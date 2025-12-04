-- +goose Up
ALTER TABLE chef_profiles
ADD COLUMN full_name VARCHAR(255);

-- +goose Down
ALTER TABLE chef_profiles
DROP COLUMN IF EXISTS full_name;
