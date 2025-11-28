import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Card } from '../common/Card';
import { Button } from '../Button';
import { Tag } from '../Tag';
import {
  Star,
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  TrendingUp,
  Award,
  Users,
  Clock,
  ChefHat,
  Target,
  Lightbulb
} from 'lucide-react';

interface Review {
  id: string;
  reviewer: {
    name: string;
    avatar: string;
    position: string;
    workPeriod: string;
  };
  rating: {
    overall: number;
    skillDevelopment: number;
    workEnvironment: number;
    management: number;
    workLifeBalance: number;
  };
  skillsLearned: string[];
  pros: string[];
  cons: string[];
  comment: string;
  isVerified: boolean;
  helpfulCount: number;
  createdAt: string;
}

interface ReviewSystemProps {
  restaurant: {
    id: string;
    name: string;
    image: string;
    overallRating: number;
    totalReviews: number;
  };
}

export function ReviewSystem({ restaurant }: ReviewSystemProps) {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'development' | 'environment' | 'management'>('all');
  const [showWriteReview, setShowWriteReview] = useState(false);

  const sampleReviews: Review[] = [
    {
      id: '1',
      reviewer: {
        name: '田中 健太',
        avatar: '/api/placeholder/40/40',
        position: 'コック',
        workPeriod: '2022年4月 - 2024年3月 (2年間)'
      },
      rating: {
        overall: 4.5,
        skillDevelopment: 5,
        workEnvironment: 4,
        management: 4,
        workLifeBalance: 4
      },
      skillsLearned: ['火入れ', 'ソース', 'チームマネジメント'],
      pros: [
        'シェフが丁寧に指導してくれる',
        '新しい技術を学べる環境',
        'チームワークが良い'
      ],
      cons: [
        '繁忙期は忙しい',
        '立地的に通勤が大変'
      ],
      comment: '技術面で大きく成長できました。特に火入れの技術は他店では学べないレベルまで習得できたと思います。',
      isVerified: true,
      helpfulCount: 12,
      createdAt: '2024年4月'
    },
    {
      id: '2',
      reviewer: {
        name: '佐藤 美咲',
        avatar: '/api/placeholder/40/40',
        position: 'スーシェフ',
        workPeriod: '2021年6月 - 継続中 (3年6ヶ月)'
      },
      rating: {
        overall: 4.8,
        skillDevelopment: 5,
        workEnvironment: 5,
        management: 4,
        workLifeBalance: 4
      },
      skillsLearned: ['盛付け', '原価管理', 'メニュー開発'],
      pros: [
        'キャリアアップの機会が多い',
        '独立支援制度がしっかりしている',
        'お客様からの評価が高い'
      ],
      cons: [
        '責任が重い',
        '学ぶことが多すぎる'
      ],
      comment: 'ここで働いて本当に良かったです。料理人として、人として大きく成長できています。',
      isVerified: true,
      helpfulCount: 8,
      createdAt: '2024年3月'
    }
  ];

  const categories = [
    { id: 'all', label: 'すべて', count: sampleReviews.length },
    { id: 'development', label: 'スキル成長', count: sampleReviews.filter(r => r.rating.skillDevelopment >= 4).length },
    { id: 'environment', label: '職場環境', count: sampleReviews.filter(r => r.rating.workEnvironment >= 4).length },
    { id: 'management', label: '経営・管理', count: sampleReviews.filter(r => r.rating.management >= 4).length }
  ];

  const skillIcons: { [key: string]: React.ComponentType<{ className?: string }> } = {
    '火入れ': ChefHat,
    'ソース': Target,
    '盛付け': Award,
    'チームマネジメント': Users,
    '原価管理': TrendingUp,
    'メニュー開発': Lightbulb
  };

  const renderStars = (rating: number, size = 'sm') => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < 5; i++) {
      stars.push(
        <Star
          key={i}
          className={`${size === 'sm' ? 'w-4 h-4' : 'w-5 h-5'} ${
            i < fullStars
              ? 'text-[#CDAE58] fill-[#CDAE58]'
              : i === fullStars && hasHalfStar
              ? 'text-[#CDAE58] fill-[#CDAE58]/50'
              : 'text-gray-300'
          }`}
        />
      );
    }

    return stars;
  };

  const filteredReviews = sampleReviews.filter(review => {
    if (selectedCategory === 'all') return true;
    if (selectedCategory === 'development') return review.rating.skillDevelopment >= 4;
    if (selectedCategory === 'environment') return review.rating.workEnvironment >= 4;
    if (selectedCategory === 'management') return review.rating.management >= 4;
    return true;
  });

  return (
    <div className="space-y-8">
      {/* Rating Overview */}
      <Card variant="elevated" size="lg">
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 leading-tight">レビュー・評価</h2>
          <p className="text-[#1C1C1C]/60">
            実際に働いた料理人からのリアルな声
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Overall Rating */}
          <div className="text-center">
            <div className="text-4xl font-bold text-[#CDAE58] mb-2">
              {restaurant.overallRating}
            </div>
            <div className="flex justify-center mb-2">
              {renderStars(restaurant.overallRating, 'lg')}
            </div>
            <p className="text-[#1C1C1C]/60">
              {restaurant.totalReviews}件のレビュー
            </p>
          </div>

          {/* Detailed Ratings */}
          <div className="space-y-3">
            {[
              { label: 'スキル成長', value: 4.6, icon: TrendingUp },
              { label: '職場環境', value: 4.3, icon: Users },
              { label: '経営・管理', value: 4.2, icon: Award },
              { label: 'ワークライフバランス', value: 4.1, icon: Clock }
            ].map(({ label, value, icon: Icon }) => (
              <div key={label} className="flex items-center gap-3">
                <Icon className="w-4 h-4 text-[#CDAE58]" />
                <span className="text-sm font-medium flex-1">{label}</span>
                <div className="flex items-center gap-2">
                  <div className="flex">{renderStars(value)}</div>
                  <span className="text-sm font-medium min-w-[2rem]">{value}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Category Filter */}
      <Card variant="outline" size="md">
        <div className="flex flex-wrap gap-3">
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id as any)}
              className={`px-4 py-2 rounded-full border transition-all ${
                selectedCategory === category.id
                  ? 'border-[#CDAE58] bg-[#CDAE58] text-white'
                  : 'border-[#1C1C1C]/20 text-[#1C1C1C]/70 hover:border-[#CDAE58]'
              }`}
            >
              {category.label} ({category.count})
            </button>
          ))}
        </div>
      </Card>

      {/* Write Review Button */}
      <div className="text-center">
        <Button
          variant="primary"
          onClick={() => setShowWriteReview(true)}
          className="inline-flex items-center gap-2"
        >
          <MessageSquare className="w-4 h-4" />
          レビューを書く
        </Button>
      </div>

      {/* Reviews List */}
      <div className="space-y-6">
        <AnimatePresence>
          {filteredReviews.map(review => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Card variant="outline" size="lg">
                <div className="space-y-6">
                  {/* Reviewer Info */}
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full overflow-hidden">
                      <img
                        src={review.reviewer.avatar}
                        alt={review.reviewer.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium">{review.reviewer.name}</span>
                        {review.isVerified && (
                          <div className="px-2 py-1 bg-[#CDAE58] text-white text-xs rounded-full">
                            認証済み
                          </div>
                        )}
                      </div>
                      <p className="text-sm text-[#1C1C1C]/60">{review.reviewer.position}</p>
                      <p className="text-xs text-[#1C1C1C]/50">{review.reviewer.workPeriod}</p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-2 mb-1">
                        {renderStars(review.rating.overall)}
                        <span className="font-medium">{review.rating.overall}</span>
                      </div>
                      <p className="text-xs text-[#1C1C1C]/50">{review.createdAt}</p>
                    </div>
                  </div>

                  {/* Skills Learned */}
                  <div>
                    <h4 className="font-medium mb-3 flex items-center gap-2 text-base sm:text-lg leading-snug">
                      <TrendingUp className="w-4 h-4 text-[#CDAE58]" />
                      習得したスキル
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {review.skillsLearned.map(skill => {
                        const IconComponent = skillIcons[skill];
                        return (
                          <Tag
                            key={skill}
                            label={skill}
                            icon={IconComponent}
                            variant="skill"
                          />
                        );
                      })}
                    </div>
                  </div>

                  {/* Pros and Cons */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium mb-3 flex items-center gap-2 text-green-600 text-base sm:text-lg leading-snug">
                        <ThumbsUp className="w-4 h-4" />
                        良かった点
                      </h4>
                      <ul className="space-y-2">
                        {review.pros.map((pro, index) => (
                          <li key={index} className="text-sm flex items-start gap-2">
                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                            {pro}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-medium mb-3 flex items-center gap-2 text-orange-600 text-base sm:text-lg leading-snug">
                        <ThumbsDown className="w-4 h-4" />
                        改善点
                      </h4>
                      <ul className="space-y-2">
                        {review.cons.map((con, index) => (
                          <li key={index} className="text-sm flex items-start gap-2">
                            <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2 flex-shrink-0" />
                            {con}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Comment */}
                  <div>
                    <h4 className="font-medium mb-3 text-base sm:text-lg leading-snug">詳細レビュー</h4>
                    <p className="text-[#1C1C1C]/70 leading-relaxed">
                      {review.comment}
                    </p>
                  </div>

                  {/* Rating Details */}
                  <div className="bg-gray-50 rounded-xl p-4">
                    <h4 className="font-medium mb-3 text-base sm:text-lg leading-snug">詳細評価</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {[
                        { label: 'スキル成長', value: review.rating.skillDevelopment },
                        { label: '職場環境', value: review.rating.workEnvironment },
                        { label: '経営・管理', value: review.rating.management },
                        { label: 'ワークライフバランス', value: review.rating.workLifeBalance }
                      ].map(({ label, value }) => (
                        <div key={label} className="text-center">
                          <div className="text-lg font-bold text-[#CDAE58] mb-1">
                            {value}
                          </div>
                          <div className="flex justify-center mb-2">
                            {renderStars(value)}
                          </div>
                          <p className="text-xs text-[#1C1C1C]/60">{label}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-4 border-t border-[#1C1C1C]/10">
                    <button className="flex items-center gap-2 text-sm text-[#1C1C1C]/60 hover:text-[#CDAE58] transition-colors">
                      <ThumbsUp className="w-4 h-4" />
                      参考になった ({review.helpfulCount})
                    </button>

                    <button className="flex items-center gap-2 text-sm text-[#1C1C1C]/60 hover:text-[#CDAE58] transition-colors">
                      <MessageSquare className="w-4 h-4" />
                      返信する
                    </button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filteredReviews.length === 0 && (
        <Card variant="outline" size="lg" className="text-center py-12">
          <div className="w-16 h-16 bg-[#CDAE58]/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <MessageSquare className="w-8 h-8 text-[#CDAE58]" />
          </div>
          <h3 className="text-lg sm:text-xl font-semibold mb-2 leading-tight">該当するレビューがありません</h3>
          <p className="text-[#1C1C1C]/60 mb-4">
            別のカテゴリを選択するか、最初のレビューを書いてみませんか？
          </p>
          <Button variant="primary" onClick={() => setShowWriteReview(true)}>
            レビューを書く
          </Button>
        </Card>
      )}
    </div>
  );
}