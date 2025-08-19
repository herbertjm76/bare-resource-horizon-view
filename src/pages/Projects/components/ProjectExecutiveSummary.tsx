import React from 'react';
import { StandardizedExecutiveSummary } from '@/components/dashboard/StandardizedExecutiveSummary';
import { TrendingUp, FolderOpen, CheckCircle, Building } from 'lucide-react';

interface ProjectExecutiveSummaryProps {
  totalProjects: number;
  activeProjects: number;
  completionRate: number;
  totalOffices: number;
}

export const ProjectExecutiveSummary: React.FC<ProjectExecutiveSummaryProps> = ({
  totalProjects,
  activeProjects,
  completionRate,
  totalOffices
}) => {
  const metrics = [
    {
      id: 'total-projects',
      title: 'Total Projects',
      value: totalProjects.toString(),
      unit: 'projects',
      icon: FolderOpen,
      description: 'All projects in system',
      trend: totalProjects > 0 ? 'positive' : 'neutral' as const,
      trendValue: totalProjects > 0 ? '+100%' : '0%'
    },
    {
      id: 'active-projects', 
      title: 'Active Projects',
      value: activeProjects.toString(),
      unit: 'active',
      icon: TrendingUp,
      description: 'Currently in progress',
      trend: activeProjects > 0 ? 'positive' : 'neutral' as const,
      trendValue: activeProjects > 0 ? '+100%' : '0%'
    },
    {
      id: 'completion-rate',
      title: 'Completion Rate',
      value: completionRate.toString(),
      unit: '%',
      icon: CheckCircle,
      description: 'Projects completed',
      trend: completionRate > 50 ? 'positive' : completionRate > 0 ? 'neutral' : 'negative' as const,
      trendValue: `${completionRate}%`
    },
    {
      id: 'office-coverage',
      title: 'Office Coverage', 
      value: totalOffices.toString(),
      unit: totalOffices === 1 ? 'office' : 'offices',
      icon: Building,
      description: 'Active office locations',
      trend: totalOffices > 1 ? 'positive' : 'neutral' as const,
      trendValue: totalOffices > 0 ? '+100%' : '0%'
    }
  ];

  return (
    <StandardizedExecutiveSummary
      title="Project Portfolio Overview"
      metrics={metrics}
    />
  );
};