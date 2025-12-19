-- +goose Up
-- +goose StatementBegin

CREATE TYPE job_status AS ENUM ('DRAFT', 'PUBLISHED', 'CLOSED');
CREATE TYPE application_status AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED');

CREATE TABLE jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    restaurant_id UUID NOT NULL REFERENCES restaurant_profiles(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    required_skills TEXT[] NOT NULL DEFAULT '{}',
    location VARCHAR(255),
    salary_range VARCHAR(255),
    employment_type VARCHAR(100),
    status job_status NOT NULL DEFAULT 'DRAFT',
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    search_vector tsvector GENERATED ALWAYS AS (
        setweight(to_tsvector('simple', coalesce(title, '')), 'A') ||
        setweight(to_tsvector('simple', coalesce(description, '')), 'B')
    ) STORED,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_jobs_restaurant_id ON jobs(restaurant_id);
CREATE INDEX idx_jobs_status ON jobs(status);
CREATE INDEX idx_jobs_location ON jobs(location);
CREATE INDEX idx_jobs_required_skills ON jobs USING GIN (required_skills);
CREATE INDEX idx_jobs_search_vector ON jobs USING GIN (search_vector);

CREATE TABLE applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
    chef_profile_id UUID NOT NULL REFERENCES chef_profiles(id) ON DELETE CASCADE,
    status application_status NOT NULL DEFAULT 'PENDING',
    cover_letter TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    UNIQUE (job_id, chef_profile_id)
);

CREATE INDEX idx_applications_job_id ON applications(job_id);
CREATE INDEX idx_applications_chef_profile_id ON applications(chef_profile_id);

-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin

DROP TABLE IF EXISTS applications;
DROP TABLE IF EXISTS jobs;
DROP TYPE IF EXISTS application_status;
DROP TYPE IF EXISTS job_status;

-- +goose StatementEnd
