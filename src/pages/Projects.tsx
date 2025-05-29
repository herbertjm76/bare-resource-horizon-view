
import React from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar';
import { AppHeader } from '@/components/AppHeader';
import { ProjectsList } from '@/components/projects/ProjectsList';
import { ModernProjectsHeader } from '@/components/projects/ModernProjectsHeader';
import { OfficeSettingsProvider } from '@/context/OfficeSettingsContext';
import { useProjects } from '@/hooks/useProjects';

const HEADER_HEIGHT = 56;

const Projects = () => {
  const { projects } = useProjects();

  // Calculate statistics
  const totalProjects = projects.length;
  const totalActiveProjects = projects.filter(project => 
    project.status === 'In Progress'
  ).length;
  const totalOffices = new Set(projects.map(project => project.office?.name).filter(Boolean)).size;

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
              <ModernProjectsHeader
                totalProjects={totalProjects}
                totalActiveProjects={totalActiveProjects}
                totalOffices={totalOffices}
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
