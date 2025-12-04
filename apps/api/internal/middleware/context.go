package middleware

import (
	"context"

	"github.com/chefnext/chefnext/apps/api/internal/pkg/auth"
	"github.com/google/uuid"
)

// Context keys for storing user information
type contextKey string

const (
	userIDKey    contextKey = "user_id"
	userEmailKey contextKey = "user_email"
	userRoleKey  contextKey = "user_role"
)

// WithUserContext stores user information in context
func WithUserContext(ctx context.Context, claims *auth.Claims) context.Context {
	ctx = context.WithValue(ctx, userIDKey, claims.UserID)
	ctx = context.WithValue(ctx, userEmailKey, claims.Email)
	ctx = context.WithValue(ctx, userRoleKey, claims.Role)
	return ctx
}

// GetUserID retrieves user ID from context
func GetUserID(ctx context.Context) (uuid.UUID, bool) {
	userID, ok := ctx.Value(userIDKey).(uuid.UUID)
	return userID, ok
}

// GetUserEmail retrieves user email from context
func GetUserEmail(ctx context.Context) (string, bool) {
	email, ok := ctx.Value(userEmailKey).(string)
	return email, ok
}

// GetUserRole retrieves user role from context
func GetUserRole(ctx context.Context) (string, bool) {
	role, ok := ctx.Value(userRoleKey).(string)
	return role, ok
}
