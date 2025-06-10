
import React from 'react';
import { cn } from '@/lib/utils';
import { SidebarLogo } from './SidebarLogo';
import { SidebarNavigation } from './SidebarNavigation';

interface DashboardSidebarProps {
  collapsed: boolean;
  toggleSidebar: () => void;
}

export const DashboardSidebar: React.FC<DashboardSidebarProps> = ({ 
  collapsed, 
  toggleSidebar 
}) => {
  return (
    <aside className={cn(
      "fixed left-0 top-0 h-full bg-gradient-to-b from-amber-900 to-yellow-900 text-white transition-all duration-300 z-40 shadow-xl border-r border-amber-700",
      collapsed ? "w-16" : "w-[280px]"
    )}>
      <SidebarLogo collapsed={collapsed} toggleSidebar={toggleSidebar} />
      <SidebarNavigation collapsed={collapsed} />
    </aside>
  );
};
