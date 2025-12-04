package restaurantprofile

import (
	"context"
	"errors"
	"strings"
	"time"

	"github.com/chefnext/chefnext/apps/api/internal/repository/db"
	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgtype"
)

var (
	ErrProfileAlreadyExists      = errors.New("restaurant profile already exists")
	ErrProfileNotFound           = errors.New("restaurant profile not found")
	ErrInvalidName               = errors.New("restaurant name is required")
	ErrUnauthorizedProfileAccess = errors.New("cannot modify another user's restaurant profile")
)

// Service coordinates restaurant profile operations.
type Service struct {
	queries *db.Queries
}

// NewService constructs a Service instance.
func NewService(queries *db.Queries) *Service {
	return &Service{queries: queries}
}

// Profile represents a restaurant profile in domain form.
type Profile struct {
	ID                 uuid.UUID
	UserID             uuid.UUID
	DisplayName        *string
	Tagline            *string
	Location           *string
	Seats              *int32
	CuisineTypes       []string
	MentorshipStyle    *string
	Description        *string
	CultureKeywords    []string
	Benefits           []string
	SupportPrograms    []string
	LearningHighlights []byte
	CreatedAt          time.Time
	UpdatedAt          time.Time
}

// CreateInput captures the values required to create a profile.
type CreateInput struct {
	UserID             uuid.UUID
	DisplayName        string
	Tagline            string
	Location           string
	Seats              int32
	CuisineTypes       []string
	MentorshipStyle    string
	Description        string
	CultureKeywords    []string
	Benefits           []string
	SupportPrograms    []string
	LearningHighlights []byte
}

// UpdateInput captures the fields that can be modified.
type UpdateInput struct {
	ProfileID          uuid.UUID
	UserID             uuid.UUID
	DisplayName        *string
	Tagline            *string
	Location           *string
	Seats              *int32
	CuisineTypes       *[]string
	MentorshipStyle    *string
	Description        *string
	CultureKeywords    *[]string
	Benefits           *[]string
	SupportPrograms    *[]string
	LearningHighlights *[]byte
}

// SearchInput defines filters for listing restaurant profiles.
type SearchInput struct {
	NameFilter string
	Cuisine    []string
	Limit      int32
	Offset     int32
}

// SearchOutput wraps the paginated list of profiles.
type SearchOutput struct {
	Profiles []*Profile
	Total    int32
}

// CreateProfile inserts a new restaurant profile for the current user.
func (s *Service) CreateProfile(ctx context.Context, input CreateInput) (*Profile, error) {
	displayName := strings.TrimSpace(input.DisplayName)
	if displayName == "" {
		return nil, ErrInvalidName
	}

	var userID pgtype.UUID
	if err := userID.Scan(input.UserID[:]); err != nil {
		return nil, err
	}

	if _, err := s.queries.GetRestaurantProfileByUserID(ctx, userID); err == nil {
		return nil, ErrProfileAlreadyExists
	} else if err != pgx.ErrNoRows {
		return nil, err
	}

	profile, err := s.queries.CreateRestaurantProfile(ctx, db.CreateRestaurantProfileParams{
		UserID:             userID,
		DisplayName:        pgtype.Text{String: displayName, Valid: displayName != ""},
		Tagline:            pgtype.Text{String: input.Tagline, Valid: input.Tagline != ""},
		Location:           pgtype.Text{String: input.Location, Valid: input.Location != ""},
		Seats:              pgtype.Int4{Int32: input.Seats, Valid: true},
		CuisineTypes:       input.CuisineTypes,
		MentorshipStyle:    pgtype.Text{String: input.MentorshipStyle, Valid: input.MentorshipStyle != ""},
		Description:        pgtype.Text{String: input.Description, Valid: input.Description != ""},
		CultureKeywords:    input.CultureKeywords,
		Benefits:           input.Benefits,
		SupportPrograms:    input.SupportPrograms,
		LearningHighlights: input.LearningHighlights,
	})
	if err != nil {
		return nil, err
	}

	return mapProfileFromCreate(profile)
}

// GetProfile fetches a profile by id.
func (s *Service) GetProfile(ctx context.Context, profileID uuid.UUID) (*Profile, error) {
	var pgID pgtype.UUID
	if err := pgID.Scan(profileID[:]); err != nil {
		return nil, err
	}

	profile, err := s.queries.GetRestaurantProfileByID(ctx, pgID)
	if err == pgx.ErrNoRows {
		return nil, ErrProfileNotFound
	}
	if err != nil {
		return nil, err
	}

	return mapProfileFromGet(profile)
}

// GetProfileByUser fetches the authenticated user's profile.
func (s *Service) GetProfileByUser(ctx context.Context, userID uuid.UUID) (*Profile, error) {
	var pgID pgtype.UUID
	if err := pgID.Scan(userID[:]); err != nil {
		return nil, err
	}

	profile, err := s.queries.GetRestaurantProfileByUserID(ctx, pgID)
	if err == pgx.ErrNoRows {
		return nil, ErrProfileNotFound
	}
	if err != nil {
		return nil, err
	}

	return mapProfileFromGetByUser(profile)
}

// UpdateProfile modifies an existing restaurant profile.
func (s *Service) UpdateProfile(ctx context.Context, input UpdateInput) (*Profile, error) {
	var pgID pgtype.UUID
	if err := pgID.Scan(input.ProfileID[:]); err != nil {
		return nil, err
	}

	existing, err := s.queries.GetRestaurantProfileByID(ctx, pgID)
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

	params := db.UpdateRestaurantProfileParams{
		ID:                 pgID,
		DisplayName:        pgtype.Text{Valid: false},
		Tagline:            pgtype.Text{Valid: false},
		Location:           pgtype.Text{Valid: false},
		Seats:              pgtype.Int4{Valid: false},
		CuisineTypes:       nil,
		MentorshipStyle:    pgtype.Text{Valid: false},
		Description:        pgtype.Text{Valid: false},
		CultureKeywords:    nil,
		Benefits:           nil,
		SupportPrograms:    nil,
		LearningHighlights: nil,
	}

	if input.DisplayName != nil {
		trimmed := strings.TrimSpace(*input.DisplayName)
		if trimmed == "" {
			return nil, ErrInvalidName
		}
		params.DisplayName = pgtype.Text{String: trimmed, Valid: true}
	}

	if input.Tagline != nil {
		params.Tagline = pgtype.Text{String: *input.Tagline, Valid: true}
	}

	if input.Location != nil {
		params.Location = pgtype.Text{String: *input.Location, Valid: true}
	}

	if input.Seats != nil {
		params.Seats = pgtype.Int4{Int32: *input.Seats, Valid: true}
	}

	if input.CuisineTypes != nil {
		params.CuisineTypes = *input.CuisineTypes
	}

	if input.MentorshipStyle != nil {
		params.MentorshipStyle = pgtype.Text{String: *input.MentorshipStyle, Valid: true}
	}

	if input.Description != nil {
		params.Description = pgtype.Text{String: *input.Description, Valid: true}
	}

	if input.CultureKeywords != nil {
		params.CultureKeywords = *input.CultureKeywords
	}

	if input.Benefits != nil {
		params.Benefits = *input.Benefits
	}

	if input.SupportPrograms != nil {
		params.SupportPrograms = *input.SupportPrograms
	}

	if input.LearningHighlights != nil {
		params.LearningHighlights = *input.LearningHighlights
	}

	updated, err := s.queries.UpdateRestaurantProfile(ctx, params)
	if err != nil {
		return nil, err
	}

	return mapProfileFromUpdate(updated)
}

// SearchProfiles lists restaurant profiles matching the filters.
func (s *Service) SearchProfiles(ctx context.Context, input SearchInput) (*SearchOutput, error) {
	limit := clampLimit(input.Limit)
	offset := input.Offset
	if offset < 0 {
		offset = 0
	}

	nameFilter := strings.TrimSpace(input.NameFilter)

	profiles, err := s.queries.SearchRestaurantProfiles(ctx, db.SearchRestaurantProfilesParams{
		Column1: nameFilter,
		Column2: input.Cuisine,
		Limit:   limit,
		Offset:  offset,
	})
	if err != nil {
		return nil, err
	}

	result := make([]*Profile, 0, len(profiles))
	for _, p := range profiles {
		mapped, err := mapProfileFromSearch(p)
		if err != nil {
			return nil, err
		}
		result = append(result, mapped)
	}

	return &SearchOutput{Profiles: result, Total: int32(len(result))}, nil
}

func mapProfileFromCreate(row db.CreateRestaurantProfileRow) (*Profile, error) {
	return mapProfileCommon(
		row.ID, row.UserID, row.DisplayName, row.Tagline, row.Location,
		row.Seats, row.CuisineTypes, row.MentorshipStyle, row.Description,
		row.CultureKeywords, row.Benefits, row.SupportPrograms,
		row.LearningHighlights, row.CreatedAt, row.UpdatedAt,
	)
}

func mapProfileFromGet(row db.GetRestaurantProfileByIDRow) (*Profile, error) {
	return mapProfileCommon(
		row.ID, row.UserID, row.DisplayName, row.Tagline, row.Location,
		row.Seats, row.CuisineTypes, row.MentorshipStyle, row.Description,
		row.CultureKeywords, row.Benefits, row.SupportPrograms,
		row.LearningHighlights, row.CreatedAt, row.UpdatedAt,
	)
}

func mapProfileFromGetByUser(row db.GetRestaurantProfileByUserIDRow) (*Profile, error) {
	return mapProfileCommon(
		row.ID, row.UserID, row.DisplayName, row.Tagline, row.Location,
		row.Seats, row.CuisineTypes, row.MentorshipStyle, row.Description,
		row.CultureKeywords, row.Benefits, row.SupportPrograms,
		row.LearningHighlights, row.CreatedAt, row.UpdatedAt,
	)
}

func mapProfileFromUpdate(row db.UpdateRestaurantProfileRow) (*Profile, error) {
	return mapProfileCommon(
		row.ID, row.UserID, row.DisplayName, row.Tagline, row.Location,
		row.Seats, row.CuisineTypes, row.MentorshipStyle, row.Description,
		row.CultureKeywords, row.Benefits, row.SupportPrograms,
		row.LearningHighlights, row.CreatedAt, row.UpdatedAt,
	)
}

func mapProfileFromSearch(row db.SearchRestaurantProfilesRow) (*Profile, error) {
	return mapProfileCommon(
		row.ID, row.UserID, row.DisplayName, row.Tagline, row.Location,
		row.Seats, row.CuisineTypes, row.MentorshipStyle, row.Description,
		row.CultureKeywords, row.Benefits, row.SupportPrograms,
		row.LearningHighlights, row.CreatedAt, row.UpdatedAt,
	)
}

func mapProfileCommon(
	id pgtype.UUID, userID pgtype.UUID, displayName pgtype.Text, tagline pgtype.Text,
	location pgtype.Text, seats pgtype.Int4, cuisineTypes []string,
	mentorshipStyle pgtype.Text, description pgtype.Text, cultureKeywords []string,
	benefits []string, supportPrograms []string, learningHighlights []byte,
	createdAt pgtype.Timestamp, updatedAt pgtype.Timestamp,
) (*Profile, error) {
	profileID, err := uuid.FromBytes(id.Bytes[:])
	if err != nil {
		return nil, err
	}

	userUUID, err := uuid.FromBytes(userID.Bytes[:])
	if err != nil {
		return nil, err
	}

	var displayNamePtr *string
	if displayName.Valid {
		displayNamePtr = &displayName.String
	}

	var taglinePtr *string
	if tagline.Valid {
		taglinePtr = &tagline.String
	}

	var locationPtr *string
	if location.Valid {
		locationPtr = &location.String
	}

	var seatsPtr *int32
	if seats.Valid {
		seatsPtr = &seats.Int32
	}

	var mentorshipStylePtr *string
	if mentorshipStyle.Valid {
		mentorshipStylePtr = &mentorshipStyle.String
	}

	var descriptionPtr *string
	if description.Valid {
		descriptionPtr = &description.String
	}

	return &Profile{
		ID:                 profileID,
		UserID:             userUUID,
		DisplayName:        displayNamePtr,
		Tagline:            taglinePtr,
		Location:           locationPtr,
		Seats:              seatsPtr,
		CuisineTypes:       cuisineTypes,
		MentorshipStyle:    mentorshipStylePtr,
		Description:        descriptionPtr,
		CultureKeywords:    cultureKeywords,
		Benefits:           benefits,
		SupportPrograms:    supportPrograms,
		LearningHighlights: learningHighlights,
		CreatedAt:          createdAt.Time,
		UpdatedAt:          updatedAt.Time,
	}, nil
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
