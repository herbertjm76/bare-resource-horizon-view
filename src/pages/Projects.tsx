import React from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar';
import { AppHeader } from '@/components/AppHeader';
import { ProjectsList } from '@/components/projects/ProjectsList';
import { OfficeSettingsProvider } from '@/context/OfficeSettingsContext';
const HEADER_HEIGHT = 56;
const Projects = () => {
  return <SidebarProvider>
      <div className="w-full min-h-screen flex flex-row">
        <div className="flex-shrink-0">
          <DashboardSidebar />
        </div>
        <div className="flex-1 flex flex-col">
          <AppHeader />
          <div style={{
          height: HEADER_HEIGHT
        }} />
          <div className="flex-1 p-4 sm:p-8 bg-background">
            <div className="max-w-6xl mx-auto space-y-8">
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold tracking-tight text-brand-primary">All Projects</h1>
              </div>
              <OfficeSettingsProvider>
                <ProjectsList />
              </OfficeSettingsProvider>
            </div>
          </div>
        </div>
      </div>
    </SidebarProvider>;
};
export default Projects;