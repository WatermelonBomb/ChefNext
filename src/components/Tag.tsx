import React from 'react';
import { LucideIcon, X } from 'lucide-react';

interface TagProps {
  label: string;
  icon?: LucideIcon;
  variant?: 'default' | 'skill' | 'category' | 'required';
  onRemove?: () => void;
  className?: string;
}

export function Tag({ label, icon: Icon, variant = 'default', onRemove, className = '' }: TagProps) {
  const variants = {
    default: 'bg-[#F2E6B6] text-[#1C1C1C]',
    skill: 'bg-[#8BA497]/20 text-[#1C1C1C] border border-[#8BA497]/30',
    category: 'bg-[#CDAE58]/20 text-[#1C1C1C] border border-[#CDAE58]/40',
    required: 'bg-red-50 text-red-600 border border-red-200'
  };

  return (
    <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full ${variants[variant]} ${className}`}>
      {Icon && <Icon className="w-3.5 h-3.5" />}
      <span className="text-sm font-medium">{label}</span>
      {onRemove && (
        <button
          onClick={onRemove}
          className="ml-1 p-0.5 rounded-full hover:bg-black/10 transition-colors"
        >
          <X className="w-3 h-3" />
        </button>
      )}
    </div>
  );
}
