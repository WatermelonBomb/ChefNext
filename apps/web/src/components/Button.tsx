import React from 'react';
import { motion } from 'motion/react';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
}

export function Button({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  onClick, 
  className = '',
  type = 'button'
}: ButtonProps) {
  const baseStyles = 'rounded-xl font-medium transition-all duration-300 ease-out cursor-pointer inline-flex items-center justify-center gap-2';
  
  const variants = {
    primary: 'bg-[#CDAE58] text-[#1C1C1C] hover:shadow-[0_4px_24px_rgba(205,174,88,0.3)] hover:scale-105',
    secondary: 'bg-transparent border-2 border-[#1C1C1C] text-[#1C1C1C] hover:bg-[#1C1C1C] hover:text-[#FAF8F4]',
    ghost: 'bg-transparent text-[#1C1C1C] hover:bg-[#CDAE58]/10'
  };
  
  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3',
    lg: 'px-8 py-4 text-lg'
  };
  
  return (
    <motion.button
      type={type}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {children}
    </motion.button>
  );
}
