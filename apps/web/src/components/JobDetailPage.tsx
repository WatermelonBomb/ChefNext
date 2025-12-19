import React, { useMemo, useState } from 'react';
import { JobDetailScreen, useJobDetail, useJobMutations } from '@features/job';
import { useAuth } from '../hooks/useAuth';
import { jobClient } from '../lib/apiClient';

interface JobDetailPageProps {
  jobId?: string | null;
  onBack: () => void;
}

export function JobDetailPage({ jobId, onBack }: JobDetailPageProps) {
  const { tokens, isAuthenticated, user } = useAuth();
  const { data: job, loading, error } = useJobDetail({ client: jobClient, jobId: jobId ?? undefined, accessToken: tokens?.accessToken });
  const [infoMessage, setInfoMessage] = useState<string | null>(null);
  const [localError, setLocalError] = useState<string | null>(null);
  const { createApplication, loading: isApplying, error: mutationError } = useJobMutations({
    client: jobClient,
    accessToken: tokens?.accessToken ?? '',
  });

  const canApply = useMemo(() => isAuthenticated && user?.role === 'CHEF' && Boolean(jobId), [isAuthenticated, user, jobId]);

  if (!jobId) {
    return (
      <PlaceholderCard title="求人が選択されていません" onBack={onBack}>
        求人一覧から閲覧したい案件を選択してください。
      </PlaceholderCard>
    );
  }

  if (loading) {
    return (
      <PlaceholderCard title="求人を読み込み中" onBack={onBack}>
        少々お待ちください…
      </PlaceholderCard>
    );
  }

  if (error || !job) {
    return (
      <PlaceholderCard title="求人の取得に失敗しました" onBack={onBack}>
        {error ?? '該当する求人が見つかりませんでした。'}
      </PlaceholderCard>
    );
  }

  const handleApply = async () => {
    setLocalError(null);
    setInfoMessage(null);

    if (!tokens?.accessToken) {
      setLocalError('応募するにはログインが必要です');
      return;
    }

    const result = await createApplication({ jobId });
    if (result) {
      setInfoMessage('応募が完了しました。応募一覧から進捗を確認できます。');
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F4]" style={{ paddingTop: '120px' }}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {(localError || mutationError || infoMessage) && (
          <div className="mb-6 p-4 rounded-xl" style={{ backgroundColor: infoMessage ? '#ecfccb' : '#fee2e2' }}>
            <p className="text-sm text-[#1C1C1C]">{infoMessage ?? localError ?? mutationError}</p>
          </div>
        )}
        <JobDetailScreen
          job={job}
          onBack={onBack}
          onApply={canApply ? handleApply : undefined}
          isApplying={isApplying}
        />
        {!canApply && (
          <p className="mt-6 text-center text-sm text-[#94a3b8]">
            応募ボタンはシェフアカウントのみ表示されます。ログイン済みの状態でご確認ください。
          </p>
        )}
      </div>
    </div>
  );
}

function PlaceholderCard({ title, children, onBack }: { title: string; children: React.ReactNode; onBack: () => void }) {
  return (
    <div className="min-h-screen bg-[#FAF8F4]" style={{ paddingTop: '120px' }}>
      <div className="max-w-3xl mx-auto px-4">
        <div className="bg-white rounded-2xl shadow p-10" style={{ textAlign: 'center' }}>
          <h3 className="text-2xl font-bold mb-4">{title}</h3>
          <p className="text-[#475569] mb-6">{children}</p>
          <button
            onClick={onBack}
            className="px-6 py-3 rounded-xl bg-[#1C1C1C] text-white font-semibold"
          >
            求人一覧に戻る
          </button>
        </div>
      </div>
    </div>
  );
}
