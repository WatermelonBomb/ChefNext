import type {
  ChefProfile,
  CreateChefProfileParams,
  UpdateChefProfileParams,
  ProfileClientOptions,
  PortfolioItem,
} from './types';
import { ApiError } from './identityClient';

interface ConnectErrorBody {
  code?: string;
  message?: string;
  details?: Array<{
    '@type': string;
    [key: string]: unknown;
  }>;
}

// Proto response types
interface ProtoPortfolioItem {
  id: string;
  url: string;
  caption: string;
}

interface ProtoChefProfile {
  id: string;
  user_id: string;
  full_name: string;
  headline: string;
  summary: string;
  location: string;
  years_experience: number;
  availability: string;
  specialties: string[];
  work_areas: string[];
  languages: string[];
  bio: string;
  learning_focus: string[];
  skill_tree_json: string;
  portfolio_items: ProtoPortfolioItem[];
  created_at: string;
  updated_at: string;
}

export class ChefProfileClient {
  private readonly baseUrl: string;
  private readonly fetchImpl: typeof fetch;

  constructor(options: ProfileClientOptions = {}) {
    this.baseUrl = (options.baseUrl ?? 'http://localhost:8080').replace(/\/$/, '');
    if (options.fetchImpl) {
      this.fetchImpl = options.fetchImpl;
    } else if (typeof fetch !== 'undefined') {
      this.fetchImpl = fetch.bind(globalThis);
    } else {
      throw new Error('fetch API is not available in this environment. Pass fetchImpl explicitly.');
    }
  }

  async createProfile(params: CreateChefProfileParams, accessToken: string): Promise<ChefProfile> {
    const response = await this.post<unknown, { profile: ProtoChefProfile }>(
      'chef.v1.ChefProfileService/CreateProfile',
      this.toProtoCreateRequest(params),
      accessToken,
    );
    return this.fromProtoProfile(response.profile);
  }

  async getProfile(profileId: string, accessToken?: string): Promise<ChefProfile> {
    const response = await this.post<{ profile_id: string }, { profile: ProtoChefProfile }>(
      'chef.v1.ChefProfileService/GetProfile',
      { profile_id: profileId },
      accessToken,
    );
    return this.fromProtoProfile(response.profile);
  }

  async getMyProfile(accessToken: string): Promise<ChefProfile> {
    const response = await this.post<object, { profile: ProtoChefProfile }>(
      'chef.v1.ChefProfileService/GetMyProfile',
      {},
      accessToken,
    );
    return this.fromProtoProfile(response.profile);
  }

  async updateProfile(params: UpdateChefProfileParams, accessToken: string): Promise<ChefProfile> {
    const response = await this.post<unknown, { profile: ProtoChefProfile }>(
      'chef.v1.ChefProfileService/UpdateProfile',
      this.toProtoUpdateRequest(params),
      accessToken,
    );
    return this.fromProtoProfile(response.profile);
  }

  async searchProfiles(
    params: {
      specialties?: string[];
      workAreas?: string[];
      limit?: number;
      offset?: number;
    },
    accessToken?: string,
  ): Promise<ChefProfile[]> {
    const response = await this.post<unknown, { profiles: ProtoChefProfile[] }>(
      'chef.v1.ChefProfileService/SearchProfiles',
      {
        specialties: params.specialties ?? [],
        work_areas: params.workAreas ?? [],
        limit: params.limit ?? 10,
        offset: params.offset ?? 0,
      },
      accessToken,
    );
    return response.profiles.map((p) => this.fromProtoProfile(p));
  }

  private toProtoCreateRequest(params: CreateChefProfileParams): unknown {
    return {
      full_name: params.fullName,
      headline: params.headline,
      summary: params.summary,
      location: params.location,
      years_experience: params.yearsExperience,
      availability: params.availability,
      specialties: params.specialties,
      work_areas: params.workAreas,
      languages: params.languages,
      bio: params.bio,
      learning_focus: params.learningFocus,
      skill_tree_json: params.skillTreeJson,
      portfolio_items: params.portfolioItems.map((item) => ({
        url: item.url,
        caption: item.caption,
      })),
    };
  }

  private toProtoUpdateRequest(params: UpdateChefProfileParams): unknown {
    return {
      profile_id: params.profileId,
      full_name: params.fullName,
      headline: params.headline,
      summary: params.summary,
      location: params.location,
      years_experience: params.yearsExperience,
      availability: params.availability,
      specialties: params.specialties,
      work_areas: params.workAreas,
      languages: params.languages,
      bio: params.bio,
      learning_focus: params.learningFocus,
      skill_tree_json: params.skillTreeJson,
      portfolio_items: params.portfolioItems.map((item) => ({
        id: item.id ?? '',
        url: item.url,
        caption: item.caption,
      })),
    };
  }

  private fromProtoProfile(proto: ProtoChefProfile): ChefProfile {
    return {
      id: proto.id,
      userId: proto.user_id,
      fullName: proto.full_name,
      headline: proto.headline,
      summary: proto.summary,
      location: proto.location,
      yearsExperience: proto.years_experience,
      availability: proto.availability,
      specialties: proto.specialties ?? [],
      workAreas: proto.work_areas ?? [],
      languages: proto.languages ?? [],
      bio: proto.bio,
      learningFocus: proto.learning_focus ?? [],
      skillTreeJson: proto.skill_tree_json,
      portfolioItems: (proto.portfolio_items ?? []).map((item) => ({
        id: item.id,
        url: item.url,
        caption: item.caption,
      })),
      createdAt: proto.created_at,
      updatedAt: proto.updated_at,
    };
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
}
