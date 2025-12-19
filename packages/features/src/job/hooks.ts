import { useCallback, useEffect, useMemo, useState } from 'react';
import type {
  ApplicationStatus,
  CreateApplicationParams,
  CreateJobParams,
  Job,
  JobApplication,
  JobClient,
  JobListResult,
  JobSearchParams,
  UpdateApplicationStatusParams,
  UpdateJobParams,
} from '@api-client';

interface HookState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export interface UseJobSearchOptions {
  client: JobClient;
  params?: JobSearchParams;
  accessToken?: string;
  immediate?: boolean;
}

export function useJobSearch({ client, params, accessToken, immediate = true }: UseJobSearchOptions) {
  const [state, setState] = useState<HookState<JobListResult>>({ data: null, loading: immediate, error: null });

  const fetchJobs = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const result = await client.searchJobs(params ?? {}, accessToken);
      setState({ data: result, loading: false, error: null });
    } catch (error) {
      const message = error instanceof Error ? error.message : '予期せぬエラーが発生しました';
      setState({ data: null, loading: false, error: message });
    }
  }, [client, params, accessToken]);

  useEffect(() => {
    if (immediate) {
      fetchJobs();
    }
  }, [fetchJobs, immediate]);

  return {
    jobs: state.data?.jobs ?? [],
    total: state.data?.total ?? 0,
    loading: state.loading,
    error: state.error,
    refresh: fetchJobs,
  };
}

export interface UseJobDetailOptions {
  client: JobClient;
  jobId?: string;
  accessToken?: string;
}

export function useJobDetail({ client, jobId, accessToken }: UseJobDetailOptions) {
  const [state, setState] = useState<HookState<Job>>({ data: null, loading: Boolean(jobId), error: null });

  useEffect(() => {
    if (!jobId) {
      return;
    }
    let cancelled = false;
    setState({ data: null, loading: true, error: null });
    client
      .getJob(jobId, accessToken)
      .then((job) => {
        if (!cancelled) {
          setState({ data: job, loading: false, error: null });
        }
      })
      .catch((error) => {
        if (!cancelled) {
          const message = error instanceof Error ? error.message : '求人の取得に失敗しました';
          setState({ data: null, loading: false, error: message });
        }
      });

    return () => {
      cancelled = true;
    };
  }, [client, jobId, accessToken]);

  return state;
}

interface UseApplicationsOptions {
  client: JobClient;
  scope: 'chef' | 'restaurant';
  accessToken: string;
  limit?: number;
  offset?: number;
}

export function useJobApplications({ client, scope, accessToken, limit, offset }: UseApplicationsOptions) {
  const [state, setState] = useState<HookState<JobApplication[]>>({ data: [], loading: true, error: null });

  const fetchApplications = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const applications = scope === 'chef'
        ? await client.listApplicationsForChef({ limit, offset }, accessToken)
        : await client.listApplicationsForRestaurant({ limit, offset }, accessToken);
      setState({ data: applications, loading: false, error: null });
    } catch (error) {
      const message = error instanceof Error ? error.message : '応募一覧の取得に失敗しました';
      setState({ data: [], loading: false, error: message });
    }
  }, [client, scope, accessToken, limit, offset]);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  return {
    applications: state.data ?? [],
    loading: state.loading,
    error: state.error,
    refresh: fetchApplications,
  };
}

export interface UseJobMutationsOptions {
  client: JobClient;
  accessToken: string;
}

export function useJobMutations({ client, accessToken }: UseJobMutationsOptions) {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const wrap = useCallback(
    async <T,>(fn: () => Promise<T>): Promise<T | null> => {
      setLoading(true);
      setError(null);
      try {
        const result = await fn();
        return result;
      } catch (error) {
        const message = error instanceof Error ? error.message : '操作に失敗しました';
        setError(message);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const createJob = useCallback(
    (params: CreateJobParams) => wrap(() => client.createJob(params, accessToken)),
    [client, accessToken, wrap],
  );

  const updateJob = useCallback(
    (params: UpdateJobParams) => wrap(() => client.updateJob(params, accessToken)),
    [client, accessToken, wrap],
  );

  const createApplication = useCallback(
    (params: CreateApplicationParams) => wrap(() => client.createApplication(params, accessToken)),
    [client, accessToken, wrap],
  );

  const updateApplicationStatus = useCallback(
    (params: UpdateApplicationStatusParams) => wrap(() => client.updateApplicationStatus(params, accessToken)),
    [client, accessToken, wrap],
  );

  return {
    loading,
    error,
    createJob,
    updateJob,
    createApplication,
    updateApplicationStatus,
  };
}

export function translateApplicationStatus(status: ApplicationStatus): string {
  switch (status) {
    case 'PENDING':
      return '審査中';
    case 'ACCEPTED':
      return '受理済み';
    case 'REJECTED':
      return 'お見送り';
    default:
      return status;
  }
}
