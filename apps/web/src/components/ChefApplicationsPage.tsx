import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ApplicationListScreen, useJobApplications } from '@features/job';
import { useAuth } from '../hooks/useAuth';
import { jobClient } from '../lib/apiClient';

export function ChefApplicationsPage() {
  const navigate = useNavigate();
  const { tokens, isAuthenticated, user } = useAuth();
  const accessToken = tokens?.accessToken;

  const handleBack = () => navigate('/jobs');

  if (!isAuthenticated || user?.role !== 'CHEF' || !accessToken) {
    return (
      <GuardedView
        title="応募一覧を表示できません"
        description="シェフアカウントでログインすると応募履歴を確認できます。"
        onBack={handleBack}
      />
    );
  }

  const { applications, loading, error, refresh } = useJobApplications({
    client: jobClient,
    scope: 'chef',
    accessToken,
    limit: 20,
  });

  return (
    <div className="min-h-screen bg-[#FAF8F4]" style={{ paddingTop: '120px' }}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="mb-8">
          <p className="text-sm uppercase tracking-widest text-[#CDAE58]">APPLICATIONS</p>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">応募状況</h1>
              <p className="text-[#475569]">応募した求人の進捗をリアルタイムで確認できます。</p>
            </div>
            <button
              onClick={handleBack}
              className="px-5 py-3 rounded-xl border border-[#e2e8f0] text-[#1C1C1C] font-semibold hover:border-[#CDAE58]"
            >
              求人一覧に戻る
            </button>
          </div>
        </header>

        <div className="bg-white rounded-2xl shadow">
          <ApplicationListScreen
            mode="chef"
            applications={applications}
            isLoading={loading}
            error={error}
            onRefresh={refresh}
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
