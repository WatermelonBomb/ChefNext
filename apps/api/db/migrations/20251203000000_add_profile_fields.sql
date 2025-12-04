-- +goose Up
-- +goose StatementBegin

-- Add new fields to chef_profiles table
ALTER TABLE chef_profiles
ADD COLUMN headline VARCHAR(255),
ADD COLUMN summary TEXT,
ADD COLUMN location VARCHAR(255),
ADD COLUMN years_experience INTEGER,
ADD COLUMN availability VARCHAR(100),
ADD COLUMN languages TEXT[],
ADD COLUMN learning_focus TEXT[],
ADD COLUMN portfolio_items JSONB DEFAULT '[]'::jsonb;

-- Update existing years_exp column name to years_experience for consistency
-- First copy data to new column
UPDATE chef_profiles SET years_experience = years_exp WHERE years_exp IS NOT NULL;

-- Drop old column
ALTER TABLE chef_profiles DROP COLUMN years_exp;

-- Add new fields to restaurant_profiles table
ALTER TABLE restaurant_profiles
ADD COLUMN display_name VARCHAR(255),
ADD COLUMN tagline VARCHAR(255),
ADD COLUMN location VARCHAR(255),
ADD COLUMN seats INTEGER,
ADD COLUMN mentorship_style TEXT,
ADD COLUMN culture_keywords TEXT[],
ADD COLUMN benefits TEXT[],
ADD COLUMN support_programs TEXT[],
ADD COLUMN learning_highlights JSONB DEFAULT '[]'::jsonb;

-- Rename 'name' to match proto definition more closely (keep both for now)
UPDATE restaurant_profiles SET display_name = name WHERE name IS NOT NULL;

-- Create indexes for new searchable fields
CREATE INDEX idx_chef_location ON chef_profiles(location);
CREATE INDEX idx_chef_languages ON chef_profiles USING GIN (languages);
CREATE INDEX idx_restaurant_location ON restaurant_profiles(location);
CREATE INDEX idx_restaurant_culture ON restaurant_profiles USING GIN (culture_keywords);

-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin

-- Drop new indexes
DROP INDEX IF EXISTS idx_restaurant_culture;
DROP INDEX IF EXISTS idx_restaurant_location;
DROP INDEX IF EXISTS idx_chef_languages;
DROP INDEX IF EXISTS idx_chef_location;

-- Remove new fields from restaurant_profiles
ALTER TABLE restaurant_profiles
DROP COLUMN IF EXISTS learning_highlights,
DROP COLUMN IF EXISTS support_programs,
DROP COLUMN IF EXISTS benefits,
DROP COLUMN IF EXISTS culture_keywords,
DROP COLUMN IF EXISTS mentorship_style,
DROP COLUMN IF EXISTS seats,
DROP COLUMN IF EXISTS location,
DROP COLUMN IF EXISTS tagline,
DROP COLUMN IF EXISTS display_name;

-- Restore years_exp column for chef_profiles
ALTER TABLE chef_profiles ADD COLUMN years_exp INTEGER;
UPDATE chef_profiles SET years_exp = years_experience WHERE years_experience IS NOT NULL;

-- Remove new fields from chef_profiles
ALTER TABLE chef_profiles
DROP COLUMN IF EXISTS portfolio_items,
DROP COLUMN IF EXISTS learning_focus,
DROP COLUMN IF EXISTS languages,
DROP COLUMN IF EXISTS availability,
DROP COLUMN IF EXISTS years_experience,
DROP COLUMN IF EXISTS location,
DROP COLUMN IF EXISTS summary,
DROP COLUMN IF EXISTS headline;

-- +goose StatementEnd
