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
	ErrEmailAlreadyExists = errors.New("email already exists")
	ErrInvalidRole        = errors.New("invalid role")
)

// RegisterUseCase handles user registration
type RegisterUseCase struct {
	queries    *db.Queries
	jwtManager *auth.JWTManager
	tokenStore *auth.TokenStore
}

// NewRegisterUseCase creates a new register use case
func NewRegisterUseCase(queries *db.Queries, jwtManager *auth.JWTManager, tokenStore *auth.TokenStore) *RegisterUseCase {
	return &RegisterUseCase{
		queries:    queries,
		jwtManager: jwtManager,
		tokenStore: tokenStore,
	}
}

// RegisterInput represents registration input
type RegisterInput struct {
	Email    string
	Password string
	Role     string
}

// RegisterOutput represents registration output
type RegisterOutput struct {
	UserID       uuid.UUID
	Email        string
	Role         string
	AccessToken  string
	RefreshToken string
}

// Execute executes the register use case
func (uc *RegisterUseCase) Execute(ctx context.Context, input RegisterInput) (*RegisterOutput, error) {
	// Validate role
	if input.Role != "CHEF" && input.Role != "RESTAURANT" {
		return nil, ErrInvalidRole
	}

	// Check if email already exists
	_, err := uc.queries.GetUserByEmail(ctx, input.Email)
	if err == nil {
		return nil, ErrEmailAlreadyExists
	}
	if err != pgx.ErrNoRows {
		return nil, err
	}

	// Hash password
	passwordHash, err := auth.HashPassword(input.Password, nil)
	if err != nil {
		return nil, err
	}

	// Create user
	user, err := uc.queries.CreateUser(ctx, db.CreateUserParams{
		Email:        input.Email,
		PasswordHash: passwordHash,
		Role:         input.Role,
		KycStatus:    "pending",
	})
	if err != nil {
		return nil, err
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

	return &RegisterOutput{
		UserID:       userID,
		Email:        user.Email,
		Role:         user.Role,
		AccessToken:  accessToken,
		RefreshToken: refreshToken,
	}, nil
}
