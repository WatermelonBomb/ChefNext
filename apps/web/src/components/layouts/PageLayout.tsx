import React from 'react';
import { motion } from 'motion/react';

interface PageLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  badge?: string;
  className?: string;
  backgroundType?: 'default' | 'gradient' | 'dark';
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

export function PageLayout({
  children,
  title,
  subtitle,
  badge,
  className = '',
  backgroundType = 'default',
  maxWidth = 'xl'
}: PageLayoutProps) {
  const getBackgroundClasses = () => {
    switch (backgroundType) {
      case 'gradient':
        return 'bg-gradient-to-br from-[#FAF8F4] via-[#F8F5EE] to-[#F4F0E6]';
      case 'dark':
        return 'bg-gradient-to-r from-[#1C1C1C] to-[#2C2C2C]';
      default:
        return 'bg-[#FAF8F4]';
    }
  };

  const getMaxWidthClasses = () => {
    switch (maxWidth) {
      case 'sm': return 'max-w-4xl';
      case 'md': return 'max-w-5xl';
      case 'lg': return 'max-w-6xl';
      case 'xl': return 'max-w-7xl';
      case 'full': return 'max-w-full';
      default: return 'max-w-7xl';
    }
  };

  const textColor = backgroundType === 'dark' ? 'text-white' : 'text-[#1C1C1C]';
  const subtitleColor = backgroundType === 'dark' ? 'text-white/80' : 'text-[#1C1C1C]/70';

  return (
    <div className={`min-h-screen ${getBackgroundClasses()} pt-24 pb-20 ${className}`} style={{ paddingTop: '120px' }}>
      <div className="w-full flex flex-col items-center px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16 max-w-4xl"
        >
          {badge && (
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1 }}
              className="inline-block px-6 py-2 bg-[#CDAE58]/10 rounded-full mb-6"
            >
              <span className="text-[#CDAE58] text-sm font-medium">{badge}</span>
            </motion.div>
          )}

          <h1 className={`mb-4 text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight ${textColor}`}>
            {title}
          </h1>

          {subtitle && (
            <p className={`text-lg sm:text-xl leading-relaxed max-w-3xl mx-auto ${subtitleColor}`}>
              {subtitle}
            </p>
          )}
        </motion.div>

        {/* Page Content */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className={`w-full ${getMaxWidthClasses()}`}
        >
          {children}
        </motion.div>
      </div>
    </div>
  );
}