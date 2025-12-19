import * as React from 'react';
import { cn } from './cn';

type BadgeVariant = 'default' | 'success' | 'warning' | 'outline';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  pill?: boolean;
}

const variantClasses: Record<BadgeVariant, string> = {
  default: 'bg-[#F7F1E0] text-[#7A5A20]',
  success: 'bg-emerald-50 text-emerald-700',
  warning: 'bg-amber-100 text-amber-800',
  outline: 'border border-[#E4DCC3] text-[#1C1C1C]',
};

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = 'default', pill = true, ...props }, ref) => (
    <span
      ref={ref}
      className={cn(
        'inline-flex items-center gap-1 text-xs font-medium px-3 py-1',
        pill ? 'rounded-full' : 'rounded-lg',
        variantClasses[variant],
        className,
      )}
      {...props}
    />
  ),
);

Badge.displayName = 'Badge';
