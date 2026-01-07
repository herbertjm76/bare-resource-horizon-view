import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { getNavigationItems } from './sidebarConfig';
import { useSidebar } from '@/components/ui/sidebar';
import { useCompany } from '@/context/CompanyContext';
import { usePermissions } from '@/hooks/usePermissions';
import { Badge } from '@/components/ui/badge';
import { Eye, Workflow, ClipboardList, Loader2 } from 'lucide-react';
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';

// Section icons and colors for visual distinction
const SECTION_CONFIG: Record<string, { icon: React.ComponentType<{ className?: string }>; color: string }> = {
  'OVERVIEW': { icon: Eye, color: 'text-sky-300' },
  'ALLOCATE': { icon: Workflow, color: 'text-emerald-300' },
  'MANAGE': { icon: ClipboardList, color: 'text-amber-300' },
};

export const SidebarNavigation: React.FC = () => {
  const location = useLocation();
  const { state } = useSidebar();
  const { companySlug } = useCompany();
  const { hasPermission, permissionsReady } = usePermissions();
  const collapsed = state === "collapsed";
  
  const navigationItems = getNavigationItems(companySlug);

  // While permissions are loading, show all sections as disabled placeholders
  // Once ready, filter by actual permissions
  const visibleSections = React.useMemo(() => {
    if (!permissionsReady) {
      // Return all sections but mark them as loading
      return navigationItems;
    }
    
    return navigationItems.filter(section => {
      if (!section.requiredPermission) return true;
      return hasPermission(section.requiredPermission);
    });
  }, [navigationItems, hasPermission, permissionsReady]);

  return (
    <nav className="mt-4 px-2 space-y-1">
      {visibleSections.map((section) => {
        const sectionConfig = SECTION_CONFIG[section.label];
        const SectionIcon = sectionConfig?.icon;
        const sectionColor = sectionConfig?.color || 'text-indigo-200';
        
        return (
          <SidebarGroup key={section.label} className={collapsed ? "space-y-0" : "space-y-1"}>
            {!collapsed && (
              <SidebarGroupLabel className="px-3 py-2 flex items-center gap-2 relative">
                {/* Accent bar on left edge */}
                <div 
                  className={cn(
                    "absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-4 rounded-full",
                    section.label === 'OVERVIEW' && "bg-sky-400 shadow-[0_0_8px_rgba(56,189,248,0.6)]",
                    section.label === 'ALLOCATE' && "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]",
                    section.label === 'MANAGE' && "bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.6)]"
                  )}
                />
                {SectionIcon && (
                  <SectionIcon className={cn("h-3.5 w-3.5", sectionColor)} />
                )}
                <span className={cn(
                  "text-xs font-semibold uppercase tracking-wider",
                  sectionColor
                )}>
                  {section.label}
                </span>
                {!permissionsReady && (
                  <Loader2 className="h-3 w-3 animate-spin text-indigo-300/50 ml-auto" />
                )}
              </SidebarGroupLabel>
            )}
            <SidebarGroupContent>
              <SidebarMenu className={collapsed ? "space-y-0 flex flex-col items-center" : "space-y-1"}>
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.url;
                  const isDisabled = !permissionsReady || item.comingSoon;
                  
                  return (
                    <SidebarMenuItem key={item.url} className={collapsed ? "w-full flex justify-center" : ""}>
                      <SidebarMenuButton
                        asChild={!isDisabled}
                        tooltip={collapsed ? item.title : undefined}
                        isActive={isActive && !isDisabled}
                        className={cn(
                          "flex items-center text-sm rounded-lg transition-all duration-300 group relative overflow-hidden",
                          isDisabled
                            ? "opacity-50 cursor-not-allowed text-indigo-200/50"
                            : isActive 
                              ? "bg-white/10 text-white shadow-lg border border-white/20 backdrop-blur-sm" 
                              : "text-indigo-100 hover:bg-indigo-800/30 hover:text-white hover:backdrop-blur-sm",
                          collapsed 
                            ? "justify-center p-2 h-10 w-10 mx-auto" 
                            : "justify-start px-3 py-2 w-full"
                        )}
                        style={isActive && !isDisabled ? {
                          background: 'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.05) 100%)',
                          boxShadow: '0 8px 32px rgba(100, 101, 240, 0.3), inset 0 1px 0 rgba(255,255,255,0.2)',
                          backdropFilter: 'blur(10px)',
                          WebkitBackdropFilter: 'blur(10px)',
                        } : {}}
                      >
                        {isDisabled ? (
                          <div className={cn(
                            "flex items-center",
                            collapsed ? "justify-center w-full h-full" : "w-full"
                          )}>
                            {!permissionsReady ? (
                              <Loader2 className={cn(
                                "h-5 w-5 animate-spin",
                                collapsed ? "mr-0" : "mr-3"
                              )} />
                            ) : (
                              <Icon className={cn(
                                "h-5 w-5",
                                collapsed ? "mr-0" : "mr-3"
                              )} />
                            )}
                            {!collapsed && (
                              <>
                                <span className="font-medium">{item.title}</span>
                                {item.comingSoon && (
                                  <Badge 
                                    variant="secondary" 
                                    className="ml-auto text-[10px] px-1.5 py-0 bg-indigo-400/20 text-indigo-100 border-indigo-300/30"
                                  >
                                    Soon
                                  </Badge>
                                )}
                              </>
                            )}
                          </div>
                        ) : (
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
                              <>
                                <span className={cn(
                                  "font-medium transition-all duration-300",
                                  isActive ? "text-white drop-shadow-sm" : ""
                                )}>{item.title}</span>
                              </>
                            )}
                            {isActive && (
                              <div 
                                className="absolute inset-0 rounded-lg opacity-20 sidebar-shimmer"
                              />
                            )}
                          </Link>
                        )}
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
            {!collapsed && section !== visibleSections[visibleSections.length - 1] && (
              <div className="border-t border-white/10 my-3 mx-3" />
            )}
          </SidebarGroup>
        );
      })}
    </nav>
  );
};
