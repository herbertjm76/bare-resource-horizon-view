
import React, { useState } from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar';
import { AppHeader } from '@/components/AppHeader';
import { SummaryDashboard } from '@/components/dashboard/SummaryDashboard';
import { useIsMobile } from '@/hooks/use-mobile';
import { Users, TrendingUp, Clock, Target } from 'lucide-react';

const HEADER_HEIGHT = 64;

export const DashboardLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
  const isMobile = useIsMobile();

  const toggleSidebar = () => {
    setCollapsed(prev => !prev);
  };

  const handleCollapseChange = (isCollapsed: boolean) => {
    setSidebarCollapsed(isCollapsed);
  };

  // Default metrics for the summary dashboard
  const defaultMetrics = [
    {
      title: "Active Projects",
      value: 0,
      icon: <Target className="h-4 w-4" />,
      status: 'info' as const
    },
    {
      title: "Team Members",
      value: 0,
      icon: <Users className="h-4 w-4" />,
      status: 'info' as const
    },
    {
      title: "Utilization Rate",
      value: "0%",
      icon: <Clock className="h-4 w-4" />,
      status: 'info' as const
    },
    {
      title: "Performance",
      value: "Good",
      icon: <TrendingUp className="h-4 w-4" />,
      status: 'good' as const
    }
  ];

  return (
    <SidebarProvider>
      <div className="w-full min-h-screen flex bg-gray-50">
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
          <main className="flex-1 overflow-auto">
            <SummaryDashboard metrics={defaultMetrics} />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};
