
import React from 'react';
import { DollarSign } from 'lucide-react';

interface SummaryMetric {
  title: string;
  value: string | number;
  subtitle?: string;
  badgeText?: string;
  badgeColor?: string;
}

interface StandardizedExecutiveSummaryProps {
  title?: string;
  timeRangeText?: string;
  metrics: SummaryMetric[];
}

export const StandardizedExecutiveSummary: React.FC<StandardizedExecutiveSummaryProps> = ({
  title = "Executive Summary",
  timeRangeText = "This Month",
  metrics
}) => {
  const getBadgeClasses = (color?: string) => {
    switch (color) {
      case 'green': return 'bg-green-100 text-green-800';
      case 'red': return 'bg-red-100 text-red-800';
      case 'orange': return 'bg-orange-100 text-orange-800';
      case 'blue': return 'bg-blue-100 text-blue-800';
      case 'yellow': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  return (
    <div 
      className="rounded-2xl p-6 border border-brand-violet/10 shadow-lg bg-[linear-gradient(180deg,#4A2A93_0%,#1E2C6C_45%,#682A6D_100%)]"
    >
      <div className="text-white mb-6">
        <h2 className="text-xl font-bold mb-2 flex items-center gap-2">
          <DollarSign className="h-5 w-5" />
          {title}
          <span className="text-sm font-normal ml-2 bg-white/30 px-2 py-0.5 rounded">
            {timeRangeText}
          </span>
        </h2>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => (
          <div key={index} className="bg-white/60 backdrop-blur-sm rounded-xl p-6 shadow-md text-center">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">
              {metric.title}
            </h3>
            <div className="mb-4">
              <div className="text-4xl font-bold text-gray-900 mb-2">
                {metric.value}
              </div>
              {metric.subtitle && (
                <p className="text-xs text-gray-500">
                  {metric.subtitle}
                </p>
              )}
              {metric.badgeText && (
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium mt-2 ${getBadgeClasses(metric.badgeColor)}`}>
                  {metric.badgeText}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
