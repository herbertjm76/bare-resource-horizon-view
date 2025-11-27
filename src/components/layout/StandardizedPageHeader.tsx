import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StandardizedPageHeaderProps {
  title: string;
  description: string;
  icon: LucideIcon;
  children?: React.ReactNode;
}

export const StandardizedPageHeader: React.FC<StandardizedPageHeaderProps> = ({
  title,
  description,
  icon: Icon,
  children
}) => {
  return (
    <div className="space-y-4 sm:space-y-6 mb-4 sm:mb-6">
      {/* Main Header Section with Subtle Background */}
      <div className="bg-card/50 border border-border rounded-lg shadow-sm">
        <div className="text-center py-4 sm:py-6">
          <div className="flex items-center justify-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'hsl(var(--theme-primary) / 0.1)' }}>
              <Icon className="h-5 w-5" style={{ color: 'hsl(var(--theme-primary))' }} />
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight" style={{ color: 'hsl(var(--theme-primary))' }}>
              {title}
            </h1>
          </div>
          <p className="text-muted-foreground text-lg hidden sm:block">
            {description}
          </p>
        </div>
      </div>

      {/* Additional content like stats cards */}
      {children && (
        <div className="flex flex-wrap items-center justify-center gap-3">
          {children}
        </div>
      )}
    </div>
  );
};