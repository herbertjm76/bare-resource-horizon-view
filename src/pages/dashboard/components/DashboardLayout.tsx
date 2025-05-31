
import React from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar';
import { AppHeader } from '@/components/AppHeader';
import { DashboardMetrics } from '@/components/dashboard/DashboardMetrics';
import { HerbieFloatingButton } from '@/components/dashboard/HerbieFloatingButton';
import { OfficeSettingsProvider } from '@/context/officeSettings/OfficeSettingsContext';
import AuthGuard from '@/components/AuthGuard';

const HEADER_HEIGHT = 56;

export const DashboardLayout: React.FC = () => {
  return (
    <AuthGuard>
      <OfficeSettingsProvider>
        <SidebarProvider>
          <div className="flex flex-col w-full min-h-screen bg-background">
            <div className="flex flex-1 w-full">
              <DashboardSidebar />
              <div className="flex-1 flex flex-col">
                <AppHeader />
                <div style={{ height: HEADER_HEIGHT }} />
                <div className="flex-1 bg-background">
                  <DashboardMetrics />
                </div>
              </div>
            </div>
            <HerbieFloatingButton />
          </div>
        </SidebarProvider>
      </OfficeSettingsProvider>
    </AuthGuard>
  );
};
