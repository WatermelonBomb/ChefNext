import React, { createContext, useContext, useCallback, useEffect, useState } from 'react';
import type {
  ChefProfile as ApiChefProfile,
  RestaurantProfile as ApiRestaurantProfile,
  CreateChefProfileParams,
  CreateRestaurantProfileParams,
} from '@chefnext/api-client';
import { ApiError } from '@chefnext/api-client';
import { useAuth } from '../hooks/useAuth';
import { chefProfileClient, restaurantProfileClient } from '../lib/apiClient';

export interface SkillTreeNodeInput {
  id: string;
  skill: string;
  level: number;
  focus: string;
}

export interface StoredImagePreview {
  id: string;
  preview: string;
}

export interface ChefProfileData {
  id?: string;
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
  skillTree: SkillTreeNodeInput[];
  skillTreeJson: string;
  portfolio: StoredImagePreview[];
}

export interface RestaurantProfileData {
  id?: string;
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
  learningHighlights: {
    id: string;
    title: string;
    duration: string;
    detail: string;
  }[];
  gallery: StoredImagePreview[];
}

interface ProfileContextValue {
  chefProfile: ChefProfileData | null;
  restaurantProfile: RestaurantProfileData | null;
  chefLoading: boolean;
  restaurantLoading: boolean;
  error: string | null;
  saveChefProfile: (profile: ChefProfileData) => Promise<ChefProfileData>;
  saveRestaurantProfile: (profile: RestaurantProfileData) => Promise<RestaurantProfileData>;
  refreshChefProfile: () => Promise<void>;
  refreshRestaurantProfile: () => Promise<void>;
  clearError: () => void;
}

const ProfileContext = createContext<ProfileContextValue | undefined>(undefined);

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const { tokens, user } = useAuth();
  const [chefProfile, setChefProfile] = useState<ChefProfileData | null>(null);
  const [restaurantProfile, setRestaurantProfile] = useState<RestaurantProfileData | null>(null);
  const [chefLoading, setChefLoading] = useState(false);
  const [restaurantLoading, setRestaurantLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => setError(null), []);

  const handleError = useCallback((message: string, err: unknown) => {
    console.error(message, err);
    setError(message);
  }, []);

  const refreshChefProfile = useCallback(async () => {
    if (!tokens?.accessToken || user?.role !== 'CHEF') {
      setChefProfile(null);
      return;
    }

    setChefLoading(true);
    try {
      const profile = await chefProfileClient.getMyProfile(tokens.accessToken);
      setChefProfile(mapChefProfile(profile));
      clearError();
    } catch (err) {
      if (err instanceof ApiError && err.code === 'not_found') {
        setChefProfile(null);
        clearError();
      } else {
        handleError('シェフプロフィールの取得に失敗しました', err);
      }
    } finally {
      setChefLoading(false);
    }
  }, [tokens?.accessToken, user?.role, clearError, handleError]);

  const refreshRestaurantProfile = useCallback(async () => {
    if (!tokens?.accessToken || user?.role !== 'RESTAURANT') {
      setRestaurantProfile(null);
      return;
    }

    setRestaurantLoading(true);
    try {
      const profile = await restaurantProfileClient.getMyProfile(tokens.accessToken);
      setRestaurantProfile(mapRestaurantProfile(profile));
      clearError();
    } catch (err) {
      if (err instanceof ApiError && err.code === 'not_found') {
        setRestaurantProfile(null);
        clearError();
      } else {
        handleError('レストランプロフィールの取得に失敗しました', err);
      }
    } finally {
      setRestaurantLoading(false);
    }
  }, [tokens?.accessToken, user?.role, clearError, handleError]);

  const saveChefProfile = useCallback(
    async (input: ChefProfileData): Promise<ChefProfileData> => {
      if (!tokens?.accessToken || user?.role !== 'CHEF') {
        const err = new Error('NOT_AUTHENTICATED');
        handleError('シェフプロフィールを保存するにはログインが必要です', err);
        throw err;
      }

      setChefLoading(true);
      try {
        const payload = buildChefPayload(input);
        const response = chefProfile?.id
          ? await chefProfileClient.updateProfile({ ...payload, profileId: chefProfile.id }, tokens.accessToken)
          : await chefProfileClient.createProfile(payload, tokens.accessToken);
        const mapped = mapChefProfile(response);
        setChefProfile(mapped);
        clearError();
        return mapped;
      } catch (err) {
        handleError('シェフプロフィールの保存に失敗しました', err);
        throw err;
      } finally {
        setChefLoading(false);
      }
    },
    [chefProfile, tokens?.accessToken, user?.role, clearError, handleError]
  );

  const saveRestaurantProfile = useCallback(
    async (input: RestaurantProfileData): Promise<RestaurantProfileData> => {
      if (!tokens?.accessToken || user?.role !== 'RESTAURANT') {
        const err = new Error('NOT_AUTHENTICATED');
        handleError('レストランプロフィールを保存するにはログインが必要です', err);
        throw err;
      }

      setRestaurantLoading(true);
      try {
        const payload = buildRestaurantPayload(input);
        const response = restaurantProfile?.id
          ? await restaurantProfileClient.updateProfile({ ...payload, profileId: restaurantProfile.id }, tokens.accessToken)
          : await restaurantProfileClient.createProfile(payload, tokens.accessToken);
        const mapped = mapRestaurantProfile(response);
        // gallery は現時点で API に保存しないため、直近の入力値を維持する
        mapped.gallery = input.gallery;
        setRestaurantProfile(mapped);
        clearError();
        return mapped;
      } catch (err) {
        handleError('レストランプロフィールの保存に失敗しました', err);
        throw err;
      } finally {
        setRestaurantLoading(false);
      }
    },
    [restaurantProfile, tokens?.accessToken, user?.role, clearError, handleError]
  );

  useEffect(() => {
    if (!tokens?.accessToken) {
      setChefProfile(null);
      setRestaurantProfile(null);
      setChefLoading(false);
      setRestaurantLoading(false);
      return;
    }

    if (user?.role === 'CHEF') {
      refreshChefProfile();
    } else if (user?.role === 'RESTAURANT') {
      refreshRestaurantProfile();
    }
  }, [tokens?.accessToken, user?.role, refreshChefProfile, refreshRestaurantProfile]);

  const value = {
    chefProfile,
    restaurantProfile,
    chefLoading,
    restaurantLoading,
    error,
    saveChefProfile,
    saveRestaurantProfile,
    refreshChefProfile,
    refreshRestaurantProfile,
    clearError,
  } satisfies ProfileContextValue;

  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>;
}

export function useProfileContext(): ProfileContextValue {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error('useProfileContext must be used within a ProfileProvider');
  }
  return context;
}

function mapChefProfile(profile: ApiChefProfile): ChefProfileData {
  return {
    id: profile.id,
    fullName: profile.fullName ?? '',
    headline: profile.headline ?? '',
    summary: profile.summary ?? '',
    location: profile.location ?? '',
    yearsExperience: profile.yearsExperience ?? 0,
    availability: profile.availability ?? '',
    specialties: profile.specialties ?? [],
    workAreas: profile.workAreas ?? [],
    languages: profile.languages ?? [],
    bio: profile.bio ?? '',
    learningFocus: profile.learningFocus ?? [],
    skillTreeJson: profile.skillTreeJson ?? '',
    skillTree: parseSkillTree(profile.skillTreeJson),
    portfolio: (profile.portfolioItems ?? []).map((item) => ({
      id: item.id ?? item.url,
      preview: item.url,
    })),
  };
}

function mapRestaurantProfile(profile: ApiRestaurantProfile): RestaurantProfileData {
  return {
    id: profile.id,
    displayName: profile.displayName ?? '',
    tagline: profile.tagline ?? '',
    location: profile.location ?? '',
    seats: profile.seats ?? 0,
    cuisineTypes: profile.cuisineTypes ?? [],
    mentorshipStyle: profile.mentorshipStyle ?? '',
    description: profile.description ?? '',
    cultureKeywords: profile.cultureKeywords ?? [],
    benefits: profile.benefits ?? [],
    supportPrograms: profile.supportPrograms ?? [],
    learningHighlights: (profile.learningHighlights ?? []).map((item) => ({
      id: item.id ?? generateLocalId(),
      title: item.title,
      duration: item.duration,
      detail: item.detail,
    })),
    gallery: [],
  };
}

function buildChefPayload(data: ChefProfileData): CreateChefProfileParams {
  return {
    fullName: data.fullName,
    headline: data.headline,
    summary: data.summary,
    location: data.location,
    yearsExperience: data.yearsExperience,
    availability: data.availability,
    specialties: data.specialties,
    workAreas: data.workAreas,
    languages: data.languages,
    bio: data.bio,
    learningFocus: data.learningFocus,
    skillTreeJson: data.skillTreeJson,
    portfolioItems: data.portfolio.map((item) => ({
      id: item.id,
      url: item.preview,
      caption: '',
    })),
  };
}

function buildRestaurantPayload(data: RestaurantProfileData): CreateRestaurantProfileParams {
  return {
    displayName: data.displayName,
    tagline: data.tagline,
    location: data.location,
    seats: data.seats,
    cuisineTypes: data.cuisineTypes,
    mentorshipStyle: data.mentorshipStyle,
    description: data.description,
    cultureKeywords: data.cultureKeywords,
    benefits: data.benefits,
    supportPrograms: data.supportPrograms,
    learningHighlights: data.learningHighlights.map((item) => ({
      id: item.id,
      title: item.title,
      duration: item.duration,
      detail: item.detail,
    })),
  };
}

function parseSkillTree(raw?: string): SkillTreeNodeInput[] {
  if (!raw) {
    return [];
  }

  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed?.nodes)) {
      return parsed.nodes.map((node: any) => ({
        id: typeof node.id === 'string' ? node.id : generateLocalId(),
        skill: typeof node.skill === 'string' ? node.skill : '',
        level: typeof node.level === 'number' ? node.level : 0,
        focus: typeof node.focus === 'string' ? node.focus : '',
      }));
    }
  } catch (error) {
    console.warn('Failed to parse skill tree JSON', error);
  }

  return [];
}

function generateLocalId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}
