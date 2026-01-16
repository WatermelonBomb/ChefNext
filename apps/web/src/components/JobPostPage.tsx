import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { CreateJobParams } from '@chefnext/api-client';
import { JobPostScreen, useJobMutations } from '@features/job';
import { useAuth } from '../hooks/useAuth';
import { jobClient } from '../lib/apiClient';

export function JobPostPage() {
  const navigate = useNavigate();
  const { tokens, user } = useAuth();
  const isRestaurant = user?.role === 'RESTAURANT';
  const [localError, setLocalError] = useState<string | null>(null);
  const { createJob, loading, error } = useJobMutations({ client: jobClient, accessToken: tokens?.accessToken ?? '' });

  const handleBack = () => navigate('/restaurant/dashboard');

  const handleSubmit = async (params: CreateJobParams) => {
    setLocalError(null);
    if (!tokens?.accessToken) {
      setLocalError('求人を作成するにはレストランアカウントでログインしてください');
      return;
    }

    const result = await createJob(params);
    if (result) {
      navigate('/restaurant/dashboard');
    }
  };

  if (!isRestaurant) {
    return (
      <div className="min-h-screen bg-[#FAF8F4]" style={{ paddingTop: '120px' }}>
        <div className="max-w-3xl mx-auto px-4">
          <div className="bg-white rounded-2xl shadow p-10 text-center">
            <h3 className="text-2xl font-bold mb-4">求人作成はレストラン専用です</h3>
            <p className="text-[#475569] mb-6">レストランアカウントでログインし直すか、管理者にお問い合わせください。</p>
            <button onClick={handleBack} className="px-6 py-3 rounded-xl bg-[#1C1C1C] text-white font-semibold">戻る</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF8F4]" style={{ paddingTop: '120px' }}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {(localError || error) && (
          <div className="bg-[#fee2e2] text-[#b91c1c] rounded-xl p-4 mb-6">
            {localError ?? error}
          </div>
        )}
        <JobPostScreen onSubmit={handleSubmit} isSubmitting={loading} />
        <div className="mt-6 text-center">
          <button
            onClick={handleBack}
            className="px-6 py-3 rounded-xl border border-[#e2e8f0] text-[#1C1C1C] font-semibold"
          >
            キャンセル
          </button>
        </div>
      </div>
    </div>
  );
}
