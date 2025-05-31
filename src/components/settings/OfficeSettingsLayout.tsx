
import React from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar';
import { AppHeader } from '@/components/AppHeader';

const HEADER_HEIGHT = 56;

interface OfficeSettingsLayoutProps {
  children: React.ReactNode;
}

export const OfficeSettingsLayout: React.FC<OfficeSettingsLayoutProps> = ({ children }) => {
  return (
    <SidebarProvider>
      <div className="w-full min-h-screen flex flex-row">
        <div className="flex-shrink-0">
          <DashboardSidebar />
        </div>
        <div className="flex-1 flex flex-col">
          <AppHeader />
          <div style={{ height: HEADER_HEIGHT }} />
          {children}
        </div>
      </div>
    </SidebarProvider>
  );
};
