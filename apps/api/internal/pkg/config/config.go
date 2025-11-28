package config

import (
	"os"
	"strings"
	"sync"

	"github.com/joho/godotenv"
)

// Config holds runtime configuration loaded from the environment.
type Config struct {
	Env             string
	HTTPHost        string
	HTTPPort        string
	LogLevel        string
	DatabaseURL     string
	RedisAddr       string
	MinIOEndpoint   string
	MinIOConsoleURL string
	MinIOAccessKey  string
	MinIOSecretKey  string
	MailpitSMTPAddr string
	MailpitWebURL   string
	JWTSecret       string
}

var (
	cached    Config
	once      sync.Once
	cachedErr error
)

// Load reads configuration one time and reuses it for future calls.
func Load() (Config, error) {
	once.Do(func() {
		_ = godotenv.Load()

		cached = Config{
			Env:             getEnv("APP_ENV", "development"),
			HTTPHost:        getEnv("API_HOST", "0.0.0.0"),
			HTTPPort:        getEnv("API_PORT", "8080"),
			LogLevel:        strings.ToUpper(getEnv("LOG_LEVEL", "INFO")),
			DatabaseURL:     getEnv("DATABASE_URL", "postgresql://chefnext:password@localhost:5432/chefnext_dev?sslmode=disable"),
			RedisAddr:       getEnv("REDIS_ADDR", "localhost:6379"),
			MinIOEndpoint:   getEnv("MINIO_ENDPOINT", "http://localhost:9000"),
			MinIOConsoleURL: getEnv("MINIO_CONSOLE_URL", "http://localhost:9001"),
			MinIOAccessKey:  getEnv("MINIO_ACCESS_KEY", "minioadmin"),
			MinIOSecretKey:  getEnv("MINIO_SECRET_KEY", "minioadmin"),
			MailpitSMTPAddr: getEnv("MAILPIT_SMTP_ADDR", "localhost:1025"),
			MailpitWebURL:   getEnv("MAILPIT_WEB_URL", "http://localhost:8025"),
			JWTSecret:       getEnv("JWT_SECRET", "insecure-change-me"),
		}

	})

	return cached, cachedErr
}

func getEnv(key, fallback string) string {
	value := strings.TrimSpace(os.Getenv(key))
	if value == "" {
		return fallback
	}
	return value
}
