package middleware

import (
	"context"
	"sync"

	"connectrpc.com/connect"
	"golang.org/x/time/rate"
)

// RateLimitInterceptor is a Connect interceptor that implements rate limiting
type RateLimitInterceptor struct {
	limiters map[string]*rate.Limiter
	mu       sync.RWMutex
	rps      rate.Limit // requests per second
	burst    int        // burst size
}

// NewRateLimitInterceptor creates a new rate limiting interceptor
// rps: requests per second allowed
// burst: maximum burst size
func NewRateLimitInterceptor(rps float64, burst int) *RateLimitInterceptor {
	return &RateLimitInterceptor{
		limiters: make(map[string]*rate.Limiter),
		rps:      rate.Limit(rps),
		burst:    burst,
	}
}

// getLimiter returns the rate limiter for a given identifier (e.g., user ID or IP)
func (i *RateLimitInterceptor) getLimiter(identifier string) *rate.Limiter {
	i.mu.RLock()
	limiter, exists := i.limiters[identifier]
	i.mu.RUnlock()

	if exists {
		return limiter
	}

	i.mu.Lock()
	defer i.mu.Unlock()

	// Double-check after acquiring write lock
	limiter, exists = i.limiters[identifier]
	if exists {
		return limiter
	}

	// Create new limiter for this identifier
	limiter = rate.NewLimiter(i.rps, i.burst)
	i.limiters[identifier] = limiter
	return limiter
}

// WrapUnary wraps unary RPCs with rate limiting
func (i *RateLimitInterceptor) WrapUnary(next connect.UnaryFunc) connect.UnaryFunc {
	return func(ctx context.Context, req connect.AnyRequest) (connect.AnyResponse, error) {
		// Try to get user ID from context, fall back to "anonymous" if not authenticated
		userID, ok := GetUserID(ctx)
		identifier := "anonymous"
		if ok {
			identifier = userID.String()
		}

		// Get limiter for this identifier
		limiter := i.getLimiter(identifier)

		// Check if request is allowed
		if !limiter.Allow() {
			return nil, connect.NewError(connect.CodeResourceExhausted, nil)
		}

		return next(ctx, req)
	}
}

// WrapStreamingClient wraps streaming client RPCs with rate limiting
func (i *RateLimitInterceptor) WrapStreamingClient(next connect.StreamingClientFunc) connect.StreamingClientFunc {
	return func(ctx context.Context, spec connect.Spec) connect.StreamingClientConn {
		return next(ctx, spec)
	}
}

// WrapStreamingHandler wraps streaming handler RPCs with rate limiting
func (i *RateLimitInterceptor) WrapStreamingHandler(next connect.StreamingHandlerFunc) connect.StreamingHandlerFunc {
	return func(ctx context.Context, conn connect.StreamingHandlerConn) error {
		// Try to get user ID from context, fall back to "anonymous" if not authenticated
		userID, ok := GetUserID(ctx)
		identifier := "anonymous"
		if ok {
			identifier = userID.String()
		}

		// Get limiter for this identifier
		limiter := i.getLimiter(identifier)

		// Check if request is allowed
		if !limiter.Allow() {
			return connect.NewError(connect.CodeResourceExhausted, nil)
		}

		return next(ctx, conn)
	}
}
