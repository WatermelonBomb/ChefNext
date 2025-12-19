import * as React from 'react';
import { cn } from './cn';

type CardVariant = 'solid' | 'muted' | 'outline';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  interactive?: boolean;
}

const variantClasses: Record<CardVariant, string> = {
  solid: 'bg-white shadow-[0_10px_50px_rgba(205,174,88,0.15)]',
  muted: 'bg-[#FAF8F4] border border-[#E4DCC3]',
  outline: 'bg-white border border-[#E4DCC3] shadow-sm',
};

const paddingClasses = {
  none: 'p-0',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
};

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'solid', padding = 'md', interactive, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'rounded-3xl transition-all duration-300',
        variantClasses[variant],
        paddingClasses[padding],
        interactive && 'hover:-translate-y-1 hover:shadow-[0_20px_60px_rgba(205,174,88,0.25)]',
        className,
      )}
      {...props}
    />
  ),
);

Card.displayName = 'Card';
