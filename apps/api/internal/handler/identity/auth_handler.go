package identity

import (
	"context"

	"connectrpc.com/connect"
	identityv1 "github.com/chefnext/chefnext/apps/api/internal/gen/identity/v1"
	"github.com/chefnext/chefnext/apps/api/internal/gen/identity/v1/identityv1connect"
	"github.com/chefnext/chefnext/apps/api/internal/usecase/identity"
)

// AuthHandler implements the AuthService
type AuthHandler struct {
	registerUseCase      *identity.RegisterUseCase
	loginUseCase         *identity.LoginUseCase
	refreshTokenUseCase  *identity.RefreshTokenUseCase
	logoutUseCase        *identity.LogoutUseCase
}

// NewAuthHandler creates a new auth handler
func NewAuthHandler(
	registerUseCase *identity.RegisterUseCase,
	loginUseCase *identity.LoginUseCase,
	refreshTokenUseCase *identity.RefreshTokenUseCase,
	logoutUseCase *identity.LogoutUseCase,
) identityv1connect.AuthServiceHandler {
	return &AuthHandler{
		registerUseCase:     registerUseCase,
		loginUseCase:        loginUseCase,
		refreshTokenUseCase: refreshTokenUseCase,
		logoutUseCase:       logoutUseCase,
	}
}

// Register handles user registration
func (h *AuthHandler) Register(ctx context.Context, req *connect.Request[identityv1.RegisterRequest]) (*connect.Response[identityv1.RegisterResponse], error) {
	// Convert role enum to string
	var role string
	switch req.Msg.Role {
	case identityv1.UserRole_USER_ROLE_CHEF:
		role = "CHEF"
	case identityv1.UserRole_USER_ROLE_RESTAURANT:
		role = "RESTAURANT"
	default:
		return nil, connect.NewError(connect.CodeInvalidArgument, identity.ErrInvalidRole)
	}

	// Execute use case
	output, err := h.registerUseCase.Execute(ctx, identity.RegisterInput{
		Email:    req.Msg.Email,
		Password: req.Msg.Password,
		Role:     role,
	})
	if err != nil {
		if err == identity.ErrEmailAlreadyExists {
			return nil, connect.NewError(connect.CodeAlreadyExists, err)
		}
		if err == identity.ErrInvalidRole {
			return nil, connect.NewError(connect.CodeInvalidArgument, err)
		}
		return nil, connect.NewError(connect.CodeInternal, err)
	}

	// Convert role string to enum
	var roleEnum identityv1.UserRole
	switch output.Role {
	case "CHEF":
		roleEnum = identityv1.UserRole_USER_ROLE_CHEF
	case "RESTAURANT":
		roleEnum = identityv1.UserRole_USER_ROLE_RESTAURANT
	default:
		roleEnum = identityv1.UserRole_USER_ROLE_UNSPECIFIED
	}

	return connect.NewResponse(&identityv1.RegisterResponse{
		UserId:       output.UserID.String(),
		Email:        output.Email,
		Role:         roleEnum,
		AccessToken:  output.AccessToken,
		RefreshToken: output.RefreshToken,
	}), nil
}

// Login handles user login
func (h *AuthHandler) Login(ctx context.Context, req *connect.Request[identityv1.LoginRequest]) (*connect.Response[identityv1.LoginResponse], error) {
	output, err := h.loginUseCase.Execute(ctx, identity.LoginInput{
		Email:    req.Msg.Email,
		Password: req.Msg.Password,
	})
	if err != nil {
		if err == identity.ErrInvalidCredentials {
			return nil, connect.NewError(connect.CodeUnauthenticated, err)
		}
		return nil, connect.NewError(connect.CodeInternal, err)
	}

	// Convert role string to enum
	var roleEnum identityv1.UserRole
	switch output.Role {
	case "CHEF":
		roleEnum = identityv1.UserRole_USER_ROLE_CHEF
	case "RESTAURANT":
		roleEnum = identityv1.UserRole_USER_ROLE_RESTAURANT
	default:
		roleEnum = identityv1.UserRole_USER_ROLE_UNSPECIFIED
	}

	return connect.NewResponse(&identityv1.LoginResponse{
		UserId:       output.UserID.String(),
		Email:        output.Email,
		Role:         roleEnum,
		AccessToken:  output.AccessToken,
		RefreshToken: output.RefreshToken,
	}), nil
}

// RefreshToken handles token refresh
func (h *AuthHandler) RefreshToken(ctx context.Context, req *connect.Request[identityv1.RefreshTokenRequest]) (*connect.Response[identityv1.RefreshTokenResponse], error) {
	output, err := h.refreshTokenUseCase.Execute(ctx, identity.RefreshTokenInput{
		RefreshToken: req.Msg.RefreshToken,
	})
	if err != nil {
		return nil, connect.NewError(connect.CodeUnauthenticated, err)
	}

	return connect.NewResponse(&identityv1.RefreshTokenResponse{
		AccessToken:  output.AccessToken,
		RefreshToken: output.RefreshToken,
	}), nil
}

// Logout handles user logout
func (h *AuthHandler) Logout(ctx context.Context, req *connect.Request[identityv1.LogoutRequest]) (*connect.Response[identityv1.LogoutResponse], error) {
	output, err := h.logoutUseCase.Execute(ctx, identity.LogoutInput{
		RefreshToken: req.Msg.RefreshToken,
	})
	if err != nil {
		return nil, connect.NewError(connect.CodeInternal, err)
	}

	return connect.NewResponse(&identityv1.LogoutResponse{
		Success: output.Success,
	}), nil
}
