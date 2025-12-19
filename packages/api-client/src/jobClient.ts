import { ApiError } from './identityClient';
import type {
  ApplicationStatus,
  CreateApplicationParams,
  CreateJobParams,
  Job,
  JobApplication,
  JobClientOptions,
  JobListResult,
  JobMetadata,
  JobSearchParams,
  JobStatus,
  ListParams,
  UpdateApplicationStatusParams,
  UpdateJobParams,
} from './types';

const JOB_STATUS_TO_PROTO: Record<JobStatus, string> = {
  DRAFT: 'JOB_STATUS_DRAFT',
  PUBLISHED: 'JOB_STATUS_PUBLISHED',
  CLOSED: 'JOB_STATUS_CLOSED',
};

const PROTO_TO_JOB_STATUS: Record<string, JobStatus> = {
  JOB_STATUS_DRAFT: 'DRAFT',
  JOB_STATUS_PUBLISHED: 'PUBLISHED',
  JOB_STATUS_CLOSED: 'CLOSED',
};

const APPLICATION_STATUS_TO_PROTO: Record<ApplicationStatus, string> = {
  PENDING: 'APPLICATION_STATUS_PENDING',
  ACCEPTED: 'APPLICATION_STATUS_ACCEPTED',
  REJECTED: 'APPLICATION_STATUS_REJECTED',
};

const PROTO_TO_APPLICATION_STATUS: Record<string, ApplicationStatus> = {
  APPLICATION_STATUS_PENDING: 'PENDING',
  APPLICATION_STATUS_ACCEPTED: 'ACCEPTED',
  APPLICATION_STATUS_REJECTED: 'REJECTED',
};

interface ConnectErrorBody {
  code?: string;
  message?: string;
  details?: Array<{
    '@type': string;
    [key: string]: unknown;
  }>;
}

interface ProtoRestaurantSummary {
  id: string;
  display_name?: string;
  tagline?: string;
  location?: string;
}

interface ProtoJob {
  id: string;
  restaurant_id: string;
  title: string;
  description: string;
  required_skills: string[];
  location?: string;
  salary_range?: string;
  employment_type?: string;
  status: string;
  metadata_json?: string;
  created_at: string;
  updated_at: string;
  restaurant?: ProtoRestaurantSummary | null;
}

interface ProtoJobSummary {
  id: string;
  title: string;
  status: string;
  restaurant_name?: string;
}

interface ProtoChefSummary {
  profile_id: string;
  full_name?: string;
  location?: string;
}

interface ProtoJobApplication {
  id: string;
  job_id: string;
  chef_profile_id: string;
  status: string;
  cover_letter?: string;
  created_at: string;
  updated_at: string;
  job?: ProtoJobSummary | null;
  chef?: ProtoChefSummary | null;
}

interface JobListResponse {
  jobs?: ProtoJob[];
  total_count?: string | number;
}

interface ApplicationListResponse {
  applications?: ProtoJobApplication[];
}

export class JobClient {
  private readonly baseUrl: string;
  private readonly fetchImpl: typeof fetch;

  constructor(options: JobClientOptions = {}) {
    this.baseUrl = (options.baseUrl ?? 'http://localhost:8080').replace(/\/$/, '');
    if (options.fetchImpl) {
      this.fetchImpl = options.fetchImpl;
    } else if (typeof fetch !== 'undefined') {
      this.fetchImpl = fetch.bind(globalThis);
    } else {
      throw new Error('fetch API is not available in this environment. Pass fetchImpl explicitly.');
    }
  }

  async createJob(params: CreateJobParams, accessToken: string): Promise<Job> {
    const response = await this.post<{
      title: string;
      description: string;
      required_skills: string[];
      location?: string;
      salary_range?: string;
      employment_type?: string;
      status?: string;
      metadata_json?: string;
    }, { job: ProtoJob }>('job.v1.JobService/CreateJob', {
      title: params.title,
      description: params.description,
      required_skills: params.requiredSkills,
      location: params.location,
      salary_range: params.salaryRange,
      employment_type: params.employmentType,
      status: params.status ? JOB_STATUS_TO_PROTO[params.status] : undefined,
      metadata_json: this.stringifyMetadata(params.metadata),
    }, accessToken);

    return this.fromProtoJob(response.job);
  }

  async updateJob(params: UpdateJobParams, accessToken: string): Promise<Job> {
    const response = await this.post<{
      job_id: string;
      title?: string;
      description?: string;
      required_skills?: string[];
      location?: string;
      salary_range?: string;
      employment_type?: string;
      status?: string;
      metadata_json?: string;
    }, { job: ProtoJob }>('job.v1.JobService/UpdateJob', {
      job_id: params.jobId,
      title: params.title,
      description: params.description,
      required_skills: params.requiredSkills,
      location: params.location,
      salary_range: params.salaryRange,
      employment_type: params.employmentType,
      status: params.status ? JOB_STATUS_TO_PROTO[params.status] : undefined,
      metadata_json: params.metadata ? this.stringifyMetadata(params.metadata) : undefined,
    }, accessToken);

    return this.fromProtoJob(response.job);
  }

  async getJob(jobId: string, accessToken?: string): Promise<Job> {
    const response = await this.post<{ job_id: string }, { job: ProtoJob }>(
      'job.v1.JobService/GetJob',
      { job_id: jobId },
      accessToken,
    );

    return this.fromProtoJob(response.job);
  }

  async listMyJobs(params: ListParams, accessToken: string): Promise<JobListResult> {
    const response = await this.post<{ limit?: number; offset?: number }, JobListResponse>(
      'job.v1.JobService/ListMyJobs',
      { limit: params.limit, offset: params.offset },
      accessToken,
    );

    return {
      jobs: (response.jobs ?? []).map((job) => this.fromProtoJob(job)),
      total: this.parseTotal(response.total_count),
    };
  }

  async searchJobs(params: JobSearchParams, accessToken?: string): Promise<JobListResult> {
    const response = await this.post<{
      keyword?: string;
      required_skills?: string[];
      location?: string;
      limit?: number;
      offset?: number;
    }, JobListResponse>('job.v1.JobService/SearchJobs', {
      keyword: params.keyword,
      required_skills: params.requiredSkills,
      location: params.location,
      limit: params.limit,
      offset: params.offset,
    }, accessToken);

    return {
      jobs: (response.jobs ?? []).map((job) => this.fromProtoJob(job)),
      total: this.parseTotal(response.total_count),
    };
  }

  async createApplication(params: CreateApplicationParams, accessToken: string): Promise<JobApplication> {
    const response = await this.post<{
      job_id: string;
      cover_letter?: string;
    }, { application: ProtoJobApplication }>('job.v1.JobService/CreateApplication', {
      job_id: params.jobId,
      cover_letter: params.coverLetter,
    }, accessToken);

    return this.fromProtoApplication(response.application);
  }

  async listApplicationsForChef(params: ListParams, accessToken: string): Promise<JobApplication[]> {
    const response = await this.post<{ limit?: number; offset?: number }, ApplicationListResponse>(
      'job.v1.JobService/ListApplicationsForChef',
      { limit: params.limit, offset: params.offset },
      accessToken,
    );

    return (response.applications ?? []).map((app) => this.fromProtoApplication(app));
  }

  async listApplicationsForRestaurant(params: ListParams, accessToken: string): Promise<JobApplication[]> {
    const response = await this.post<{ limit?: number; offset?: number }, ApplicationListResponse>(
      'job.v1.JobService/ListApplicationsForRestaurant',
      { limit: params.limit, offset: params.offset },
      accessToken,
    );

    return (response.applications ?? []).map((app) => this.fromProtoApplication(app));
  }

  async updateApplicationStatus(params: UpdateApplicationStatusParams, accessToken: string): Promise<JobApplication> {
    const response = await this.post<{
      application_id: string;
      status: string;
    }, { application: ProtoJobApplication }>('job.v1.JobService/UpdateApplicationStatus', {
      application_id: params.applicationId,
      status: APPLICATION_STATUS_TO_PROTO[params.status],
    }, accessToken);

    return this.fromProtoApplication(response.application);
  }

  private async post<TBody, TResponse>(path: string, body: TBody, accessToken?: string): Promise<TResponse> {
    const normalizedPath = path.startsWith('/') ? path.slice(1) : path;
    const url = `${this.baseUrl}/${normalizedPath}`;

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (accessToken) {
      headers.Authorization = `Bearer ${accessToken}`;
    }

    const res = await this.fetchImpl(url, {
      method: 'POST',
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });

    const maybeJson = await this.safeJson(res);
    if (!res.ok) {
      const errorBody = maybeJson as ConnectErrorBody | undefined;
      const message = errorBody?.message ?? `Request failed with status ${res.status}`;
      const code = errorBody?.code ?? 'unknown';
      throw new ApiError(message, code, res.status);
    }

    return (maybeJson ?? {}) as TResponse;
  }

  private async safeJson(res: Response): Promise<unknown | undefined> {
    try {
      return await res.json();
    } catch (error) {
      return undefined;
    }
  }

  private fromProtoJob(job: ProtoJob): Job {
    const summary = job.restaurant ?? undefined;

    return {
      id: job.id,
      restaurantId: job.restaurant_id,
      restaurantName: summary?.display_name,
      restaurantLocation: summary?.location,
      restaurantTagline: summary?.tagline,
      title: job.title,
      description: job.description,
      requiredSkills: job.required_skills ?? [],
      location: job.location,
      salaryRange: job.salary_range,
      employmentType: job.employment_type,
      status: this.fromProtoJobStatus(job.status),
      metadata: this.parseMetadata(job.metadata_json),
      createdAt: job.created_at,
      updatedAt: job.updated_at,
    };
  }

  private fromProtoApplication(application: ProtoJobApplication): JobApplication {
    return {
      id: application.id,
      jobId: application.job_id,
      chefProfileId: application.chef_profile_id,
      status: this.fromProtoApplicationStatus(application.status),
      coverLetter: application.cover_letter,
      createdAt: application.created_at,
      updatedAt: application.updated_at,
      job: application.job
        ? {
            id: application.job.id,
            title: application.job.title,
            status: this.fromProtoJobStatus(application.job.status),
            restaurantName: application.job.restaurant_name,
          }
        : undefined,
      chef: application.chef
        ? {
            profileId: application.chef.profile_id,
            fullName: application.chef.full_name,
            location: application.chef.location,
          }
        : undefined,
    };
  }

  private fromProtoJobStatus(status: string): JobStatus {
    return PROTO_TO_JOB_STATUS[status] ?? 'DRAFT';
  }

  private fromProtoApplicationStatus(status: string): ApplicationStatus {
    return PROTO_TO_APPLICATION_STATUS[status] ?? 'PENDING';
  }

  private stringifyMetadata(metadata?: JobMetadata): string | undefined {
    if (!metadata) {
      return undefined;
    }
    try {
      return JSON.stringify(metadata);
    } catch (error) {
      return JSON.stringify({});
    }
  }

  private parseMetadata(raw?: string): JobMetadata {
    if (!raw) {
      return {};
    }
    try {
      return JSON.parse(raw) as JobMetadata;
    } catch (error) {
      return {};
    }
  }

  private parseTotal(value?: string | number): number {
    if (typeof value === 'number') {
      return value;
    }
    if (typeof value === 'string') {
      const parsed = Number(value);
      return Number.isNaN(parsed) ? 0 : parsed;
    }
    return 0;
  }
}
