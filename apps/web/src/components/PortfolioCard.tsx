import React from 'react';
import { motion } from 'motion/react';
import { Tag } from './Tag';
import { Flame, Droplet, Scissors } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface PortfolioCardProps {
  imageUrl: string;
  title: string;
  description: string;
  skills: string[];
  className?: string;
}

const skillIcons: { [key: string]: any } = {
  '火入れ': Flame,
  'ソース': Droplet,
  '盛付け': Scissors
};

export function PortfolioCard({ imageUrl, title, description, skills, className = '' }: PortfolioCardProps) {
  return (
    <motion.div
      whileHover={{
        y: -12,
        rotate: [0, -1, 1, 0],
        boxShadow: '0 20px 60px rgba(205, 174, 88, 0.2)'
      }}
      transition={{
        y: { duration: 0.3 },
        rotate: { duration: 0.6 },
        boxShadow: { duration: 0.3 }
      }}
      className={`group relative bg-white rounded-3xl overflow-hidden cursor-pointer transform-gpu ${className}`}
    >
      {/* Premium Border Effect */}
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-[#CDAE58]/20 via-[#F2E6B6]/10 to-[#CDAE58]/20 p-[1px] group-hover:from-[#CDAE58]/40 group-hover:to-[#CDAE58]/40 transition-all duration-300">
        <div className="h-full w-full rounded-3xl bg-white" />
      </div>

      <div className="relative">
        {/* Enhanced Image Section */}
        <div className="relative h-80 overflow-hidden rounded-t-3xl">
          <ImageWithFallback
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:brightness-110"
          />

          {/* Floating Chef's Touch Badge */}
          <div className="absolute top-4 right-4 px-3 py-1 bg-white/95 backdrop-blur-sm rounded-full border border-[#CDAE58]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <span className="text-xs text-[#CDAE58] font-medium">Chef's Touch</span>
          </div>

          {/* Enhanced Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-300" />

          {/* Skills Preview on Hover */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileHover={{ opacity: 1, y: 0 }}
            className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          >
            <div className="flex flex-wrap gap-1">
              {skills.slice(0, 2).map((skill, index) => (
                <div
                  key={index}
                  className="px-2 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs text-[#1C1C1C] font-medium"
                >
                  {skill}
                </div>
              ))}
              {skills.length > 2 && (
                <div className="px-2 py-1 bg-[#CDAE58]/90 backdrop-blur-sm rounded-full text-xs text-white font-medium">
                  +{skills.length - 2}
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Enhanced Content Section */}
        <div className="p-8">
          <div className="mb-6">
            <h4 className="text-xl font-semibold mb-3 group-hover:text-[#CDAE58] transition-colors duration-300">
              {title}
            </h4>
            <p className="text-sm text-[#1C1C1C]/70 leading-relaxed overflow-hidden" style={{
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical' as const
            }}>
              {description}
            </p>
          </div>

          {/* Skills Section with Enhanced Spacing */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-1 h-1 bg-[#CDAE58] rounded-full" />
              <span className="text-xs text-[#1C1C1C]/60 font-medium uppercase tracking-wider">Techniques</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill, index) => (
                <Tag
                  key={index}
                  label={skill}
                  icon={skillIcons[skill]}
                  variant="skill"
                  className="hover:scale-105 transition-transform duration-200"
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
