
import React from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar';
import { ProjectsList } from '@/components/projects/ProjectsList';
import { AppHeader } from '@/components/AppHeader';

const HEADER_HEIGHT = 56; // Should match AppHeader minHeight

const Projects = () => {
  return (
    <SidebarProvider>
      <div className="w-full min-h-screen flex flex-row">
        {/* Sidebar in first column */}
        <div className="flex-shrink-0">
          <DashboardSidebar />
        </div>
        {/* Main content in second column */}
        <div className="flex-1 flex flex-col">
          {/* Header only in main column */}
          <AppHeader />
          {/* Spacer for header height */}
          <div style={{ height: HEADER_HEIGHT }} />
          <div className="flex-1 p-8 bg-background">
            <div className="max-w-6xl mx-auto space-y-8">
              <div className="flex justify-between items-center">
                <h1 className="text-4xl font-bold" style={{ color: '#8E9196' }}>All Projects</h1>
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
