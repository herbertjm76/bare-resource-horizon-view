
import React from 'react';
import { Calendar, Users, Building2, BarChart3, TrendingUp } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { useCompany } from '@/context/CompanyContext';
import { useWeeklyOverviewMetrics } from './WeeklyOverviewMetrics';

interface WeeklyOverviewHeaderProps {
  selectedWeek: Date;
}

export const WeeklyOverviewHeader: React.FC<WeeklyOverviewHeaderProps> = ({
  selectedWeek
}) => {
  const { company } = useCompany();
  const companyName = company?.name || 'Your Company';
  
  const { metrics, isLoading } = useWeeklyOverviewMetrics({ selectedWeek });

  if (isLoading) {
    return (
      <div className="space-y-4 sm:space-y-6 mb-4 sm:mb-6">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 sm:gap-6">
          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-brand-primary flex items-center gap-2 sm:gap-3">
              <Calendar className="h-6 w-6 sm:h-8 sm:w-8 text-brand-violet" strokeWidth={1.5} />
              Weekly Overview
            </h1>
          </div>
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <div className="h-10 sm:h-12 w-20 sm:w-24 bg-muted animate-pulse rounded"></div>
            <div className="h-10 sm:h-12 w-20 sm:w-24 bg-muted animate-pulse rounded"></div>
            <div className="h-10 sm:h-12 w-20 sm:w-24 bg-muted animate-pulse rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6 mb-4 sm:mb-6 print:hidden">
      {/* Main Header Section */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 sm:gap-6">
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-brand-primary flex items-center gap-2 sm:gap-3">
            <Calendar className="h-6 w-6 sm:h-8 sm:w-8 text-brand-violet" strokeWidth={1.5} />
            Weekly Overview
          </h1>
        </div>
        
        {/* Quick Stats Cards */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <Card className="px-3 py-2 sm:px-4 bg-gradient-to-r from-brand-violet/10 to-brand-violet/5 border-brand-violet/20">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-brand-violet" strokeWidth={1.5} />
              <div className="text-xs sm:text-sm">
                <span className="font-semibold text-brand-violet">{metrics[0]?.value || 0}</span>
                <span className="text-muted-foreground ml-1">Projects</span>
              </div>
            </div>
          </Card>
          
          <Card className="px-3 py-2 sm:px-4 bg-gradient-to-r from-emerald-500/10 to-emerald-500/5 border-emerald-500/20">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-emerald-600" strokeWidth={1.5} />
              <div className="text-xs sm:text-sm">
                <span className="font-semibold text-emerald-600">{metrics[1]?.value || '0%'}</span>
                <span className="text-muted-foreground ml-1">Utilization</span>
              </div>
            </div>
          </Card>
          
          <Card className="px-3 py-2 sm:px-4 bg-gradient-to-r from-blue-500/10 to-blue-500/5 border-blue-500/20">
            <div className="flex items-center gap-2">
              <Users className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-blue-600" strokeWidth={1.5} />
              <div className="text-xs sm:text-sm">
                <span className="font-semibold text-blue-600">{metrics[2]?.value || 0}</span>
                <span className="text-muted-foreground ml-1">Members</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
