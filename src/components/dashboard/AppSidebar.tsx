
import React from 'react';
import { 
  Sidebar, 
  SidebarContent, 
  SidebarHeader,
  SidebarFooter 
} from '@/components/ui/sidebar';
import { SidebarLogo } from './SidebarLogo';
import { SidebarNavigation } from './SidebarNavigation';

export const AppSidebar: React.FC = () => {
  return (
    <Sidebar 
      collapsible="icon" 
      className="bg-gradient-to-b from-slate-800 via-purple-800 to-indigo-800 text-white border-slate-600/30"
    >
      <SidebarHeader className="p-0">
        <SidebarLogo />
      </SidebarHeader>
      <SidebarContent className="p-0 overflow-hidden">
        <SidebarNavigation />
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  );
};
