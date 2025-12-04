import type {
  RestaurantProfile,
  CreateRestaurantProfileParams,
  UpdateRestaurantProfileParams,
  ProfileClientOptions,
  LearningHighlight,
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
interface ProtoLearningHighlight {
  id: string;
  title: string;
  duration: string;
  detail: string;
}

interface ProtoRestaurantProfile {
  id: string;
  user_id: string;
  display_name: string;
  tagline: string;
  location: string;
  seats: number;
  cuisine_types: string[];
  mentorship_style: string;
  description: string;
  culture_keywords: string[];
  benefits: string[];
  support_programs: string[];
  learning_highlights: ProtoLearningHighlight[];
  created_at: string;
  updated_at: string;
}

export class RestaurantProfileClient {
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

  async createProfile(params: CreateRestaurantProfileParams, accessToken: string): Promise<RestaurantProfile> {
    const response = await this.post<unknown, { profile: ProtoRestaurantProfile }>(
      'restaurant.v1.RestaurantProfileService/CreateProfile',
      this.toProtoCreateRequest(params),
      accessToken,
    );
    return this.fromProtoProfile(response.profile);
  }

  async getProfile(profileId: string, accessToken?: string): Promise<RestaurantProfile> {
    const response = await this.post<{ profile_id: string }, { profile: ProtoRestaurantProfile }>(
      'restaurant.v1.RestaurantProfileService/GetProfile',
      { profile_id: profileId },
      accessToken,
    );
    return this.fromProtoProfile(response.profile);
  }

  async getMyProfile(accessToken: string): Promise<RestaurantProfile> {
    const response = await this.post<object, { profile: ProtoRestaurantProfile }>(
      'restaurant.v1.RestaurantProfileService/GetMyProfile',
      {},
      accessToken,
    );
    return this.fromProtoProfile(response.profile);
  }

  async updateProfile(params: UpdateRestaurantProfileParams, accessToken: string): Promise<RestaurantProfile> {
    const response = await this.post<unknown, { profile: ProtoRestaurantProfile }>(
      'restaurant.v1.RestaurantProfileService/UpdateProfile',
      this.toProtoUpdateRequest(params),
      accessToken,
    );
    return this.fromProtoProfile(response.profile);
  }

  async searchProfiles(
    params: {
      cuisineTypes?: string[];
      name?: string;
      limit?: number;
      offset?: number;
    },
    accessToken?: string,
  ): Promise<RestaurantProfile[]> {
    const response = await this.post<unknown, { profiles: ProtoRestaurantProfile[] }>(
      'restaurant.v1.RestaurantProfileService/SearchProfiles',
      {
        cuisine_types: params.cuisineTypes ?? [],
        name: params.name ?? '',
        limit: params.limit ?? 10,
        offset: params.offset ?? 0,
      },
      accessToken,
    );
    return response.profiles.map((p) => this.fromProtoProfile(p));
  }

  private toProtoCreateRequest(params: CreateRestaurantProfileParams): unknown {
    return {
      display_name: params.displayName,
      tagline: params.tagline,
      location: params.location,
      seats: params.seats,
      cuisine_types: params.cuisineTypes,
      mentorship_style: params.mentorshipStyle,
      description: params.description,
      culture_keywords: params.cultureKeywords,
      benefits: params.benefits,
      support_programs: params.supportPrograms,
      learning_highlights: params.learningHighlights.map((item) => ({
        title: item.title,
        duration: item.duration,
        detail: item.detail,
      })),
    };
  }

  private toProtoUpdateRequest(params: UpdateRestaurantProfileParams): unknown {
    return {
      profile_id: params.profileId,
      display_name: params.displayName,
      tagline: params.tagline,
      location: params.location,
      seats: params.seats,
      cuisine_types: params.cuisineTypes,
      mentorship_style: params.mentorshipStyle,
      description: params.description,
      culture_keywords: params.cultureKeywords,
      benefits: params.benefits,
      support_programs: params.supportPrograms,
      learning_highlights: params.learningHighlights.map((item) => ({
        id: item.id ?? '',
        title: item.title,
        duration: item.duration,
        detail: item.detail,
      })),
    };
  }

  private fromProtoProfile(proto: ProtoRestaurantProfile): RestaurantProfile {
    return {
      id: proto.id,
      userId: proto.user_id,
      displayName: proto.display_name,
      tagline: proto.tagline,
      location: proto.location,
      seats: proto.seats,
      cuisineTypes: proto.cuisine_types ?? [],
      mentorshipStyle: proto.mentorship_style,
      description: proto.description,
      cultureKeywords: proto.culture_keywords ?? [],
      benefits: proto.benefits ?? [],
      supportPrograms: proto.support_programs ?? [],
      learningHighlights: (proto.learning_highlights ?? []).map((item) => ({
        id: item.id,
        title: item.title,
        duration: item.duration,
        detail: item.detail,
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
