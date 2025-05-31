
import React from 'react';
import { StandardizedExecutiveSummary } from './StandardizedExecutiveSummary';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PageMetric } from './utils/metricsCalculations';

interface StandardizedPageLayoutProps {
  title: string;
  icon: React.ReactNode;
  metrics: PageMetric[];
  cardTitle: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
}

export const StandardizedPageLayout: React.FC<StandardizedPageLayoutProps> = ({
  title,
  icon,
  metrics,
  cardTitle,
  children,
  actions
}) => {
  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Modern Header Section */}
      <div className="space-y-6 mb-6">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div className="space-y-2">
            <h1 className="text-3xl lg:text-4xl font-bold tracking-tight text-brand-primary flex items-center gap-3">
              {icon}
              {title}
            </h1>
          </div>
          {actions && (
            <div className="flex items-center gap-2">
              {actions}
            </div>
          )}
        </div>
      </div>

      {/* Executive Summary */}
      <StandardizedExecutiveSummary
        metrics={metrics}
        gradientType="purple"
      />

      {/* Main Content Card */}
      <Card>
        <CardHeader>
          <CardTitle>{cardTitle}</CardTitle>
        </CardHeader>
        <CardContent>
          {children}
        </CardContent>
      </Card>
    </div>
  );
};
