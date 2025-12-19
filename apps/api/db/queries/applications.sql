-- name: CreateApplication :one
INSERT INTO applications (
    job_id,
    chef_profile_id,
    status,
    cover_letter
) VALUES (
    $1, $2, $3, $4
)
RETURNING id, job_id, chef_profile_id, status, cover_letter, created_at, updated_at;

-- name: GetApplicationByJobAndChef :one
SELECT id, job_id, chef_profile_id, status, cover_letter, created_at, updated_at
FROM applications
WHERE job_id = $1 AND chef_profile_id = $2;

-- name: GetApplicationOwnership :one
SELECT
    a.id,
    a.job_id,
    a.chef_profile_id,
    j.restaurant_id,
    rp.user_id AS restaurant_user_id,
    cp.user_id AS chef_user_id
FROM applications a
JOIN jobs j ON j.id = a.job_id
JOIN restaurant_profiles rp ON rp.id = j.restaurant_id
JOIN chef_profiles cp ON cp.id = a.chef_profile_id
WHERE a.id = $1;

-- name: ListApplicationsForChef :many
SELECT
    a.id,
    a.job_id,
    a.chef_profile_id,
    a.status,
    a.cover_letter,
    a.created_at,
    a.updated_at,
    j.title AS job_title,
    j.status AS job_status,
    rp.display_name AS restaurant_display_name
FROM applications a
JOIN jobs j ON j.id = a.job_id
JOIN restaurant_profiles rp ON rp.id = j.restaurant_id
WHERE a.chef_profile_id = $1
ORDER BY a.created_at DESC
LIMIT $2 OFFSET $3;

-- name: ListApplicationsForRestaurant :many
SELECT
    a.id,
    a.job_id,
    a.chef_profile_id,
    a.status,
    a.cover_letter,
    a.created_at,
    a.updated_at,
    cp.full_name AS chef_full_name,
    cp.location AS chef_location,
    j.title AS job_title
FROM applications a
JOIN jobs j ON j.id = a.job_id
JOIN chef_profiles cp ON cp.id = a.chef_profile_id
WHERE j.restaurant_id = $1
ORDER BY a.created_at DESC
LIMIT $2 OFFSET $3;

-- name: UpdateApplicationStatus :one
UPDATE applications
SET status = $2,
    updated_at = NOW()
WHERE id = $1
RETURNING id, job_id, chef_profile_id, status, cover_letter, created_at, updated_at;
