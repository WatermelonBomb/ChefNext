export type UserRole = 'CHEF' | 'RESTAURANT';

export interface AuthUser {
  id: string;
  email: string;
  role: UserRole;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface RegisterParams {
  email: string;
  password: string;
  role: UserRole;
}

export interface LoginParams {
  email: string;
  password: string;
}

export interface IdentityClientOptions {
  /**
   * Base URL of the Connect-enabled API server.
   * Defaults to http://localhost:8080
   */
  baseUrl?: string;
  /** Custom fetch implementation (useful for tests). */
  fetchImpl?: typeof fetch;
}

// Chef Profile Types
export interface PortfolioItem {
  id?: string;
  url: string;
  caption: string;
}

export interface ChefProfile {
  id: string;
  userId: string;
  fullName: string;
  headline: string;
  summary: string;
  location: string;
  yearsExperience: number;
  availability: string;
  specialties: string[];
  workAreas: string[];
  languages: string[];
  bio: string;
  learningFocus: string[];
  skillTreeJson: string;
  portfolioItems: PortfolioItem[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateChefProfileParams {
  fullName: string;
  headline: string;
  summary: string;
  location: string;
  yearsExperience: number;
  availability: string;
  specialties: string[];
  workAreas: string[];
  languages: string[];
  bio: string;
  learningFocus: string[];
  skillTreeJson: string;
  portfolioItems: PortfolioItem[];
}

export interface UpdateChefProfileParams extends CreateChefProfileParams {
  profileId: string;
}

// Restaurant Profile Types
export interface LearningHighlight {
  id?: string;
  title: string;
  duration: string;
  detail: string;
}

export interface RestaurantProfile {
  id: string;
  userId: string;
  displayName: string;
  tagline: string;
  location: string;
  seats: number;
  cuisineTypes: string[];
  mentorshipStyle: string;
  description: string;
  cultureKeywords: string[];
  benefits: string[];
  supportPrograms: string[];
  learningHighlights: LearningHighlight[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateRestaurantProfileParams {
  displayName: string;
  tagline: string;
  location: string;
  seats: number;
  cuisineTypes: string[];
  mentorshipStyle: string;
  description: string;
  cultureKeywords: string[];
  benefits: string[];
  supportPrograms: string[];
  learningHighlights: LearningHighlight[];
}

export interface UpdateRestaurantProfileParams extends CreateRestaurantProfileParams {
  profileId: string;
}

export interface ProfileClientOptions {
  baseUrl?: string;
  fetchImpl?: typeof fetch;
}
