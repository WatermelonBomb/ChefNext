import * as React from 'react';
import { cn } from './cn';

export interface TextProps extends React.HTMLAttributes<HTMLParagraphElement> {
  variant?: 'body' | 'small' | 'large' | 'caption';
  weight?: 'normal' | 'medium' | 'semibold' | 'bold';
  color?: 'default' | 'muted' | 'primary';
}

const Text = React.forwardRef<HTMLParagraphElement, TextProps>(
  ({ className, variant = 'body', weight = 'normal', color = 'default', ...props }, ref) => {
    const variantStyles = {
      body: 'text-base',
      small: 'text-sm',
      large: 'text-lg',
      caption: 'text-xs',
    };

    const weightStyles = {
      normal: 'font-normal',
      medium: 'font-medium',
      semibold: 'font-semibold',
      bold: 'font-bold',
    };

    const colorStyles = {
      default: 'text-[#1C1C1C]',
      muted: 'text-[#1C1C1C]/60',
      primary: 'text-[#CDAE58]',
    };

    return (
      <p
        ref={ref}
        className={cn(
          variantStyles[variant],
          weightStyles[weight],
          colorStyles[color],
          className
        )}
        {...props}
      />
    );
  }
);

Text.displayName = 'Text';

export { Text };
