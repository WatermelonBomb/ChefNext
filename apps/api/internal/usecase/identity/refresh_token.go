package identity

import (
	"context"

	"github.com/chefnext/chefnext/apps/api/internal/pkg/auth"
	"github.com/chefnext/chefnext/apps/api/internal/repository/db"
)

// RefreshTokenUseCase handles token refresh
type RefreshTokenUseCase struct {
	queries    *db.Queries
	jwtManager *auth.JWTManager
	tokenStore *auth.TokenStore
}

// NewRefreshTokenUseCase creates a new refresh token use case
func NewRefreshTokenUseCase(queries *db.Queries, jwtManager *auth.JWTManager, tokenStore *auth.TokenStore) *RefreshTokenUseCase {
	return &RefreshTokenUseCase{
		queries:    queries,
		jwtManager: jwtManager,
		tokenStore: tokenStore,
	}
}

// RefreshTokenInput represents refresh token input
type RefreshTokenInput struct {
	RefreshToken string
}

// RefreshTokenOutput represents refresh token output
type RefreshTokenOutput struct {
	AccessToken  string
	RefreshToken string
}

// Execute executes the refresh token use case
func (uc *RefreshTokenUseCase) Execute(ctx context.Context, input RefreshTokenInput) (*RefreshTokenOutput, error) {
	// Verify refresh token
	claims, err := uc.jwtManager.VerifyRefreshToken(input.RefreshToken)
	if err != nil {
		return nil, err
	}

	// Validate token in Redis
	valid, err := uc.tokenStore.ValidateRefreshToken(ctx, claims.UserID, input.RefreshToken)
	if err != nil {
		return nil, err
	}
	if !valid {
		return nil, auth.ErrInvalidToken
	}

	// Get user from database to ensure they still exist
	user, err := uc.queries.GetUserByID(ctx, claims.UserID)
	if err != nil {
		return nil, err
	}

	// Generate new tokens
	newAccessToken, err := uc.jwtManager.GenerateAccessToken(user.ID, user.Email, user.Role)
	if err != nil {
		return nil, err
	}

	newRefreshToken, err := uc.jwtManager.GenerateRefreshToken(user.ID, user.Email, user.Role)
	if err != nil {
		return nil, err
	}

	// Store new refresh token
	if err := uc.tokenStore.StoreRefreshToken(ctx, user.ID, newRefreshToken); err != nil {
		return nil, err
	}

	return &RefreshTokenOutput{
		AccessToken:  newAccessToken,
		RefreshToken: newRefreshToken,
	}, nil
}
