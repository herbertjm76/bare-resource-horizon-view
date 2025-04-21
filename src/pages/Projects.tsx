
import React from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar';
import { ProjectsList } from '@/components/projects/ProjectsList';
import { AppHeader } from '@/components/AppHeader';

const HEADER_HEIGHT = 56; // Should match AppHeader minHeight

const Projects = () => {
  return (
    <SidebarProvider>
      {/* Glassmorphism header, always present */}
      <AppHeader />
      <div className="w-full flex flex-col min-h-screen">
        {/* Spacer for fixed header */}
        <div style={{ height: HEADER_HEIGHT }} />
        <div className="flex flex-1 w-full">
          {/* Sidebar now starts below the glass header */}
          <DashboardSidebar />
          <div className="flex-1 p-8 bg-background">
            <div className="max-w-6xl mx-auto space-y-8">
              <div className="flex justify-between items-center">
                <h1 className="text-4xl font-bold">All Projects</h1>
              </div>
              <ProjectsList />
            </div>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Projects;
