import React from 'react';
import type { Job } from '@api-client';
import { Pressable, ScrollView, Text, View } from '@ui';

export interface JobDetailScreenProps {
  job: Job;
  onBack?: () => void;
  onApply?: () => void;
  isApplying?: boolean;
}

export const JobDetailScreen = React.memo(function JobDetailScreen({ job, onBack, onApply, isApplying }: JobDetailScreenProps) {
  return (
    <ScrollView style={{ width: '100%', padding: 32, boxSizing: 'border-box' }}>
      <View style={{ marginBottom: 24 }}>
        <Text style={{ fontSize: 12, fontWeight: 600, color: '#0f172a' }}>{job.status}</Text>
        <Text style={{ fontSize: 28, fontWeight: 700, display: 'block', margin: '8px 0' }}>{job.title}</Text>
        <Text style={{ color: '#475569' }}>{job.restaurantName}</Text>
        {job.location && <Text style={{ color: '#94a3b8' }}>{job.location}</Text>}
      </View>

      <View style={{ marginBottom: 24 }}>
        <Text style={{ display: 'block', fontWeight: 600, marginBottom: 8 }}>求めるスキル</Text>
        <View style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {job.requiredSkills.map((skill) => (
            <Text
              key={skill}
              style={{
                padding: '6px 12px',
                borderRadius: 999,
                backgroundColor: '#f1f5f9',
              }}
            >
              {skill}
            </Text>
          ))}
        </View>
      </View>

      <View style={{ marginBottom: 24 }}>
        <Text style={{ display: 'block', fontWeight: 600, marginBottom: 8 }}>仕事内容</Text>
        <Text style={{ color: '#475569', lineHeight: 1.6 }}>{job.description}</Text>
      </View>

      <View style={{ display: 'flex', gap: 16, marginBottom: 32 }}>
        {job.salaryRange && (
          <View style={{
            flex: 1,
            backgroundColor: '#f8fafc',
            padding: 16,
            borderRadius: 12,
          }}>
            <Text style={{ fontSize: 12, color: '#94a3b8' }}>報酬</Text>
            <Text style={{ fontWeight: 600, fontSize: 18 }}>{job.salaryRange}</Text>
          </View>
        )}
        {job.employmentType && (
          <View style={{
            flex: 1,
            backgroundColor: '#f8fafc',
            padding: 16,
            borderRadius: 12,
          }}>
            <Text style={{ fontSize: 12, color: '#94a3b8' }}>雇用形態</Text>
            <Text style={{ fontWeight: 600, fontSize: 18 }}>{job.employmentType}</Text>
          </View>
        )}
      </View>

      <View style={{ display: 'flex', flexDirection: 'row', gap: 12 }}>
        {onBack && (
          <Pressable
            onPress={onBack}
            style={{
              flex: 1,
              padding: '12px 16px',
              borderRadius: 12,
              border: '1px solid #e2e8f0',
              textAlign: 'center',
            }}
          >
            <Text style={{ color: '#0f172a' }}>戻る</Text>
          </Pressable>
        )}
        {onApply && (
          <Pressable
            disabled={isApplying}
            onPress={onApply}
            style={{
              flex: 2,
              padding: '12px 16px',
              borderRadius: 12,
              backgroundColor: isApplying ? '#94a3b8' : '#0f172a',
              textAlign: 'center',
              color: '#fff',
            }}
          >
            <Text style={{ color: '#fff', fontWeight: 600 }}>{isApplying ? '応募処理中…' : 'この求人に応募する'}</Text>
          </Pressable>
        )}
      </View>
    </ScrollView>
  );
});
