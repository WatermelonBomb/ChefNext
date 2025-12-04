import React from 'react';
import { motion } from 'motion/react';
import { Building, MapPin, Utensils, Sprout, Star, ArrowLeft } from 'lucide-react';
import { PageLayout } from './layouts/PageLayout';
import { Card } from './common/Card';
import { Tag } from './Tag';
import { Button } from './Button';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useProfileContext } from '../context/ProfileContext';

interface RestaurantProfilePageProps {
  onBack: () => void;
}

const DEFAULT_RESTAURANT_PROFILE = {
  displayName: "Restaurant L'espoir",
  tagline: '育成ファーストのモダンビストロ',
  location: '東京都渋谷区',
  seats: 32,
  cuisineTypes: ['フレンチ', 'デザート'],
  mentorshipStyle: 'ペアリング制 (若手 + シェフ)',
  description: '週次フィードバックと季節メニュー開発を通じて学びを可視化します。',
  cultureKeywords: ['丁寧な育成', '独立支援', '創作歓迎'],
  benefits: ['独立支援', '海外研修'],
  supportPrograms: ['事業計画サポート', '物件探し支援'],
  learningHighlights: [
    {
      id: 'highlight-1',
      title: '火入れ / ソース週次カリキュラム',
      duration: '3ヶ月',
      detail: '肉・魚ごとの火入れレビューと1on1でのソースチェック'
    },
    {
      id: 'highlight-2',
      title: '独立準備スタジオ',
      duration: '6ヶ月',
      detail: '原価計算からメニュー設計、開業計画作成まで伴走'
    }
  ],
  gallery: []
};

export function RestaurantProfilePage({ onBack }: RestaurantProfilePageProps) {
  const { restaurantProfile, restaurantLoading, refreshRestaurantProfile } = useProfileContext();

  React.useEffect(() => {
    if (!restaurantProfile && !restaurantLoading) {
      refreshRestaurantProfile().catch((error) => console.warn('Failed to refresh restaurant profile', error));
    }
  }, [restaurantProfile, restaurantLoading, refreshRestaurantProfile]);

  if (restaurantLoading && !restaurantProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAF8F4]">
        <p className="text-[#1C1C1C]/60">読み込み中...</p>
      </div>
    );
  }

  const profile = restaurantProfile ?? DEFAULT_RESTAURANT_PROFILE;

  return (
    <PageLayout
      title="店舗プロフィール"
      subtitle="育成環境を透明化することで、学びに前向きなシェフとのマッチングが加速します"
      badge="RESTAURANT PROFILE"
    >
      <div className="space-y-10">
        <Card className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#CDAE58] to-[#F2E6B6] flex items-center justify-center text-white text-2xl font-bold">
              {profile.displayName.slice(0, 2)}
            </div>
            <div>
              <h2 className="text-2xl font-semibold mb-1">{profile.displayName}</h2>
              <p className="text-[#1C1C1C]/70">{profile.tagline}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-2 text-[#1C1C1C]/70">
              <MapPin className="w-5 h-5 text-[#CDAE58]" />
              {profile.location}
            </div>
            <div className="flex items-center gap-2 text-[#1C1C1C]/70">
              <Building className="w-5 h-5 text-[#CDAE58]" />
              客席数 {profile.seats || 'N/A'}
            </div>
            <div className="flex items-center gap-2 text-[#1C1C1C]/70">
              <Utensils className="w-5 h-5 text-[#CDAE58]" />
              {profile.cuisineTypes.join(' / ')}
            </div>
          </div>

          <p className="text-[#1C1C1C]/70 leading-relaxed">{profile.description}</p>
        </Card>

        <Card className="space-y-6">
          <div className="flex items-center gap-3">
            <Sprout className="w-6 h-6 text-[#CDAE58]" />
            <h3>育成カルチャー</h3>
          </div>

          <div className="flex flex-wrap gap-2">
            {profile.cultureKeywords.map((keyword) => (
              <Tag key={keyword} label={keyword} variant="skill" />
            ))}
          </div>

          <div>
            <p className="text-sm text-[#1C1C1C]/60 mb-2">メンタリングスタイル</p>
            <div className="p-4 rounded-2xl bg-[#FAF8F4] border border-[#CDAE58]/20">
              {profile.mentorshipStyle}
            </div>
          </div>
        </Card>

        <Card className="space-y-6">
          <div className="flex items-center gap-3">
            <Star className="w-6 h-6 text-[#CDAE58]" />
            <h3>学びのハイライト</h3>
          </div>

          <div className="space-y-4">
            {profile.learningHighlights.map((highlight, index) => (
              <motion.div
                key={highlight.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-[#FAF8F4] border border-[#CDAE58]/20 rounded-2xl p-4"
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold">{highlight.title}</h4>
                  <span className="text-sm text-[#1C1C1C]/60">{highlight.duration}</span>
                </div>
                <p className="text-[#1C1C1C]/70 leading-relaxed">{highlight.detail}</p>
              </motion.div>
            ))}
          </div>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="space-y-4">
            <h3>福利厚生 / 特典</h3>
            <div className="flex flex-wrap gap-2">
              {profile.benefits.map((benefit) => (
                <Tag key={benefit} label={benefit} />
              ))}
            </div>
          </Card>

          <Card className="space-y-4">
            <h3>独立・キャリア支援</h3>
            <div className="flex flex-wrap gap-2">
              {profile.supportPrograms.map((program) => (
                <Tag key={program} label={program} variant="category" />
              ))}
            </div>
          </Card>
        </div>

        <Card className="space-y-4">
          <h3>ギャラリー</h3>
          {profile.gallery.length === 0 ? (
            <p className="text-[#1C1C1C]/60">アップロードされた写真はまだありません。</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {profile.gallery.map((shot) => (
                <div key={shot.id} className="rounded-2xl overflow-hidden shadow-md">
                  <ImageWithFallback src={shot.preview} alt="kitchen" className="w-full h-48 object-cover" />
                </div>
              ))}
            </div>
          )}
        </Card>

        <div className="flex justify-center">
          <Button variant="ghost" onClick={onBack}>
            <ArrowLeft className="w-4 h-4" /> 戻る
          </Button>
        </div>
      </div>
    </PageLayout>
  );
}
