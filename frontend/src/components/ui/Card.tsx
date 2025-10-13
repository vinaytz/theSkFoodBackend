import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/utils/cn';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'outlined';
  interactive?: boolean;
  children: React.ReactNode;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', interactive = false, children, ...props }, ref) => {
    const baseClasses = 'rounded-xl bg-white transition-all duration-200';
    
    const variants = {
      default: 'shadow-card',
      elevated: 'shadow-card-hover',
      outlined: 'border border-neutral-200',
    };

    const interactiveClasses = interactive
      ? 'cursor-pointer hover:shadow-card-hover hover:-translate-y-0.5'
      : '';

    const Component = interactive ? motion.div : 'div';
    const motionProps = interactive
      ? {
          whileHover: { y: -2 },
          whileTap: { scale: 0.98 },
        }
      : {};

    return (
      <Component
        ref={ref as any}
        className={cn(baseClasses, variants[variant], interactiveClasses, className)}
        {...motionProps}
        {...(props as any)}
      >
        {children}
      </Component>
    );
  }
);

Card.displayName = 'Card';

export default Card;