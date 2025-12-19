import React, { useMemo, useState } from 'react';
import type { JobSearchParams } from '@chefnext/api-client';
import { JobListScreen, useJobSearch } from '@features/job';
import { useAuth } from '../hooks/useAuth';
import { jobClient } from '../lib/apiClient';

interface JobListingPageProps {
  onJobClick: (jobId: string) => void;
  onCreateJob?: () => void;
  onViewApplications?: () => void;
}

export function JobListingPage({ onJobClick, onCreateJob, onViewApplications }: JobListingPageProps) {
  const { tokens, user } = useAuth();
  const [keyword, setKeyword] = useState('');
  const [searchParams, setSearchParams] = useState<JobSearchParams>({ limit: 12 });
  const { jobs, loading, error, refresh } = useJobSearch({
    client: jobClient,
    params: searchParams,
    accessToken: tokens?.accessToken,
  });

  const canCreateJob = useMemo(() => user?.role === 'RESTAURANT' && Boolean(onCreateJob), [user, onCreateJob]);
  const canViewApplications = useMemo(
    () => user?.role === 'CHEF' && Boolean(onViewApplications),
    [user, onViewApplications],
  );

  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSearchParams((prev) => ({ ...prev, keyword }));
  };

  return (
    <div className="min-h-screen bg-[#FAF8F4]" style={{ paddingTop: '120px' }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <h2 className="text-4xl font-bold mb-3">求人を探す</h2>
              <p className="text-[#475569]">
                最新の求人はすべて shared features (`@features/job`) 経由でレンダリングされています。
              </p>
            </div>
            {canViewApplications && (
              <button
                onClick={onViewApplications}
                className="px-5 py-3 rounded-xl border border-[#e2e8f0] text-[#1C1C1C] font-semibold hover:border-[#CDAE58]"
              >
                応募状況を確認
              </button>
            )}
          </div>
        </div>

        <form onSubmit={handleSearch} className="bg-white rounded-2xl p-6 shadow mb-10 flex gap-4 flex-col md:flex-row">
          <input
            value={keyword}
            onChange={(event) => setKeyword(event.target.value)}
            className="flex-1 border border-[#e2e8f0] rounded-xl px-4 py-3 focus:outline-none focus:border-[#CDAE58]"
            placeholder="エリアやスキルで検索"
          />
          <button
            type="submit"
            className="px-6 py-3 bg-[#1C1C1C] text-white rounded-xl font-semibold hover:bg-[#CDAE58] transition"
          >
            検索
          </button>
        </form>

        <JobListScreen
          jobs={jobs}
          isLoading={loading}
          error={error}
          onRetry={refresh}
          onJobSelect={onJobClick}
          onCreateJob={canCreateJob ? onCreateJob : undefined}
          subtitle="React Native ベースの UI を Web でもそのまま利用しています"
        />
      </div>
    </div>
  );
}
