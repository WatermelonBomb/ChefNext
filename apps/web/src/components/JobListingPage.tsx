import React, { useState } from 'react';
import { motion } from 'motion/react';
import { JobCard } from './JobCard';
import { Filter, Search } from 'lucide-react';

interface JobListingPageProps {
  onJobClick: (jobId: string) => void;
}

export function JobListingPage({ onJobClick }: JobListingPageProps) {
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  const jobs = [
    {
      id: '1',
      imageUrl: 'https://images.unsplash.com/photo-1643101570532-88c8ecc07c1f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaW5lJTIwZGluaW5nJTIwcmVzdGF1cmFudCUyMGludGVyaW9yfGVufDF8fHx8MTc2Mjk1NTk5MXww&ixlib=rb-4.1.0&q=80&w=1080',
      restaurantName: 'Restaurant L\'espoir',
      location: '東京都港区',
      skills: ['火入れ', 'ソース', '原価管理'],
      salary: '30-35万円',
      duration: '6ヶ月-1年',
      isPopular: true,
      type: '独立支援枠'
    },
    {
      id: '2',
      imageUrl: 'https://images.unsplash.com/photo-1655890193532-3f51318b23c0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmb29kJTIwcHJlcGFyYXRpb24lMjBjb29raW5nfGVufDF8fHx8MTc2MzAxMTIyM3ww&ixlib=rb-4.1.0&q=80&w=1080',
      restaurantName: '和食処 銀座 雅',
      location: '東京都中央区',
      skills: ['和包丁', '盛付け', '仕込み'],
      salary: '25-30万円',
      duration: '1年以上',
      isPopular: false,
      type: '修行枠'
    },
    {
      id: '3',
      imageUrl: 'https://images.unsplash.com/photo-1718939043703-ed834bff9685?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjdWxpbmFyeSUyMGFydCUyMGRpc2h8ZW58MXx8fHwxNzYyOTQ3MTcxfDA&ixlib=rb-4.1.0&q=80&w=1080',
      restaurantName: 'Trattoria Bella',
      location: '神奈川県横浜市',
      skills: ['パスタ', 'リゾット', 'ドルチェ'],
      salary: '28-33万円',
      duration: '6ヶ月-1年',
      isPopular: true,
      type: '修行枠'
    },
    {
      id: '4',
      imageUrl: 'https://images.unsplash.com/photo-1740727665746-cfe80ababc23?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGVmJTIwY29va2luZyUyMGtpdGNoZW58ZW58MXx8fHwxNzYzMDQ3MDkyfDA&ixlib=rb-4.1.0&q=80&w=1080',
      restaurantName: 'Bistro Moderne',
      location: '東京都渋谷区',
      skills: ['火入れ', 'ソース', 'プレゼンテーション'],
      salary: '32-38万円',
      duration: '1年以上',
      isPopular: false,
      type: 'フルタイム'
    }
  ];
  
  const categories = ['すべて', 'フレンチ', 'イタリアン', '和食', '中華'];
  const [selectedCategory, setSelectedCategory] = useState('すべて');
  
  return (
    <div className="min-h-screen bg-[#FAF8F4] pb-20" style={{ paddingTop: '120px' }}>
      <div className="w-full flex flex-col items-center px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16 max-w-4xl"
        >
          <h2 className="mb-4 text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">求人を探す</h2>
          <p className="text-[#1C1C1C]/70 text-lg sm:text-xl leading-relaxed max-w-3xl mx-auto">あなたの成長を支える職場を見つけましょう</p>
        </motion.div>
        
        {/* Search and Filter Bar */}
        <div className="w-full max-w-7xl bg-white rounded-2xl p-4 shadow-[0_4px_20px_rgba(205,174,88,0.1)] mb-8 sticky top-24 z-40 backdrop-blur-sm">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#1C1C1C]/40" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="エリア、スキル、料理ジャンルで検索"
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-[#1C1C1C]/20 focus:border-[#CDAE58] focus:outline-none transition-colors"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-6 py-3 bg-[#FAF8F4] rounded-xl border border-[#1C1C1C]/20 hover:border-[#CDAE58] transition-colors flex items-center gap-2"
            >
              <Filter className="w-5 h-5" />
              フィルター
            </button>
          </div>
          
          {/* Category Tabs */}
          <div className="flex gap-3 mt-4 overflow-x-auto pb-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full whitespace-nowrap transition-all ${
                  selectedCategory === category
                    ? 'bg-[#CDAE58] text-white'
                    : 'bg-[#FAF8F4] text-[#1C1C1C] hover:bg-[#CDAE58]/20'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
          
          {/* Expandable Filters */}
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mt-4 pt-4 border-t border-[#1C1C1C]/10 grid grid-cols-1 md:grid-cols-3 gap-4"
            >
              <div>
                <label className="block mb-2 text-sm font-medium flex items-center gap-2">
                  🎯 学べるスキル
                </label>
                <select className="w-full px-3 py-2 rounded-lg border border-[#1C1C1C]/20 focus:border-[#CDAE58] focus:outline-none transition-all">
                  <option>すべて</option>
                  <option>火入れ (基礎〜応用)</option>
                  <option>ソース (古典〜創作)</option>
                  <option>盛付け (美学・プレゼン)</option>
                  <option>原価管理 (経営基礎)</option>
                  <option>チーム運営 (リーダーシップ)</option>
                </select>
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium">勤務期間</label>
                <select className="w-full px-3 py-2 rounded-lg border border-[#1C1C1C]/20 focus:border-[#CDAE58] focus:outline-none">
                  <option>すべて</option>
                  <option>3ヶ月以内</option>
                  <option>6ヶ月-1年</option>
                  <option>1年以上</option>
                </select>
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium">報酬</label>
                <select className="w-full px-3 py-2 rounded-lg border border-[#1C1C1C]/20 focus:border-[#CDAE58] focus:outline-none">
                  <option>すべて</option>
                  <option>20-25万円</option>
                  <option>25-30万円</option>
                  <option>30-35万円</option>
                  <option>35万円以上</option>
                </select>
              </div>
            </motion.div>
          )}
        </div>
        
        {/* Job Results */}
        <div className="mb-6">
          <p className="text-[#1C1C1C]/60">{jobs.length}件の求人が見つかりました</p>
        </div>
        
        {/* Job Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map((job, index) => (
            <motion.div
              key={job.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <JobCard {...job} onClick={() => onJobClick(job.id)} />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
