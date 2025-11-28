package auth

import (
	"context"
	"fmt"
	"time"

	"github.com/google/uuid"
	"github.com/redis/go-redis/v9"
)

// TokenStore manages refresh tokens in Redis
type TokenStore struct {
	client *redis.Client
	ttl    time.Duration
}

// NewTokenStore creates a new token store
func NewTokenStore(client *redis.Client, ttl time.Duration) *TokenStore {
	return &TokenStore{
		client: client,
		ttl:    ttl,
	}
}

// StoreRefreshToken stores a refresh token in Redis
func (s *TokenStore) StoreRefreshToken(ctx context.Context, userID uuid.UUID, token string) error {
	key := fmt.Sprintf("refresh_token:%s", userID.String())
	return s.client.Set(ctx, key, token, s.ttl).Err()
}

// ValidateRefreshToken checks if a refresh token is valid
func (s *TokenStore) ValidateRefreshToken(ctx context.Context, userID uuid.UUID, token string) (bool, error) {
	key := fmt.Sprintf("refresh_token:%s", userID.String())
	storedToken, err := s.client.Get(ctx, key).Result()
	if err == redis.Nil {
		return false, nil
	}
	if err != nil {
		return false, err
	}

	return storedToken == token, nil
}

// RevokeRefreshToken removes a refresh token from Redis
func (s *TokenStore) RevokeRefreshToken(ctx context.Context, userID uuid.UUID) error {
	key := fmt.Sprintf("refresh_token:%s", userID.String())
	return s.client.Del(ctx, key).Err()
}

// RevokeAllUserTokens revokes all tokens for a user
func (s *TokenStore) RevokeAllUserTokens(ctx context.Context, userID uuid.UUID) error {
	pattern := fmt.Sprintf("refresh_token:%s*", userID.String())

	iter := s.client.Scan(ctx, 0, pattern, 0).Iterator()
	for iter.Next(ctx) {
		if err := s.client.Del(ctx, iter.Val()).Err(); err != nil {
			return err
		}
	}

	return iter.Err()
}
