-- name: CreateChefProfile :one
INSERT INTO chef_profiles (
    user_id,
    full_name,
    headline,
    summary,
    location,
    years_experience,
    availability,
    specialties,
    work_areas,
    languages,
    bio,
    learning_focus,
    skill_tree_json,
    portfolio_items
) VALUES (
    $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14
)
RETURNING *;

-- name: GetChefProfileByUserID :one
SELECT * FROM chef_profiles
WHERE user_id = $1;

-- name: GetChefProfileByID :one
SELECT * FROM chef_profiles
WHERE id = $1;

-- name: UpdateChefProfile :one
UPDATE chef_profiles
SET
    full_name = COALESCE(sqlc.narg('full_name'), full_name),
    headline = COALESCE(sqlc.narg('headline'), headline),
    summary = COALESCE(sqlc.narg('summary'), summary),
    location = COALESCE(sqlc.narg('location'), location),
    years_experience = COALESCE(sqlc.narg('years_experience'), years_experience),
    availability = COALESCE(sqlc.narg('availability'), availability),
    specialties = COALESCE(sqlc.narg('specialties'), specialties),
    work_areas = COALESCE(sqlc.narg('work_areas'), work_areas),
    languages = COALESCE(sqlc.narg('languages'), languages),
    bio = COALESCE(sqlc.narg('bio'), bio),
    learning_focus = COALESCE(sqlc.narg('learning_focus'), learning_focus),
    skill_tree_json = COALESCE(sqlc.narg('skill_tree_json'), skill_tree_json),
    portfolio_items = COALESCE(sqlc.narg('portfolio_items'), portfolio_items),
    updated_at = NOW()
WHERE id = $1
RETURNING *;

-- name: DeleteChefProfile :exec
DELETE FROM chef_profiles
WHERE id = $1;

-- name: SearchChefProfiles :many
SELECT * FROM chef_profiles
WHERE
    ($1::TEXT[] IS NULL OR specialties && $1::TEXT[])
    AND ($2::TEXT[] IS NULL OR work_areas && $2::TEXT[])
ORDER BY created_at DESC
LIMIT $3 OFFSET $4;
