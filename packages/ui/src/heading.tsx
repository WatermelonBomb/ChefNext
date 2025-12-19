import * as React from 'react';
import { cn } from './cn';

export interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  weight?: 'normal' | 'medium' | 'semibold' | 'bold';
}

const Heading = React.forwardRef<HTMLHeadingElement, HeadingProps>(
  ({ className, level = 2, weight = 'bold', ...props }, ref) => {
    const Component = `h${level}` as keyof JSX.IntrinsicElements;

    const levelStyles = {
      1: 'text-4xl',
      2: 'text-3xl',
      3: 'text-2xl',
      4: 'text-xl',
      5: 'text-lg',
      6: 'text-base',
    };

    const weightStyles = {
      normal: 'font-normal',
      medium: 'font-medium',
      semibold: 'font-semibold',
      bold: 'font-bold',
    };

    return React.createElement(
      Component,
      {
        ref,
        className: cn(
          'text-[#1C1C1C]',
          levelStyles[level],
          weightStyles[weight],
          className
        ),
        ...props
      }
    );
  }
);

Heading.displayName = 'Heading';

export { Heading };
