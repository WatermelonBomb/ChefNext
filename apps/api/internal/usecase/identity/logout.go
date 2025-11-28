package identity

import (
	"context"

	"github.com/chefnext/chefnext/apps/api/internal/pkg/auth"
)

// LogoutUseCase handles user logout
type LogoutUseCase struct {
	jwtManager *auth.JWTManager
	tokenStore *auth.TokenStore
}

// NewLogoutUseCase creates a new logout use case
func NewLogoutUseCase(jwtManager *auth.JWTManager, tokenStore *auth.TokenStore) *LogoutUseCase {
	return &LogoutUseCase{
		jwtManager: jwtManager,
		tokenStore: tokenStore,
	}
}

// LogoutInput represents logout input
type LogoutInput struct {
	RefreshToken string
}

// LogoutOutput represents logout output
type LogoutOutput struct {
	Success bool
}

// Execute executes the logout use case
func (uc *LogoutUseCase) Execute(ctx context.Context, input LogoutInput) (*LogoutOutput, error) {
	// Verify refresh token
	claims, err := uc.jwtManager.VerifyRefreshToken(input.RefreshToken)
	if err != nil {
		// Even if token is invalid, we still return success
		// to avoid leaking information about token validity
		return &LogoutOutput{Success: true}, nil
	}

	// Revoke refresh token
	if err := uc.tokenStore.RevokeRefreshToken(ctx, claims.UserID); err != nil {
		return nil, err
	}

	return &LogoutOutput{Success: true}, nil
}
