import React from 'react';
import { motion } from 'motion/react';

interface SkillTreeNodeProps {
  skill: string;
  level: number; // 0-5
  isLearning?: boolean;
  angle: number;
  distance: number;
}

export function SkillTreeNode({ skill, level, isLearning = false, angle, distance }: SkillTreeNodeProps) {
  const x = Math.cos((angle * Math.PI) / 180) * distance;
  const y = Math.sin((angle * Math.PI) / 180) * distance;
  
  const getColor = (level: number) => {
    const colors = [
      '#E5E5E5', // Level 0
      '#F2E6B6', // Level 1
      '#E8D89F', // Level 2
      '#DECA88', // Level 3
      '#D4BC71', // Level 4
      '#CDAE58'  // Level 5
    ];
    return colors[level];
  };
  
  const getSize = (level: number) => {
    return 60 + (level * 8); // 60px to 100px
  };
  
  const size = getSize(level);
  const color = getColor(level);
  
  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.4, delay: angle / 360 }}
      style={{
        position: 'absolute',
        left: '50%',
        top: '50%',
        transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`
      }}
      className="flex flex-col items-center"
    >
      <motion.div
        whileHover={{ scale: 1.1 }}
        style={{
          width: size,
          height: size,
          backgroundColor: color,
          boxShadow: isLearning ? '0 0 20px rgba(205, 174, 88, 0.6)' : 'none'
        }}
        className="rounded-full flex items-center justify-center border-2 border-white shadow-lg cursor-pointer relative"
      >
        {isLearning && (
          <motion.div
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.5, 0, 0.5]
            }}
            transition={{
              duration: 2,
              repeat: Infinity
            }}
            className="absolute inset-0 rounded-full border-2 border-[#CDAE58]"
          />
        )}
        <span className="text-xs font-medium text-center px-2">{skill}</span>
      </motion.div>
      <div className="mt-2 text-xs text-[#1C1C1C]/60">Lv.{level}</div>
    </motion.div>
  );
}
