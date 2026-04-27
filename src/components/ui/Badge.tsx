import { HTMLAttributes, forwardRef } from 'react';
import { clsx } from 'clsx';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = 'default', children, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={clsx(
          'inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-semibold',
          variant === 'default' && 'bg-dark-800 text-dark-300',
          variant === 'success' && 'bg-emerald-500/15 text-emerald-400',
          variant === 'warning' && 'bg-amber-500/15 text-amber-400',
          variant === 'error' && 'bg-red-500/15 text-red-400',
          variant === 'info' && 'bg-blue-500/15 text-blue-400',
          className
        )}
        {...props}
      >
        {children}
      </span>
    );
  }
);

Badge.displayName = 'Badge';