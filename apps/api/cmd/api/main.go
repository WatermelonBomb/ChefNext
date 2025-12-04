package main

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"log/slog"
	"net"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"connectrpc.com/connect"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/redis/go-redis/v9"
	"golang.org/x/net/http2"
	"golang.org/x/net/http2/h2c"

	"github.com/chefnext/chefnext/apps/api/internal/gen/chef/v1/chefv1connect"
	"github.com/chefnext/chefnext/apps/api/internal/gen/identity/v1/identityv1connect"
	"github.com/chefnext/chefnext/apps/api/internal/gen/restaurant/v1/restaurantv1connect"
	chefHandler "github.com/chefnext/chefnext/apps/api/internal/handler/chef"
	"github.com/chefnext/chefnext/apps/api/internal/handler/identity"
	restaurantHandler "github.com/chefnext/chefnext/apps/api/internal/handler/restaurant"
	"github.com/chefnext/chefnext/apps/api/internal/middleware"
	"github.com/chefnext/chefnext/apps/api/internal/pkg/auth"
	"github.com/chefnext/chefnext/apps/api/internal/pkg/config"
	"github.com/chefnext/chefnext/apps/api/internal/pkg/logger"
	"github.com/chefnext/chefnext/apps/api/internal/repository/db"
	chefProfileUseCase "github.com/chefnext/chefnext/apps/api/internal/usecase/chefprofile"
	identityUseCase "github.com/chefnext/chefnext/apps/api/internal/usecase/identity"
	restaurantProfileUseCase "github.com/chefnext/chefnext/apps/api/internal/usecase/restaurantprofile"
)

func main() {
	if err := run(); err != nil {
		fmt.Fprintf(os.Stderr, "chefnext api: %v\n", err)
		os.Exit(1)
	}
}

func run() error {
	ctx, stop := signal.NotifyContext(context.Background(), os.Interrupt, syscall.SIGTERM)
	defer stop()

	cfg, err := config.Load()
	if err != nil {
		return fmt.Errorf("load config: %w", err)
	}

	log := logger.New(cfg.LogLevel)

	// Initialize database
	pool, err := pgxpool.New(ctx, cfg.DatabaseURL)
	if err != nil {
		return fmt.Errorf("connect to database: %w", err)
	}
	defer pool.Close()

	queries := db.New(pool)

	// Initialize Redis
	redisClient := redis.NewClient(&redis.Options{
		Addr: cfg.RedisAddr,
	})
	defer redisClient.Close()

	if err := redisClient.Ping(ctx).Err(); err != nil {
		return fmt.Errorf("connect to redis: %w", err)
	}

	// Initialize JWT manager and token store
	jwtManager := auth.NewJWTManager(cfg.JWTSecret, 15*time.Minute, 30*24*time.Hour)
	tokenStore := auth.NewTokenStore(redisClient, 30*24*time.Hour)

	// Initialize use cases
	registerUC := identityUseCase.NewRegisterUseCase(queries, jwtManager, tokenStore)
	loginUC := identityUseCase.NewLoginUseCase(queries, jwtManager, tokenStore)
	refreshTokenUC := identityUseCase.NewRefreshTokenUseCase(queries, jwtManager, tokenStore)
	logoutUC := identityUseCase.NewLogoutUseCase(jwtManager, tokenStore)
	chefProfileUC := chefProfileUseCase.NewService(queries)
	restaurantProfileUC := restaurantProfileUseCase.NewService(queries)

	// Initialize handlers
	authHandler := identity.NewAuthHandler(registerUC, loginUC, refreshTokenUC, logoutUC)
	chefProfileHandler := chefHandler.NewProfileHandler(chefProfileUC)
	restaurantProfileHandler := restaurantHandler.NewProfileHandler(restaurantProfileUC)

	// Initialize interceptors
	authInterceptor := middleware.NewAuthInterceptor(jwtManager)
	rateLimitInterceptor := middleware.NewRateLimitInterceptor(100, 200) // 100 req/sec, burst 200

	mux := http.NewServeMux()
	mux.HandleFunc("/health", healthHandler(pool))

	// Register Connect-RPC routes with interceptors
	// Apply rate limiting to all endpoints, auth to protected endpoints
	path, handler := identityv1connect.NewAuthServiceHandler(
		authHandler,
		connect.WithInterceptors(rateLimitInterceptor, authInterceptor),
	)
	mux.Handle(path, handler)

	path, handler = chefv1connect.NewChefProfileServiceHandler(
		chefProfileHandler,
		connect.WithInterceptors(rateLimitInterceptor, authInterceptor),
	)
	mux.Handle(path, handler)

	path, handler = restaurantv1connect.NewRestaurantProfileServiceHandler(
		restaurantProfileHandler,
		connect.WithInterceptors(rateLimitInterceptor, authInterceptor),
	)
	mux.Handle(path, handler)

	// Use h2c to support HTTP/2 without TLS (required for Connect-RPC)
	srv := &http.Server{
		Addr:    net.JoinHostPort(cfg.HTTPHost, cfg.HTTPPort),
		Handler: loggingMiddleware(log, h2c.NewHandler(mux, &http2.Server{})),
	}

	go func() {
		<-ctx.Done()
		shutdownCtx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
		defer cancel()

		if err := srv.Shutdown(shutdownCtx); err != nil {
			log.Error("graceful shutdown failed", "error", err)
		} else {
			log.Info("server shut down gracefully")
		}
	}()

	log.Info("ChefNext API ready", "addr", srv.Addr)

	err = srv.ListenAndServe()
	if err != nil && !errors.Is(err, http.ErrServerClosed) {
		return fmt.Errorf("http server: %w", err)
	}

	return nil
}

func healthHandler(db *pgxpool.Pool) http.HandlerFunc {
	type response struct {
		Status   string `json:"status"`
		Database string `json:"database"`
	}

	return func(w http.ResponseWriter, r *http.Request) {
		ctx, cancel := context.WithTimeout(r.Context(), 2*time.Second)
		defer cancel()

		resp := response{Status: "ok", Database: "connected"}
		statusCode := http.StatusOK
		if err := db.Ping(ctx); err != nil {
			statusCode = http.StatusServiceUnavailable
			resp.Status = "error"
			resp.Database = "unreachable"
		}

		writeJSON(w, statusCode, resp)
	}
}

func writeJSON(w http.ResponseWriter, status int, payload any) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	if err := json.NewEncoder(w).Encode(payload); err != nil {
		// HTTP server should best-effort log encoding failures
		fmt.Fprintf(os.Stderr, "failed to encode response: %v\n", err)
	}
}

func loggingMiddleware(log *slog.Logger, next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		start := time.Now()
		rw := &responseWriter{ResponseWriter: w, status: http.StatusOK}
		next.ServeHTTP(rw, r)
		log.Info("request completed",
			"method", r.Method,
			"path", r.URL.Path,
			"status", rw.status,
			"duration", time.Since(start).String(),
		)
	})
}

// responseWriter tracks HTTP status codes for structured logging.
type responseWriter struct {
	http.ResponseWriter
	status int
}

func (rw *responseWriter) WriteHeader(code int) {
	rw.status = code
	rw.ResponseWriter.WriteHeader(code)
}
