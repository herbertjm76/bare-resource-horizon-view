
import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  "inline-flex items-center justify-center font-medium transition-all duration-200 hover:scale-105",
  {
    variants: {
      variant: {
        default: "bg-semantic-background-secondary text-semantic-text-secondary border border-semantic-border-primary",
        primary: "bg-brand-violet text-white border-0 shadow-sm",
        secondary: "bg-semantic-background-tertiary text-semantic-text-primary border border-semantic-border-secondary",
        success: "bg-green-100 text-green-800 border border-green-200",
        warning: "bg-orange-100 text-orange-800 border border-orange-200", 
        error: "bg-red-100 text-red-800 border border-red-200",
        info: "bg-blue-100 text-blue-800 border border-blue-200",
        status: "bg-semantic-background-accent text-brand-violet border border-brand-violet/20",
        metric: "bg-gradient-to-r from-brand-violet/10 to-brand-violet/5 text-brand-violet border border-brand-violet/20 font-semibold",
      },
      size: {
        sm: "text-xs px-2 py-0.5 h-5 rounded-full",
        default: "text-xs px-2.5 py-1 h-6 rounded-full",
        lg: "text-sm px-3 py-1.5 h-7 rounded-full",
        metric: "text-xs px-3 py-1 h-6 rounded-lg", // Special size for metrics
      },
      position: {
        default: "",
        'top-right': "ml-auto",
        'inline': "mx-1",
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      position: "default",
    },
  }
);

interface StandardizedBadgeProps 
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  children: React.ReactNode;
}

export const StandardizedBadge: React.FC<StandardizedBadgeProps> = ({ 
  children, 
  variant,
  size,
  position,
  className,
  ...props
}) => {
  return (
    <div 
      className={cn(badgeVariants({ variant, size, position }), className)}
      {...props}
    >
      {children}
    </div>
  );
};
