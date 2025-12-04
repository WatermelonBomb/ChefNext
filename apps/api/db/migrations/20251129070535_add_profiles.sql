-- +goose Up
-- +goose StatementBegin

-- Chef profiles table
CREATE TABLE chef_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    skill_tree_json JSONB,
    specialties TEXT[],
    work_areas TEXT[],
    years_exp INTEGER,
    bio TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Indexes for efficient querying
CREATE INDEX idx_chef_specialties ON chef_profiles USING GIN (specialties);
CREATE INDEX idx_chef_work_areas ON chef_profiles USING GIN (work_areas);
CREATE INDEX idx_chef_user_id ON chef_profiles(user_id);

-- Restaurant profiles table
CREATE TABLE restaurant_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    address TEXT,
    description TEXT,
    cuisine_types TEXT[],
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Index for restaurant lookup
CREATE INDEX idx_restaurant_user_id ON restaurant_profiles(user_id);
CREATE INDEX idx_restaurant_cuisine_types ON restaurant_profiles USING GIN (cuisine_types);

-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin

DROP TABLE IF EXISTS restaurant_profiles;
DROP TABLE IF EXISTS chef_profiles;

-- +goose StatementEnd
