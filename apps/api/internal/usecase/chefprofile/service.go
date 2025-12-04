package chefprofile

import (
	"context"
	"encoding/json"
	"errors"
	"strings"
	"time"

	"github.com/chefnext/chefnext/apps/api/internal/repository/db"
	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgtype"
)

var (
	ErrProfileAlreadyExists      = errors.New("chef profile already exists")
	ErrProfileNotFound           = errors.New("chef profile not found")
	ErrInvalidSkillTreeJSON      = errors.New("skill tree JSON must be valid JSON")
	ErrUnauthorizedProfileAccess = errors.New("cannot modify another user's profile")
)

// Service coordinates chef profile operations against the database.
type Service struct {
	queries *db.Queries
}

// NewService constructs a new Service instance.
func NewService(queries *db.Queries) *Service {
	return &Service{queries: queries}
}

// Profile represents a chef profile in domain form.
type Profile struct {
	ID              uuid.UUID
	UserID          uuid.UUID
	FullName        *string
	Headline        *string
	Summary         *string
	Location        *string
	YearsExperience *int32
	Availability    *string
	Specialties     []string
	WorkAreas       []string
	Languages       []string
	Bio             *string
	LearningFocus   []string
	SkillTreeJSON   string
	PortfolioItems  []byte
	CreatedAt       time.Time
	UpdatedAt       time.Time
}

// CreateInput captures the information needed to create a chef profile.
type CreateInput struct {
	UserID          uuid.UUID
	FullName        string
	Headline        string
	Summary         string
	Location        string
	YearsExperience int32
	Availability    string
	Specialties     []string
	WorkAreas       []string
	Languages       []string
	Bio             string
	LearningFocus   []string
	SkillTreeJSON   string
	PortfolioItems  []byte
}

// UpdateInput captures fields that can be changed on a chef profile.
type UpdateInput struct {
	ProfileID       uuid.UUID
	UserID          uuid.UUID
	FullName        *string
	Headline        *string
	Summary         *string
	Location        *string
	YearsExperience *int32
	Availability    *string
	Specialties     *[]string
	WorkAreas       *[]string
	Languages       *[]string
	Bio             *string
	LearningFocus   *[]string
	SkillTreeJSON   *string
	PortfolioItems  *[]byte
}

// SearchInput defines filters for listing chef profiles.
type SearchInput struct {
	Specialties []string
	WorkAreas   []string
	Limit       int32
	Offset      int32
}

// SearchOutput wraps the results of a search operation.
type SearchOutput struct {
	Profiles []*Profile
	Total    int32
}

// CreateProfile inserts a new chef profile for the authenticated user.
func (s *Service) CreateProfile(ctx context.Context, input CreateInput) (*Profile, error) {
	if err := validateSkillTreeJSON(input.SkillTreeJSON); err != nil {
		return nil, err
	}

	var userID pgtype.UUID
	if err := userID.Scan(input.UserID[:]); err != nil {
		return nil, err
	}

	if _, err := s.queries.GetChefProfileByUserID(ctx, userID); err == nil {
		return nil, ErrProfileAlreadyExists
	} else if err != pgx.ErrNoRows {
		return nil, err
	}

	skillTreeBytes := normalizeSkillTreeBytes(input.SkillTreeJSON)

	profile, err := s.queries.CreateChefProfile(ctx, db.CreateChefProfileParams{
		UserID:          userID,
		FullName:        pgtype.Text{String: input.FullName, Valid: input.FullName != ""},
		Headline:        pgtype.Text{String: input.Headline, Valid: input.Headline != ""},
		Summary:         pgtype.Text{String: input.Summary, Valid: input.Summary != ""},
		Location:        pgtype.Text{String: input.Location, Valid: input.Location != ""},
		YearsExperience: pgtype.Int4{Int32: input.YearsExperience, Valid: true},
		Availability:    pgtype.Text{String: input.Availability, Valid: input.Availability != ""},
		Specialties:     input.Specialties,
		WorkAreas:       input.WorkAreas,
		Languages:       input.Languages,
		Bio:             pgtype.Text{String: input.Bio, Valid: input.Bio != ""},
		LearningFocus:   input.LearningFocus,
		SkillTreeJson:   skillTreeBytes,
		PortfolioItems:  input.PortfolioItems,
	})
	if err != nil {
		return nil, err
	}

	return mapChefProfile(profile)
}

// GetProfile fetches a profile by its identifier.
func (s *Service) GetProfile(ctx context.Context, profileID uuid.UUID) (*Profile, error) {
	var pgID pgtype.UUID
	if err := pgID.Scan(profileID[:]); err != nil {
		return nil, err
	}

	profile, err := s.queries.GetChefProfileByID(ctx, pgID)
	if err == pgx.ErrNoRows {
		return nil, ErrProfileNotFound
	}
	if err != nil {
		return nil, err
	}

	return mapChefProfile(profile)
}

// GetProfileByUser fetches the current user's chef profile.
func (s *Service) GetProfileByUser(ctx context.Context, userID uuid.UUID) (*Profile, error) {
	var pgID pgtype.UUID
	if err := pgID.Scan(userID[:]); err != nil {
		return nil, err
	}

	profile, err := s.queries.GetChefProfileByUserID(ctx, pgID)
	if err == pgx.ErrNoRows {
		return nil, ErrProfileNotFound
	}
	if err != nil {
		return nil, err
	}

	return mapChefProfile(profile)
}

// UpdateProfile applies partial changes to an existing chef profile.
func (s *Service) UpdateProfile(ctx context.Context, input UpdateInput) (*Profile, error) {
	var pgProfileID pgtype.UUID
	if err := pgProfileID.Scan(input.ProfileID[:]); err != nil {
		return nil, err
	}

	existing, err := s.queries.GetChefProfileByID(ctx, pgProfileID)
	if err == pgx.ErrNoRows {
		return nil, ErrProfileNotFound
	}
	if err != nil {
		return nil, err
	}

	existingUserID, err := uuid.FromBytes(existing.UserID.Bytes[:])
	if err != nil {
		return nil, err
	}
	if existingUserID != input.UserID {
		return nil, ErrUnauthorizedProfileAccess
	}

	var skillTreeBytes []byte
	if input.SkillTreeJSON != nil {
		if err := validateSkillTreeJSON(*input.SkillTreeJSON); err != nil {
			return nil, err
		}
		skillTreeBytes = normalizeSkillTreeBytes(*input.SkillTreeJSON)
	}

	params := db.UpdateChefProfileParams{
		ID:              pgProfileID,
		FullName:        pgtype.Text{Valid: false},
		Headline:        pgtype.Text{Valid: false},
		Summary:         pgtype.Text{Valid: false},
		Location:        pgtype.Text{Valid: false},
		YearsExperience: pgtype.Int4{Valid: false},
		Availability:    pgtype.Text{Valid: false},
		Specialties:     nil,
		WorkAreas:       nil,
		Languages:       nil,
		Bio:             pgtype.Text{Valid: false},
		LearningFocus:   nil,
		SkillTreeJson:   skillTreeBytes,
		PortfolioItems:  nil,
	}

	if input.Headline != nil {
		params.Headline = pgtype.Text{String: *input.Headline, Valid: true}
	}

	if input.FullName != nil {
		params.FullName = pgtype.Text{String: *input.FullName, Valid: true}
	}

	if input.Summary != nil {
		params.Summary = pgtype.Text{String: *input.Summary, Valid: true}
	}

	if input.Location != nil {
		params.Location = pgtype.Text{String: *input.Location, Valid: true}
	}

	if input.YearsExperience != nil {
		params.YearsExperience = pgtype.Int4{Int32: *input.YearsExperience, Valid: true}
	}

	if input.Availability != nil {
		params.Availability = pgtype.Text{String: *input.Availability, Valid: true}
	}

	if input.Specialties != nil {
		params.Specialties = *input.Specialties
	}

	if input.WorkAreas != nil {
		params.WorkAreas = *input.WorkAreas
	}

	if input.Languages != nil {
		params.Languages = *input.Languages
	}

	if input.Bio != nil {
		params.Bio = pgtype.Text{String: *input.Bio, Valid: true}
	}

	if input.LearningFocus != nil {
		params.LearningFocus = *input.LearningFocus
	}

	if input.PortfolioItems != nil {
		params.PortfolioItems = *input.PortfolioItems
	}

	updated, err := s.queries.UpdateChefProfile(ctx, params)
	if err != nil {
		return nil, err
	}

	return mapChefProfile(updated)
}

// SearchProfiles lists chef profiles matching the provided filters.
func (s *Service) SearchProfiles(ctx context.Context, input SearchInput) (*SearchOutput, error) {
	limit := clampLimit(input.Limit)
	offset := input.Offset
	if offset < 0 {
		offset = 0
	}

	profiles, err := s.queries.SearchChefProfiles(ctx, db.SearchChefProfilesParams{
		Column1: input.Specialties,
		Column2: input.WorkAreas,
		Limit:   limit,
		Offset:  offset,
	})
	if err != nil {
		return nil, err
	}

	result := make([]*Profile, 0, len(profiles))
	for _, profile := range profiles {
		mapped, err := mapChefProfile(profile)
		if err != nil {
			return nil, err
		}
		result = append(result, mapped)
	}

	return &SearchOutput{
		Profiles: result,
		Total:    int32(len(result)),
	}, nil
}

func mapChefProfile(row db.ChefProfile) (*Profile, error) {
	profileID, err := uuid.FromBytes(row.ID.Bytes[:])
	if err != nil {
		return nil, err
	}

	userUUID, err := uuid.FromBytes(row.UserID.Bytes[:])
	if err != nil {
		return nil, err
	}

	var headlinePtr *string
	if row.Headline.Valid {
		headlinePtr = &row.Headline.String
	}

	var fullNamePtr *string
	if row.FullName.Valid {
		fullNamePtr = &row.FullName.String
	}

	var summaryPtr *string
	if row.Summary.Valid {
		summaryPtr = &row.Summary.String
	}

	var locationPtr *string
	if row.Location.Valid {
		locationPtr = &row.Location.String
	}

	var yearsExpPtr *int32
	if row.YearsExperience.Valid {
		yearsExpPtr = &row.YearsExperience.Int32
	}

	var availabilityPtr *string
	if row.Availability.Valid {
		availabilityPtr = &row.Availability.String
	}

	var bioPtr *string
	if row.Bio.Valid {
		bioPtr = &row.Bio.String
	}

	return &Profile{
		ID:              profileID,
		UserID:          userUUID,
		FullName:        fullNamePtr,
		Headline:        headlinePtr,
		Summary:         summaryPtr,
		Location:        locationPtr,
		YearsExperience: yearsExpPtr,
		Availability:    availabilityPtr,
		Specialties:     row.Specialties,
		WorkAreas:       row.WorkAreas,
		Languages:       row.Languages,
		Bio:             bioPtr,
		LearningFocus:   row.LearningFocus,
		SkillTreeJSON:   string(row.SkillTreeJson),
		PortfolioItems:  row.PortfolioItems,
		CreatedAt:       row.CreatedAt.Time,
		UpdatedAt:       row.UpdatedAt.Time,
	}, nil
}

func validateSkillTreeJSON(raw string) error {
	if strings.TrimSpace(raw) == "" {
		return nil
	}

	if !json.Valid([]byte(raw)) {
		return ErrInvalidSkillTreeJSON
	}

	return nil
}

func normalizeSkillTreeBytes(raw string) []byte {
	trimmed := strings.TrimSpace(raw)
	if trimmed == "" {
		return nil
	}

	return []byte(trimmed)
}

func clampLimit(limit int32) int32 {
	if limit <= 0 {
		return 20
	}

	if limit > 100 {
		return 100
	}

	return limit
}
