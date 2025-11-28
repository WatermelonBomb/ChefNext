import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface ProgressiveImageLoaderProps {
  src: string;
  alt: string;
  className?: string;
  placeholder?: string;
}

export function ProgressiveImageLoader({
  src,
  alt,
  className = '',
  placeholder = 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=20&q=20'
}: ProgressiveImageLoaderProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Placeholder/Blur Image */}
      <motion.div
        initial={{ opacity: 1 }}
        animate={{ opacity: isLoaded ? 0 : 1 }}
        transition={{ duration: 0.3 }}
        className="absolute inset-0"
      >
        <ImageWithFallback
          src={placeholder}
          alt={alt}
          className="w-full h-full object-cover filter blur-md scale-110"
        />
        {/* Loading shimmer effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
      </motion.div>

      {/* High-quality Image */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoaded ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        className="relative"
      >
        <ImageWithFallback
          src={src}
          alt={alt}
          className="w-full h-full object-cover"
          onLoad={() => setIsLoaded(true)}
        />
      </motion.div>
    </div>
  );
}