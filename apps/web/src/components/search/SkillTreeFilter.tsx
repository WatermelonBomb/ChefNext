import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Card } from '../common/Card';
import { SkillTreeNode } from '../SkillTreeNode';
import { Flame, Droplet, Scissors, Users, TrendingUp, Award } from 'lucide-react';

interface SkillTreeFilterProps {
  selectedSkills: string[];
  onSkillToggle: (skill: string) => void;
}

export function SkillTreeFilter({ selectedSkills, onSkillToggle }: SkillTreeFilterProps) {
  const skills = [
    { name: '火入れ', icon: Flame, description: '素材の特性を活かした加熱技術' },
    { name: 'ソース', icon: Droplet, description: '風味豊かなソース作り' },
    { name: '盛付け', icon: Scissors, description: '美しい盛り付けとプレゼンテーション' },
    { name: 'チームマネジメント', icon: Users, description: 'キッチンチームの統率' },
    { name: '原価管理', icon: TrendingUp, description: '効率的なコスト管理' },
    { name: '仕込み', icon: Award, description: '下ごしらえと食材準備' }
  ];

  return (
    <Card variant="glass" size="lg">
      <div className="text-center mb-8">
        <h2 className="text-xl font-bold mb-2">スキルツリーで探す</h2>
        <p className="text-[#1C1C1C]/60">
          学びたいスキルを選択して、成長できる職場を見つけよう
        </p>
      </div>

      {/* Interactive Skill Tree */}
      <div className="relative h-96 bg-gradient-to-br from-[#FAF8F4] to-[#F5F3EF] rounded-2xl mb-8 overflow-hidden">
        {/* Center Node - You */}
        <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-gradient-to-br from-[#CDAE58] to-[#F2E6B6] rounded-full flex items-center justify-center shadow-lg z-10">
          <span className="font-bold text-white text-sm">YOU</span>
        </div>

        {/* Skill Nodes */}
        {skills.map((skill, index) => {
          const angle = (360 / skills.length) * index;
          const distance = 140;
          const x = Math.cos((angle - 90) * Math.PI / 180) * distance;
          const y = Math.sin((angle - 90) * Math.PI / 180) * distance;
          const isSelected = selectedSkills.includes(skill.name);

          return (
            <div key={skill.name}>
              {/* Connection Line */}
              <motion.div
                className={`absolute left-1/2 top-1/2 w-0.5 origin-bottom transition-colors ${
                  isSelected ? 'bg-[#CDAE58]' : 'bg-[#1C1C1C]/20'
                }`}
                style={{
                  height: distance,
                  transform: `translate(-50%, -50%) rotate(${angle}deg)`,
                }}
                animate={{
                  backgroundColor: isSelected ? '#CDAE58' : 'rgba(28, 28, 28, 0.2)',
                }}
              />

              {/* Skill Node */}
              <motion.button
                onClick={() => onSkillToggle(skill.name)}
                className={`absolute w-12 h-12 rounded-full flex items-center justify-center transition-all group ${
                  isSelected
                    ? 'bg-[#CDAE58] text-white shadow-lg scale-110'
                    : 'bg-white text-[#CDAE58] border-2 border-[#CDAE58]/40 hover:border-[#CDAE58] hover:shadow-md'
                }`}
                style={{
                  left: `calc(50% + ${x}px - 24px)`,
                  top: `calc(50% + ${y}px - 24px)`,
                }}
                whileHover={{ scale: isSelected ? 1.15 : 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <skill.icon className="w-5 h-5" />

                {/* Tooltip */}
                <motion.div
                  className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                  initial={{ opacity: 0, y: 10 }}
                  whileHover={{ opacity: 1, y: 0 }}
                >
                  <div className="bg-[#1C1C1C] text-white text-xs rounded-lg px-2 py-1 whitespace-nowrap">
                    {skill.name}
                  </div>
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-l-4 border-r-4 border-t-4 border-transparent border-t-[#1C1C1C]"></div>
                </motion.div>
              </motion.button>
            </div>
          );
        })}
      </div>

      {/* Skill List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {skills.map((skill) => {
          const isSelected = selectedSkills.includes(skill.name);
          return (
            <motion.button
              key={skill.name}
              onClick={() => onSkillToggle(skill.name)}
              className={`p-4 rounded-xl border text-left transition-all ${
                isSelected
                  ? 'border-[#CDAE58] bg-[#CDAE58] text-white'
                  : 'border-[#1C1C1C]/20 hover:border-[#CDAE58] hover:bg-[#CDAE58]/5'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center gap-3 mb-2">
                <skill.icon className={`w-5 h-5 ${isSelected ? 'text-white' : 'text-[#CDAE58]'}`} />
                <span className="font-medium">{skill.name}</span>
                {isSelected && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="ml-auto w-5 h-5 bg-white/20 rounded-full flex items-center justify-center"
                  >
                    ✓
                  </motion.div>
                )}
              </div>
              <p className={`text-sm ${isSelected ? 'text-white/80' : 'text-[#1C1C1C]/60'}`}>
                {skill.description}
              </p>
            </motion.button>
          );
        })}
      </div>

      {/* Selected Skills Summary */}
      {selectedSkills.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 p-4 bg-[#CDAE58]/10 rounded-xl border border-[#CDAE58]/20"
        >
          <h4 className="font-semibold mb-2">選択中のスキル ({selectedSkills.length}個)</h4>
          <div className="flex flex-wrap gap-2">
            {selectedSkills.map(skill => (
              <span
                key={skill}
                className="px-3 py-1 bg-[#CDAE58] text-white rounded-full text-sm"
              >
                {skill}
              </span>
            ))}
          </div>
        </motion.div>
      )}
    </Card>
  );
}