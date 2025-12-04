import React from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { motion } from 'motion/react';
import {
  MapPin,
  Sparkles,
  Flame,
  Languages,
  PlusCircle,
  Images,
  Target,
  ClipboardCheck,
  ClipboardList,
  ChevronRight,
  Star
} from 'lucide-react';
import { PageLayout } from '../layouts/PageLayout';
import { Card } from '../common/Card';
import { Button } from '../Button';
import { Tag } from '../Tag';
import { ImageUploader, UploadedImage } from '../upload/ImageUploader';
import { StoredImagePreview, useProfileContext } from '../../context/ProfileContext';

const SPECIALTIES = ['フレンチ', 'イタリアン', '和食', 'パティスリー', 'カフェ', '発酵', 'ビストロ', '和洋折衷'];
const LANGUAGES = ['日本語', '英語', 'フランス語', 'スペイン語', '中国語'];
const GOALS = ['ミシュラン獲得', '海外修行', '独立準備', '管理職スキル', 'デザート強化'];

interface ChefSkillInput {
  id: string;
  skill: string;
  level: number;
  focus: string;
}

interface ChefProfileFormValues {
  fullName: string;
  headline: string;
  summary: string;
  location: string;
  yearsExperience: number;
  availability: string;
  specialties: string[];
  workAreas: string[];
  languages: string[];
  bio: string;
  learningFocus: string[];
  skillTree: ChefSkillInput[];
}

interface ChefProfileEditorProps {
  onBack: () => void;
  onSaved?: () => void;
}

export function ChefProfileEditor({ onBack, onSaved }: ChefProfileEditorProps) {
  const [workAreaInput, setWorkAreaInput] = React.useState('');
  const [portfolioShots, setPortfolioShots] = React.useState<UploadedImage[]>([]);
  const [copied, setCopied] = React.useState(false);
  const [lastSavedAt, setLastSavedAt] = React.useState<string | null>(null);
  const {
    chefProfile,
    chefLoading,
    saveChefProfile,
    refreshChefProfile,
    error: profileError,
    clearError,
  } = useProfileContext();

  const {
    handleSubmit,
    register,
    control,
    setValue,
    watch,
    trigger,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<ChefProfileFormValues>({
    defaultValues: {
      fullName: '田中 健太',
      headline: '素材と火入れで勝負するスーシェフ',
      summary: '火入れとソースを軸に、学び続ける28歳。次の現場ではマネジメントを磨きたい。',
      location: '東京都 / 関東圏',
      yearsExperience: 5,
      availability: '1ヶ月以内',
      specialties: ['フレンチ', 'パティスリー'],
      workAreas: ['港区', '渋谷区'],
      languages: ['日本語'],
      bio: 'クラシックフレンチから発酵を取り入れたモダン料理まで経験。火入れ・ソースを徹底的に鍛え、次はチームマネジメントと独立準備を進めたい。',
      learningFocus: ['独立準備', '管理職スキル'],
      skillTree: [
        { id: 'skill-1', skill: '火入れ', level: 4, focus: 'それぞれの部位ごとの火入れ最適化' },
        { id: 'skill-2', skill: 'ソース', level: 3, focus: 'バターソースと現代的な軽さの両立' },
        { id: 'skill-3', skill: 'チームマネジメント', level: 2, focus: '3-4名チームのリーダー経験' }
      ]
    }
  });

  const { fields: skillFields, append: appendSkill, remove: removeSkill } = useFieldArray({
    control,
    name: 'skillTree'
  });

  const selectedSpecialties = watch('specialties');
  const selectedLanguages = watch('languages');
  const selectedGoals = watch('learningFocus');
  const workAreas = watch('workAreas');
  const skillTree = watch('skillTree');

  React.useEffect(() => {
    if (!chefProfile && !chefLoading) {
      refreshChefProfile().catch((error) => {
        console.warn('Failed to refresh chef profile', error);
      });
    }
  }, [chefProfile, chefLoading, refreshChefProfile]);

  React.useEffect(() => {
    if (!chefProfile) {
      return;
    }

    reset({
      fullName: chefProfile.fullName || '田中 健太',
      headline: chefProfile.headline || '素材と火入れで勝負するスーシェフ',
      summary: chefProfile.summary || '火入れとソースを軸に、学び続ける28歳。次の現場ではマネジメントを磨きたい。',
      location: chefProfile.location || '東京都 / 関東圏',
      yearsExperience: chefProfile.yearsExperience || 0,
      availability: chefProfile.availability || '1ヶ月以内',
      specialties: chefProfile.specialties.length ? chefProfile.specialties : ['フレンチ', 'パティスリー'],
      workAreas: chefProfile.workAreas.length ? chefProfile.workAreas : ['港区', '渋谷区'],
      languages: chefProfile.languages.length ? chefProfile.languages : ['日本語'],
      bio: chefProfile.bio || 'クラシックフレンチから発酵を取り入れたモダン料理まで経験。火入れ・ソースを徹底的に鍛え、次はチームマネジメントと独立準備を進めたい。',
      learningFocus: chefProfile.learningFocus.length ? chefProfile.learningFocus : ['独立準備', '管理職スキル'],
      skillTree: chefProfile.skillTree.length
        ? chefProfile.skillTree
        : [
            { id: 'skill-1', skill: '火入れ', level: 4, focus: 'それぞれの部位ごとの火入れ最適化' },
            { id: 'skill-2', skill: 'ソース', level: 3, focus: 'バターソースと現代的な軽さの両立' },
            { id: 'skill-3', skill: 'チームマネジメント', level: 2, focus: '3-4名チームのリーダー経験' }
          ],
    });
    setPortfolioShots(chefProfile.portfolio.map(createUploadedImageFromStored));
  }, [chefProfile, reset]);

  React.useEffect(() => () => clearError(), [clearError]);

  React.useEffect(() => {
    register('specialties', {
      validate: (value) => (value && value.length > 0) || '少なくとも1つ選択してください'
    });
  }, [register]);

  React.useEffect(() => {
    trigger('specialties');
  }, [selectedSpecialties, trigger]);

  const toggleChip = (field: 'specialties' | 'languages' | 'learningFocus', value: string) => {
    const current = watch(field);
    if (current.includes(value)) {
      setValue(field, current.filter((item) => item !== value));
    } else {
      setValue(field, [...current, value]);
    }
  };

  const addWorkArea = () => {
    const trimmed = workAreaInput.trim();
    if (!trimmed) return;
    if (workAreas.includes(trimmed)) {
      setWorkAreaInput('');
      return;
    }
    setValue('workAreas', [...workAreas, trimmed]);
    setWorkAreaInput('');
  };

  const removeWorkArea = (area: string) => {
    setValue('workAreas', workAreas.filter((item) => item !== area));
  };

  const skillTreeJson = React.useMemo(() => {
    return JSON.stringify(
      {
        nodes: skillTree.map((node) => ({
          id: node.id,
          label: node.skill,
          level: node.level,
          focus: node.focus
        }))
      },
      null,
      2
    );
  }, [skillTree]);

  const handleCopySkillTree = async () => {
    try {
      await navigator.clipboard.writeText(skillTreeJson);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy skill tree JSON', error);
    }
  };

  const onSubmit = async (values: ChefProfileFormValues) => {
    try {
      const saved = await saveChefProfile({
        fullName: values.fullName,
        headline: values.headline,
        summary: values.summary,
        location: values.location,
        yearsExperience: values.yearsExperience,
        availability: values.availability,
        specialties: values.specialties,
        workAreas: values.workAreas,
        languages: values.languages,
        bio: values.bio,
        learningFocus: values.learningFocus,
        skillTree: values.skillTree,
        skillTreeJson,
        portfolio: portfolioShots.map((shot) => ({ id: shot.id, preview: shot.dataUrl ?? shot.preview })),
      });

      setPortfolioShots(saved.portfolio.map(createUploadedImageFromStored));
      setLastSavedAt(new Date().toLocaleTimeString());
      onSaved?.();
    } catch (error) {
      console.error('Failed to save chef profile', error);
    }
  };

  const isBusy = isSubmitting || chefLoading;

  return (
    <PageLayout
      title="シェフプロフィールの作成"
      subtitle="スキルと学びたいことを明確にすることで、育成型の求人からスカウトを受けやすくなります"
      badge="CHEF PROFILE"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
        {profileError && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {profileError}
          </div>
        )}
        <Card className="space-y-6">
          <div className="flex items-center gap-3">
            <Sparkles className="w-6 h-6 text-[#CDAE58]" />
            <h3>基本情報</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">氏名 *</label>
              <input
                {...register('fullName', { required: '氏名を入力してください' })}
                className="w-full px-4 py-3 rounded-xl border border-[#1C1C1C]/15 focus:border-[#CDAE58] focus:outline-none"
                placeholder="例: 田中 健太"
              />
              {errors.fullName && <p className="text-xs text-red-500 mt-1">{errors.fullName.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">キャッチコピー *</label>
              <input
                {...register('headline', { required: 'キャッチコピーを入力してください' })}
                className="w-full px-4 py-3 rounded-xl border border-[#1C1C1C]/15 focus:border-[#CDAE58] focus:outline-none"
                placeholder="例: 火入れとソースに強いスーシェフ"
              />
              {errors.headline && <p className="text-xs text-red-500 mt-1">{errors.headline.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">希望エリア *</label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-[#CDAE58] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  {...register('location', { required: '希望エリアを入力してください' })}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#1C1C1C]/15 focus:border-[#CDAE58] focus:outline-none"
                  placeholder="例: 東京都 / 関東圏"
                />
              </div>
              {errors.location && <p className="text-xs text-red-500 mt-1">{errors.location.message}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">プロフィール概要 *</label>
            <textarea
              {...register('summary', { required: '概要を入力してください', minLength: 10 })}
              rows={3}
              className="w-full px-4 py-3 rounded-xl border border-[#1C1C1C]/15 focus:border-[#CDAE58] focus:outline-none"
              placeholder="どのような現場で、何を学びたいかを記載します"
            />
            {errors.summary && <p className="text-xs text-red-500 mt-1">{errors.summary.message}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">経験年数 *</label>
              <input
                type="number"
                {...register('yearsExperience', {
                  required: '経験年数を入力してください',
                  valueAsNumber: true,
                  min: { value: 0, message: '0以上を入力してください' }
                })}
                className="w-full px-4 py-3 rounded-xl border border-[#1C1C1C]/15 focus:border-[#CDAE58] focus:outline-none"
                placeholder="5"
              />
              {errors.yearsExperience && <p className="text-xs text-red-500 mt-1">{errors.yearsExperience.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">出勤可能時期 *</label>
              <input
                {...register('availability', { required: '出勤可能時期を入力してください' })}
                className="w-full px-4 py-3 rounded-xl border border-[#1C1C1C]/15 focus:border-[#CDAE58] focus:outline-none"
                placeholder="1ヶ月以内"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">対応言語</label>
              <div className="flex flex-wrap gap-2">
                {LANGUAGES.map((language) => (
                  <button
                    key={language}
                    type="button"
                    onClick={() => toggleChip('languages', language)}
                    className={`px-4 py-2 rounded-xl border text-sm transition-colors ${
                      selectedLanguages.includes(language)
                        ? 'border-[#CDAE58] bg-[#CDAE58]/10 text-[#1C1C1C]'
                        : 'border-[#1C1C1C]/15 text-[#1C1C1C]/70 hover:border-[#CDAE58]/40'
                    }`}
                  >
                    <Languages className="w-4 h-4 inline mr-1" />
                    {language}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </Card>

        <Card className="space-y-6">
          <div className="flex items-center gap-3">
            <Flame className="w-6 h-6 text-[#CDAE58]" />
            <h3>得意ジャンルと活動エリア</h3>
          </div>

          <div>
            <p className="text-sm text-[#1C1C1C]/60 mb-3">得意な料理ジャンル *</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {SPECIALTIES.map((specialty) => (
                <button
                  key={specialty}
                  type="button"
                  onClick={() => toggleChip('specialties', specialty)}
                  className={`p-3 rounded-xl border transition-all ${
                    selectedSpecialties.includes(specialty)
                      ? 'border-[#CDAE58] bg-[#CDAE58]/10'
                      : 'border-[#1C1C1C]/15 hover:border-[#CDAE58]/40'
                  }`}
                >
                  <span className="font-medium">{specialty}</span>
                </button>
              ))}
            </div>
            {errors.specialties && <p className="text-xs text-red-500 mt-1">{errors.specialties.message}</p>}
          </div>

          <div>
            <p className="text-sm text-[#1C1C1C]/60 mb-2">勤務可能エリア</p>
            <div className="flex gap-3">
              <input
                value={workAreaInput}
                onChange={(e) => setWorkAreaInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addWorkArea();
                  }
                }}
                className="flex-1 px-4 py-3 rounded-xl border border-[#1C1C1C]/15 focus:border-[#CDAE58] focus:outline-none"
                placeholder="例: 新宿区"
              />
              <Button type="button" variant="secondary" size="sm" onClick={addWorkArea}>
                追加
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-3">
              {workAreas.map((area) => (
                <Tag key={area} label={area} variant="skill" onRemove={() => removeWorkArea(area)} />
              ))}
            </div>
          </div>
        </Card>

        <Card className="space-y-6">
          <div className="flex items-center gap-3">
            <Target className="w-6 h-6 text-[#CDAE58]" />
            <h3>学びたいこと / キャリア目標</h3>
          </div>

          <p className="text-sm text-[#1C1C1C]/60">複数選択可</p>
          <div className="flex flex-wrap gap-3">
            {GOALS.map((goal) => (
              <button
                key={goal}
                type="button"
                onClick={() => toggleChip('learningFocus', goal)}
                className={`px-4 py-2 rounded-full border text-sm transition-colors ${
                  selectedGoals.includes(goal)
                    ? 'border-[#8BA497] bg-[#8BA497]/10 text-[#1C1C1C]'
                    : 'border-[#1C1C1C]/15 text-[#1C1C1C]/70 hover:border-[#8BA497]/40'
                }`}
              >
                {goal}
              </button>
            ))}
          </div>
        </Card>

        <Card className="space-y-6">
          <div className="flex items-center gap-3">
            <ClipboardList className="w-6 h-6 text-[#CDAE58]" />
            <h3>スキルツリー入力</h3>
          </div>

          <p className="text-sm text-[#1C1C1C]/60">
            主要スキルと現在のレベル、今後の学習フォーカスを入力します
          </p>

          <div className="space-y-4">
            {skillFields.map((field, index) => (
              <motion.div key={field.id} layout className="p-4 rounded-2xl bg-[#FAF8F4] border border-[#CDAE58]/20">
                <div className="flex justify-between items-center mb-4">
                  <div className="font-medium flex items-center gap-2">
                    <Star className="w-4 h-4 text-[#CDAE58]" />
                    ノード {index + 1}
                  </div>
                  <button type="button" onClick={() => removeSkill(index)} className="text-sm text-[#1C1C1C]/60 hover:text-red-500">
                    削除
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold mb-2">スキル名</label>
                    <input
                      {...register(`skillTree.${index}.skill` as const, { required: 'スキル名を入力' })}
                      className="w-full px-3 py-2 rounded-xl border border-[#1C1C1C]/15 focus:border-[#CDAE58] focus:outline-none"
                      placeholder="例: 火入れ"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-2">レベル (1-5)</label>
                    <input
                      type="range"
                      min={1}
                      max={5}
                      {...register(`skillTree.${index}.level` as const, { valueAsNumber: true })}
                      className="w-full"
                    />
                    <div className="text-xs text-[#1C1C1C]/60">Lv.{skillTree[index].level}</div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-2">注力ポイント</label>
                    <input
                      {...register(`skillTree.${index}.focus` as const)}
                      className="w-full px-3 py-2 rounded-xl border border-[#1C1C1C]/15 focus:border-[#CDAE58] focus:outline-none"
                      placeholder="例: 各部位の最適火入れ"
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <Button
            type="button"
            variant="secondary"
            onClick={() =>
              appendSkill({ id: `skill-${Date.now()}`, skill: '新しいスキル', level: 3, focus: '' })
            }
          >
            <PlusCircle className="w-4 h-4" />
            ノードを追加
          </Button>
        </Card>

        <Card className="space-y-6">
          <div className="flex items-center gap-3">
            <ClipboardCheck className="w-6 h-6 text-[#CDAE58]" />
            <h3>スキルツリーJSONプレビュー</h3>
          </div>

          <pre className="bg-[#1C1C1C] text-[#F2E6B6] p-6 rounded-2xl text-sm overflow-auto max-h-80">
{skillTreeJson}
          </pre>

          <Button type="button" variant="ghost" onClick={handleCopySkillTree}>
            {copied ? 'コピーしました' : 'JSONをコピー'}
          </Button>
        </Card>

        <Card className="space-y-6">
          <div className="flex items-center gap-3">
            <Images className="w-6 h-6 text-[#CDAE58]" />
            <h3>ポートフォリオ写真</h3>
          </div>
          <ImageUploader maxImages={6} onImagesUploaded={setPortfolioShots} />
        </Card>

        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <Button type="button" variant="ghost" onClick={onBack} disabled={isBusy}>
            ← 戻る
          </Button>
          <div className="flex items-center gap-4">
            {lastSavedAt && (
              <span className="text-sm text-[#1C1C1C]/60">{lastSavedAt} に保存済み</span>
            )}
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
