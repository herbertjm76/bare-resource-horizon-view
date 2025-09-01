
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
      className="bg-gradient-to-b from-purple-500 via-purple-600 to-indigo-600 text-white border-purple-400/20"
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
