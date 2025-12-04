package identity

import (
	"context"
	"errors"

	"github.com/chefnext/chefnext/apps/api/internal/pkg/auth"
	"github.com/chefnext/chefnext/apps/api/internal/repository/db"
	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
)

var (
	ErrInvalidCredentials = errors.New("invalid email or password")
)

// LoginUseCase handles user login
type LoginUseCase struct {
	queries    *db.Queries
	jwtManager *auth.JWTManager
	tokenStore *auth.TokenStore
}

// NewLoginUseCase creates a new login use case
func NewLoginUseCase(queries *db.Queries, jwtManager *auth.JWTManager, tokenStore *auth.TokenStore) *LoginUseCase {
	return &LoginUseCase{
		queries:    queries,
		jwtManager: jwtManager,
		tokenStore: tokenStore,
	}
}

// LoginInput represents login input
type LoginInput struct {
	Email    string
	Password string
}

// LoginOutput represents login output
type LoginOutput struct {
	UserID       uuid.UUID
	Email        string
	Role         string
	AccessToken  string
	RefreshToken string
}

// Execute executes the login use case
func (uc *LoginUseCase) Execute(ctx context.Context, input LoginInput) (*LoginOutput, error) {
	// Get user by email
	user, err := uc.queries.GetUserByEmail(ctx, input.Email)
	if err == pgx.ErrNoRows {
		return nil, ErrInvalidCredentials
	}
	if err != nil {
		return nil, err
	}

	// Verify password
	match, err := auth.VerifyPassword(input.Password, user.PasswordHash)
	if err != nil {
		return nil, err
	}
	if !match {
		return nil, ErrInvalidCredentials
	}

	// Convert pgtype.UUID to uuid.UUID
	userID, err := uuid.FromBytes(user.ID.Bytes[:])
	if err != nil {
		return nil, err
	}

	// Generate tokens
	accessToken, err := uc.jwtManager.GenerateAccessToken(userID, user.Email, user.Role)
	if err != nil {
		return nil, err
	}

	refreshToken, err := uc.jwtManager.GenerateRefreshToken(userID, user.Email, user.Role)
	if err != nil {
		return nil, err
	}

	// Store refresh token in Redis
	if err := uc.tokenStore.StoreRefreshToken(ctx, userID, refreshToken); err != nil {
		return nil, err
	}

	return &LoginOutput{
		UserID:       userID,
		Email:        user.Email,
		Role:         user.Role,
		AccessToken:  accessToken,
		RefreshToken: refreshToken,
	}, nil
}
