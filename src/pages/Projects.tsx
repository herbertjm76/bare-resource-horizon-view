
import React, { useState } from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar';
import { AppHeader } from '@/components/AppHeader';
import { ProjectsList } from '@/components/projects/ProjectsList';
import { StandardizedExecutiveSummary } from '@/components/dashboard/StandardizedExecutiveSummary';
import { Button } from '@/components/ui/button';
import { OfficeSettingsProvider } from '@/context/OfficeSettingsContext';
import { useProjects } from '@/hooks/useProjects';
import { FolderOpen } from 'lucide-react';

const HEADER_HEIGHT = 56;

const Projects = () => {
  const { projects } = useProjects();

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

  const metrics = [
    {
      title: "Total Projects",
      value: totalProjects,
      subtitle: "All projects in system",
      badgeText: totalProjects > 10 ? 'High Volume' : 'Manageable',
      badgeColor: totalProjects > 10 ? 'blue' : 'green'
    },
    {
      title: "Active Projects",
      value: totalActiveProjects,
      subtitle: "Currently in progress",
      badgeText: totalActiveProjects > 5 ? 'Busy' : 'Normal Load',
      badgeColor: totalActiveProjects > 5 ? 'orange' : 'green'
    },
    {
      title: "Completion Rate",
      value: `${completionRate}%`,
      subtitle: `${completedProjects} completed`,
      badgeText: completionRate > 70 ? 'Excellent' : completionRate > 50 ? 'Good' : 'Needs Focus',
      badgeColor: completionRate > 70 ? 'green' : completionRate > 50 ? 'blue' : 'orange'
    },
    {
      title: "Offices",
      value: totalOffices,
      subtitle: "Locations served",
      badgeText: "Multi-Location",
      badgeColor: "blue"
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
              {/* Modern Header Section */}
              <div className="space-y-6 mb-6">
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                  <div className="space-y-2">
                    <h1 className="text-3xl lg:text-4xl font-bold tracking-tight text-brand-primary flex items-center gap-3">
                      <FolderOpen className="h-8 w-8 text-brand-violet" />
                      All Projects
                    </h1>
                  </div>
                </div>
              </div>

              <StandardizedExecutiveSummary
                metrics={metrics}
                gradientType="purple"
              />
              
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
