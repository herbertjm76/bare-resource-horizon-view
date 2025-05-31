
import React from 'react';
import { cn } from '@/lib/utils';
import { typography } from '@/styles/typography';

// Typography component props
interface TypographyProps {
  children: React.ReactNode;
  className?: string;
  as?: keyof JSX.IntrinsicElements;
}

// Heading components
export const H1: React.FC<TypographyProps> = ({ children, className, as: Component = 'h1' }) => (
  <Component className={cn('text-heading-1 text-text-primary', className)}>
    {children}
  </Component>
);

export const H2: React.FC<TypographyProps> = ({ children, className, as: Component = 'h2' }) => (
  <Component className={cn('text-heading-2 text-text-primary', className)}>
    {children}
  </Component>
);

export const H3: React.FC<TypographyProps> = ({ children, className, as: Component = 'h3' }) => (
  <Component className={cn('text-heading-3 text-text-primary', className)}>
    {children}
  </Component>
);

export const H4: React.FC<TypographyProps> = ({ children, className, as: Component = 'h4' }) => (
  <Component className={cn('text-heading-4 text-text-primary', className)}>
    {children}
  </Component>
);

export const H5: React.FC<TypographyProps> = ({ children, className, as: Component = 'h5' }) => (
  <Component className={cn('text-heading-5 text-text-primary', className)}>
    {children}
  </Component>
);

export const H6: React.FC<TypographyProps> = ({ children, className, as: Component = 'h6' }) => (
  <Component className={cn('text-heading-6 text-text-primary', className)}>
    {children}
  </Component>
);

// Body text components
export const BodyLarge: React.FC<TypographyProps> = ({ children, className, as: Component = 'p' }) => (
  <Component className={cn('text-body-lg text-text-primary', className)}>
    {children}
  </Component>
);

export const Body: React.FC<TypographyProps> = ({ children, className, as: Component = 'p' }) => (
  <Component className={cn('text-body text-text-primary', className)}>
    {children}
  </Component>
);

export const BodySmall: React.FC<TypographyProps> = ({ children, className, as: Component = 'p' }) => (
  <Component className={cn('text-body-sm text-text-secondary', className)}>
    {children}
  </Component>
);

export const BodyXS: React.FC<TypographyProps> = ({ children, className, as: Component = 'p' }) => (
  <Component className={cn('text-body-xs text-text-tertiary', className)}>
    {children}
  </Component>
);

// UI text components
export const Label: React.FC<TypographyProps> = ({ children, className, as: Component = 'label' }) => (
  <Component className={cn('text-ui-label text-text-primary', className)}>
    {children}
  </Component>
);

export const Caption: React.FC<TypographyProps> = ({ children, className, as: Component = 'span' }) => (
  <Component className={cn('text-ui-caption text-text-tertiary', className)}>
    {children}
  </Component>
);

// Specialized text components
export const KPI: React.FC<TypographyProps> = ({ children, className, as: Component = 'div' }) => (
  <Component className={cn('text-kpi text-text-primary', className)}>
    {children}
  </Component>
);

// Generic typography component with variant prop
interface GenericTypographyProps extends TypographyProps {
  variant: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'body-lg' | 'body' | 'body-sm' | 'body-xs' | 'label' | 'caption' | 'kpi';
}

export const Typography: React.FC<GenericTypographyProps> = ({ 
  variant, 
  children, 
  className, 
  as 
}) => {
  const getDefaultElement = (variant: string) => {
    if (variant.startsWith('h')) return variant as keyof JSX.IntrinsicElements;
    if (variant === 'label') return 'label';
    if (variant === 'caption') return 'span';
    return 'p';
  };

  const Component = as || getDefaultElement(variant);
  const variantClass = `text-${variant.replace('-', '-')}`;
  
  const getTextColor = (variant: string) => {
    if (variant.startsWith('h') || variant === 'body-lg' || variant === 'body' || variant === 'label' || variant === 'kpi') {
      return 'text-text-primary';
    }
    if (variant === 'body-sm') return 'text-text-secondary';
    return 'text-text-tertiary';
  };

  return (
    <Component className={cn(variantClass, getTextColor(variant), className)}>
      {children}
    </Component>
  );
};
