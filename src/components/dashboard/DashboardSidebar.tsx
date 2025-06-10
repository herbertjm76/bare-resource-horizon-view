
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
      "fixed left-0 top-0 h-full bg-gradient-to-b from-indigo-600 to-purple-700 text-white transition-all duration-300 z-40 shadow-xl border-r border-indigo-500",
      collapsed ? "w-16" : "w-[280px]"
    )}>
      <SidebarLogo collapsed={collapsed} toggleSidebar={toggleSidebar} />
      <SidebarNavigation collapsed={collapsed} />
    </aside>
  );
};
