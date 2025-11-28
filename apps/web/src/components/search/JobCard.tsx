import React from 'react';
import { motion } from 'motion/react';
import { Card } from '../common/Card';
import { Tag } from '../Tag';
import { Button } from '../Button';
import {
  MapPin,
  Star,
  Clock,
  DollarSign,
  Flame,
  Droplet,
  Scissors,
  Users,
  TrendingUp,
  Award,
  Heart,
  MessageSquare
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

interface JobCardProps {
  job: Job;
}

const skillIcons: { [key: string]: React.ComponentType<{ className?: string }> } = {
  '火入れ': Flame,
  'ソース': Droplet,
  '盛付け': Scissors,
  'チームマネジメント': Users,
  '仕込み': Award,
  '原価管理': TrendingUp
};

export function JobCard({ job }: JobCardProps) {
  const [isFavorited, setIsFavorited] = React.useState(false);

  return (
    <Card
      variant={job.featured ? "elevated" : "outline"}
      className={`group hover:shadow-xl transition-all duration-300 ${
        job.featured ? 'ring-2 ring-[#CDAE58]/20' : ''
      }`}
    >
      <div className="flex gap-6">
        {/* Restaurant Image */}
        <div className="flex-shrink-0">
          <div className="w-20 h-20 rounded-xl overflow-hidden bg-gray-100">
            <img
              src={job.restaurant.image}
              alt={job.restaurant.name}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-lg font-semibold text-[#1C1C1C]">
                  {job.position}
                </h3>
                {job.featured && (
                  <span className="px-2 py-1 bg-[#CDAE58] text-white text-xs rounded-full">
                    注目
                  </span>
                )}
              </div>
              <div className="flex items-center gap-4 text-sm text-[#1C1C1C]/60">
                <span className="font-medium">{job.restaurant.name}</span>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-[#CDAE58] text-[#CDAE58]" />
                  <span>{job.restaurant.rating}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  <span>{job.restaurant.location}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{job.posted}</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsFavorited(!isFavorited)}
              className={`p-2 rounded-lg transition-colors ${
                isFavorited
                  ? 'text-red-500 bg-red-50'
                  : 'text-[#1C1C1C]/40 hover:text-red-500 hover:bg-red-50'
              }`}
            >
              <Heart className={`w-5 h-5 ${isFavorited ? 'fill-current' : ''}`} />
            </button>
          </div>

          {/* Skills You Can Learn */}
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-[#CDAE58]" />
              <span className="text-sm font-medium text-[#CDAE58]">
                学べるスキル
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {job.skillsYouCanLearn.map(skill => {
                const IconComponent = skillIcons[skill];
                return (
                  <Tag
                    key={skill}
                    label={skill}
                    icon={IconComponent}
                    variant="skill"
                  />
                );
              })}
            </div>
          </div>

          {/* Required Skills */}
          {job.skillsRequired.length > 0 && (
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <Award className="w-4 h-4 text-[#1C1C1C]/60" />
                <span className="text-sm font-medium text-[#1C1C1C]/60">
                  必要スキル
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {job.skillsRequired.map(skill => {
                  const IconComponent = skillIcons[skill];
                  return (
                    <Tag
                      key={skill}
                      label={skill}
                      icon={IconComponent}
                      variant="required"
                    />
                  );
                })}
              </div>
            </div>
          )}

          {/* Job Details */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-[#1C1C1C]/70 mb-4">
            <div className="flex items-center gap-1">
              <DollarSign className="w-4 h-4" />
              <span>{job.salary}</span>
            </div>
            <span>•</span>
            <span>{job.experienceLevel}</span>
            <span>•</span>
            <div className="flex gap-1">
              {job.workStyle.map(style => (
                <span key={style} className="text-xs bg-gray-100 px-2 py-1 rounded">
                  {style}
                </span>
              ))}
            </div>
          </div>

          {/* Description */}
          <p className="text-[#1C1C1C]/70 text-sm mb-4 line-clamp-2">
            {job.description}
          </p>

          {/* Actions */}
          <div className="flex gap-3">
            <Button
              variant="primary"
              size="sm"
              className="flex-1"
            >
              応募する
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center gap-2"
            >
              <MessageSquare className="w-4 h-4" />
              相談
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}