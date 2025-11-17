import React from 'react';
import { motion } from 'motion/react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'elevated' | 'glass' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  interactive?: boolean;
  onClick?: () => void;
}

export function Card({
  children,
  className = '',
  variant = 'default',
  size = 'md',
  interactive = false,
  onClick
}: CardProps) {
  const getVariantClasses = () => {
    switch (variant) {
      case 'elevated':
        return 'bg-white shadow-[0_8px_40px_rgba(205,174,88,0.12)] hover:shadow-[0_16px_60px_rgba(205,174,88,0.2)]';
      case 'glass':
        return 'bg-white/80 backdrop-blur-sm border border-[#CDAE58]/20 shadow-[0_4px_24px_rgba(205,174,88,0.1)]';
      case 'outline':
        return 'bg-white border-2 border-[#CDAE58]/20 hover:border-[#CDAE58]/40';
      default:
        return 'bg-white shadow-[0_4px_20px_rgba(205,174,88,0.1)] hover:shadow-[0_8px_32px_rgba(205,174,88,0.15)]';
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm': return 'p-4 rounded-xl';
      case 'lg': return 'p-10 rounded-3xl';
      default: return 'p-6 rounded-2xl';
    }
  };

  const Component = interactive ? motion.div : 'div';

  const motionProps = interactive ? {
    whileHover: { y: -4 },
    whileTap: { scale: 0.98 },
    transition: { duration: 0.2 }
  } : {};

  return (
    <Component
      onClick={onClick}
      className={`
        ${getVariantClasses()}
        ${getSizeClasses()}
        transition-all duration-300
        ${interactive ? 'cursor-pointer' : ''}
        ${className}
      `}
      {...motionProps}
    >
      {children}
    </Component>
  );
}