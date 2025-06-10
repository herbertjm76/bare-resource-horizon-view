
import React, { useState } from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar';
import { AppHeader } from '@/components/AppHeader';
import { DashboardMetrics } from '@/components/dashboard/DashboardMetrics';
import { HerbieFloatingButton } from '@/components/dashboard/HerbieFloatingButton';
import { OfficeSettingsProvider } from '@/context/officeSettings/OfficeSettingsContext';
import AuthGuard from '@/components/AuthGuard';
import { useIsMobile } from '@/hooks/use-mobile';

const HEADER_HEIGHT = 56;

export const DashboardLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(true); // Start collapsed on mobile
  const isMobile = useIsMobile();

  const toggleSidebar = () => {
    setCollapsed(prev => !prev);
  };

  return (
    <AuthGuard>
      <OfficeSettingsProvider>
        <SidebarProvider>
          <div className="flex w-full min-h-screen bg-background">
            <DashboardSidebar collapsed={collapsed} toggleSidebar={toggleSidebar} />
            <div className="flex-1 flex flex-col min-w-0">
              <AppHeader onMenuToggle={isMobile ? toggleSidebar : undefined} />
              <div style={{ height: HEADER_HEIGHT }} />
              <div className="flex-1 bg-background">
                <DashboardMetrics />
              </div>
            </div>
            <HerbieFloatingButton />
          </div>
        </SidebarProvider>
      </OfficeSettingsProvider>
    </AuthGuard>
  );
};
