import React from 'react';
import type { Job } from '@api-client';
import { JobCard, Pressable, ScrollView, Text, View } from '@ui';

export interface JobListScreenProps {
  jobs: Job[];
  isLoading?: boolean;
  error?: string | null;
  title?: string;
  subtitle?: string;
  emptyMessage?: string;
  onJobSelect?: (jobId: string) => void;
  onRetry?: () => void;
  onCreateJob?: () => void;
}

export const JobListScreen = React.memo(function JobListScreen({
  jobs,
  isLoading,
  error,
  title = '求人を探す',
  subtitle,
  emptyMessage = '現在表示できる求人がありません。条件を変えて再検索してください。',
  onJobSelect,
  onRetry,
  onCreateJob,
}: JobListScreenProps) {
  return (
    <ScrollView style={{ width: '100%', padding: 32, boxSizing: 'border-box' }}>
      <View style={{ marginBottom: 24 }}>
        <Text style={{ fontSize: 24, fontWeight: 700, display: 'block', marginBottom: 4 }}>{title}</Text>
        {subtitle && <Text style={{ color: '#475569' }}>{subtitle}</Text>}
      </View>

      {onCreateJob && (
        <Pressable
          onPress={onCreateJob}
          style={{
            marginBottom: 24,
            padding: '10px 16px',
            borderRadius: 999,
            backgroundColor: '#0f172a',
            color: '#fff',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <Text style={{ color: '#fff', fontWeight: 600 }}>+ 新しい求人を作成</Text>
        </Pressable>
      )}

      {isLoading && (
        <Text style={{ color: '#475569' }}>求人を読み込み中です…</Text>
      )}

      {!isLoading && error && (
        <View style={{ backgroundColor: '#fee2e2', borderRadius: 12, padding: 16, marginBottom: 16 }}>
          <Text style={{ color: '#b91c1c', fontWeight: 600 }}>読み込みに失敗しました</Text>
          <Text style={{ color: '#b91c1c', display: 'block', marginTop: 4 }}>{error}</Text>
          {onRetry && (
            <Pressable
              onPress={onRetry}
              style={{ marginTop: 12, padding: '8px 12px', borderRadius: 8, backgroundColor: '#b91c1c', color: '#fff' }}
            >
              <Text style={{ color: '#fff' }}>再試行</Text>
            </Pressable>
          )}
        </View>
      )}

      {!isLoading && !error && jobs.length === 0 && (
        <View style={{ padding: 32, borderRadius: 16, backgroundColor: '#f8fafc', textAlign: 'center' }}>
          <Text style={{ color: '#475569' }}>{emptyMessage}</Text>
        </View>
      )}

      <View style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
        {jobs.map((job) => (
          <JobCard
            key={job.id}
            title={job.title}
            restaurantName={job.restaurantName}
            location={job.location ?? job.restaurantLocation}
            requiredSkills={job.requiredSkills}
            salaryRange={job.salaryRange}
            employmentType={job.employmentType}
            status={job.status}
            onPress={onJobSelect ? () => onJobSelect(job.id) : undefined}
          />
        ))}
      </View>
    </ScrollView>
  );
});
