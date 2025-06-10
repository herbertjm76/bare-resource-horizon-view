
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { navigationItems } from './sidebarConfig';

interface SidebarNavigationProps {
  collapsed: boolean;
}

export const SidebarNavigation: React.FC<SidebarNavigationProps> = ({ collapsed }) => {
  const location = useLocation();

  return (
    <nav className="mt-4 px-2 space-y-1">
      {navigationItems.map((section) => (
        <div key={section.label} className="space-y-1">
          {!collapsed && (
            <div className="px-3 py-2 text-xs font-semibold text-amber-200 uppercase tracking-wider">
              {section.label}
            </div>
          )}
          <div className="space-y-1">
            {section.items.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.url;
              
              return (
                <Link
                  key={item.url}
                  to={item.url}
                  className={cn(
                    "flex items-center px-3 py-2 text-sm rounded-lg transition-all duration-200 group",
                    isActive 
                      ? "bg-amber-700 text-white shadow-md border border-amber-600" 
                      : "text-amber-100 hover:bg-amber-800/50 hover:text-white",
                    collapsed ? "justify-center" : "justify-start"
                  )}
                >
                  <Icon className={cn(
                    "h-5 w-5 transition-colors duration-200",
                    isActive ? "text-white" : "text-amber-200 group-hover:text-white",
                    collapsed ? "" : "mr-3"
                  )} />
                  {!collapsed && (
                    <span className="font-medium">{item.title}</span>
                  )}
                </Link>
              );
            })}
          </div>
          {!collapsed && section !== navigationItems[navigationItems.length - 1] && (
            <div className="border-t border-amber-800 my-2" />
          )}
        </div>
      ))}
    </nav>
  );
};
