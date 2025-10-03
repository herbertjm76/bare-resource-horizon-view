
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
      className="bg-gradient-modern text-white border-r border-white/10"
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
