package identity

import (
	"context"

	"github.com/chefnext/chefnext/apps/api/internal/pkg/auth"
	"github.com/chefnext/chefnext/apps/api/internal/repository/db"
	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgtype"
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

	// Convert uuid.UUID to pgtype.UUID for database query
	var pgUserID pgtype.UUID
	if err := pgUserID.Scan(claims.UserID[:]); err != nil {
		return nil, err
	}

	// Get user from database to ensure they still exist
	user, err := uc.queries.GetUserByID(ctx, pgUserID)
	if err != nil {
		return nil, err
	}

	// Convert pgtype.UUID back to uuid.UUID
	userID, err := uuid.FromBytes(user.ID.Bytes[:])
	if err != nil {
		return nil, err
	}

	// Generate new tokens
	newAccessToken, err := uc.jwtManager.GenerateAccessToken(userID, user.Email, user.Role)
	if err != nil {
		return nil, err
	}

	newRefreshToken, err := uc.jwtManager.GenerateRefreshToken(userID, user.Email, user.Role)
	if err != nil {
		return nil, err
	}

	// Store new refresh token
	if err := uc.tokenStore.StoreRefreshToken(ctx, userID, newRefreshToken); err != nil {
		return nil, err
	}

	return &RefreshTokenOutput{
		AccessToken:  newAccessToken,
		RefreshToken: newRefreshToken,
	}, nil
}
