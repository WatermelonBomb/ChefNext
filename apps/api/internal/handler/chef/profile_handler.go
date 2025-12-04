package chef

import (
	"context"
	"encoding/json"
	"errors"
	"time"

	"connectrpc.com/connect"
	chefv1 "github.com/chefnext/chefnext/apps/api/internal/gen/chef/v1"
	"github.com/chefnext/chefnext/apps/api/internal/gen/chef/v1/chefv1connect"
	"github.com/chefnext/chefnext/apps/api/internal/middleware"
	"github.com/chefnext/chefnext/apps/api/internal/usecase/chefprofile"
	"github.com/google/uuid"
)

// ProfileHandler implements the ChefProfileService RPCs.
type ProfileHandler struct {
	service *chefprofile.Service
}

// NewProfileHandler wires a chef profile handler.
func NewProfileHandler(service *chefprofile.Service) chefv1connect.ChefProfileServiceHandler {
	return &ProfileHandler{service: service}
}

// CreateProfile creates a new chef profile for the authenticated chef.
func (h *ProfileHandler) CreateProfile(ctx context.Context, req *connect.Request[chefv1.CreateProfileRequest]) (*connect.Response[chefv1.CreateProfileResponse], error) {
	userID, err := h.requireRole(ctx, "CHEF")
	if err != nil {
		return nil, err
	}

	// Convert PortfolioItems from proto to JSON bytes
	portfolioBytes, err := marshalPortfolioItems(req.Msg.GetPortfolioItems())
	if err != nil {
		return nil, connect.NewError(connect.CodeInvalidArgument, err)
	}

	profile, err := h.service.CreateProfile(ctx, chefprofile.CreateInput{
		UserID:          userID,
		FullName:        req.Msg.GetFullName(),
		Headline:        req.Msg.GetHeadline(),
		Summary:         req.Msg.GetSummary(),
		Location:        req.Msg.GetLocation(),
		YearsExperience: req.Msg.GetYearsExperience(),
		Availability:    req.Msg.GetAvailability(),
		Specialties:     req.Msg.GetSpecialties(),
		WorkAreas:       req.Msg.GetWorkAreas(),
		Languages:       req.Msg.GetLanguages(),
		Bio:             req.Msg.GetBio(),
		LearningFocus:   req.Msg.GetLearningFocus(),
		SkillTreeJSON:   req.Msg.GetSkillTreeJson(),
		PortfolioItems:  portfolioBytes,
	})
	if err != nil {
		return nil, mapChefError(err)
	}

	return connect.NewResponse(&chefv1.CreateProfileResponse{Profile: toProto(profile)}), nil
}

// GetProfile fetches a chef profile by its identifier.
func (h *ProfileHandler) GetProfile(ctx context.Context, req *connect.Request[chefv1.GetProfileRequest]) (*connect.Response[chefv1.GetProfileResponse], error) {
	profileID, err := uuid.Parse(req.Msg.GetProfileId())
	if err != nil {
		return nil, connect.NewError(connect.CodeInvalidArgument, err)
	}

	profile, err := h.service.GetProfile(ctx, profileID)
	if err != nil {
		return nil, mapChefError(err)
	}

	return connect.NewResponse(&chefv1.GetProfileResponse{Profile: toProto(profile)}), nil
}

// GetMyProfile returns the authenticated chef's profile.
func (h *ProfileHandler) GetMyProfile(ctx context.Context, _ *connect.Request[chefv1.GetMyProfileRequest]) (*connect.Response[chefv1.GetMyProfileResponse], error) {
	userID, err := h.requireRole(ctx, "CHEF")
	if err != nil {
		return nil, err
	}

	profile, err := h.service.GetProfileByUser(ctx, userID)
	if err != nil {
		return nil, mapChefError(err)
	}

	return connect.NewResponse(&chefv1.GetMyProfileResponse{Profile: toProto(profile)}), nil
}

// UpdateProfile updates fields on the chef profile.
func (h *ProfileHandler) UpdateProfile(ctx context.Context, req *connect.Request[chefv1.UpdateProfileRequest]) (*connect.Response[chefv1.UpdateProfileResponse], error) {
	userID, err := h.requireRole(ctx, "CHEF")
	if err != nil {
		return nil, err
	}

	profileID, err := uuid.Parse(req.Msg.GetProfileId())
	if err != nil {
		return nil, connect.NewError(connect.CodeInvalidArgument, err)
	}

	var portfolioBytes *[]byte
	if req.Msg.PortfolioItems != nil {
		bytes, err := marshalPortfolioItems(req.Msg.PortfolioItems)
		if err != nil {
			return nil, connect.NewError(connect.CodeInvalidArgument, err)
		}
		portfolioBytes = &bytes
	}

	input := chefprofile.UpdateInput{
		ProfileID:       profileID,
		UserID:          userID,
		FullName:        optionalString(req.Msg.FullName),
		Headline:        optionalString(req.Msg.Headline),
		Summary:         optionalString(req.Msg.Summary),
		Location:        optionalString(req.Msg.Location),
		YearsExperience: optionalInt32(req.Msg.YearsExperience),
		Availability:    optionalString(req.Msg.Availability),
		Specialties:     optionalSlice(req.Msg.Specialties),
		WorkAreas:       optionalSlice(req.Msg.WorkAreas),
		Languages:       optionalSlice(req.Msg.Languages),
		Bio:             optionalString(req.Msg.Bio),
		LearningFocus:   optionalSlice(req.Msg.LearningFocus),
		SkillTreeJSON:   optionalString(req.Msg.SkillTreeJson),
		PortfolioItems:  portfolioBytes,
	}

	profile, err := h.service.UpdateProfile(ctx, input)
	if err != nil {
		return nil, mapChefError(err)
	}

	return connect.NewResponse(&chefv1.UpdateProfileResponse{Profile: toProto(profile)}), nil
}

// SearchProfiles lists chef profiles by filters.
func (h *ProfileHandler) SearchProfiles(ctx context.Context, req *connect.Request[chefv1.SearchProfilesRequest]) (*connect.Response[chefv1.SearchProfilesResponse], error) {
	// Any authenticated user can search, but ensure we have user context.
	if _, _, err := h.getUserContext(ctx); err != nil {
		return nil, err
	}

	output, err := h.service.SearchProfiles(ctx, chefprofile.SearchInput{
		Specialties: req.Msg.GetSpecialties(),
		WorkAreas:   req.Msg.GetWorkAreas(),
		Limit:       req.Msg.GetLimit(),
		Offset:      req.Msg.GetOffset(),
	})
	if err != nil {
		return nil, connect.NewError(connect.CodeInternal, err)
	}

	profiles := make([]*chefv1.ChefProfile, 0, len(output.Profiles))
	for _, profile := range output.Profiles {
		profiles = append(profiles, toProto(profile))
	}

	return connect.NewResponse(&chefv1.SearchProfilesResponse{
		Profiles: profiles,
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

func toProto(profile *chefprofile.Profile) *chefv1.ChefProfile {
	if profile == nil {
		return nil
	}

	var headline string
	if profile.Headline != nil {
		headline = *profile.Headline
	}

	var summary string
	if profile.Summary != nil {
		summary = *profile.Summary
	}

	var location string
	if profile.Location != nil {
		location = *profile.Location
	}

	var yearsExperience int32
	if profile.YearsExperience != nil {
		yearsExperience = *profile.YearsExperience
	}

	var availability string
	if profile.Availability != nil {
		availability = *profile.Availability
	}

	var bio string
	if profile.Bio != nil {
		bio = *profile.Bio
	}

	portfolioItems, _ := unmarshalPortfolioItems(profile.PortfolioItems)

	return &chefv1.ChefProfile{
		Id:              profile.ID.String(),
		UserId:          profile.UserID.String(),
		Headline:        headline,
		Summary:         summary,
		Location:        location,
		YearsExperience: yearsExperience,
		Availability:    availability,
		Specialties:     profile.Specialties,
		WorkAreas:       profile.WorkAreas,
		Languages:       profile.Languages,
		Bio:             bio,
		LearningFocus:   profile.LearningFocus,
		SkillTreeJson:   profile.SkillTreeJSON,
		PortfolioItems:  portfolioItems,
		CreatedAt:       profile.CreatedAt.UTC().Format(time.RFC3339Nano),
		UpdatedAt:       profile.UpdatedAt.UTC().Format(time.RFC3339Nano),
	}
}

func mapChefError(err error) error {
	switch {
	case errors.Is(err, chefprofile.ErrProfileAlreadyExists):
		return connect.NewError(connect.CodeAlreadyExists, err)
	case errors.Is(err, chefprofile.ErrProfileNotFound):
		return connect.NewError(connect.CodeNotFound, err)
	case errors.Is(err, chefprofile.ErrInvalidSkillTreeJSON):
		return connect.NewError(connect.CodeInvalidArgument, err)
	case errors.Is(err, chefprofile.ErrUnauthorizedProfileAccess):
		return connect.NewError(connect.CodePermissionDenied, err)
	default:
		return connect.NewError(connect.CodeInternal, err)
	}
}

func marshalPortfolioItems(items []*chefv1.PortfolioItem) ([]byte, error) {
	if len(items) == 0 {
		return []byte("[]"), nil
	}
	return json.Marshal(items)
}

func unmarshalPortfolioItems(data []byte) ([]*chefv1.PortfolioItem, error) {
	if len(data) == 0 {
		return nil, nil
	}
	var items []*chefv1.PortfolioItem
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
