-- name: CreateRestaurantProfile :one
INSERT INTO restaurant_profiles (
    user_id,
    display_name,
    tagline,
    location,
    seats,
    cuisine_types,
    mentorship_style,
    description,
    culture_keywords,
    benefits,
    support_programs,
    learning_highlights
) VALUES (
    $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12
)
RETURNING id, user_id, name, display_name, tagline, location, seats, cuisine_types,
    mentorship_style, description, culture_keywords, benefits, support_programs,
    learning_highlights, address, created_at, updated_at;

-- name: GetRestaurantProfileByUserID :one
SELECT id, user_id, name, display_name, tagline, location, seats, cuisine_types,
    mentorship_style, description, culture_keywords, benefits, support_programs,
    learning_highlights, address, created_at, updated_at
FROM restaurant_profiles
WHERE user_id = $1;

-- name: GetRestaurantProfileByID :one
SELECT id, user_id, name, display_name, tagline, location, seats, cuisine_types,
    mentorship_style, description, culture_keywords, benefits, support_programs,
    learning_highlights, address, created_at, updated_at
FROM restaurant_profiles
WHERE id = $1;

-- name: UpdateRestaurantProfile :one
UPDATE restaurant_profiles
SET
    display_name = COALESCE(sqlc.narg('display_name'), display_name),
    tagline = COALESCE(sqlc.narg('tagline'), tagline),
    location = COALESCE(sqlc.narg('location'), location),
    seats = COALESCE(sqlc.narg('seats'), seats),
    cuisine_types = COALESCE(sqlc.narg('cuisine_types'), cuisine_types),
    mentorship_style = COALESCE(sqlc.narg('mentorship_style'), mentorship_style),
    description = COALESCE(sqlc.narg('description'), description),
    culture_keywords = COALESCE(sqlc.narg('culture_keywords'), culture_keywords),
    benefits = COALESCE(sqlc.narg('benefits'), benefits),
    support_programs = COALESCE(sqlc.narg('support_programs'), support_programs),
    learning_highlights = COALESCE(sqlc.narg('learning_highlights'), learning_highlights),
    updated_at = NOW()
WHERE id = $1
RETURNING id, user_id, name, display_name, tagline, location, seats, cuisine_types,
    mentorship_style, description, culture_keywords, benefits, support_programs,
    learning_highlights, address, created_at, updated_at;

-- name: DeleteRestaurantProfile :exec
DELETE FROM restaurant_profiles
WHERE id = $1;

-- name: SearchRestaurantProfiles :many
SELECT id, user_id, name, display_name, tagline, location, seats, cuisine_types,
    mentorship_style, description, culture_keywords, benefits, support_programs,
    learning_highlights, address, created_at, updated_at
FROM restaurant_profiles
WHERE
    ($1::TEXT IS NULL OR name ILIKE '%' || $1 || '%')
    AND ($2::TEXT[] IS NULL OR cuisine_types && $2::TEXT[])
ORDER BY created_at DESC
LIMIT $3 OFFSET $4;
