package restaurant

import (
	"context"
	"encoding/json"
	"errors"
	"time"

	"connectrpc.com/connect"
	restaurantv1 "github.com/chefnext/chefnext/apps/api/internal/gen/restaurant/v1"
	"github.com/chefnext/chefnext/apps/api/internal/gen/restaurant/v1/restaurantv1connect"
	"github.com/chefnext/chefnext/apps/api/internal/middleware"
	"github.com/chefnext/chefnext/apps/api/internal/usecase/restaurantprofile"
	"github.com/google/uuid"
)

// ProfileHandler implements RestaurantProfileService.
type ProfileHandler struct {
	service *restaurantprofile.Service
}

// NewProfileHandler wires the handler into Connect.
func NewProfileHandler(service *restaurantprofile.Service) restaurantv1connect.RestaurantProfileServiceHandler {
	return &ProfileHandler{service: service}
}

// CreateProfile registers a new restaurant profile.
func (h *ProfileHandler) CreateProfile(ctx context.Context, req *connect.Request[restaurantv1.CreateProfileRequest]) (*connect.Response[restaurantv1.CreateProfileResponse], error) {
	userID, err := h.requireRole(ctx, "RESTAURANT")
	if err != nil {
		return nil, err
	}

	learningHighlightsBytes, err := marshalLearningHighlights(req.Msg.GetLearningHighlights())
	if err != nil {
		return nil, connect.NewError(connect.CodeInvalidArgument, err)
	}

	profile, err := h.service.CreateProfile(ctx, restaurantprofile.CreateInput{
		UserID:             userID,
		DisplayName:        req.Msg.GetDisplayName(),
		Tagline:            req.Msg.GetTagline(),
		Location:           req.Msg.GetLocation(),
		Seats:              req.Msg.GetSeats(),
		CuisineTypes:       req.Msg.GetCuisineTypes(),
		MentorshipStyle:    req.Msg.GetMentorshipStyle(),
		Description:        req.Msg.GetDescription(),
		CultureKeywords:    req.Msg.GetCultureKeywords(),
		Benefits:           req.Msg.GetBenefits(),
		SupportPrograms:    req.Msg.GetSupportPrograms(),
		LearningHighlights: learningHighlightsBytes,
	})
	if err != nil {
		return nil, mapRestaurantError(err)
	}

	return connect.NewResponse(&restaurantv1.CreateProfileResponse{Profile: toProto(profile)}), nil
}

// GetProfile retrieves a restaurant profile by ID.
func (h *ProfileHandler) GetProfile(ctx context.Context, req *connect.Request[restaurantv1.GetProfileRequest]) (*connect.Response[restaurantv1.GetProfileResponse], error) {
	profileID, err := uuid.Parse(req.Msg.GetProfileId())
	if err != nil {
		return nil, connect.NewError(connect.CodeInvalidArgument, err)
	}

	profile, err := h.service.GetProfile(ctx, profileID)
	if err != nil {
		return nil, mapRestaurantError(err)
	}

	return connect.NewResponse(&restaurantv1.GetProfileResponse{Profile: toProto(profile)}), nil
}

// GetMyProfile returns the authenticated restaurant's profile.
func (h *ProfileHandler) GetMyProfile(ctx context.Context, _ *connect.Request[restaurantv1.GetMyProfileRequest]) (*connect.Response[restaurantv1.GetMyProfileResponse], error) {
	userID, err := h.requireRole(ctx, "RESTAURANT")
	if err != nil {
		return nil, err
	}

	profile, err := h.service.GetProfileByUser(ctx, userID)
	if err != nil {
		return nil, mapRestaurantError(err)
	}

	return connect.NewResponse(&restaurantv1.GetMyProfileResponse{Profile: toProto(profile)}), nil
}

// UpdateProfile modifies restaurant profile fields.
func (h *ProfileHandler) UpdateProfile(ctx context.Context, req *connect.Request[restaurantv1.UpdateProfileRequest]) (*connect.Response[restaurantv1.UpdateProfileResponse], error) {
	userID, err := h.requireRole(ctx, "RESTAURANT")
	if err != nil {
		return nil, err
	}

	profileID, err := uuid.Parse(req.Msg.GetProfileId())
	if err != nil {
		return nil, connect.NewError(connect.CodeInvalidArgument, err)
	}

	var learningHighlightsBytes *[]byte
	if req.Msg.LearningHighlights != nil {
		bytes, err := marshalLearningHighlights(req.Msg.LearningHighlights)
		if err != nil {
			return nil, connect.NewError(connect.CodeInvalidArgument, err)
		}
		learningHighlightsBytes = &bytes
	}

	input := restaurantprofile.UpdateInput{
		ProfileID:          profileID,
		UserID:             userID,
		DisplayName:        optionalString(req.Msg.DisplayName),
		Tagline:            optionalString(req.Msg.Tagline),
		Location:           optionalString(req.Msg.Location),
		Seats:              optionalInt32(req.Msg.Seats),
		CuisineTypes:       optionalSlice(req.Msg.CuisineTypes),
		MentorshipStyle:    optionalString(req.Msg.MentorshipStyle),
		Description:        optionalString(req.Msg.Description),
		CultureKeywords:    optionalSlice(req.Msg.CultureKeywords),
		Benefits:           optionalSlice(req.Msg.Benefits),
		SupportPrograms:    optionalSlice(req.Msg.SupportPrograms),
		LearningHighlights: learningHighlightsBytes,
	}

	profile, err := h.service.UpdateProfile(ctx, input)
	if err != nil {
		return nil, mapRestaurantError(err)
	}

	return connect.NewResponse(&restaurantv1.UpdateProfileResponse{Profile: toProto(profile)}), nil
}

// SearchProfiles lists restaurant profiles by filters.
func (h *ProfileHandler) SearchProfiles(ctx context.Context, req *connect.Request[restaurantv1.SearchProfilesRequest]) (*connect.Response[restaurantv1.SearchProfilesResponse], error) {
	if _, _, err := h.getUserContext(ctx); err != nil {
		return nil, err
	}

	output, err := h.service.SearchProfiles(ctx, restaurantprofile.SearchInput{
		NameFilter: req.Msg.GetName(),
		Cuisine:    req.Msg.GetCuisineTypes(),
		Limit:      req.Msg.GetLimit(),
		Offset:     req.Msg.GetOffset(),
	})
	if err != nil {
		return nil, connect.NewError(connect.CodeInternal, err)
	}

	items := make([]*restaurantv1.RestaurantProfile, 0, len(output.Profiles))
	for _, profile := range output.Profiles {
		items = append(items, toProto(profile))
	}

	return connect.NewResponse(&restaurantv1.SearchProfilesResponse{
		Profiles: items,
	}), nil
}

func (h *ProfileHandler) requireRole(ctx context.Context, role string) (uuid.UUID, error) {
	userID, userRole, err := h.getUserContext(ctx)
	if err != nil {
		return uuid.UUID{}, err
	}

	if userRole != role {
		return uuid.UUID{}, connect.NewError(connect.CodePermissionDenied, errors.New("insufficient role"))
	}

	return userID, nil
}

func (h *ProfileHandler) getUserContext(ctx context.Context) (uuid.UUID, string, error) {
	userID, ok := middleware.GetUserID(ctx)
	if !ok {
		return uuid.UUID{}, "", connect.NewError(connect.CodeUnauthenticated, errors.New("missing user context"))
	}

	role, ok := middleware.GetUserRole(ctx)
	if !ok {
		return uuid.UUID{}, "", connect.NewError(connect.CodeUnauthenticated, errors.New("missing role context"))
	}

	return userID, role, nil
}

func toProto(profile *restaurantprofile.Profile) *restaurantv1.RestaurantProfile {
	if profile == nil {
		return nil
	}

	var displayName string
	if profile.DisplayName != nil {
		displayName = *profile.DisplayName
	}

	var tagline string
	if profile.Tagline != nil {
		tagline = *profile.Tagline
	}

	var location string
	if profile.Location != nil {
		location = *profile.Location
	}

	var seats int32
	if profile.Seats != nil {
		seats = *profile.Seats
	}

	var mentorshipStyle string
	if profile.MentorshipStyle != nil {
		mentorshipStyle = *profile.MentorshipStyle
	}

	var description string
	if profile.Description != nil {
		description = *profile.Description
	}

	learningHighlights, _ := unmarshalLearningHighlights(profile.LearningHighlights)

	return &restaurantv1.RestaurantProfile{
		Id:                 profile.ID.String(),
		UserId:             profile.UserID.String(),
		DisplayName:        displayName,
		Tagline:            tagline,
		Location:           location,
		Seats:              seats,
		CuisineTypes:       profile.CuisineTypes,
		MentorshipStyle:    mentorshipStyle,
		Description:        description,
		CultureKeywords:    profile.CultureKeywords,
		Benefits:           profile.Benefits,
		SupportPrograms:    profile.SupportPrograms,
		LearningHighlights: learningHighlights,
		CreatedAt:          profile.CreatedAt.UTC().Format(time.RFC3339Nano),
		UpdatedAt:          profile.UpdatedAt.UTC().Format(time.RFC3339Nano),
	}
}

func mapRestaurantError(err error) error {
	switch {
	case errors.Is(err, restaurantprofile.ErrProfileAlreadyExists):
		return connect.NewError(connect.CodeAlreadyExists, err)
	case errors.Is(err, restaurantprofile.ErrProfileNotFound):
		return connect.NewError(connect.CodeNotFound, err)
	case errors.Is(err, restaurantprofile.ErrInvalidName):
		return connect.NewError(connect.CodeInvalidArgument, err)
	case errors.Is(err, restaurantprofile.ErrUnauthorizedProfileAccess):
		return connect.NewError(connect.CodePermissionDenied, err)
	default:
		return connect.NewError(connect.CodeInternal, err)
	}
}

func marshalLearningHighlights(items []*restaurantv1.LearningHighlight) ([]byte, error) {
	if len(items) == 0 {
		return []byte("[]"), nil
	}
	return json.Marshal(items)
}

func unmarshalLearningHighlights(data []byte) ([]*restaurantv1.LearningHighlight, error) {
	if len(data) == 0 {
		return nil, nil
	}
	var items []*restaurantv1.LearningHighlight
	if err := json.Unmarshal(data, &items); err != nil {
		return nil, err
	}
	return items, nil
}

func optionalString(s string) *string {
	if s == "" {
		return nil
	}
	return &s
}

func optionalInt32(i int32) *int32 {
	if i == 0 {
		return nil
	}
	return &i
}

func optionalSlice(s []string) *[]string {
	if len(s) == 0 {
		return nil
	}
	return &s
}
