import type { AuthTokens, AuthUser, IdentityClientOptions, LoginParams, RegisterParams, UserRole } from './types';

const ROLE_TO_PROTO: Record<UserRole, string> = {
  CHEF: 'USER_ROLE_CHEF',
  RESTAURANT: 'USER_ROLE_RESTAURANT',
};

const PROTO_TO_ROLE: Record<string, UserRole> = {
  USER_ROLE_CHEF: 'CHEF',
  USER_ROLE_RESTAURANT: 'RESTAURANT',
};

export interface RegisterResult {
  user: AuthUser;
  tokens: AuthTokens;
}

export interface LoginResult extends RegisterResult {}

export class ApiError extends Error {
  readonly status: number;
  readonly code: string;

  constructor(message: string, code: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.status = status;
  }
}

interface ConnectErrorBody {
  code?: string;
  message?: string;
  details?: Array<{
    '@type': string;
    [key: string]: unknown;
  }>;
}

export class IdentityClient {
  private readonly baseUrl: string;
  private readonly fetchImpl: typeof fetch;

  constructor(options: IdentityClientOptions = {}) {
    this.baseUrl = (options.baseUrl ?? 'http://localhost:8080').replace(/\/$/, '');
    if (options.fetchImpl) {
      this.fetchImpl = options.fetchImpl;
    } else if (typeof fetch !== 'undefined') {
      this.fetchImpl = fetch.bind(globalThis);
    } else {
      throw new Error('fetch API is not available in this environment. Pass fetchImpl explicitly.');
    }
  }

  async register(params: RegisterParams): Promise<RegisterResult> {
    const response = await this.post<{
      email: string;
      password: string;
      role: string;
    }, {
      user_id: string;
      email: string;
      role: string;
      access_token: string;
      refresh_token: string;
    }>('identity.v1.AuthService/Register', {
      email: params.email,
      password: params.password,
      role: ROLE_TO_PROTO[params.role],
    });

    return this.toAuthResult(response);
  }

  async login(params: LoginParams): Promise<LoginResult> {
    const response = await this.post<LoginParams, {
      user_id: string;
      email: string;
      role: string;
      access_token: string;
      refresh_token: string;
    }>('identity.v1.AuthService/Login', params);

    return this.toAuthResult(response);
  }

  async refresh(refreshToken: string): Promise<AuthTokens> {
    const response = await this.post<{ refresh_token: string }, {
      access_token: string;
      refresh_token: string;
    }>('identity.v1.AuthService/RefreshToken', { refresh_token: refreshToken });

    return {
      accessToken: response.access_token,
      refreshToken: response.refresh_token,
    };
  }

  async logout(refreshToken: string): Promise<void> {
    await this.post<{ refresh_token: string }, { success: boolean }>(
      'identity.v1.AuthService/Logout',
      { refresh_token: refreshToken },
    );
  }

  async getMe(accessToken: string): Promise<AuthUser> {
    const response = await this.post<object, {
      user_id: string;
      email: string;
      role: string;
    }>('identity.v1.AuthService/GetMe', {}, accessToken);

    return {
      id: response.user_id,
      email: response.email,
      role: this.fromProtoRole(response.role),
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

  private toAuthResult(response: {
    user_id: string;
    email: string;
    role: string;
    access_token: string;
    refresh_token: string;
  }): RegisterResult {
    return {
      user: {
        id: response.user_id,
        email: response.email,
        role: this.fromProtoRole(response.role),
      },
      tokens: {
        accessToken: response.access_token,
        refreshToken: response.refresh_token,
      },
    };
  }

  private fromProtoRole(role: string): UserRole {
    return PROTO_TO_ROLE[role] ?? 'CHEF';
  }
}
