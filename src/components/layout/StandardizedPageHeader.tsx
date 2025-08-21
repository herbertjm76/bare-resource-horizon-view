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
    <div className="space-y-6 mb-6">
      {/* Main Header Section with Purple Background */}
      <div className="bg-gradient-to-r from-indigo-950 to-purple-950 rounded-lg">
        <div className="text-center py-6">
          <div className="flex items-center justify-center gap-3 mb-2">
            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
              <Icon className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-3xl lg:text-4xl font-bold text-white tracking-tight">
              {title}
            </h1>
          </div>
          <p className="text-white/90 text-lg">
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