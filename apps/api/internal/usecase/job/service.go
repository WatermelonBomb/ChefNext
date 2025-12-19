package job

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
	ErrRestaurantProfileMissing = errors.New("restaurant profile not found")
	ErrChefProfileMissing       = errors.New("chef profile not found")
	ErrJobNotFound              = errors.New("job not found")
	ErrForbidden                = errors.New("insufficient permissions")
	ErrApplicationExists        = errors.New("application already exists")
	ErrApplicationNotFound      = errors.New("application not found")
	ErrJobNotPublished          = errors.New("job is not open for applications")
)

// Service coordinates job and application workflows against the data store.
type Service struct {
	queries *db.Queries
}

// NewService wires the job/application service.
func NewService(queries *db.Queries) *Service {
	return &Service{queries: queries}
}

// Job represents a job posting with optional restaurant context.
type Job struct {
	ID             uuid.UUID
	RestaurantID   uuid.UUID
	Title          string
	Description    string
	RequiredSkills []string
	Location       *string
	SalaryRange    *string
	EmploymentType *string
	Status         db.JobStatus
	Metadata       json.RawMessage
	CreatedAt      time.Time
	UpdatedAt      time.Time
	Restaurant     *RestaurantSummary
}

// RestaurantSummary contains lightweight info for display.
type RestaurantSummary struct {
	ID          uuid.UUID
	DisplayName *string
	Tagline     *string
	Location    *string
}

// JobSearchOutput wraps paginated job search results.
type JobSearchOutput struct {
	Jobs  []*Job
	Total int64
}

// JobListOutput is used when listing jobs for restaurant owners.
type JobListOutput struct {
	Jobs  []*Job
	Total int64
}

// Application captures a chef application to a job.
type Application struct {
	ID            uuid.UUID
	JobID         uuid.UUID
	ChefProfileID uuid.UUID
	Status        db.ApplicationStatus
	CoverLetter   *string
	CreatedAt     time.Time
	UpdatedAt     time.Time
	Job           *JobSummary
	Chef          *ChefSummary
}

// JobSummary shortens job info embedded on applications.
type JobSummary struct {
	ID             uuid.UUID
	Title          string
	Status         db.JobStatus
	RestaurantName *string
}

// ChefSummary shortens chef info embedded on applications.
type ChefSummary struct {
	ProfileID uuid.UUID
	FullName  *string
	Location  *string
}

// CreateJobInput defines the payload for creating a job.
type CreateJobInput struct {
	Title          string
	Description    string
	RequiredSkills []string
	Location       *string
	SalaryRange    *string
	EmploymentType *string
	Status         *db.JobStatus
	Metadata       json.RawMessage
}

// UpdateJobInput defines mutable fields for jobs.
type UpdateJobInput struct {
	JobID          uuid.UUID
	Title          *string
	Description    *string
	RequiredSkills *[]string
	Location       *string
	SalaryRange    *string
	EmploymentType *string
	Status         *db.JobStatus
	Metadata       *json.RawMessage
}

// SearchJobsInput configures query filters.
type SearchJobsInput struct {
	Keyword  string
	Skills   []string
	Location string
	Limit    int32
	Offset   int32
}

// ListJobsInput configures owner listing pagination.
type ListJobsInput struct {
	Limit  int32
	Offset int32
}

// CreateApplicationInput holds chef application payload.
type CreateApplicationInput struct {
	JobID       uuid.UUID
	CoverLetter *string
}

// UpdateApplicationStatusInput updates status for an application.
type UpdateApplicationStatusInput struct {
	ApplicationID uuid.UUID
	Status        db.ApplicationStatus
}

// CreateJob creates a job for the authenticated restaurant owner.
func (s *Service) CreateJob(ctx context.Context, userID uuid.UUID, input CreateJobInput) (*Job, error) {
	restaurant, err := s.getRestaurantProfileByUser(ctx, userID)
	if err != nil {
		return nil, err
	}

	status := db.JobStatusDRAFT
	if input.Status != nil {
		status = *input.Status
	}

	params := db.CreateJobParams{
		RestaurantID:   restaurant.id,
		Title:          strings.TrimSpace(input.Title),
		Description:    strings.TrimSpace(input.Description),
		RequiredSkills: input.RequiredSkills,
		Location:       textParam(input.Location),
		SalaryRange:    textParam(input.SalaryRange),
		EmploymentType: textParam(input.EmploymentType),
		Status:         status,
		Metadata:       metadataOrDefault(input.Metadata),
	}

	row, err := s.queries.CreateJob(ctx, params)
	if err != nil {
		return nil, err
	}

	summary := restaurant.toSummary()
	return mapJobFromColumns(jobColumnsFromCreate(row), summary)
}

// UpdateJob updates mutable job fields owned by the restaurant user.
func (s *Service) UpdateJob(ctx context.Context, userID uuid.UUID, input UpdateJobInput) (*Job, error) {
	ownership, err := s.getJobOwnership(ctx, input.JobID)
	if err != nil {
		return nil, err
	}

	if ownership.restaurantUserID != userID {
		return nil, ErrForbidden
	}

	params := db.UpdateJobParams{
		Title:          textParam(input.Title),
		Description:    textParam(input.Description),
		RequiredSkills: nil,
		Location:       textParam(input.Location),
		SalaryRange:    textParam(input.SalaryRange),
		EmploymentType: textParam(input.EmploymentType),
		Status:         nullJobStatus(input.Status),
		Metadata:       nil,
		ID:             ownership.jobID,
	}

	if input.RequiredSkills != nil {
		params.RequiredSkills = *input.RequiredSkills
	}

	if input.Metadata != nil {
		params.Metadata = metadataOrDefault(*input.Metadata)
	}

	row, err := s.queries.UpdateJob(ctx, params)
	if err != nil {
		return nil, err
	}

	// Pull restaurant summary for response.
	summary, err := s.getRestaurantSummaryByID(ctx, ownership.restaurantID)
	if err != nil {
		return nil, err
	}

	return mapJobFromColumns(jobColumnsFromUpdate(row), summary)
}

// GetJob fetches a published job (or any job if owner) by ID.
func (s *Service) GetJob(ctx context.Context, jobID uuid.UUID) (*Job, error) {
	pgID, err := toPgUUID(jobID)
	if err != nil {
		return nil, err
	}

	row, err := s.queries.GetJobByID(ctx, pgID)
	if err == pgx.ErrNoRows {
		return nil, ErrJobNotFound
	}
	if err != nil {
		return nil, err
	}

	summary := restaurantSummaryFromRow(row.RestaurantID, row.DisplayName, row.Tagline, row.RestaurantLocation)
	return mapJobFromColumns(jobColumnsFromGet(row), summary)
}

// ListJobsForRestaurant returns jobs owned by the authenticated restaurant.
func (s *Service) ListJobsForRestaurant(ctx context.Context, userID uuid.UUID, input ListJobsInput) (*JobListOutput, error) {
	restaurant, err := s.getRestaurantProfileByUser(ctx, userID)
	if err != nil {
		return nil, err
	}

	limit := clampLimit(input.Limit)
	pgID := restaurant.id

	rows, err := s.queries.ListJobsByRestaurant(ctx, db.ListJobsByRestaurantParams{
		RestaurantID: pgID,
		Limit:        limit,
		Offset:       input.Offset,
	})
	if err != nil {
		return nil, err
	}

	summary := restaurant.toSummary()
	jobs := make([]*Job, 0, len(rows))
	var total int64
	for _, row := range rows {
		job, err := mapJobFromColumns(jobColumnsFromList(row), summary)
		if err != nil {
			return nil, err
		}
		total = row.TotalCount
		jobs = append(jobs, job)
	}

	return &JobListOutput{Jobs: jobs, Total: total}, nil
}

// SearchJobs returns public job listings.
func (s *Service) SearchJobs(ctx context.Context, input SearchJobsInput) (*JobSearchOutput, error) {
	limit := clampLimit(input.Limit)
	rows, err := s.queries.SearchJobs(ctx, db.SearchJobsParams{
		Column1: strings.TrimSpace(input.Keyword),
		Column2: input.Skills,
		Column3: strings.TrimSpace(input.Location),
		Limit:   limit,
		Offset:  input.Offset,
	})
	if err != nil {
		return nil, err
	}

	jobs := make([]*Job, 0, len(rows))
	var total int64
	for _, row := range rows {
		summary := restaurantSummaryFromRow(row.RestaurantID, row.DisplayName, row.Tagline, row.RestaurantLocation)
		job, err := mapJobFromColumns(jobColumnsFromSearch(row), summary)
		if err != nil {
			return nil, err
		}
		total = row.TotalCount
		jobs = append(jobs, job)
	}

	return &JobSearchOutput{Jobs: jobs, Total: total}, nil
}

// CreateApplication allows chefs to apply to a published job.
func (s *Service) CreateApplication(ctx context.Context, userID uuid.UUID, input CreateApplicationInput) (*Application, error) {
	job, err := s.GetJob(ctx, input.JobID)
	if err != nil {
		return nil, err
	}

	if job.Status != db.JobStatusPUBLISHED {
		return nil, ErrJobNotPublished
	}

	chef, err := s.getChefProfileByUser(ctx, userID)
	if err != nil {
		return nil, err
	}

	if err := s.ensureNoExistingApplication(ctx, job.ID, chef.id); err != nil {
		return nil, err
	}

	params := db.CreateApplicationParams{
		JobID:         toPgUUIDMust(job.ID),
		ChefProfileID: chef.id,
		Status:        db.ApplicationStatusPENDING,
		CoverLetter:   textParam(input.CoverLetter),
	}

	created, err := s.queries.CreateApplication(ctx, params)
	if err != nil {
		return nil, err
	}

	return mapApplicationBase(created, &JobSummary{
		ID:             job.ID,
		Title:          job.Title,
		Status:         job.Status,
		RestaurantName: summaryName(job.Restaurant),
	}, &ChefSummary{
		ProfileID: chef.uuid,
		FullName:  chef.fullName,
		Location:  chef.location,
	})
}

// ListApplicationsForChef lists applications for the chef user.
func (s *Service) ListApplicationsForChef(ctx context.Context, userID uuid.UUID, limit, offset int32) ([]*Application, error) {
	chef, err := s.getChefProfileByUser(ctx, userID)
	if err != nil {
		return nil, err
	}

	rows, err := s.queries.ListApplicationsForChef(ctx, db.ListApplicationsForChefParams{
		ChefProfileID: chef.id,
		Limit:         clampLimit(limit),
		Offset:        offset,
	})
	if err != nil {
		return nil, err
	}

	apps := make([]*Application, 0, len(rows))
	for _, row := range rows {
		jobID, err := uuidFromPg(row.JobID)
		if err != nil {
			return nil, err
		}
		summary := &JobSummary{
			ID:             jobID,
			Title:          row.JobTitle,
			Status:         row.JobStatus,
			RestaurantName: textPointer(row.RestaurantDisplayName),
		}
		app, err := mapApplicationRow(row.ID, row.JobID, row.ChefProfileID, row.Status, row.CoverLetter, row.CreatedAt, row.UpdatedAt, summary, nil)
		if err != nil {
			return nil, err
		}
		apps = append(apps, app)
	}

	return apps, nil
}

// ListApplicationsForRestaurant lists applications submitted to the restaurant's jobs.
func (s *Service) ListApplicationsForRestaurant(ctx context.Context, userID uuid.UUID, limit, offset int32) ([]*Application, error) {
	restaurant, err := s.getRestaurantProfileByUser(ctx, userID)
	if err != nil {
		return nil, err
	}

	rows, err := s.queries.ListApplicationsForRestaurant(ctx, db.ListApplicationsForRestaurantParams{
		RestaurantID: restaurant.id,
		Limit:        clampLimit(limit),
		Offset:       offset,
	})
	if err != nil {
		return nil, err
	}

	apps := make([]*Application, 0, len(rows))
	for _, row := range rows {
		jobID, err := uuidFromPg(row.JobID)
		if err != nil {
			return nil, err
		}
		chefProfileID, err := uuidFromPg(row.ChefProfileID)
		if err != nil {
			return nil, err
		}
		chefSummary := &ChefSummary{
			ProfileID: chefProfileID,
			FullName:  textPointer(row.ChefFullName),
			Location:  textPointer(row.ChefLocation),
		}
		jobSummary := &JobSummary{ID: jobID, Title: row.JobTitle}
		app, err := mapApplicationRow(row.ID, row.JobID, row.ChefProfileID, row.Status, row.CoverLetter, row.CreatedAt, row.UpdatedAt, jobSummary, chefSummary)
		if err != nil {
			return nil, err
		}
		apps = append(apps, app)
	}

	return apps, nil
}

// UpdateApplicationStatus lets restaurant owners accept/reject.
func (s *Service) UpdateApplicationStatus(ctx context.Context, userID uuid.UUID, input UpdateApplicationStatusInput) (*Application, error) {
	ownership, err := s.queries.GetApplicationOwnership(ctx, toPgUUIDMust(input.ApplicationID))
	if err == pgx.ErrNoRows {
		return nil, ErrApplicationNotFound
	}
	if err != nil {
		return nil, err
	}

	restaurantUserID, err := uuidFromPg(ownership.RestaurantUserID)
	if err != nil {
		return nil, err
	}
	if restaurantUserID != userID {
		return nil, ErrForbidden
	}

	updated, err := s.queries.UpdateApplicationStatus(ctx, db.UpdateApplicationStatusParams{
		ID:     ownership.ID,
		Status: input.Status,
	})
	if err != nil {
		return nil, err
	}

	jobRow, err := s.queries.GetJobByID(ctx, ownership.JobID)
	if err != nil {
		return nil, err
	}
	job, err := mapJobFromColumns(jobColumnsFromGet(jobRow), restaurantSummaryFromRow(jobRow.RestaurantID, jobRow.DisplayName, jobRow.Tagline, jobRow.RestaurantLocation))
	if err != nil {
		return nil, err
	}

	chefRow, err := s.queries.GetChefProfileByID(ctx, ownership.ChefProfileID)
	if err != nil {
		return nil, err
	}
	chefProfile, err := mapChefSummary(chefRow)
	if err != nil {
		return nil, err
	}

	return mapApplicationBase(updated, &JobSummary{ID: job.ID, Title: job.Title, Status: job.Status, RestaurantName: summaryName(job.Restaurant)}, chefProfile)
}

// Helper and mapping utilities below.

func (s *Service) getRestaurantProfileByUser(ctx context.Context, userID uuid.UUID) (*restaurantProfileRow, error) {
	pgID, err := toPgUUID(userID)
	if err != nil {
		return nil, err
	}

	row, err := s.queries.GetRestaurantProfileByUserID(ctx, pgID)
	if err == pgx.ErrNoRows {
		return nil, ErrRestaurantProfileMissing
	}
	if err != nil {
		return nil, err
	}

	return &restaurantProfileRow{
		id:          row.ID,
		displayName: row.DisplayName,
		tagline:     row.Tagline,
		location:    row.Location,
	}, nil
}

func (s *Service) getRestaurantSummaryByID(ctx context.Context, restaurantID pgtype.UUID) (*RestaurantSummary, error) {
	row, err := s.queries.GetRestaurantProfileByID(ctx, restaurantID)
	if err != nil {
		return nil, err
	}

	summary := restaurantSummaryFromRow(row.ID, row.DisplayName, row.Tagline, row.Location)
	if summary == nil {
		return nil, ErrRestaurantProfileMissing
	}

	return summary, nil
}

func (s *Service) getChefProfileByUser(ctx context.Context, userID uuid.UUID) (*chefProfileRow, error) {
	pgID, err := toPgUUID(userID)
	if err != nil {
		return nil, err
	}

	row, err := s.queries.GetChefProfileByUserID(ctx, pgID)
	if err == pgx.ErrNoRows {
		return nil, ErrChefProfileMissing
	}
	if err != nil {
		return nil, err
	}

	profileID, err := uuidFromPg(row.ID)
	if err != nil {
		return nil, err
	}

	return &chefProfileRow{
		id:       row.ID,
		uuid:     profileID,
		fullName: textPointer(row.FullName),
		location: textPointer(row.Location),
	}, nil
}

func (s *Service) ensureNoExistingApplication(ctx context.Context, jobID uuid.UUID, chefID pgtype.UUID) error {
	jobPg := toPgUUIDMust(jobID)
	_, err := s.queries.GetApplicationByJobAndChef(ctx, db.GetApplicationByJobAndChefParams{
		JobID:         jobPg,
		ChefProfileID: chefID,
	})
	if err == pgx.ErrNoRows {
		return nil
	}
	if err != nil {
		return err
	}

	return ErrApplicationExists
}

func (s *Service) getJobOwnership(ctx context.Context, jobID uuid.UUID) (*jobOwnership, error) {
	pgID := toPgUUIDMust(jobID)
	row, err := s.queries.GetJobOwnership(ctx, pgID)
	if err == pgx.ErrNoRows {
		return nil, ErrJobNotFound
	}
	if err != nil {
		return nil, err
	}

	restaurantUserID, err := uuidFromPg(row.RestaurantUserID)
	if err != nil {
		return nil, err
	}

	return &jobOwnership{
		jobID:            row.ID,
		restaurantID:     row.RestaurantID,
		restaurantUserID: restaurantUserID,
	}, nil
}

// --- Mapping helpers ---

type jobColumns struct {
	ID             pgtype.UUID
	RestaurantID   pgtype.UUID
	Title          string
	Description    string
	RequiredSkills []string
	Location       pgtype.Text
	SalaryRange    pgtype.Text
	EmploymentType pgtype.Text
	Status         db.JobStatus
	Metadata       []byte
	CreatedAt      pgtype.Timestamp
	UpdatedAt      pgtype.Timestamp
}

func jobColumnsFromCreate(row db.CreateJobRow) jobColumns {
	return jobColumns{
		ID:             row.ID,
		RestaurantID:   row.RestaurantID,
		Title:          row.Title,
		Description:    row.Description,
		RequiredSkills: row.RequiredSkills,
		Location:       row.Location,
		SalaryRange:    row.SalaryRange,
		EmploymentType: row.EmploymentType,
		Status:         row.Status,
		Metadata:       row.Metadata,
		CreatedAt:      row.CreatedAt,
		UpdatedAt:      row.UpdatedAt,
	}
}

func jobColumnsFromGet(row db.GetJobByIDRow) jobColumns {
	return jobColumns{
		ID:             row.ID,
		RestaurantID:   row.RestaurantID,
		Title:          row.Title,
		Description:    row.Description,
		RequiredSkills: row.RequiredSkills,
		Location:       row.Location,
		SalaryRange:    row.SalaryRange,
		EmploymentType: row.EmploymentType,
		Status:         row.Status,
		Metadata:       row.Metadata,
		CreatedAt:      row.CreatedAt,
		UpdatedAt:      row.UpdatedAt,
	}
}

func jobColumnsFromList(row db.ListJobsByRestaurantRow) jobColumns {
	return jobColumns{
		ID:             row.ID,
		RestaurantID:   row.RestaurantID,
		Title:          row.Title,
		Description:    row.Description,
		RequiredSkills: row.RequiredSkills,
		Location:       row.Location,
		SalaryRange:    row.SalaryRange,
		EmploymentType: row.EmploymentType,
		Status:         row.Status,
		Metadata:       row.Metadata,
		CreatedAt:      row.CreatedAt,
		UpdatedAt:      row.UpdatedAt,
	}
}

func jobColumnsFromSearch(row db.SearchJobsRow) jobColumns {
	return jobColumns{
		ID:             row.ID,
		RestaurantID:   row.RestaurantID,
		Title:          row.Title,
		Description:    row.Description,
		RequiredSkills: row.RequiredSkills,
		Location:       row.Location,
		SalaryRange:    row.SalaryRange,
		EmploymentType: row.EmploymentType,
		Status:         row.Status,
		Metadata:       row.Metadata,
		CreatedAt:      row.CreatedAt,
		UpdatedAt:      row.UpdatedAt,
	}
}

func jobColumnsFromUpdate(row db.UpdateJobRow) jobColumns {
	return jobColumns{
		ID:             row.ID,
		RestaurantID:   row.RestaurantID,
		Title:          row.Title,
		Description:    row.Description,
		RequiredSkills: row.RequiredSkills,
		Location:       row.Location,
		SalaryRange:    row.SalaryRange,
		EmploymentType: row.EmploymentType,
		Status:         row.Status,
		Metadata:       row.Metadata,
		CreatedAt:      row.CreatedAt,
		UpdatedAt:      row.UpdatedAt,
	}
}

func mapJobFromColumns(cols jobColumns, summary *RestaurantSummary) (*Job, error) {
	jobID, err := uuidFromPg(cols.ID)
	if err != nil {
		return nil, err
	}

	restaurantID, err := uuidFromPg(cols.RestaurantID)
	if err != nil {
		return nil, err
	}

	return &Job{
		ID:             jobID,
		RestaurantID:   restaurantID,
		Title:          cols.Title,
		Description:    cols.Description,
		RequiredSkills: cols.RequiredSkills,
		Location:       textPointer(cols.Location),
		SalaryRange:    textPointer(cols.SalaryRange),
		EmploymentType: textPointer(cols.EmploymentType),
		Status:         cols.Status,
		Metadata:       copyJSON(cols.Metadata),
		CreatedAt:      cols.CreatedAt.Time,
		UpdatedAt:      cols.UpdatedAt.Time,
		Restaurant:     summary,
	}, nil
}

func restaurantSummaryFromRow(id pgtype.UUID, name pgtype.Text, tagline pgtype.Text, location pgtype.Text) *RestaurantSummary {
	restaurantID, err := uuidFromPg(id)
	if err != nil {
		return nil
	}

	return &RestaurantSummary{
		ID:          restaurantID,
		DisplayName: textPointer(name),
		Tagline:     textPointer(tagline),
		Location:    textPointer(location),
	}
}

func mapApplicationBase(row db.Application, job *JobSummary, chef *ChefSummary) (*Application, error) {
	return mapApplicationRow(row.ID, row.JobID, row.ChefProfileID, row.Status, row.CoverLetter, row.CreatedAt, row.UpdatedAt, job, chef)
}

func mapApplicationRow(id pgtype.UUID, jobID pgtype.UUID, chefProfileID pgtype.UUID, status db.ApplicationStatus, cover pgtype.Text, created pgtype.Timestamp, updated pgtype.Timestamp, job *JobSummary, chef *ChefSummary) (*Application, error) {
	appID, err := uuidFromPg(id)
	if err != nil {
		return nil, err
	}
	jobUUID, err := uuidFromPg(jobID)
	if err != nil {
		return nil, err
	}
	chefUUID, err := uuidFromPg(chefProfileID)
	if err != nil {
		return nil, err
	}

	return &Application{
		ID:            appID,
		JobID:         jobUUID,
		ChefProfileID: chefUUID,
		Status:        status,
		CoverLetter:   textPointer(cover),
		CreatedAt:     created.Time,
		UpdatedAt:     updated.Time,
		Job:           job,
		Chef:          chef,
	}, nil
}

func mapChefSummary(row db.ChefProfile) (*ChefSummary, error) {
	profileID, err := uuidFromPg(row.ID)
	if err != nil {
		return nil, err
	}

	return &ChefSummary{
		ProfileID: profileID,
		FullName:  textPointer(row.FullName),
		Location:  textPointer(row.Location),
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

func textParam(value *string) pgtype.Text {
	if value == nil {
		return pgtype.Text{Valid: false}
	}
	return pgtype.Text{String: strings.TrimSpace(*value), Valid: true}
}

func textPointer(value pgtype.Text) *string {
	if !value.Valid {
		return nil
	}
	s := value.String
	return &s
}

func metadataOrDefault(raw json.RawMessage) []byte {
	if len(raw) == 0 {
		return []byte("{}")
	}
	copied := make([]byte, len(raw))
	copy(copied, raw)
	return copied
}

func copyJSON(src []byte) json.RawMessage {
	if len(src) == 0 {
		return json.RawMessage([]byte("{}"))
	}
	dst := make([]byte, len(src))
	copy(dst, src)
	return json.RawMessage(dst)
}

func nullJobStatus(status *db.JobStatus) db.NullJobStatus {
	if status == nil {
		return db.NullJobStatus{}
	}
	return db.NullJobStatus{Valid: true, JobStatus: *status}
}

func toPgUUID(id uuid.UUID) (pgtype.UUID, error) {
	var pgID pgtype.UUID
	if err := pgID.Scan(id[:]); err != nil {
		return pgtype.UUID{}, err
	}
	return pgID, nil
}

func toPgUUIDMust(id uuid.UUID) pgtype.UUID {
	var pgID pgtype.UUID
	_ = pgID.Scan(id[:])
	return pgID
}

func uuidFromPg(value pgtype.UUID) (uuid.UUID, error) {
	if !value.Valid {
		return uuid.UUID{}, errors.New("invalid uuid value")
	}
	return uuid.FromBytes(value.Bytes[:])
}

func summaryName(summary *RestaurantSummary) *string {
	if summary == nil {
		return nil
	}
	return summary.DisplayName
}

// Internal helper structs used to keep pg types + decoded UUIDs side by side.
type restaurantProfileRow struct {
	id          pgtype.UUID
	displayName pgtype.Text
	tagline     pgtype.Text
	location    pgtype.Text
}

func (r *restaurantProfileRow) toSummary() *RestaurantSummary {
	return restaurantSummaryFromRow(r.id, r.displayName, r.tagline, r.location)
}

type chefProfileRow struct {
	id       pgtype.UUID
	uuid     uuid.UUID
	fullName *string
	location *string
}

type jobOwnership struct {
	jobID            pgtype.UUID
	restaurantID     pgtype.UUID
	restaurantUserID uuid.UUID
}
