
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { navigationItems } from './sidebarConfig';
import { useSidebar } from '@/components/ui/sidebar';
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';

export const SidebarNavigation: React.FC = () => {
  const location = useLocation();
  const { state } = useSidebar();
  const collapsed = state === "collapsed";

  return (
    <nav className="mt-4 px-2 space-y-1">
      {navigationItems.map((section) => (
        <SidebarGroup key={section.label} className={collapsed ? "space-y-0" : "space-y-1"}>
          {!collapsed && (
            <SidebarGroupLabel className="px-3 py-2 text-xs font-semibold text-indigo-200 uppercase tracking-wider">
              {section.label}
            </SidebarGroupLabel>
          )}
          <SidebarGroupContent>
            <SidebarMenu className={collapsed ? "space-y-0 flex flex-col items-center" : "space-y-1"}>
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.url;
                
                return (
                  <SidebarMenuItem key={item.url} className={collapsed ? "w-full flex justify-center" : ""}>
                    <SidebarMenuButton
                      asChild
                      tooltip={collapsed ? item.title : undefined}
                      className={cn(
                        "flex items-center text-sm rounded-lg transition-all duration-200 group",
                        isActive 
                          ? "bg-[#6F4BF6] text-white shadow-md border border-[#5D3FD3]" 
                          : "text-indigo-100 hover:bg-indigo-800/50 hover:text-white",
                        collapsed 
                          ? "justify-center p-2 h-10 w-10 mx-auto" 
                          : "justify-start px-3 py-2 w-full"
                      )}
                    >
                      <Link to={item.url} className={cn(
                        "flex items-center",
                        collapsed ? "justify-center w-full h-full" : "w-full"
                      )}>
                        <Icon className={cn(
                          "h-5 w-5 transition-colors duration-200",
                          isActive ? "text-white" : "text-indigo-200 group-hover:text-white",
                          collapsed ? "mr-0" : "mr-3"
                        )} />
                        {!collapsed && (
                          <span className="font-medium">{item.title}</span>
                        )}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
          {!collapsed && section !== navigationItems[navigationItems.length - 1] && (
            <div className="border-t border-indigo-600 my-2" />
          )}
        </SidebarGroup>
      ))}
    </nav>
  );
};
