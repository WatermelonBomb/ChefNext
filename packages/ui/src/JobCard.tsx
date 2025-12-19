import React from 'react';
import type { JobStatus } from '@api-client';
import { Pressable, Text, View, type StyleProp, type ViewStyle } from './primitives';

export interface JobCardProps {
  title: string;
  restaurantName?: string;
  location?: string;
  requiredSkills?: string[];
  salaryRange?: string;
  employmentType?: string;
  status?: JobStatus;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
}

const STATUS_COLOR: Record<JobStatus, string> = {
  DRAFT: '#a1a1aa',
  PUBLISHED: '#047857',
  CLOSED: '#b45309',
};

const STATUS_LABEL: Record<JobStatus, string> = {
  DRAFT: '下書き',
  PUBLISHED: '募集中',
  CLOSED: 'クローズ',
};

const styles = {
  card: {
    width: '100%' as const,
    borderRadius: 16,
    padding: 16,
    backgroundColor: '#fff',
    boxShadow: '0 8px 30px rgba(0,0,0,0.06)',
    textAlign: 'left' as const,
  },
  header: {
    marginBottom: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: 600 as const,
  },
  title: {
    display: 'block' as const,
    fontSize: 18,
    fontWeight: 700 as const,
    color: '#0f172a',
  },
  restaurantName: {
    display: 'block' as const,
    color: '#475569',
    marginTop: 4,
  },
  location: {
    display: 'block' as const,
    color: '#64748b',
    marginTop: 2,
  },
  skillsContainer: {
    flexDirection: 'row' as const,
    flexWrap: 'wrap' as const,
    gap: 8,
    marginBottom: 12,
  },
  skillBadge: {
    padding: '4px 10px',
    borderRadius: 999,
    fontSize: 12,
    backgroundColor: '#f1f5f9',
    color: '#0f172a',
  },
  detailsContainer: {
    display: 'flex' as const,
    flexDirection: 'column' as const,
    gap: 6,
  },
  detailText: {
    color: '#0f172a',
    fontWeight: 600 as const,
  },
};

export const JobCard = React.memo(function JobCard({
  title,
  restaurantName,
  location,
  requiredSkills = [],
  salaryRange,
  employmentType,
  status = 'PUBLISHED',
  onPress,
  style,
}: JobCardProps) {
  return (
    <Pressable onPress={onPress} style={[styles.card, style]}>
      <View style={styles.header}>
        <Text style={{ ...styles.statusText, color: STATUS_COLOR[status] }}>
          {STATUS_LABEL[status]}
        </Text>
        <Text style={styles.title}>{title}</Text>
        {restaurantName && <Text style={styles.restaurantName}>{restaurantName}</Text>}
        {location && <Text style={styles.location}>{location}</Text>}
      </View>

      {requiredSkills.length > 0 && (
        <View style={styles.skillsContainer}>
          {requiredSkills.slice(0, 4).map((skill) => (
            <Text key={skill} style={styles.skillBadge}>
              {skill}
            </Text>
          ))}
          {requiredSkills.length > 4 && (
            <Text style={{ fontSize: 12, color: '#475569' }}>+{requiredSkills.length - 4}</Text>
          )}
        </View>
      )}

      <View style={styles.detailsContainer}>
        {salaryRange && <Text style={styles.detailText}>報酬: {salaryRange}</Text>}
        {employmentType && <Text style={styles.detailText}>雇用形態: {employmentType}</Text>}
      </View>
    </Pressable>
  );
});
