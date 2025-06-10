
import React, { useState } from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar';
import { AppHeader } from '@/components/AppHeader';
import { useIsMobile } from '@/hooks/use-mobile';

const HEADER_HEIGHT = 56;

interface OfficeSettingsLayoutProps {
  children: React.ReactNode;
}

export const OfficeSettingsLayout: React.FC<OfficeSettingsLayoutProps> = ({ children }) => {
  const [collapsed, setCollapsed] = useState(true); // Start collapsed on mobile
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
  const isMobile = useIsMobile();

  const toggleSidebar = () => {
    setCollapsed(prev => !prev);
  };

  const handleCollapseChange = (isCollapsed: boolean) => {
    setSidebarCollapsed(isCollapsed);
  };

  return (
    <SidebarProvider>
      <div className="w-full min-h-screen flex">
        <DashboardSidebar 
          collapsed={collapsed} 
          toggleSidebar={toggleSidebar}
          onCollapseChange={handleCollapseChange}
        />
        <div className="flex-1 flex flex-col min-w-0">
          <AppHeader 
            onMenuToggle={isMobile ? toggleSidebar : undefined}
            sidebarCollapsed={sidebarCollapsed}
          />
          <div style={{ height: HEADER_HEIGHT }} />
          {children}
        </div>
      </div>
    </SidebarProvider>
  );
};
