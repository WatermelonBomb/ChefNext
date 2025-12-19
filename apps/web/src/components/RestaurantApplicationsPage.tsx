import React, { useState } from 'react';
import type { ApplicationStatus } from '@chefnext/api-client';
import {
  ApplicationListScreen,
  translateApplicationStatus,
  useJobApplications,
  useJobMutations,
} from '@features/job';
import { useAuth } from '../hooks/useAuth';
import { jobClient } from '../lib/apiClient';

interface RestaurantApplicationsPageProps {
  onBack: () => void;
}

export function RestaurantApplicationsPage({ onBack }: RestaurantApplicationsPageProps) {
  const { tokens, isAuthenticated, user } = useAuth();
  const accessToken = tokens?.accessToken;
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  if (!isAuthenticated || user?.role !== 'RESTAURANT' || !accessToken) {
    return (
      <GuardedView
        title="応募管理を表示できません"
        description="レストランアカウントでログインしてください。"
        onBack={onBack}
      />
    );
  }

  const { applications, loading, error, refresh } = useJobApplications({
    client: jobClient,
    scope: 'restaurant',
    accessToken,
    limit: 20,
  });

  const { updateApplicationStatus, loading: mutationLoading, error: mutationError } = useJobMutations({
    client: jobClient,
    accessToken,
  });

  const handleStatusUpdate = async (applicationId: string, status: ApplicationStatus) => {
    if (mutationLoading) {
      return;
    }
    setStatusMessage(null);
    const result = await updateApplicationStatus({ applicationId, status });
    if (result) {
      setStatusMessage(`応募を${translateApplicationStatus(status)}に更新しました`);
      refresh();
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F4]" style={{ paddingTop: '120px' }}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="mb-8">
          <p className="text-sm uppercase tracking-widest text-[#CDAE58]">APPLICANT MANAGEMENT</p>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">応募者管理</h1>
              <p className="text-[#475569]">最新の応募者とステータスをここから管理できます。</p>
            </div>
            <button
              onClick={onBack}
              className="px-5 py-3 rounded-xl border border-[#e2e8f0] text-[#1C1C1C] font-semibold hover:border-[#CDAE58]"
            >
              ダッシュボードに戻る
            </button>
          </div>
        </header>

        {(mutationError || statusMessage) && (
          <div
            className={`mb-6 rounded-xl p-4 ${mutationError ? 'bg-[#fee2e2] text-[#b91c1c]' : 'bg-[#dcfce7] text-[#166534]'}`}
          >
            {mutationError ?? statusMessage}
          </div>
        )}

        <div className="bg-white rounded-2xl shadow">
          <ApplicationListScreen
            mode="restaurant"
            applications={applications}
            isLoading={loading}
            error={error}
            onRefresh={refresh}
            onUpdateStatus={handleStatusUpdate}
          />
        </div>
      </div>
    </div>
  );
}

interface GuardedViewProps {
  title: string;
  description: string;
  onBack: () => void;
}

function GuardedView({ title, description, onBack }: GuardedViewProps) {
  return (
    <div className="min-h-screen bg-[#FAF8F4]" style={{ paddingTop: '120px' }}>
      <div className="max-w-3xl mx-auto px-4">
        <div className="bg-white rounded-2xl shadow p-10 text-center">
          <h3 className="text-2xl font-bold mb-4">{title}</h3>
          <p className="text-[#475569] mb-6">{description}</p>
          <button
            onClick={onBack}
            className="px-6 py-3 rounded-xl bg-[#1C1C1C] text-white font-semibold"
          >
            戻る
          </button>
        </div>
      </div>
    </div>
  );
}
