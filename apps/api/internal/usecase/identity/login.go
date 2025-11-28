package identity

import (
	"context"
	"database/sql"
	"errors"

	"github.com/chefnext/chefnext/apps/api/internal/pkg/auth"
	"github.com/chefnext/chefnext/apps/api/internal/repository/db"
	"github.com/google/uuid"
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
	if err == sql.ErrNoRows {
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

	// Generate tokens
	accessToken, err := uc.jwtManager.GenerateAccessToken(user.ID, user.Email, user.Role)
	if err != nil {
		return nil, err
	}

	refreshToken, err := uc.jwtManager.GenerateRefreshToken(user.ID, user.Email, user.Role)
	if err != nil {
		return nil, err
	}

	// Store refresh token in Redis
	if err := uc.tokenStore.StoreRefreshToken(ctx, user.ID, refreshToken); err != nil {
		return nil, err
	}

	return &LoginOutput{
		UserID:       user.ID,
		Email:        user.Email,
		Role:         user.Role,
		AccessToken:  accessToken,
		RefreshToken: refreshToken,
	}, nil
}
