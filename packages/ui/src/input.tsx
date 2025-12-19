import * as React from 'react';
import { cn } from './cn';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  variant?: 'default' | 'outline';
  error?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, variant = 'default', error = false, type, ...props }, ref) => {
    const variantStyles = {
      default: 'border-[#1C1C1C]/20 focus:border-[#CDAE58]',
      outline: 'border-2 border-[#1C1C1C]/30 focus:border-[#CDAE58]',
    };

    return (
      <input
        type={type}
        className={cn(
          'flex w-full rounded-xl px-4 py-3 text-base transition-colors',
          'placeholder:text-[#1C1C1C]/40',
          'focus:outline-none disabled:cursor-not-allowed disabled:opacity-50',
          error ? 'border-red-500 focus:border-red-500' : variantStyles[variant],
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

Input.displayName = 'Input';

export { Input };
