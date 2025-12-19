import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

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
  onJobSelect?: (job: Job) => void;
}

export function JobSearchPage({ onBack, onJobSelect }: JobSearchPageProps) {
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
    <div className="min-h-screen bg-[#FAF8F4] pb-20" style={{ paddingTop: '120px' }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">スキルで見つける理想の職場</h1>
          <p className="text-[#1C1C1C]/60">成長できる環境で、あなたの料理人生を加速させよう</p>
        </div>

        <div className="space-y-8">
          {/* Search Mode Toggle */}
          <div className="bg-white rounded-xl p-2 max-w-md mx-auto shadow-sm">
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setSearchMode('skills')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  searchMode === 'skills'
                    ? 'bg-[#CDAE58] text-white'
                    : 'text-[#1C1C1C]/70 hover:bg-[#CDAE58]/10'
                }`}
              >
                📈 スキル重視
              </button>
              <button
                onClick={() => setSearchMode('jobs')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  searchMode === 'jobs'
                    ? 'bg-[#CDAE58] text-white'
                    : 'text-[#1C1C1C]/70 hover:bg-[#CDAE58]/10'
                }`}
              >
                🔍 求人検索
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="bg-white rounded-xl p-4 max-w-2xl mx-auto shadow-sm">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={searchMode === 'skills' ? "学びたいスキルを入力..." : "職種、店舗名で検索..."}
                className="w-full pl-4 pr-16 py-4 rounded-xl border border-[#1C1C1C]/20 focus:border-[#CDAE58] focus:outline-none transition-colors"
              />
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`absolute right-3 top-1/2 transform -translate-y-1/2 p-2 rounded-lg transition-colors ${
                  showFilters ? 'text-[#CDAE58] bg-[#CDAE58]/10' : 'text-[#1C1C1C]/40 hover:text-[#CDAE58]'
                }`}
              >
                ⚙️
              </button>
            </div>
          </div>

          {/* Skills Filter */}
          {searchMode === 'skills' && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-4xl mx-auto"
            >
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="text-lg font-semibold mb-4">学びたいスキルを選択</h3>
                <div className="flex flex-wrap gap-3">
                  {skills.map((skill) => (
                    <button
                      key={skill}
                      onClick={() => handleSkillFilter(skill)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all ${
                        selectedSkills.includes(skill)
                          ? 'border-[#CDAE58] bg-[#CDAE58] text-white'
                          : 'border-[#CDAE58]/40 text-[#CDAE58] hover:border-[#CDAE58] hover:bg-[#CDAE58]/10'
                      }`}
                    >
                      <span>{skill}</span>
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Results Summary */}
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <h3 className="text-lg font-semibold">
              検索結果: {filteredJobs.length}件
            </h3>
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
                  className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => onJobSelect?.(job)}
                >
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 bg-[#FAF8F4] rounded-xl" />
                    <div className="flex-1">
                      <h4 className="text-xl font-semibold mb-1">{job.position}</h4>
                      <p className="text-[#1C1C1C]/60 mb-2">{job.restaurant.name} • {job.restaurant.location}</p>
                      <div className="flex flex-wrap gap-2">
                        {job.skillsYouCanLearn.map(skill => (
                          <span key={skill} className="px-3 py-1 bg-[#CDAE58]/10 text-[#CDAE58] rounded-full text-sm">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-semibold text-[#CDAE58]">{job.salary}</p>
                      <p className="text-sm text-[#1C1C1C]/60">{job.posted}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {filteredJobs.length === 0 && (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-[#CDAE58]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  🔍
                </div>
                <h3 className="text-lg font-semibold mb-2">該当する求人が見つかりません</h3>
                <p className="text-[#1C1C1C]/60 mb-4">
                  検索条件を変更するか、フィルタをリセットしてお試しください
                </p>
                <button
                  onClick={() => setSelectedSkills([])}
                  className="px-4 py-2 text-[#CDAE58] hover:bg-[#CDAE58]/10 rounded-lg transition-colors"
                >
                  フィルタをリセット
                </button>
              </div>
            )}
          </div>

          {/* Back Button */}
          <div className="text-center">
            <button onClick={onBack} className="text-[#1C1C1C]/60 hover:text-[#CDAE58] transition-colors">
              ← トップページに戻る
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
