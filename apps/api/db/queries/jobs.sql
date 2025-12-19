-- name: CreateJob :one
INSERT INTO jobs (
    restaurant_id,
    title,
    description,
    required_skills,
    location,
    salary_range,
    employment_type,
    status,
    metadata
) VALUES (
    $1, $2, $3, $4, $5, $6, $7, $8, $9
)
RETURNING id, restaurant_id, title, description, required_skills, location, salary_range,
          employment_type, status, metadata, created_at, updated_at;

-- name: GetJobByID :one
SELECT
    j.id,
    j.restaurant_id,
    j.title,
    j.description,
    j.required_skills,
    j.location,
    j.salary_range,
    j.employment_type,
    j.status,
    j.metadata,
    j.created_at,
    j.updated_at,
    rp.display_name,
    rp.tagline,
    rp.location AS restaurant_location,
    rp.user_id AS restaurant_user_id
FROM jobs j
JOIN restaurant_profiles rp ON rp.id = j.restaurant_id
WHERE j.id = $1;

-- name: ListJobsByRestaurant :many
SELECT
    id,
    restaurant_id,
    title,
    description,
    required_skills,
    location,
    salary_range,
    employment_type,
    status,
    metadata,
    created_at,
    updated_at,
    COUNT(*) OVER() AS total_count
FROM jobs
WHERE restaurant_id = $1
ORDER BY created_at DESC
LIMIT $2 OFFSET $3;

-- name: SearchJobs :many
SELECT
    j.id,
    j.restaurant_id,
    j.title,
    j.description,
    j.required_skills,
    j.location,
    j.salary_range,
    j.employment_type,
    j.status,
    j.metadata,
    j.created_at,
    j.updated_at,
    rp.display_name,
    rp.tagline,
    rp.location AS restaurant_location,
    rp.user_id AS restaurant_user_id,
    COUNT(*) OVER() AS total_count
FROM jobs j
JOIN restaurant_profiles rp ON rp.id = j.restaurant_id
WHERE
    j.status = 'PUBLISHED'
    AND ($1::text IS NULL OR j.search_vector @@ plainto_tsquery('simple', $1))
    AND ($2::text[] IS NULL OR j.required_skills && $2::text[])
    AND ($3::text IS NULL OR j.location ILIKE '%' || $3 || '%')
ORDER BY j.created_at DESC
LIMIT $4 OFFSET $5;

-- name: GetJobOwnership :one
SELECT
    j.id,
    j.restaurant_id,
    rp.user_id AS restaurant_user_id
FROM jobs j
JOIN restaurant_profiles rp ON rp.id = j.restaurant_id
WHERE j.id = $1;

-- name: UpdateJob :one
UPDATE jobs
SET
    title = COALESCE(sqlc.narg('title'), title),
    description = COALESCE(sqlc.narg('description'), description),
    required_skills = COALESCE(sqlc.narg('required_skills'), required_skills),
    location = COALESCE(sqlc.narg('location'), location),
    salary_range = COALESCE(sqlc.narg('salary_range'), salary_range),
    employment_type = COALESCE(sqlc.narg('employment_type'), employment_type),
    status = COALESCE(sqlc.narg('status'), status),
    metadata = COALESCE(sqlc.narg('metadata'), metadata),
    updated_at = NOW()
WHERE id = sqlc.arg('id')
RETURNING id, restaurant_id, title, description, required_skills, location, salary_range,
          employment_type, status, metadata, created_at, updated_at;
