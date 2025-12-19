import React from 'react';
import type { ApplicationStatus, JobApplication } from '@api-client';
import { Pressable, ScrollView, Text, View } from '@ui';

export interface ApplicationListScreenProps {
  applications: JobApplication[];
  mode: 'chef' | 'restaurant';
  isLoading?: boolean;
  error?: string | null;
  onRefresh?: () => void;
  onApplicationSelect?: (applicationId: string) => void;
  onUpdateStatus?: (applicationId: string, status: ApplicationStatus) => void;
}

const STATUS_LABEL: Record<ApplicationStatus, string> = {
  PENDING: '審査中',
  ACCEPTED: '受理済み',
  REJECTED: 'お見送り',
};

const STATUS_COLOR: Record<ApplicationStatus, string> = {
  PENDING: '#fbbf24',
  ACCEPTED: '#10b981',
  REJECTED: '#f97316',
};

export const ApplicationListScreen = React.memo(function ApplicationListScreen({
  applications,
  mode,
  isLoading,
  error,
  onRefresh,
  onApplicationSelect,
  onUpdateStatus,
}: ApplicationListScreenProps) {
  return (
    <ScrollView style={{ width: '100%', padding: 32, boxSizing: 'border-box' }}>
      <View style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text style={{ fontSize: 24, fontWeight: 700 }}>応募一覧</Text>
        {onRefresh && (
          <Pressable
            onPress={onRefresh}
            style={{ padding: '8px 12px', borderRadius: 10, border: '1px solid #e2e8f0' }}
          >
            <Text>最新の状態に更新</Text>
          </Pressable>
        )}
      </View>

      {isLoading && <Text style={{ color: '#475569' }}>応募情報を読み込み中です…</Text>}
      {!isLoading && error && (
        <Text style={{ color: '#b91c1c', marginBottom: 16 }}>応募情報の取得に失敗しました: {error}</Text>
      )}

      {!isLoading && !error && applications.length === 0 && (
        <Text style={{ color: '#475569' }}>まだ応募はありません。</Text>
      )}

      <View style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {applications.map((application) => (
          <View
            key={application.id}
            style={{
              padding: 20,
              borderRadius: 16,
              backgroundColor: '#fff',
              boxShadow: '0 12px 40px rgba(15,23,42,0.08)',
            }}
          >
            <View style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
              <Text style={{ fontSize: 18, fontWeight: 600 }}>
                {mode === 'chef' ? application.job?.title : application.chef?.fullName ?? '応募者'}
              </Text>
              <Text style={{ color: STATUS_COLOR[application.status], fontWeight: 600 }}>
                {STATUS_LABEL[application.status]}
              </Text>
            </View>

            {application.job?.restaurantName && (
              <Text style={{ color: '#475569', display: 'block', marginBottom: 8 }}>
                {application.job.restaurantName}
              </Text>
            )}

            {application.coverLetter && (
              <Text style={{ color: '#475569', display: 'block', marginBottom: 12 }}>
                {application.coverLetter}
              </Text>
            )}

            <View style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
              {onApplicationSelect && (
                <Pressable
                  onPress={() => onApplicationSelect(application.id)}
                  style={{ padding: '8px 14px', borderRadius: 10, border: '1px solid #e2e8f0' }}
                >
                  <Text>詳細を見る</Text>
                </Pressable>
              )}

              {mode === 'restaurant' && onUpdateStatus && application.status === 'PENDING' && (
                <>
                  <Pressable
                    onPress={() => onUpdateStatus(application.id, 'REJECTED')}
                    style={{ padding: '8px 14px', borderRadius: 10, backgroundColor: '#fee2e2' }}
                  >
                    <Text style={{ color: '#b91c1c' }}>お見送り</Text>
                  </Pressable>
                  <Pressable
                    onPress={() => onUpdateStatus(application.id, 'ACCEPTED')}
                    style={{ padding: '8px 14px', borderRadius: 10, backgroundColor: '#d1fae5' }}
                  >
                    <Text style={{ color: '#065f46' }}>採用へ進む</Text>
                  </Pressable>
                </>
              )}
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
});
