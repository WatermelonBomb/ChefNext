import React from 'react';
import { motion } from 'motion/react';
import { Tag } from './Tag';
import { MapPin, Clock, DollarSign, Flame } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface JobCardProps {
  imageUrl: string;
  restaurantName: string;
  location: string;
  skills: string[];
  salary: string;
  duration: string;
  isPopular?: boolean;
  type: string;
  onClick?: () => void;
}

export function JobCard({ 
  imageUrl, 
  restaurantName, 
  location, 
  skills, 
  salary, 
  duration, 
  isPopular = false,
  type,
  onClick 
}: JobCardProps) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      onClick={onClick}
      className="bg-white rounded-2xl overflow-hidden shadow-[0_4px_20px_rgba(205,174,88,0.1)] cursor-pointer hover:shadow-[0_8px_32px_rgba(205,174,88,0.2)] transition-shadow duration-300"
    >
      <div className="relative h-48 overflow-hidden">
        <ImageWithFallback
          src={imageUrl}
          alt={restaurantName}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        
        {isPopular && (
          <div className="absolute top-3 right-3 bg-[#C23E35] text-white px-3 py-1 rounded-full flex items-center gap-1">
            <Flame className="w-4 h-4" />
            <span className="text-sm font-medium">人気</span>
          </div>
        )}
        
        <div className="absolute bottom-3 left-3">
          <h4 className="text-white mb-1">{restaurantName}</h4>
          <div className="flex items-center gap-1 text-white/90 text-sm">
            <MapPin className="w-4 h-4" />
            <span>{location}</span>
          </div>
        </div>
      </div>
      
      <div className="p-5">
        <div className="mb-3">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm text-[#1C1C1C]/60">📚 学べるスキル：</span>
            <div className="w-2 h-2 bg-[#CDAE58] rounded-full animate-pulse" />
          </div>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill, index) => (
              <Tag
                key={index}
                label={skill}
                variant="skill"
                className="hover:bg-[#CDAE58] hover:text-white transition-colors cursor-pointer"
              />
            ))}
          </div>
        </div>
        
        <div className="flex items-center justify-between text-sm border-t border-[#1C1C1C]/10 pt-3">
          <div className="flex items-center gap-1 text-[#1C1C1C]/70">
            <DollarSign className="w-4 h-4" />
            <span>{salary}</span>
          </div>
          <div className="flex items-center gap-1 text-[#1C1C1C]/70">
            <Clock className="w-4 h-4" />
            <span>{duration}</span>
          </div>
        </div>
        
        <div className="mt-3">
          <Tag label={type} variant="category" />
        </div>
      </div>
    </motion.div>
  );
}
