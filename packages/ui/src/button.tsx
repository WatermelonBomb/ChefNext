import * as React from 'react';
import { cn } from './cn';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'outline';
type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-[#CDAE58] text-white hover:bg-[#C09730] focus-visible:ring-[#E1C977]',
  secondary:
    'bg-[#FAF8F4] text-[#1C1C1C] border border-[#E4DCC3] hover:border-[#CDAE58] focus-visible:ring-[#E1C977]/60',
  ghost: 'text-[#1C1C1C] hover:bg-black/5 focus-visible:ring-[#CDAE58]/40',
  outline:
    'border border-[#CDAE58] text-[#CDAE58] hover:bg-[#CDAE58]/10 focus-visible:ring-[#E1C977]'
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'h-9 px-4 text-sm',
  md: 'h-11 px-6 text-base',
  lg: 'h-12 px-8 text-base'
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', children, isLoading, disabled, ...props }, ref) => {
    const isDisabled = disabled || isLoading;
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center rounded-xl font-medium transition-all focus-visible:outline-none focus-visible:ring-2 disabled:cursor-not-allowed disabled:opacity-60 gap-2',
          variantClasses[variant],
          sizeClasses[size],
          className,
        )}
        disabled={isDisabled}
        {...props}
      >
        {isLoading && (
          <span className="inline-block size-4 rounded-full border-2 border-white/60 border-t-transparent animate-spin" aria-hidden />
        )}
        {children}
      </button>
    );
  },
);

Button.displayName = 'Button';
