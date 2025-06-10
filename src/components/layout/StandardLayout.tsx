
import React, { useState } from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar';
import { AppHeader } from '@/components/AppHeader';
import { useIsMobile } from '@/hooks/use-mobile';

const HEADER_HEIGHT = 64;

interface StandardLayoutProps {
  children: React.ReactNode;
  className?: string;
  contentClassName?: string;
  title?: string;
}

export const StandardLayout: React.FC<StandardLayoutProps> = ({ 
  children, 
  className = "bg-gray-50",
  contentClassName = "p-3 sm:p-4 lg:p-6",
  title
}) => {
  const [collapsed, setCollapsed] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
  const isMobile = useIsMobile();

  const toggleSidebar = () => {
    console.log("StandardLayout: Toggling sidebar, current state:", collapsed);
    setCollapsed(prev => !prev);
  };

  const handleCollapseChange = (isCollapsed: boolean) => {
    console.log("StandardLayout: Sidebar collapse changed to:", isCollapsed);
    setSidebarCollapsed(isCollapsed);
  };

  return (
    <SidebarProvider>
      <div className={`w-full min-h-screen flex ${className}`}>
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
          <main className={`flex-1 overflow-auto ${contentClassName} min-w-0`}>
            {title && (
              <div className="mb-6">
                <h1 className="text-3xl font-bold tracking-tight text-gray-900">{title}</h1>
              </div>
            )}
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};
