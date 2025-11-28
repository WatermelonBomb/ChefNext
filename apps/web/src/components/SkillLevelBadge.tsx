import React from 'react';
import { motion } from 'motion/react';

interface SkillLevelBadgeProps {
  level: number;
  label: string;
  isActive?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function SkillLevelBadge({
  level,
  label,
  isActive = false,
  size = 'md'
}: SkillLevelBadgeProps) {
  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-12 h-12 text-sm',
    lg: 'w-16 h-16 text-base'
  };

  const getSkillColor = (level: number) => {
    if (level === 0) return 'from-gray-400 to-gray-500';
    if (level <= 2) return 'from-blue-400 to-blue-500';
    if (level <= 3) return 'from-green-400 to-green-500';
    if (level <= 4) return 'from-yellow-400 to-yellow-500';
    return 'from-purple-400 to-purple-500';
  };

  const getSkillTitle = (level: number) => {
    if (level === 0) return '未習得';
    if (level <= 2) return '初級';
    if (level <= 3) return '中級';
    if (level <= 4) return '上級';
    return 'マスター';
  };

  return (
    <motion.div
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      className={`
        ${sizeClasses[size]}
        bg-gradient-to-br ${getSkillColor(level)}
        rounded-full
        flex items-center justify-center
        shadow-lg
        text-white font-bold
        cursor-pointer
        transition-all duration-200
        ${isActive ? 'ring-4 ring-[#CDAE58]/50' : ''}
        relative
        group
      `}
      title={`${label} - ${getSkillTitle(level)} (Lv.${level})`}
    >
      <span>{level}</span>

      {/* Skill level indicator dots */}
      <div className="absolute -bottom-1 flex gap-0.5">
        {Array.from({ length: 5 }, (_, i) => (
          <div
            key={i}
            className={`w-1 h-1 rounded-full transition-all ${
              i < level ? 'bg-white' : 'bg-white/30'
            }`}
          />
        ))}
      </div>

      {/* Tooltip */}
      <div className="absolute bottom-full mb-2 px-2 py-1 bg-black/80 text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
        {label} - Lv.{level}
      </div>
    </motion.div>
  );
}