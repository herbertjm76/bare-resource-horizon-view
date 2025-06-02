
import React from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar';
import { AppHeader } from '@/components/AppHeader';

const HEADER_HEIGHT = 56;

interface ProfileLayoutProps {
  children: React.ReactNode;
}

export const ProfileLayout: React.FC<ProfileLayoutProps> = ({ children }) => {
  return (
    <SidebarProvider>
      <div className="w-full min-h-screen flex flex-row">
        <div className="flex-shrink-0">
          <DashboardSidebar />
        </div>
        <div className="flex-1 flex flex-col">
          <AppHeader />
          <div style={{ height: HEADER_HEIGHT }} />
          <div className="flex-1 p-4 sm:p-8 bg-background">
            <div className="max-w-6xl mx-auto space-y-8">
              {children}
            </div>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};
