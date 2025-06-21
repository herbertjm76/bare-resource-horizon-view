
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
                      isActive={isActive}
                      className={cn(
                        "flex items-center text-sm rounded-lg transition-all duration-300 group relative overflow-hidden",
                        isActive 
                          ? "bg-white/10 text-white shadow-lg border border-white/20 backdrop-blur-sm" 
                          : "text-indigo-100 hover:bg-indigo-800/30 hover:text-white hover:backdrop-blur-sm",
                        collapsed 
                          ? "justify-center p-2 h-10 w-10 mx-auto" 
                          : "justify-start px-3 py-2 w-full"
                      )}
                      style={isActive ? {
                        background: 'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.05) 100%)',
                        boxShadow: '0 8px 32px rgba(100, 101, 240, 0.3), inset 0 1px 0 rgba(255,255,255,0.2)',
                        backdropFilter: 'blur(10px)',
                        WebkitBackdropFilter: 'blur(10px)',
                      } : {}}
                    >
                      <Link to={item.url} className={cn(
                        "flex items-center",
                        collapsed ? "justify-center w-full h-full" : "w-full"
                      )}>
                        <Icon className={cn(
                          "h-5 w-5 transition-all duration-300",
                          isActive ? "text-white drop-shadow-sm" : "text-indigo-200 group-hover:text-white",
                          collapsed ? "mr-0" : "mr-3"
                        )} />
                        {!collapsed && (
                          <span className={cn(
                            "font-medium transition-all duration-300",
                            isActive ? "text-white drop-shadow-sm" : ""
                          )}>{item.title}</span>
                        )}
                        {isActive && (
                          <div 
                            className="absolute inset-0 rounded-lg opacity-20"
                            style={{
                              background: 'linear-gradient(45deg, rgba(255,255,255,0.1) 0%, transparent 50%, rgba(255,255,255,0.1) 100%)',
                              animation: 'shimmer 2s ease-in-out infinite alternate'
                            }}
                          />
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
      <style jsx>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </nav>
  );
};
