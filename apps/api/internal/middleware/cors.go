package middleware

import (
	"net/http"
	"strings"
)

type corsConfig struct {
	allowAll bool
	origins  map[string]struct{}
}

func newCORSConfig(origins []string) corsConfig {
	cfg := corsConfig{origins: make(map[string]struct{})}
	for _, origin := range origins {
		if origin == "*" {
			cfg.allowAll = true
			cfg.origins = nil
			break
		}
		trimmed := strings.TrimSpace(origin)
		if trimmed == "" {
			continue
		}
		cfg.origins[trimmed] = struct{}{}
	}
	if len(origins) == 0 {
		cfg.allowAll = true
	}
	return cfg
}

// NewCORSMiddleware returns a HTTP middleware that adds standard CORS headers
// for the provided origins. If the list contains "*", every origin is allowed.
func NewCORSMiddleware(origins []string) func(http.Handler) http.Handler {
	cfg := newCORSConfig(origins)
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			origin := r.Header.Get("Origin")
			if origin != "" && (cfg.allowAll || cfg.isAllowed(origin)) {
				value := origin
				if cfg.allowAll {
					value = "*"
				}
				w.Header().Set("Access-Control-Allow-Origin", value)
				w.Header().Set("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE,OPTIONS")
				w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
				w.Header().Set("Access-Control-Max-Age", "300")
				w.Header().Add("Vary", "Origin")
			}

			if r.Method == http.MethodOptions {
				w.WriteHeader(http.StatusNoContent)
				return
			}

			next.ServeHTTP(w, r)
		})
	}
}

func (c corsConfig) isAllowed(origin string) bool {
	if c.allowAll {
		return true
	}
	_, ok := c.origins[origin]
	return ok
}
