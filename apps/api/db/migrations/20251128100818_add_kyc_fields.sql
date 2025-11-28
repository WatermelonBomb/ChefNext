-- +goose Up
-- +goose StatementBegin
ALTER TABLE users ADD COLUMN kyc_flags JSONB DEFAULT '{}';
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
ALTER TABLE users DROP COLUMN IF EXISTS kyc_flags;
-- +goose StatementEnd
