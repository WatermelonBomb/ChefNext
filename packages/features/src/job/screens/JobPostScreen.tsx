import React, { useCallback, useMemo, useState } from 'react';
import type { CreateJobParams, JobStatus } from '@api-client';
import { Pressable, ScrollView, Text, TextInput, View } from '@ui';

export interface JobPostScreenProps {
  initialValues?: Partial<CreateJobParams> & { status?: JobStatus };
  onSubmit: (params: CreateJobParams) => Promise<void> | void;
  isSubmitting?: boolean;
  error?: string | null;
}

type FormState = {
  title: string;
  description: string;
  requiredSkillsText: string;
  location: string;
  salaryRange: string;
  employmentType: string;
  metadataText: string;
};

const DEFAULT_FORM: FormState = {
  title: '',
  description: '',
  requiredSkillsText: '',
  location: '',
  salaryRange: '',
  employmentType: '',
  metadataText: '{}',
};

export const JobPostScreen = React.memo(function JobPostScreen({ initialValues, onSubmit, isSubmitting, error }: JobPostScreenProps) {
  const [form, setForm] = useState<FormState>(() => ({
    title: initialValues?.title ?? '',
    description: initialValues?.description ?? '',
    requiredSkillsText: initialValues?.requiredSkills?.join(', ') ?? '',
    location: initialValues?.location ?? '',
    salaryRange: initialValues?.salaryRange ?? '',
    employmentType: initialValues?.employmentType ?? '',
    metadataText: initialValues?.metadata ? JSON.stringify(initialValues.metadata, null, 2) : DEFAULT_FORM.metadataText,
  }));
  const [metadataError, setMetadataError] = useState<string | null>(null);

  const isValid = useMemo(() => form.title.trim().length > 0 && form.description.trim().length > 0, [form]);

  const handleChange = useCallback((key: keyof FormState) => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const value = event.target.value;
    setForm((prev) => ({ ...prev, [key]: value }));
  }, []);

  const handleSubmit = useCallback(async (event: React.FormEvent) => {
    event.preventDefault();
    setMetadataError(null);

    let metadata: Record<string, unknown> | undefined;
    if (form.metadataText.trim()) {
      try {
        metadata = JSON.parse(form.metadataText);
      } catch (parseError) {
        setMetadataError('metadata は JSON 形式で入力してください');
        return;
      }
    }

    const payload: CreateJobParams = {
      title: form.title.trim(),
      description: form.description.trim(),
      requiredSkills: form.requiredSkillsText
        .split(',')
        .map((skill) => skill.trim())
        .filter(Boolean),
      location: form.location.trim() || undefined,
      salaryRange: form.salaryRange.trim() || undefined,
      employmentType: form.employmentType.trim() || undefined,
      status: initialValues?.status,
      metadata,
    };

    await onSubmit(payload);
  }, [form, initialValues, onSubmit]);

  return (
    <form onSubmit={handleSubmit} style={{ width: '100%' }}>
      <ScrollView style={{ padding: 32, boxSizing: 'border-box' }}>
        <Text style={{ fontSize: 24, fontWeight: 700, display: 'block', marginBottom: 24 }}>
          {initialValues ? '求人を編集' : '新しい求人を作成'}
        </Text>

        <Field label="タイトル" required>
          <TextInput
            value={form.title}
            onChange={handleChange('title')}
            placeholder="例: スーシェフ / パン部門リーダー"
            style={inputStyle}
          />
        </Field>

        <Field label="求人概要" required>
          <TextInput
            multiline
            rows={6}
            value={form.description}
            onChange={handleChange('description')}
            placeholder="どんな業務か、どんな成長機会があるかを記入してください"
            style={{ ...inputStyle, minHeight: 160, resize: 'vertical' }}
          />
        </Field>

        <Field label="必要スキル (カンマ区切り)">
          <TextInput
            value={form.requiredSkillsText}
            onChange={handleChange('requiredSkillsText')}
            placeholder="火入れ, 原価管理, フレンチ"
            style={inputStyle}
          />
        </Field>

        <Field label="勤務地">
          <TextInput
            value={form.location}
            onChange={handleChange('location')}
            placeholder="東京都渋谷区..."
            style={inputStyle}
          />
        </Field>

        <Field label="想定報酬">
          <TextInput
            value={form.salaryRange}
            onChange={handleChange('salaryRange')}
            placeholder="例: 月給30〜35万円"
            style={inputStyle}
          />
        </Field>

        <Field label="雇用形態">
          <TextInput
            value={form.employmentType}
            onChange={handleChange('employmentType')}
            placeholder="正社員 / 業務委託 など"
            style={inputStyle}
          />
        </Field>

        <Field label="追加メタデータ (JSON)">
          <TextInput
            multiline
            rows={4}
            value={form.metadataText}
            onChange={handleChange('metadataText')}
            style={{ ...inputStyle, fontFamily: 'monospace', minHeight: 120 }}
          />
          {metadataError && <Text style={{ color: '#b91c1c' }}>{metadataError}</Text>}
        </Field>

        {error && (
          <View style={{ backgroundColor: '#fee2e2', borderRadius: 8, padding: 12, marginBottom: 16 }}>
            <Text style={{ color: '#b91c1c' }}>{error}</Text>
          </View>
        )}

        <Pressable
          type="submit"
          disabled={!isValid || isSubmitting}
          style={{
            padding: '12px 18px',
            borderRadius: 12,
            backgroundColor: !isValid || isSubmitting ? '#cbd5f5' : '#0f172a',
            color: '#fff',
            fontWeight: 600,
            textAlign: 'center',
          }}
        >
          <Text style={{ color: '#fff' }}>{isSubmitting ? '保存中…' : '求人を保存'}</Text>
        </Pressable>
      </ScrollView>
    </form>
  );
});

interface FieldProps {
  label: string;
  children: React.ReactNode;
  required?: boolean;
}

const Field = React.memo(function Field({ label, children, required }: FieldProps) {
  return (
    <View style={{ marginBottom: 20 }}>
      <Text style={{ display: 'block', fontWeight: 600, marginBottom: 8 }}>
        {label}
        {required && <Text style={{ color: '#dc2626', marginLeft: 4 }}>*</Text>}
      </Text>
      {children}
    </View>
  );
});

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '10px 14px',
  borderRadius: 10,
  border: '1px solid #e2e8f0',
  fontSize: 16,
  boxSizing: 'border-box',
};
