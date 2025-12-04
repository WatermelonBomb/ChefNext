package middleware

import (
	"context"
	"strings"

	"connectrpc.com/connect"
	"github.com/chefnext/chefnext/apps/api/internal/pkg/auth"
)

// AuthInterceptor is a Connect interceptor that validates JWT tokens
type AuthInterceptor struct {
	jwtManager *auth.JWTManager
}

// NewAuthInterceptor creates a new auth interceptor
func NewAuthInterceptor(jwtManager *auth.JWTManager) *AuthInterceptor {
	return &AuthInterceptor{
		jwtManager: jwtManager,
	}
}

// WrapUnary wraps unary RPCs with authentication
func (i *AuthInterceptor) WrapUnary(next connect.UnaryFunc) connect.UnaryFunc {
	return func(ctx context.Context, req connect.AnyRequest) (connect.AnyResponse, error) {
		// Skip authentication for public endpoints
		if isPublicEndpoint(req.Spec().Procedure) {
			return next(ctx, req)
		}

		// Extract token from Authorization header
		token := extractToken(req.Header().Get("Authorization"))
		if token == "" {
			return nil, connect.NewError(connect.CodeUnauthenticated, nil)
		}

		// Verify access token
		claims, err := i.jwtManager.VerifyAccessToken(token)
		if err != nil {
			return nil, connect.NewError(connect.CodeUnauthenticated, err)
		}

		// Store user information in context
		ctx = WithUserContext(ctx, claims)

		return next(ctx, req)
	}
}

// WrapStreamingClient wraps streaming client RPCs with authentication
func (i *AuthInterceptor) WrapStreamingClient(next connect.StreamingClientFunc) connect.StreamingClientFunc {
	return func(ctx context.Context, spec connect.Spec) connect.StreamingClientConn {
		return next(ctx, spec)
	}
}

// WrapStreamingHandler wraps streaming handler RPCs with authentication
func (i *AuthInterceptor) WrapStreamingHandler(next connect.StreamingHandlerFunc) connect.StreamingHandlerFunc {
	return func(ctx context.Context, conn connect.StreamingHandlerConn) error {
		// Extract token from Authorization header
		token := extractToken(conn.RequestHeader().Get("Authorization"))
		if token == "" {
			return connect.NewError(connect.CodeUnauthenticated, nil)
		}

		// Verify access token
		claims, err := i.jwtManager.VerifyAccessToken(token)
		if err != nil {
			return connect.NewError(connect.CodeUnauthenticated, err)
		}

		// Store user information in context
		ctx = WithUserContext(ctx, claims)

		return next(ctx, conn)
	}
}

// extractToken extracts the token from the Authorization header
// Format: "Bearer <token>"
func extractToken(authHeader string) string {
	if authHeader == "" {
		return ""
	}

	parts := strings.Split(authHeader, " ")
	if len(parts) != 2 || strings.ToLower(parts[0]) != "bearer" {
		return ""
	}

	return parts[1]
}

// isPublicEndpoint checks if the endpoint is public (does not require authentication)
func isPublicEndpoint(procedure string) bool {
	publicEndpoints := []string{
		"/identity.v1.AuthService/Register",
		"/identity.v1.AuthService/Login",
	}

	for _, endpoint := range publicEndpoints {
		if procedure == endpoint {
			return true
		}
	}

	return false
}
