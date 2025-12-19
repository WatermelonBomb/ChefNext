package job

import (
	"context"
	"encoding/json"
	"errors"
	"strings"
	"time"

	"connectrpc.com/connect"
	jobv1 "github.com/chefnext/chefnext/apps/api/internal/gen/job/v1"
	"github.com/chefnext/chefnext/apps/api/internal/gen/job/v1/jobv1connect"
	"github.com/chefnext/chefnext/apps/api/internal/middleware"
	"github.com/chefnext/chefnext/apps/api/internal/repository/db"
	jobusecase "github.com/chefnext/chefnext/apps/api/internal/usecase/job"
	"github.com/google/uuid"
)

// Handler implements the JobService RPCs.
type Handler struct {
	service *jobusecase.Service
}

// NewJobHandler wires a job handler implementation.
func NewJobHandler(service *jobusecase.Service) jobv1connect.JobServiceHandler {
	return &Handler{service: service}
}

func (h *Handler) CreateJob(ctx context.Context, req *connect.Request[jobv1.CreateJobRequest]) (*connect.Response[jobv1.CreateJobResponse], error) {
	userID, err := h.requireRole(ctx, "RESTAURANT")
	if err != nil {
		return nil, err
	}

	metadata, err := metadataFromString(req.Msg.GetMetadataJson())
	if err != nil {
		return nil, connect.NewError(connect.CodeInvalidArgument, err)
	}

	input := jobusecase.CreateJobInput{
		Title:          strings.TrimSpace(req.Msg.GetTitle()),
		Description:    strings.TrimSpace(req.Msg.GetDescription()),
		RequiredSkills: req.Msg.GetRequiredSkills(),
		Location:       optionalString(req.Msg.Location),
		SalaryRange:    optionalString(req.Msg.SalaryRange),
		EmploymentType: optionalString(req.Msg.EmploymentType),
		Metadata:       metadata,
	}

	if req.Msg.GetStatus() != jobv1.JobStatus_JOB_STATUS_UNSPECIFIED {
		status, err := toDBJobStatus(req.Msg.GetStatus())
		if err != nil {
			return nil, connect.NewError(connect.CodeInvalidArgument, err)
		}
		input.Status = &status
	}

	job, err := h.service.CreateJob(ctx, userID, input)
	if err != nil {
		return nil, mapJobError(err)
	}

	return connect.NewResponse(&jobv1.CreateJobResponse{Job: toProtoJob(job)}), nil
}

func (h *Handler) UpdateJob(ctx context.Context, req *connect.Request[jobv1.UpdateJobRequest]) (*connect.Response[jobv1.UpdateJobResponse], error) {
	userID, err := h.requireRole(ctx, "RESTAURANT")
	if err != nil {
		return nil, err
	}

	jobID, err := uuid.Parse(strings.TrimSpace(req.Msg.GetJobId()))
	if err != nil {
		return nil, connect.NewError(connect.CodeInvalidArgument, err)
	}

	var metadata *json.RawMessage
	if raw := req.Msg.GetMetadataJson(); strings.TrimSpace(raw) != "" {
		parsed, err := metadataFromString(raw)
		if err != nil {
			return nil, connect.NewError(connect.CodeInvalidArgument, err)
		}
		metadata = &parsed
	}

	input := jobusecase.UpdateJobInput{
		JobID:          jobID,
		Title:          optionalString(req.Msg.Title),
		Description:    optionalString(req.Msg.Description),
		RequiredSkills: optionalSlice(req.Msg.GetRequiredSkills()),
		Location:       optionalString(req.Msg.Location),
		SalaryRange:    optionalString(req.Msg.SalaryRange),
		EmploymentType: optionalString(req.Msg.EmploymentType),
		Metadata:       metadata,
	}

	if req.Msg.GetStatus() != jobv1.JobStatus_JOB_STATUS_UNSPECIFIED {
		status, err := toDBJobStatus(req.Msg.GetStatus())
		if err != nil {
			return nil, connect.NewError(connect.CodeInvalidArgument, err)
		}
		input.Status = &status
	}

	updated, err := h.service.UpdateJob(ctx, userID, input)
	if err != nil {
		return nil, mapJobError(err)
	}

	return connect.NewResponse(&jobv1.UpdateJobResponse{Job: toProtoJob(updated)}), nil
}

func (h *Handler) GetJob(ctx context.Context, req *connect.Request[jobv1.GetJobRequest]) (*connect.Response[jobv1.GetJobResponse], error) {
	if _, _, err := h.getUserContext(ctx); err != nil {
		return nil, err
	}

	jobID, err := uuid.Parse(strings.TrimSpace(req.Msg.GetJobId()))
	if err != nil {
		return nil, connect.NewError(connect.CodeInvalidArgument, err)
	}

	job, err := h.service.GetJob(ctx, jobID)
	if err != nil {
		return nil, mapJobError(err)
	}

	return connect.NewResponse(&jobv1.GetJobResponse{Job: toProtoJob(job)}), nil
}

func (h *Handler) ListMyJobs(ctx context.Context, req *connect.Request[jobv1.ListMyJobsRequest]) (*connect.Response[jobv1.ListMyJobsResponse], error) {
	userID, err := h.requireRole(ctx, "RESTAURANT")
	if err != nil {
		return nil, err
	}

	out, err := h.service.ListJobsForRestaurant(ctx, userID, jobusecase.ListJobsInput{
		Limit:  req.Msg.GetLimit(),
		Offset: req.Msg.GetOffset(),
	})
	if err != nil {
		return nil, mapJobError(err)
	}

	resp := &jobv1.ListMyJobsResponse{
		Jobs:       toProtoJobs(out.Jobs),
		TotalCount: out.Total,
	}
	return connect.NewResponse(resp), nil
}

func (h *Handler) SearchJobs(ctx context.Context, req *connect.Request[jobv1.SearchJobsRequest]) (*connect.Response[jobv1.SearchJobsResponse], error) {
	if _, _, err := h.getUserContext(ctx); err != nil {
		return nil, err
	}

	out, err := h.service.SearchJobs(ctx, jobusecase.SearchJobsInput{
		Keyword:  req.Msg.GetKeyword(),
		Skills:   req.Msg.GetRequiredSkills(),
		Location: req.Msg.GetLocation(),
		Limit:    req.Msg.GetLimit(),
		Offset:   req.Msg.GetOffset(),
	})
	if err != nil {
		return nil, mapJobError(err)
	}

	resp := &jobv1.SearchJobsResponse{
		Jobs:       toProtoJobs(out.Jobs),
		TotalCount: out.Total,
	}
	return connect.NewResponse(resp), nil
}

func (h *Handler) CreateApplication(ctx context.Context, req *connect.Request[jobv1.CreateApplicationRequest]) (*connect.Response[jobv1.CreateApplicationResponse], error) {
	userID, err := h.requireRole(ctx, "CHEF")
	if err != nil {
		return nil, err
	}

	jobID, err := uuid.Parse(strings.TrimSpace(req.Msg.GetJobId()))
	if err != nil {
		return nil, connect.NewError(connect.CodeInvalidArgument, err)
	}

	input := jobusecase.CreateApplicationInput{
		JobID:       jobID,
		CoverLetter: optionalString(req.Msg.CoverLetter),
	}

	application, err := h.service.CreateApplication(ctx, userID, input)
	if err != nil {
		return nil, mapJobError(err)
	}

	return connect.NewResponse(&jobv1.CreateApplicationResponse{Application: toProtoApplication(application)}), nil
}

func (h *Handler) ListApplicationsForChef(ctx context.Context, req *connect.Request[jobv1.ListApplicationsForChefRequest]) (*connect.Response[jobv1.ListApplicationsForChefResponse], error) {
	userID, err := h.requireRole(ctx, "CHEF")
	if err != nil {
		return nil, err
	}

	applications, err := h.service.ListApplicationsForChef(ctx, userID, req.Msg.GetLimit(), req.Msg.GetOffset())
	if err != nil {
		return nil, mapJobError(err)
	}

	return connect.NewResponse(&jobv1.ListApplicationsForChefResponse{Applications: toProtoApplications(applications)}), nil
}

func (h *Handler) ListApplicationsForRestaurant(ctx context.Context, req *connect.Request[jobv1.ListApplicationsForRestaurantRequest]) (*connect.Response[jobv1.ListApplicationsForRestaurantResponse], error) {
	userID, err := h.requireRole(ctx, "RESTAURANT")
	if err != nil {
		return nil, err
	}

	applications, err := h.service.ListApplicationsForRestaurant(ctx, userID, req.Msg.GetLimit(), req.Msg.GetOffset())
	if err != nil {
		return nil, mapJobError(err)
	}

	return connect.NewResponse(&jobv1.ListApplicationsForRestaurantResponse{Applications: toProtoApplications(applications)}), nil
}

func (h *Handler) UpdateApplicationStatus(ctx context.Context, req *connect.Request[jobv1.UpdateApplicationStatusRequest]) (*connect.Response[jobv1.UpdateApplicationStatusResponse], error) {
	userID, err := h.requireRole(ctx, "RESTAURANT")
	if err != nil {
		return nil, err
	}

	appID, err := uuid.Parse(strings.TrimSpace(req.Msg.GetApplicationId()))
	if err != nil {
		return nil, connect.NewError(connect.CodeInvalidArgument, err)
	}

	status, err := toDBApplicationStatus(req.Msg.GetStatus())
	if err != nil {
		return nil, connect.NewError(connect.CodeInvalidArgument, err)
	}

	application, err := h.service.UpdateApplicationStatus(ctx, userID, jobusecase.UpdateApplicationStatusInput{
		ApplicationID: appID,
		Status:        status,
	})
	if err != nil {
		return nil, mapJobError(err)
	}

	return connect.NewResponse(&jobv1.UpdateApplicationStatusResponse{Application: toProtoApplication(application)}), nil
}

func toProtoJobs(jobs []*jobusecase.Job) []*jobv1.Job {
	out := make([]*jobv1.Job, 0, len(jobs))
	for _, job := range jobs {
		out = append(out, toProtoJob(job))
	}
	return out
}

func toProtoJob(job *jobusecase.Job) *jobv1.Job {
	if job == nil {
		return nil
	}

	protoJob := &jobv1.Job{
		Id:             job.ID.String(),
		RestaurantId:   job.RestaurantID.String(),
		Title:          job.Title,
		Description:    job.Description,
		RequiredSkills: job.RequiredSkills,
		Status:         fromDBJobStatus(job.Status),
		MetadataJson:   string(job.Metadata),
		CreatedAt:      job.CreatedAt.Format(time.RFC3339),
		UpdatedAt:      job.UpdatedAt.Format(time.RFC3339),
	}

	if job.Location != nil {
		protoJob.Location = *job.Location
	}
	if job.SalaryRange != nil {
		protoJob.SalaryRange = *job.SalaryRange
	}
	if job.EmploymentType != nil {
		protoJob.EmploymentType = *job.EmploymentType
	}
	if job.Restaurant != nil {
		protoJob.Restaurant = &jobv1.RestaurantSummary{
			Id:          job.Restaurant.ID.String(),
			DisplayName: derefString(job.Restaurant.DisplayName),
			Tagline:     derefString(job.Restaurant.Tagline),
			Location:    derefString(job.Restaurant.Location),
		}
	}

	return protoJob
}

func toProtoApplications(apps []*jobusecase.Application) []*jobv1.JobApplication {
	out := make([]*jobv1.JobApplication, 0, len(apps))
	for _, app := range apps {
		out = append(out, toProtoApplication(app))
	}
	return out
}

func toProtoApplication(app *jobusecase.Application) *jobv1.JobApplication {
	if app == nil {
		return nil
	}

	protoApp := &jobv1.JobApplication{
		Id:            app.ID.String(),
		JobId:         app.JobID.String(),
		ChefProfileId: app.ChefProfileID.String(),
		Status:        fromDBApplicationStatus(app.Status),
		CoverLetter:   derefString(app.CoverLetter),
		CreatedAt:     app.CreatedAt.Format(time.RFC3339),
		UpdatedAt:     app.UpdatedAt.Format(time.RFC3339),
	}

	if app.Job != nil {
		protoApp.Job = &jobv1.JobSummary{
			Id:             app.Job.ID.String(),
			Title:          app.Job.Title,
			Status:         fromDBJobStatus(app.Job.Status),
			RestaurantName: derefString(app.Job.RestaurantName),
		}
	}

	if app.Chef != nil {
		protoApp.Chef = &jobv1.ChefSummary{
			ProfileId: app.Chef.ProfileID.String(),
			FullName:  derefString(app.Chef.FullName),
			Location:  derefString(app.Chef.Location),
		}
	}

	return protoApp
}

func toDBJobStatus(status jobv1.JobStatus) (db.JobStatus, error) {
	switch status {
	case jobv1.JobStatus_JOB_STATUS_DRAFT:
		return db.JobStatusDRAFT, nil
	case jobv1.JobStatus_JOB_STATUS_PUBLISHED:
		return db.JobStatusPUBLISHED, nil
	case jobv1.JobStatus_JOB_STATUS_CLOSED:
		return db.JobStatusCLOSED, nil
	case jobv1.JobStatus_JOB_STATUS_UNSPECIFIED:
		return db.JobStatusDRAFT, nil
	default:
		return db.JobStatusDRAFT, errors.New("invalid job status")
	}
}

func fromDBJobStatus(status db.JobStatus) jobv1.JobStatus {
	switch status {
	case db.JobStatusDRAFT:
		return jobv1.JobStatus_JOB_STATUS_DRAFT
	case db.JobStatusPUBLISHED:
		return jobv1.JobStatus_JOB_STATUS_PUBLISHED
	case db.JobStatusCLOSED:
		return jobv1.JobStatus_JOB_STATUS_CLOSED
	default:
		return jobv1.JobStatus_JOB_STATUS_UNSPECIFIED
	}
}

func toDBApplicationStatus(status jobv1.ApplicationStatus) (db.ApplicationStatus, error) {
	switch status {
	case jobv1.ApplicationStatus_APPLICATION_STATUS_PENDING:
		return db.ApplicationStatusPENDING, nil
	case jobv1.ApplicationStatus_APPLICATION_STATUS_ACCEPTED:
		return db.ApplicationStatusACCEPTED, nil
	case jobv1.ApplicationStatus_APPLICATION_STATUS_REJECTED:
		return db.ApplicationStatusREJECTED, nil
	default:
		return "", errors.New("invalid application status")
	}
}

func fromDBApplicationStatus(status db.ApplicationStatus) jobv1.ApplicationStatus {
	switch status {
	case db.ApplicationStatusPENDING:
		return jobv1.ApplicationStatus_APPLICATION_STATUS_PENDING
	case db.ApplicationStatusACCEPTED:
		return jobv1.ApplicationStatus_APPLICATION_STATUS_ACCEPTED
	case db.ApplicationStatusREJECTED:
		return jobv1.ApplicationStatus_APPLICATION_STATUS_REJECTED
	default:
		return jobv1.ApplicationStatus_APPLICATION_STATUS_UNSPECIFIED
	}
}

func optionalString(value string) *string {
	trimmed := strings.TrimSpace(value)
	if trimmed == "" {
		return nil
	}
	return &trimmed
}

func optionalSlice(values []string) *[]string {
	if len(values) == 0 {
		return nil
	}
	return &values
}

func derefString(value *string) string {
	if value == nil {
		return ""
	}
	return *value
}

func metadataFromString(raw string) (json.RawMessage, error) {
	trimmed := strings.TrimSpace(raw)
	if trimmed == "" {
		return nil, nil
	}
	data := []byte(trimmed)
	if !json.Valid(data) {
		return nil, errors.New("metadata_json must be valid JSON")
	}
	return json.RawMessage(data), nil
}

func mapJobError(err error) error {
	switch {
	case errors.Is(err, jobusecase.ErrRestaurantProfileMissing), errors.Is(err, jobusecase.ErrChefProfileMissing), errors.Is(err, jobusecase.ErrJobNotPublished):
		return connect.NewError(connect.CodeFailedPrecondition, err)
	case errors.Is(err, jobusecase.ErrJobNotFound), errors.Is(err, jobusecase.ErrApplicationNotFound):
		return connect.NewError(connect.CodeNotFound, err)
	case errors.Is(err, jobusecase.ErrForbidden):
		return connect.NewError(connect.CodePermissionDenied, err)
	case errors.Is(err, jobusecase.ErrApplicationExists):
		return connect.NewError(connect.CodeAlreadyExists, err)
	default:
		return connect.NewError(connect.CodeInternal, err)
	}
}

func (h *Handler) requireRole(ctx context.Context, role string) (uuid.UUID, error) {
	userID, actualRole, err := h.getUserContext(ctx)
	if err != nil {
		return uuid.Nil, err
	}

	if actualRole != role {
		return uuid.Nil, connect.NewError(connect.CodePermissionDenied, errors.New("insufficient role"))
	}

	return userID, nil
}

func (h *Handler) getUserContext(ctx context.Context) (uuid.UUID, string, error) {
	userID, ok := middleware.GetUserID(ctx)
	if !ok {
		return uuid.Nil, "", connect.NewError(connect.CodeUnauthenticated, errors.New("missing user context"))
	}

	role, ok := middleware.GetUserRole(ctx)
	if !ok {
		return uuid.Nil, "", connect.NewError(connect.CodeUnauthenticated, errors.New("missing role context"))
	}

	return userID, role, nil
}
