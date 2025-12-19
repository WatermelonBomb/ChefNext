import React from 'react';
import { motion } from 'motion/react';
import { PortfolioCard } from './PortfolioCard';
import { SkillTreeNode } from './SkillTreeNode';
import { Tag } from './Tag';
import { Calendar, MapPin, Award } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useProfileContext } from '../context/ProfileContext';

interface ChefProfilePageProps {
  onBack: () => void;
  onViewApplications?: () => void;
}

const DEFAULT_SKILL_TREE = [
  { id: 'default-1', skill: '火入れ', level: 4, focus: '部位ごとの最適火入れ' },
  { id: 'default-2', skill: 'ソース', level: 3, focus: '軽さとコクの両立' },
  { id: 'default-3', skill: '盛付け', level: 5, focus: '季節感の演出' },
  { id: 'default-4', skill: '仕込み', level: 3, focus: '段取り最適化' },
  { id: 'default-5', skill: 'チームマネジメント', level: 3, focus: '3-4名の指導' }
];

const DEFAULT_PORTFOLIO = [
  {
    imageUrl:
      'https://images.unsplash.com/photo-1755811248279-1ab13b7d4384?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnb3VybWV0JTIwcGxhdGluZyUyMGZpbmUlMjBkaW5pbmd8ZW58MXx8fHwxNzYzMDU0Mzg5fDA&ixlib=rb-4.1.0&q=80&w=1080',
    title: '鴨のロースト',
    description: '低温調理で仕上げた鴨胸肉',
    skills: ['火入れ', 'ソース', '盛付け']
  },
  {
    imageUrl:
      'https://images.unsplash.com/photo-1566950596959-bd0b3f8c2634?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxqYXBhbmVzZSUyMGN1aXNpbmUlMjBwbGF0aW5nfGVufDF8fHx8MTc2MzA1NDM5MHww&ixlib=rb-4.1.0&q=80&w=1080',
    title: '季節の前菜',
    description: '日本の四季を表現した一皿',
    skills: ['盛付け', 'ソース']
  },
  {
    imageUrl:
      'https://images.unsplash.com/photo-1761095596765-c8abe01d3aea?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnb3VybWV0JTIwZGVzc2VydCUyMHBsYXRpbmd8ZW58MXx8fHwxNzYzMDU0MzkxfDA&ixlib=rb-4.1.0&q=80&w=1080',
    title: 'デセールアート',
    description: '視覚と味覚で楽しむデザート',
    skills: ['盛付け']
  }
];

const DEFAULT_GROWTH_LOG = [
  {
    date: '2024年3月',
    title: 'ミシュラン1つ星獲得',
    description: "Restaurant L'espoirでスーシェフとして貢献",
    achievement: 'チームリーダーシップ',
    imageUrl:
      'https://images.unsplash.com/photo-1759521296144-fe6f2d2dc769?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGVmJTIwcG9ydHJhaXQlMjBwcm9mZXNzaW9uYWx8ZW58MXx8fHwxNzYzMDU0MzkxfDA&ixlib=rb-4.1.0&q=80&w=1080'
  },
  {
    date: '2023年10月',
    title: 'スーシェフ昇格',
    description: '火入れとソース技術の向上が評価された',
    achievement: '技術スキル向上',
    imageUrl:
      'https://images.unsplash.com/photo-1755811248279-1ab13b7d4384?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnb3VybWV0JTIwcGxhdGluZyUyMGZpbmUlMjBkaW5pbmd8ZW58MXx8fHwxNzYzMDU0Mzg5fDA&ixlib=rb-4.1.0&q=80&w=1080'
  },
  {
    date: '2022年12月',
    title: '料理コンテスト入賞',
    description: '盛付け技術で地域コンテスト2位',
    achievement: '盛付けスキル',
    imageUrl:
      'https://images.unsplash.com/photo-1566950596959-bd0b3f8c2634?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxqYXBhbmVzZSUyMGN1aXNpbmUlMjBwbGF0aW5nfGVufDF8fHx8MTc2MzA1NDM5MHww&ixlib=rb-4.1.0&q=80&w=1080'
  }
];

const DEFAULT_PROFILE = {
  fullName: '田中 健太',
  headline: "スーシェフ | Restaurant L'espoir",
  summary: '火入れとソースを軸に成長中。次はマネジメントと独立準備を進めたい。',
  location: '東京都港区',
  yearsExperience: 5,
  availability: '1ヶ月以内',
  specialties: ['フレンチ', 'パティスリー'],
  workAreas: ['港区', '渋谷区'],
  languages: ['日本語'],
  bio: 'クラシックフレンチとモダン技法を融合させた料理を追求しています。',
  learningFocus: ['独立準備', 'マネジメント強化'],
  skillTree: DEFAULT_SKILL_TREE,
  skillTreeJson: JSON.stringify({ nodes: DEFAULT_SKILL_TREE }),
  portfolio: []
};

export function ChefProfilePage({ onBack, onViewApplications }: ChefProfilePageProps) {
  const { chefProfile, chefLoading, refreshChefProfile } = useProfileContext();

  React.useEffect(() => {
    if (!chefProfile && !chefLoading) {
      refreshChefProfile().catch((error) => console.warn('Failed to refresh chef profile', error));
    }
  }, [chefProfile, chefLoading, refreshChefProfile]);

  if (chefLoading && !chefProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAF8F4]">
        <p className="text-[#1C1C1C]/60">読み込み中...</p>
      </div>
    );
  }

  const profile = chefProfile ?? DEFAULT_PROFILE;
  const skillNodes = profile.skillTree.length ? profile.skillTree : DEFAULT_SKILL_TREE;
  const skillsList = skillNodes.map((node) => node.skill);
  const skillLevelMap = skillNodes.reduce<Record<string, number>>((acc, node) => {
    acc[node.skill] = node.level;
    return acc;
  }, {});

  const portfolioItems = profile.portfolio.length
    ? profile.portfolio.map((item, index) => ({
        imageUrl: item.preview,
        title: `${profile.specialties[0] ?? 'Portfolio'} ${index + 1}`,
        description: profile.summary,
        skills: profile.specialties.slice(0, 3)
      }))
    : DEFAULT_PORTFOLIO;

  const growthLog = DEFAULT_GROWTH_LOG;

  return (
    <div className="min-h-screen bg-[#FAF8F4] pb-20" style={{ paddingTop: '120px' }}>
      <div className="w-full flex flex-col items-center px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-7xl">
          {/* Hero Section */}
          <div className="relative h-[400px] mb-12">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1755811248279-1ab13b7d4384?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnb3VybWV0JTIwcGxhdGluZyUyMGZpbmUlMjBkaW5pbmd8ZW58MXx8fHwxNzYzMDU0Mzg5fDA&ixlib=rb-4.1.0&q=80&w=1080"
              alt="Chef profile hero"
              className="w-full h-full object-cover rounded-2xl"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent rounded-2xl" />

            <div className="absolute bottom-8 left-8 text-white">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-white/20">
                  <ImageWithFallback
                    src="https://images.unsplash.com/photo-1759521296144-fe6f2d2dc769?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGVmJTIwcG9ydHJhaXQlMjBwcm9mZXNzaW9uYWx8ZW58MXx8fHwxNzYzMDU0MzkxfDA&ixlib=rb-4.1.0&q=80&w=1080"
                    alt="Chef avatar"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h1 className="text-3xl font-bold mb-2">{profile.fullName}</h1>
                  <p className="text-white/90 mb-2">{profile.headline}</p>
                  <div className="flex items-center gap-4 text-sm text-white/80">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {profile.location}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      経験 {profile.yearsExperience}年
                    </div>
                    <div className="flex items-center gap-1">
                      <Award className="w-4 h-4" />
                      {profile.learningFocus[0] ?? '学び継続中'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {onViewApplications && (
            <div className="flex justify-end mb-8">
              <button
                onClick={onViewApplications}
                className="px-5 py-3 rounded-xl border border-[#e2e8f0] text-[#1C1C1C] font-semibold hover:border-[#CDAE58]"
              >
                応募状況を確認
              </button>
            </div>
          )}

          {/* Skills Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl p-8 shadow-[0_4px_20px_rgba(205,174,88,0.1)] mb-12"
          >
            <h3 className="mb-8">スキルレベル</h3>

            <div className="relative h-[400px] bg-[#FAF8F4] rounded-2xl mb-8">
              <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-gradient-to-br from-[#CDAE58] to-[#F2E6B6] rounded-full flex items-center justify-center shadow-[0_4px_24px_rgba(205,174,88,0.3)] z-10">
                <span className="font-medium text-white">{profile.fullName.slice(0, 2)}</span>
              </div>

              {skillsList.map((skill, index) => (
                <SkillTreeNode
                  key={skill}
                  skill={skill}
                  level={skillLevelMap[skill] || 0}
                  angle={(360 / skillsList.length) * index}
                  distance={150}
                />
              ))}
            </div>

            <div className="flex flex-wrap gap-3">
              {skillsList.map((skill) => (
                <Tag key={skill} label={`${skill} Lv.${skillLevelMap[skill] || 0}`} variant="skill" />
              ))}
            </div>
          </motion.div>

          {/* Portfolio Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl p-8 shadow-[0_4px_20px_rgba(205,174,88,0.1)] mb-12"
          >
            <h3 className="mb-8">ポートフォリオ</h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {portfolioItems.map((item, index) => (
                <PortfolioCard key={index} {...item} />
              ))}
            </div>
          </motion.div>

          {/* Growth Log Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl p-8 shadow-[0_4px_20px_rgba(205,174,88,0.1)]"
          >
            <h3 className="mb-8">成長ログ</h3>

            <div className="space-y-8">
              {growthLog.map((log, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="flex gap-6 relative"
                >
                  {index < growthLog.length - 1 && (
                    <div className="absolute left-12 top-24 w-0.5 h-16 bg-[#CDAE58]/20" />
                  )}

                  <div className="w-6 h-6 bg-[#CDAE58] rounded-full mt-6 flex-shrink-0 border-4 border-white shadow-lg" />

                  <div className="flex-1 bg-[#FAF8F4] rounded-2xl p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <p className="text-[#CDAE58] text-sm font-medium mb-1">{log.date}</p>
                        <h4 className="text-lg font-semibold mb-2">{log.title}</h4>
                        <p className="text-[#1C1C1C]/70 leading-relaxed mb-3">{log.description}</p>
                        <Tag label={log.achievement} variant="skill" />
                      </div>
                      <ImageWithFallback src={log.imageUrl} alt={log.title} className="w-32 h-24 object-cover rounded-xl" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
