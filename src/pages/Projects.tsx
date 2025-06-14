
import React, { useState } from 'react';
import { StandardLayout } from '@/components/layout/StandardLayout';
import { ProjectsList } from '@/components/projects/ProjectsList';
import { StandardizedExecutiveSummary } from '@/components/dashboard/StandardizedExecutiveSummary';
import { Button } from '@/components/ui/button';
import { OfficeSettingsProvider } from '@/context/OfficeSettingsContext';
import { useProjects } from '@/hooks/useProjects';
import { FolderOpen } from 'lucide-react';

const Projects = () => {
  const { projects } = useProjects();

  // Calculate statistics
  const totalProjects = projects.length;
  const activeProjects = projects.filter(project => 
    project.status === 'In Progress'
  ).length;
  const completedProjects = projects.filter(project => 
    project.status === 'Complete'
  ).length;
  const totalOffices = new Set(projects.map(project => project.office?.name).filter(Boolean)).size;

  // Calculate completion rate
  const completionRate = totalProjects > 0 ? Math.round((completedProjects / totalProjects) * 100) : 0;

  const metrics = [
    {
      title: "Total Projects",
      value: totalProjects,
      subtitle: "All projects in system",
      badgeText: totalProjects > 15 ? 'High Volume' : totalProjects > 8 ? 'Active Portfolio' : 'Growing',
      badgeColor: totalProjects > 15 ? 'blue' : totalProjects > 8 ? 'green' : 'orange'
    },
    {
      title: "Active Projects",
      value: activeProjects,
      subtitle: "Currently in progress",
      badgeText: activeProjects > 8 ? 'Very Busy' : activeProjects > 4 ? 'Busy' : activeProjects > 0 ? 'Normal Load' : 'Available',
      badgeColor: activeProjects > 8 ? 'orange' : activeProjects > 4 ? 'blue' : activeProjects > 0 ? 'green' : 'gray'
    },
    {
      title: "Completion Rate",
      value: `${completionRate}%`,
      subtitle: `${completedProjects} of ${totalProjects} completed`,
      badgeText: completionRate >= 80 ? 'Excellent' : completionRate >= 60 ? 'Good' : completionRate >= 40 ? 'Average' : 'Needs Focus',
      badgeColor: completionRate >= 80 ? 'green' : completionRate >= 60 ? 'blue' : completionRate >= 40 ? 'orange' : 'red'
    },
    {
      title: "Office Locations",
      value: totalOffices,
      subtitle: totalOffices === 1 ? "Single location" : "Multi-location operations",
      badgeText: totalOffices > 3 ? 'Global Reach' : totalOffices > 1 ? 'Multi-Location' : 'Single Office',
      badgeColor: totalOffices > 3 ? 'blue' : totalOffices > 1 ? 'green' : 'gray'
    }
  ];

  return (
    <StandardLayout>
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
    </StandardLayout>
  );
};

export default Projects;
