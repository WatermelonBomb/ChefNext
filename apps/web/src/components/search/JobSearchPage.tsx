import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PageLayout } from '../layouts/PageLayout';
import { Card } from '../common/Card';
import { Button } from '../Button';
import { Tag } from '../Tag';
import { SearchFilters } from './SearchFilters';
import { JobCard } from './JobCard';
import { SkillTreeFilter } from './SkillTreeFilter';
import {
  Search,
  SlidersHorizontal,
  MapPin,
  Clock,
  Star,
  Flame,
  Droplet,
  Scissors,
  Users,
  TrendingUp,
  Filter
} from 'lucide-react';

interface Job {
  id: string;
  restaurant: {
    name: string;
    image: string;
    rating: number;
    location: string;
  };
  position: string;
  skillsYouCanLearn: string[];
  skillsRequired: string[];
  experienceLevel: string;
  salary: string;
  workStyle: string[];
  description: string;
  posted: string;
  featured: boolean;
}

interface JobSearchPageProps {
  onBack: () => void;
}

export function JobSearchPage({ onBack }: JobSearchPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [searchMode, setSearchMode] = useState<'skills' | 'jobs'>('skills');

  const skills = ['火入れ', 'ソース', '盛付け', '仕込み', '原価管理', 'チームマネジメント'];

  const sampleJobs: Job[] = [
    {
      id: '1',
      restaurant: {
        name: 'レストラン・オーベルジュ',
        image: '/api/placeholder/80/80',
        rating: 4.8,
        location: '銀座'
      },
      position: 'スーシェフ',
      skillsYouCanLearn: ['火入れ', 'ソース', 'チームマネジメント'],
      skillsRequired: ['仕込み', '盛付け'],
      experienceLevel: '3-5年',
      salary: '35-40万円',
      workStyle: ['フルタイム', '独立支援枠'],
      description: '伝統的なフランス料理の技法を学びながら、創作料理にも挑戦できる環境',
      posted: '2日前',
      featured: true
    },
    {
      id: '2',
      restaurant: {
        name: 'イル・ソーレ',
        image: '/api/placeholder/80/80',
        rating: 4.6,
        location: '恵比寿'
      },
      position: 'コック',
      skillsYouCanLearn: ['火入れ', '盛付け'],
      skillsRequired: ['仕込み'],
      experienceLevel: '1-3年',
      salary: '25-30万円',
      workStyle: ['フルタイム'],
      description: '本格イタリアンで基礎から応用まで幅広い技術を身につけられます',
      posted: '1週間前',
      featured: false
    }
  ];

  const handleSkillFilter = (skill: string) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter(s => s !== skill));
    } else {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  const filteredJobs = sampleJobs.filter(job => {
    if (selectedSkills.length === 0) return true;
    return selectedSkills.some(skill =>
      job.skillsYouCanLearn.includes(skill) ||
      job.skillsRequired.includes(skill)
    );
  });

  return (
    <PageLayout
      title="スキルで見つける理想の職場"
      subtitle="成長できる環境で、あなたの料理人生を加速させよう"
      badge="SKILL-FOCUSED SEARCH"
      maxWidth="full"
    >
      <div className="space-y-8">
        {/* Search Mode Toggle */}
        <Card variant="outline" size="sm" className="mx-auto max-w-md">
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setSearchMode('skills')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                searchMode === 'skills'
                  ? 'bg-[#CDAE58] text-white'
                  : 'text-[#1C1C1C]/70 hover:bg-[#CDAE58]/10'
              }`}
            >
              <TrendingUp className="w-4 h-4 inline mr-2" />
              スキル重視
            </button>
            <button
              onClick={() => setSearchMode('jobs')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                searchMode === 'jobs'
                  ? 'bg-[#CDAE58] text-white'
                  : 'text-[#1C1C1C]/70 hover:bg-[#CDAE58]/10'
              }`}
            >
              <Search className="w-4 h-4 inline mr-2" />
              求人検索
            </button>
          </div>
        </Card>

        {/* Search Bar */}
        <Card variant="elevated" size="md" className="mx-auto max-w-2xl">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#1C1C1C]/40" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={searchMode === 'skills' ? "学びたいスキルを入力..." : "職種、店舗名で検索..."}
              className="w-full pl-12 pr-16 py-4 rounded-xl border border-[#1C1C1C]/20 focus:border-[#CDAE58] focus:outline-none transition-colors"
            />
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`absolute right-3 top-1/2 transform -translate-y-1/2 p-2 rounded-lg transition-colors ${
                showFilters ? 'text-[#CDAE58] bg-[#CDAE58]/10' : 'text-[#1C1C1C]/40 hover:text-[#CDAE58]'
              }`}
            >
              <SlidersHorizontal className="w-5 h-5" />
            </button>
          </div>
        </Card>

        {/* Skills Filter */}
        {searchMode === 'skills' && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto"
          >
            <Card variant="glass" size="md">
              <h3 className="text-lg font-semibold mb-4">学びたいスキルを選択</h3>
              <div className="flex flex-wrap gap-3">
                {skills.map((skill) => (
                  <motion.button
                    key={skill}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleSkillFilter(skill)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all ${
                      selectedSkills.includes(skill)
                        ? 'border-[#CDAE58] bg-[#CDAE58] text-white'
                        : 'border-[#CDAE58]/40 text-[#CDAE58] hover:border-[#CDAE58] hover:bg-[#CDAE58]/10'
                    }`}
                  >
                    {skill === '火入れ' && <Flame className="w-4 h-4" />}
                    {skill === 'ソース' && <Droplet className="w-4 h-4" />}
                    {skill === '盛付け' && <Scissors className="w-4 h-4" />}
                    {skill === 'チームマネジメント' && <Users className="w-4 h-4" />}
                    <span>{skill}</span>
                  </motion.button>
                ))}
              </div>
            </Card>
          </motion.div>
        )}

        {/* Advanced Filters */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="max-w-4xl mx-auto"
            >
              <SearchFilters onFiltersChange={() => {}} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results Summary */}
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h3 className="text-lg font-semibold">
              検索結果: {filteredJobs.length}件
            </h3>
            {selectedSkills.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-[#1C1C1C]/60">フィルタ:</span>
                <div className="flex gap-1">
                  {selectedSkills.map(skill => (
                    <Tag
                      key={skill}
                      label={skill}
                      variant="skill"
                      onRemove={() => handleSkillFilter(skill)}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          <select className="px-3 py-2 rounded-lg border border-[#1C1C1C]/20 text-sm">
            <option>新着順</option>
            <option>スキル一致度</option>
            <option>給与順</option>
            <option>評価順</option>
          </select>
        </div>

        {/* Job Results */}
        <div className="max-w-4xl mx-auto space-y-4">
          <AnimatePresence mode="popLayout">
            {filteredJobs.map((job) => (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                layout
              >
                <JobCard job={job} />
              </motion.div>
            ))}
          </AnimatePresence>

          {filteredJobs.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <div className="w-16 h-16 bg-[#CDAE58]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-[#CDAE58]" />
              </div>
              <h3 className="text-lg font-semibold mb-2">該当する求人が見つかりません</h3>
              <p className="text-[#1C1C1C]/60 mb-4">
                検索条件を変更するか、フィルタをリセットしてお試しください
              </p>
              <Button
                variant="ghost"
                onClick={() => setSelectedSkills([])}
              >
                フィルタをリセット
              </Button>
            </motion.div>
          )}
        </div>

        {/* Back Button */}
        <div className="text-center">
          <Button variant="ghost" onClick={onBack}>
            ← トップページに戻る
          </Button>
        </div>
      </div>
    </PageLayout>
  );
}