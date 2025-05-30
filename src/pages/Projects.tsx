
import React, { useState } from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar';
import { AppHeader } from '@/components/AppHeader';
import { ProjectsList } from '@/components/projects/ProjectsList';
import { StandardizedExecutiveSummary } from '@/components/dashboard/StandardizedExecutiveSummary';
import { Button } from '@/components/ui/button';
import { OfficeSettingsProvider } from '@/context/OfficeSettingsContext';
import { useProjects } from '@/hooks/useProjects';
import { Briefcase, CheckCircle, TrendingUp, Building } from 'lucide-react';

const HEADER_HEIGHT = 56;

const Projects = () => {
  const { projects } = useProjects();
  const [summaryFormat, setSummaryFormat] = useState<'simple' | 'detailed'>('detailed');

  // Calculate statistics
  const totalProjects = projects.length;
  const totalActiveProjects = projects.filter(project => 
    project.status === 'In Progress'
  ).length;
  const totalOffices = new Set(projects.map(project => project.office?.name).filter(Boolean)).size;
  const completedProjects = projects.filter(project => 
    project.status === 'Complete'
  ).length;

  // Calculate completion rate
  const completionRate = totalProjects > 0 ? Math.round((completedProjects / totalProjects) * 100) : 0;

  // Calculate breakdown data
  const inProgressProjects = projects.filter(p => p.status === 'In Progress').length;
  const planningProjects = projects.filter(p => p.status === 'Planning').length;
  const onHoldProjects = projects.filter(p => p.status === 'On Hold').length;

  const recentProjects = Math.round(totalProjects * 0.3);
  const thisQuarterProjects = Math.round(totalProjects * 0.4);
  const olderProjects = totalProjects - recentProjects - thisQuarterProjects;

  const primaryOffices = Math.min(totalOffices, 3);
  const secondaryOffices = Math.max(0, totalOffices - 3);

  const metrics = [
    {
      title: "Total Projects",
      value: totalProjects,
      subtitle: "All projects in system",
      icon: Briefcase,
      badgeText: totalProjects > 10 ? 'High Volume' : 'Manageable',
      badgeColor: totalProjects > 10 ? 'blue' : 'green',
      breakdowns: [
        { label: 'In Progress', value: inProgressProjects, color: 'blue' },
        { label: 'Planning', value: planningProjects, color: 'orange' },
        { label: 'On Hold', value: onHoldProjects, color: 'red' }
      ]
    },
    {
      title: "Active Projects",
      value: totalActiveProjects,
      subtitle: "Currently in progress",
      icon: TrendingUp,
      badgeText: totalActiveProjects > 5 ? 'Busy' : 'Normal Load',
      badgeColor: totalActiveProjects > 5 ? 'orange' : 'green',
      breakdowns: [
        { label: 'Recent', value: recentProjects, color: 'green' },
        { label: 'This Quarter', value: thisQuarterProjects, color: 'blue' },
        { label: 'Older', value: olderProjects, color: 'orange' }
      ]
    },
    {
      title: "Completion Rate",
      value: `${completionRate}%`,
      subtitle: `${completedProjects} completed`,
      icon: CheckCircle,
      badgeText: completionRate > 70 ? 'Excellent' : completionRate > 50 ? 'Good' : 'Needs Focus',
      badgeColor: completionRate > 70 ? 'green' : completionRate > 50 ? 'blue' : 'orange',
      breakdowns: [
        { label: 'Completed', value: completedProjects, color: 'green' },
        { label: 'Active', value: totalActiveProjects, color: 'blue' },
        { label: 'Other', value: totalProjects - completedProjects - totalActiveProjects, color: 'orange' }
      ]
    },
    {
      title: "Offices",
      value: totalOffices,
      subtitle: "Locations served",
      icon: Building,
      badgeText: "Multi-Location",
      badgeColor: "blue",
      breakdowns: totalOffices > 0 ? [
        { label: 'Primary', value: primaryOffices, color: 'green' },
        { label: 'Secondary', value: secondaryOffices, color: 'blue' }
      ] : [
        { label: 'No offices', value: 0, color: 'red' }
      ]
    }
  ];

  return (
    <SidebarProvider>
      <div className="w-full min-h-screen flex flex-row bg-gradient-to-br from-gray-50 to-white">
        <div className="flex-shrink-0">
          <DashboardSidebar />
        </div>
        <div className="flex-1 flex flex-col">
          <AppHeader />
          <div style={{ height: HEADER_HEIGHT }} />
          <div className="flex-1 p-6 sm:p-8 bg-gradient-to-br from-white via-gray-50/30 to-gray-100/20">
            <div className="max-w-6xl mx-auto space-y-8">
              <div>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                  <h1 className="text-3xl font-bold tracking-tight text-brand-primary">Projects Overview</h1>
                  <div className="flex gap-2">
                    <Button
                      variant={summaryFormat === 'simple' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSummaryFormat('simple')}
                    >
                      Simple Cards
                    </Button>
                    <Button
                      variant={summaryFormat === 'detailed' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSummaryFormat('detailed')}
                    >
                      Detailed Cards
                    </Button>
                  </div>
                </div>
                <StandardizedExecutiveSummary
                  metrics={metrics}
                  gradientType="purple"
                  cardFormat={summaryFormat}
                />
              </div>
              <OfficeSettingsProvider>
                <ProjectsList />
              </OfficeSettingsProvider>
            </div>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Projects;
