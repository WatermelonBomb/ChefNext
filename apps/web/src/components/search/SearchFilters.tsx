import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Card } from '../common/Card';
import { MapPin, DollarSign, Clock, Star, Building, Award } from 'lucide-react';

interface SearchFiltersProps {
  onFiltersChange: (filters: any) => void;
}

export function SearchFilters({ onFiltersChange }: SearchFiltersProps) {
  const [filters, setFilters] = useState({
    location: '',
    salaryMin: '',
    salaryMax: '',
    experienceLevel: '',
    workStyle: [] as string[],
    restaurantType: '',
    rating: ''
  });

  const experienceLevels = ['1年未満', '1-3年', '3-5年', '5-10年', '10年以上'];
  const workStyles = ['フルタイム', 'パートタイム', '修行期間限定', '独立支援枠'];
  const restaurantTypes = ['フレンチ', 'イタリアン', '和食', '中華', 'スペイン料理', 'その他'];

  const handleWorkStyleToggle = (style: string) => {
    const newWorkStyles = filters.workStyle.includes(style)
      ? filters.workStyle.filter(s => s !== style)
      : [...filters.workStyle, style];

    const newFilters = { ...filters, workStyle: newWorkStyles };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  return (
    <Card variant="outline" size="lg">
      <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
        <Building className="w-5 h-5 text-[#CDAE58]" />
        詳細フィルタ
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Location */}
        <div>
          <label className="block text-sm font-medium mb-2 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-[#CDAE58]" />
            勤務地
          </label>
          <select
            value={filters.location}
            onChange={(e) => handleFilterChange('location', e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-[#1C1C1C]/20 focus:border-[#CDAE58] focus:outline-none"
          >
            <option value="">すべて</option>
            <option value="東京">東京</option>
            <option value="大阪">大阪</option>
            <option value="京都">京都</option>
            <option value="神奈川">神奈川</option>
            <option value="愛知">愛知</option>
          </select>
        </div>

        {/* Salary Range */}
        <div>
          <label className="block text-sm font-medium mb-2 flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-[#CDAE58]" />
            希望年収
          </label>
          <div className="flex gap-2 items-center">
            <select
              value={filters.salaryMin}
              onChange={(e) => handleFilterChange('salaryMin', e.target.value)}
              className="flex-1 px-3 py-2 rounded-lg border border-[#1C1C1C]/20 focus:border-[#CDAE58] focus:outline-none"
            >
              <option value="">下限</option>
              <option value="200">200万</option>
              <option value="300">300万</option>
              <option value="400">400万</option>
              <option value="500">500万</option>
            </select>
            <span className="text-[#1C1C1C]/40">〜</span>
            <select
              value={filters.salaryMax}
              onChange={(e) => handleFilterChange('salaryMax', e.target.value)}
              className="flex-1 px-3 py-2 rounded-lg border border-[#1C1C1C]/20 focus:border-[#CDAE58] focus:outline-none"
            >
              <option value="">上限</option>
              <option value="400">400万</option>
              <option value="500">500万</option>
              <option value="600">600万</option>
              <option value="700">700万</option>
              <option value="800">800万+</option>
            </select>
          </div>
        </div>

        {/* Experience Level */}
        <div>
          <label className="block text-sm font-medium mb-2 flex items-center gap-2">
            <Award className="w-4 h-4 text-[#CDAE58]" />
            経験年数
          </label>
          <select
            value={filters.experienceLevel}
            onChange={(e) => handleFilterChange('experienceLevel', e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-[#1C1C1C]/20 focus:border-[#CDAE58] focus:outline-none"
          >
            <option value="">すべて</option>
            {experienceLevels.map(level => (
              <option key={level} value={level}>{level}</option>
            ))}
          </select>
        </div>

        {/* Restaurant Type */}
        <div>
          <label className="block text-sm font-medium mb-2 flex items-center gap-2">
            <Building className="w-4 h-4 text-[#CDAE58]" />
            料理ジャンル
          </label>
          <select
            value={filters.restaurantType}
            onChange={(e) => handleFilterChange('restaurantType', e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-[#1C1C1C]/20 focus:border-[#CDAE58] focus:outline-none"
          >
            <option value="">すべて</option>
            {restaurantTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        {/* Restaurant Rating */}
        <div>
          <label className="block text-sm font-medium mb-2 flex items-center gap-2">
            <Star className="w-4 h-4 text-[#CDAE58]" />
            店舗評価
          </label>
          <select
            value={filters.rating}
            onChange={(e) => handleFilterChange('rating', e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-[#1C1C1C]/20 focus:border-[#CDAE58] focus:outline-none"
          >
            <option value="">すべて</option>
            <option value="4.5">4.5以上</option>
            <option value="4.0">4.0以上</option>
            <option value="3.5">3.5以上</option>
            <option value="3.0">3.0以上</option>
          </select>
        </div>
      </div>

      {/* Work Style */}
      <div className="mt-6">
        <label className="block text-sm font-medium mb-3 flex items-center gap-2">
          <Clock className="w-4 h-4 text-[#CDAE58]" />
          勤務形態
        </label>
        <div className="flex flex-wrap gap-3">
          {workStyles.map(style => (
            <motion.button
              key={style}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleWorkStyleToggle(style)}
              className={`px-4 py-2 rounded-full border transition-all ${
                filters.workStyle.includes(style)
                  ? 'border-[#CDAE58] bg-[#CDAE58] text-white'
                  : 'border-[#1C1C1C]/20 text-[#1C1C1C]/70 hover:border-[#CDAE58]'
              }`}
            >
              {style}
            </motion.button>
          ))}
        </div>
      </div>
    </Card>
  );
}