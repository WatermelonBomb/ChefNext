import React from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import {
  Building,
  MapPin,
  Utensils,
  Sprout,
  GraduationCap,
  BadgeCheck,
  ClipboardList,
  Images,
  ClipboardCopy,
  ChevronRight
} from 'lucide-react';
import { PageLayout } from '../layouts/PageLayout';
import { Card } from '../common/Card';
import { Button } from '../Button';
import { ImageUploader, UploadedImage } from '../upload/ImageUploader';
import { StoredImagePreview, useProfileContext } from '../../context/ProfileContext';

const CUISINE_OPTIONS = ['フレンチ', 'イタリアン', '和食', '中華', 'パティスリー', 'ベーカリー', 'カフェ', 'エスニック'];
const CULTURE_KEYWORDS = ['丁寧な育成', '創作歓迎', '衛生管理徹底', 'チームワーク', '独立支援', 'オープンキッチン'];
const BENEFIT_OPTIONS = ['独立支援', '海外研修', 'KPIに基づいた育成', '社内シェフ会', '資格取得支援', '短期集中プログラム'];
const SUPPORT_PROGRAMS = ['事業計画サポート', '物件探し支援', '資金調達アドバイス', 'メニュー開発補助'];

interface LearningHighlight {
  id: string;
  title: string;
  duration: string;
  detail: string;
}

interface RestaurantProfileFormValues {
  displayName: string;
  tagline: string;
  location: string;
  seats: number;
  cuisineTypes: string[];
  mentorshipStyle: string;
  description: string;
  cultureKeywords: string[];
  benefits: string[];
  supportPrograms: string[];
  learningHighlights: LearningHighlight[];
}

export function RestaurantProfileEditor() {
  const navigate = useNavigate();
  const [gallery, setGallery] = React.useState<UploadedImage[]>([]);
  const [copied, setCopied] = React.useState(false);
  const [lastSavedAt, setLastSavedAt] = React.useState<string | null>(null);
  const {
    restaurantProfile,
    restaurantLoading,
    saveRestaurantProfile,
    refreshRestaurantProfile,
    error: profileError,
    clearError,
  } = useProfileContext();

  const {
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<RestaurantProfileFormValues>({
    defaultValues: {
      displayName: 'Restaurant L\'atelier',
      tagline: '育成ファーストのモダンビストロ。火入れから経営まで段階的に習得。',
      location: '東京都渋谷区',
      seats: 32,
      cuisineTypes: ['フレンチ', 'カフェ'],
      mentorshipStyle: 'ペアリング制 (若手+シェフ)',
      description: '週1の振り返り面談と、季節メニューを通じた学びの可視化を重視しています。',
      cultureKeywords: ['丁寧な育成', '独立支援', '創作歓迎'],
      benefits: ['独立支援', '海外研修'],
      supportPrograms: ['事業計画サポート', '物件探し支援'],
      learningHighlights: [
        {
          id: 'highlight-1',
          title: '火入れ / ソース週次カリキュラム',
          duration: '3ヶ月',
          detail: '肉・魚での火入れレビューと、1on1でのソースチェックを実施'
        },
        {
          id: 'highlight-2',
          title: '独立準備スタジオ',
          duration: '6ヶ月',
          detail: '原価計算とメニュー設計、開業計画作成まで伴走'
        }
      ]
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'learningHighlights'
  });

  const cuisineTypes = watch('cuisineTypes');
  const cultureKeywords = watch('cultureKeywords');
  const benefits = watch('benefits');
  const supportPrograms = watch('supportPrograms');
  const learningHighlights = watch('learningHighlights');
  const displayName = watch('displayName');
  const location = watch('location');
  const mentorshipStyle = watch('mentorshipStyle');

  React.useEffect(() => {
    if (!restaurantProfile && !restaurantLoading) {
      refreshRestaurantProfile().catch((error) => {
        console.warn('Failed to refresh restaurant profile', error);
      });
    }
  }, [restaurantProfile, restaurantLoading, refreshRestaurantProfile]);

  React.useEffect(() => {
    if (!restaurantProfile) {
      return;
    }

    reset({
      displayName: restaurantProfile.displayName || 'Restaurant L\'atelier',
      tagline: restaurantProfile.tagline || '育成ファーストのモダンビストロ。火入れから経営まで段階的に習得。',
      location: restaurantProfile.location || '東京都渋谷区',
      seats: restaurantProfile.seats || 0,
      cuisineTypes: restaurantProfile.cuisineTypes.length ? restaurantProfile.cuisineTypes : ['フレンチ', 'カフェ'],
      mentorshipStyle: restaurantProfile.mentorshipStyle || 'ペアリング制 (若手+シェフ)',
      description:
        restaurantProfile.description || '週1の振り返り面談と、季節メニューを通じた学びの可視化を重視しています。',
      cultureKeywords: restaurantProfile.cultureKeywords.length
        ? restaurantProfile.cultureKeywords
        : ['丁寧な育成', '独立支援', '創作歓迎'],
      benefits: restaurantProfile.benefits.length ? restaurantProfile.benefits : ['独立支援', '海外研修'],
      supportPrograms: restaurantProfile.supportPrograms.length
        ? restaurantProfile.supportPrograms
        : ['事業計画サポート', '物件探し支援'],
      learningHighlights: restaurantProfile.learningHighlights.length
        ? restaurantProfile.learningHighlights
        : [
          {
            id: 'highlight-1',
            title: '火入れ / ソース週次カリキュラム',
            duration: '3ヶ月',
            detail: '肉・魚での火入れレビューと、1on1でのソースチェックを実施'
          },
          {
            id: 'highlight-2',
            title: '独立準備スタジオ',
            duration: '6ヶ月',
            detail: '原価計算とメニュー設計、開業計画作成まで伴走'
          }
        ],
    });
    setGallery(restaurantProfile.gallery.map(createUploadedImageFromStored));
  }, [restaurantProfile, reset]);

  React.useEffect(() => () => clearError(), [clearError]);

  const toggleMultiSelect = (field: 'cuisineTypes' | 'cultureKeywords' | 'benefits' | 'supportPrograms', value: string) => {
    const current = watch(field);
    if (current.includes(value)) {
      setValue(field, current.filter((item) => item !== value));
    } else {
      setValue(field, [...current, value]);
    }
  };

  const previewJson = React.useMemo(() => {
    return JSON.stringify(
      {
        displayName,
        area: location,
        cuisineTypes,
        mentorshipStyle,
        learningHighlights: learningHighlights.map((item) => ({
          title: item.title,
          duration: item.duration,
          detail: item.detail
        })),
        supportPrograms
      },
      null,
      2
    );
  }, [displayName, location, mentorshipStyle, cuisineTypes, learningHighlights, supportPrograms]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(previewJson);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy profile JSON', error);
    }
  };

  const onSubmit = async (values: RestaurantProfileFormValues) => {
    try {
      const saved = await saveRestaurantProfile({
        ...values,
        gallery: gallery.map((shot) => ({ id: shot.id, preview: shot.dataUrl ?? shot.preview })),
      });
      setLastSavedAt(new Date().toLocaleTimeString());
    } catch (error) {
      console.error('Failed to save restaurant profile', error);
    }
  };

  const isBusy = isSubmitting || restaurantLoading;

  return (
    <PageLayout
      title="レストランプロフィールの作成"
      subtitle="学べることと育成スタイルを明確にすることで、成長意欲の高いシェフからの応募が増えます"
      badge="RESTAURANT PROFILE"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
        {profileError && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {profileError}
          </div>
        )}
        <Card className="space-y-6">
          <div className="flex items-center gap-3">
            <Building className="w-6 h-6 text-[#CDAE58]" />
            <h3>店舗の基本情報</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">店舗名 *</label>
              <input
                {...register('displayName', { required: '店舗名を入力してください' })}
                className="w-full px-4 py-3 rounded-xl border border-[#1C1C1C]/15 focus:outline-none focus:border-[#CDAE58]"
                placeholder="Restaurant L'atelier"
              />
              {errors.displayName && <p className="text-xs text-red-500 mt-1">{errors.displayName.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">タグライン *</label>
              <input
                {...register('tagline', { required: 'タグラインを入力してください' })}
                className="w-full px-4 py-3 rounded-xl border border-[#1C1C1C]/15 focus:outline-none focus:border-[#CDAE58]"
                placeholder="例: 育成ファーストのモダンビストロ"
              />
              {errors.tagline && <p className="text-xs text-red-500 mt-1">{errors.tagline.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">所在地 *</label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-[#CDAE58] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  {...register('location', { required: '所在地を入力してください' })}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#1C1C1C]/15 focus:border-[#CDAE58] focus:outline-none"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">客席数</label>
              <input
                type="number"
                {...register('seats', { valueAsNumber: true })}
                className="w-full px-4 py-3 rounded-xl border border-[#1C1C1C]/15 focus:border-[#CDAE58] focus:outline-none"
                placeholder="32"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">紹介文 *</label>
              <input
                {...register('description', { required: '紹介文を入力してください' })}
                className="w-full px-4 py-3 rounded-xl border border-[#1C1C1C]/15 focus:border-[#CDAE58] focus:outline-none"
                placeholder="育成のこだわりやカルチャーなど"
              />
            </div>
          </div>
        </Card>

        <Card className="space-y-6">
          <div className="flex items-center gap-3">
            <Utensils className="w-6 h-6 text-[#CDAE58]" />
            <h3>料理ジャンルとカルチャー</h3>
          </div>

          <div>
            <p className="text-sm text-[#1C1C1C]/60 mb-2">提供ジャンル *</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {CUISINE_OPTIONS.map((cuisine) => (
                <button
                  key={cuisine}
                  type="button"
                  onClick={() => toggleMultiSelect('cuisineTypes', cuisine)}
                  className={`p-3 rounded-xl border transition-colors ${cuisineTypes.includes(cuisine)
                      ? 'border-[#CDAE58] bg-[#CDAE58]/10'
                      : 'border-[#1C1C1C]/15 hover:border-[#CDAE58]/30'
                    }`}
                >
                  {cuisine}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-sm text-[#1C1C1C]/60 mb-2">カルチャー・働く環境</p>
            <div className="flex flex-wrap gap-2">
              {CULTURE_KEYWORDS.map((keyword) => (
                <button
                  key={keyword}
                  type="button"
                  onClick={() => toggleMultiSelect('cultureKeywords', keyword)}
                  className={`px-4 py-2 rounded-full border text-sm transition-colors ${cultureKeywords.includes(keyword)
                      ? 'border-[#8BA497] bg-[#8BA497]/10 text-[#1C1C1C]'
                      : 'border-[#1C1C1C]/15 text-[#1C1C1C]/70 hover:border-[#8BA497]/40'
                    }`}
                >
                  {keyword}
                </button>
              ))}
            </div>
          </div>
        </Card>

        <Card className="space-y-6">
          <div className="flex items-center gap-3">
            <Sprout className="w-6 h-6 text-[#CDAE58]" />
            <h3>育成スタイルと学べること</h3>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">メンタリングスタイル *</label>
            <input
              {...register('mentorshipStyle', { required: '育成スタイルを入力してください' })}
              className="w-full px-4 py-3 rounded-xl border border-[#1C1C1C]/15 focus:outline-none focus:border-[#CDAE58]"
              placeholder="例: ペアリング制 / 週次レビューフィードバック"
            />
            {errors.mentorshipStyle && <p className="text-xs text-red-500 mt-1">{errors.mentorshipStyle.message}</p>}
          </div>

          <div className="space-y-4">
            {fields.map((field, index) => (
              <motion.div key={field.id} layout className="bg-[#FAF8F4] border border-[#CDAE58]/20 rounded-2xl p-4">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-2 font-medium">
                    <GraduationCap className="w-4 h-4 text-[#CDAE58]" />
                    学びのハイライト {index + 1}
                  </div>
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="text-sm text-[#1C1C1C]/60 hover:text-red-500"
                  >
                    削除
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold mb-2">テーマ</label>
                    <input
                      {...register(`learningHighlights.${index}.title` as const, { required: true })}
                      className="w-full px-3 py-2 rounded-xl border border-[#1C1C1C]/15 focus:border-[#CDAE58] focus:outline-none"
                      placeholder="例: 火入れ集中レーン"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-2">期間</label>
                    <input
                      {...register(`learningHighlights.${index}.duration` as const)}
                      className="w-full px-3 py-2 rounded-xl border border-[#1C1C1C]/15 focus:border-[#CDAE58] focus:outline-none"
                      placeholder="例: 3ヶ月"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-2">詳細</label>
                    <input
                      {...register(`learningHighlights.${index}.detail` as const)}
                      className="w-full px-3 py-2 rounded-xl border border-[#1C1C1C]/15 focus:border-[#CDAE58] focus:outline-none"
                      placeholder="例: 週1レビューとレシピ開発"
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <Button
            type="button"
            variant="secondary"
            onClick={() => append({ id: `highlight-${Date.now()}`, title: '新しいプログラム', duration: '', detail: '' })}
          >
            ハイライトを追加
          </Button>
        </Card>

        <Card className="space-y-6">
          <div className="flex items-center gap-3">
            <BadgeCheck className="w-6 h-6 text-[#CDAE58]" />
            <h3>支援内容と制度</h3>
          </div>

          <div>
            <p className="text-sm text-[#1C1C1C]/60 mb-2">福利厚生 / 特典</p>
            <div className="flex flex-wrap gap-2">
              {BENEFIT_OPTIONS.map((benefit) => (
                <button
                  key={benefit}
                  type="button"
                  onClick={() => toggleMultiSelect('benefits', benefit)}
                  className={`px-4 py-2 rounded-full border text-sm transition-colors ${benefits.includes(benefit)
                      ? 'border-[#CDAE58] bg-[#CDAE58]/10 text-[#1C1C1C]'
                      : 'border-[#1C1C1C]/15 text-[#1C1C1C]/70 hover:border-[#CDAE58]/40'
                    }`}
                >
                  {benefit}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-sm text-[#1C1C1C]/60 mb-2">独立・キャリア支援プログラム</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {SUPPORT_PROGRAMS.map((program) => (
                <button
                  key={program}
                  type="button"
                  onClick={() => toggleMultiSelect('supportPrograms', program)}
                  className={`p-3 rounded-xl border text-left transition-colors ${supportPrograms.includes(program)
                      ? 'border-[#8BA497] bg-[#8BA497]/10'
                      : 'border-[#1C1C1C]/15 hover:border-[#8BA497]/40'
                    }`}
                >
                  {program}
                </button>
              ))}
            </div>
          </div>
        </Card>

        <Card className="space-y-6">
          <div className="flex items-center gap-3">
            <ClipboardList className="w-6 h-6 text-[#CDAE58]" />
            <h3>プロフィールJSONプレビュー</h3>
          </div>
          <pre className="bg-[#1C1C1C] text-[#F2E6B6] p-6 rounded-2xl text-sm overflow-auto max-h-80">
            {previewJson}
          </pre>
          <Button type="button" variant="ghost" onClick={handleCopy}>
            {copied ? 'コピーしました' : 'JSONをコピー'}
            <ClipboardCopy className="w-4 h-4" />
          </Button>
        </Card>

        <Card className="space-y-6">
          <div className="flex items-center gap-3">
            <Images className="w-6 h-6 text-[#CDAE58]" />
            <h3>キッチン・指導風景のギャラリー</h3>
          </div>
          <ImageUploader maxImages={8} onImagesUploaded={setGallery} />
        </Card>

        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <Button type="button" variant="ghost" onClick={() => navigate('/restaurant/profile')} disabled={isBusy}>
            ← 戻る
          </Button>
          <div className="flex items-center gap-4">
            {lastSavedAt && <span className="text-sm text-[#1C1C1C]/60">{lastSavedAt} に保存済み</span>}
            <Button type="submit" variant="primary" size="lg" disabled={isBusy}>
              {isBusy ? '保存中...' : (
                <span className="flex items-center gap-2">
                  プロフィールを保存
                  <ChevronRight className="w-4 h-4" />
                </span>
              )}
            </Button>
          </div>
        </div>
      </form>
    </PageLayout>
  );
}

function createUploadedImageFromStored(item: StoredImagePreview): UploadedImage {
  return {
    id: item.id,
    preview: item.preview,
    status: 'success',
    progress: 100,
  };
}
