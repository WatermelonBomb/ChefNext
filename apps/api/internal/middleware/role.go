package middleware

import (
	"context"

	"connectrpc.com/connect"
)

// RoleInterceptor is a Connect interceptor that checks user roles
type RoleInterceptor struct {
	allowedRoles []string
}

// NewRoleInterceptor creates a new role checking interceptor
// allowedRoles: list of roles that are allowed to access the endpoint (e.g., ["CHEF", "RESTAURANT"])
func NewRoleInterceptor(allowedRoles ...string) *RoleInterceptor {
	return &RoleInterceptor{
		allowedRoles: allowedRoles,
	}
}

// WrapUnary wraps unary RPCs with role checking
func (i *RoleInterceptor) WrapUnary(next connect.UnaryFunc) connect.UnaryFunc {
	return func(ctx context.Context, req connect.AnyRequest) (connect.AnyResponse, error) {
		// Get user role from context
		role, ok := GetUserRole(ctx)
		if !ok {
			return nil, connect.NewError(connect.CodeUnauthenticated, nil)
		}

		// Check if user has the required role
		if !i.hasRole(role) {
			return nil, connect.NewError(connect.CodePermissionDenied, nil)
		}

		return next(ctx, req)
	}
}

// WrapStreamingClient wraps streaming client RPCs with role checking
func (i *RoleInterceptor) WrapStreamingClient(next connect.StreamingClientFunc) connect.StreamingClientFunc {
	return func(ctx context.Context, spec connect.Spec) connect.StreamingClientConn {
		return next(ctx, spec)
	}
}

// WrapStreamingHandler wraps streaming handler RPCs with role checking
func (i *RoleInterceptor) WrapStreamingHandler(next connect.StreamingHandlerFunc) connect.StreamingHandlerFunc {
	return func(ctx context.Context, conn connect.StreamingHandlerConn) error {
		// Get user role from context
		role, ok := GetUserRole(ctx)
		if !ok {
			return connect.NewError(connect.CodeUnauthenticated, nil)
		}

		// Check if user has the required role
		if !i.hasRole(role) {
			return connect.NewError(connect.CodePermissionDenied, nil)
		}

		return next(ctx, conn)
	}
}

// hasRole checks if the user's role is in the allowed roles list
func (i *RoleInterceptor) hasRole(userRole string) bool {
	for _, allowedRole := range i.allowedRoles {
		if userRole == allowedRole {
			return true
		}
	}
	return false
}
