import React from 'react';
import { Link } from 'react-router-dom';
import { Settings, HelpCircle, Loader2 } from 'lucide-react';
import { 
  Sidebar, 
  SidebarContent, 
  SidebarHeader,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar
} from '@/components/ui/sidebar';
import { SidebarLogo } from './SidebarLogo';
import { SidebarNavigation } from './SidebarNavigation';
import { useCompany } from '@/context/CompanyContext';
import { usePermissions } from '@/hooks/usePermissions';
import { cn } from '@/lib/utils';

export const AppSidebar: React.FC = () => {
  const { state } = useSidebar();
  const { companySlug } = useCompany();
  const { hasPermission, permissionsReady } = usePermissions();
  const collapsed = state === "collapsed";
  const baseUrl = companySlug ? `/${companySlug}` : '';
  
  const canViewSettings = permissionsReady && hasPermission('view:settings');
  const showSettingsPlaceholder = !permissionsReady;

  return (
    <Sidebar 
      collapsible="icon" 
      className="bg-gradient-modern text-white border-r border-white/10"
    >
      <SidebarHeader className="p-0 flex-shrink-0">
        <SidebarLogo />
      </SidebarHeader>
      <SidebarContent className="p-0 overflow-y-auto flex-1">
        <SidebarNavigation />
      </SidebarContent>
      <SidebarFooter className="flex-shrink-0 p-2 border-t border-white/10">
        <SidebarMenu className={cn(
          collapsed ? "space-y-0 flex flex-col items-center" : "space-y-1"
        )}>
          {(canViewSettings || showSettingsPlaceholder) && (
            <SidebarMenuItem className={collapsed ? "w-full flex justify-center" : ""}>
              <SidebarMenuButton
                asChild={!showSettingsPlaceholder}
                tooltip={collapsed ? "Company Settings" : undefined}
                className={cn(
                  "flex items-center text-sm rounded-lg transition-all duration-300",
                  showSettingsPlaceholder
                    ? "opacity-50 cursor-not-allowed text-indigo-200/50"
                    : "text-indigo-100 hover:bg-indigo-800/30 hover:text-white",
                  collapsed 
                    ? "justify-center p-2 h-10 w-10 mx-auto" 
                    : "justify-start px-3 py-2 w-full"
                )}
              >
                {showSettingsPlaceholder ? (
                  <div className={cn(
                    "flex items-center",
                    collapsed ? "justify-center w-full h-full" : "w-full"
                  )}>
                    <Loader2 className={cn(
                      "h-5 w-5 animate-spin text-indigo-200",
                      collapsed ? "mr-0" : "mr-3"
                    )} />
                    {!collapsed && <span className="font-medium">Settings</span>}
                  </div>
                ) : (
                  <Link to={`${baseUrl}/office-settings`} className={cn(
                    "flex items-center",
                    collapsed ? "justify-center w-full h-full" : "w-full"
                  )}>
                    <Settings className={cn(
                      "h-5 w-5 text-indigo-200 group-hover:text-white",
                      collapsed ? "mr-0" : "mr-3"
                    )} />
                    {!collapsed && <span className="font-medium">Settings</span>}
                  </Link>
                )}
              </SidebarMenuButton>
            </SidebarMenuItem>
          )}
          <SidebarMenuItem className={collapsed ? "w-full flex justify-center" : ""}>
            <SidebarMenuButton
              asChild
              tooltip={collapsed ? "Help Center" : undefined}
              className={cn(
                "flex items-center text-sm rounded-lg transition-all duration-300",
                "text-indigo-100 hover:bg-indigo-800/30 hover:text-white",
                collapsed 
                  ? "justify-center p-2 h-10 w-10 mx-auto" 
                  : "justify-start px-3 py-2 w-full"
              )}
            >
              <Link to={`${baseUrl}/help-center`} className={cn(
                "flex items-center",
                collapsed ? "justify-center w-full h-full" : "w-full"
              )}>
                <HelpCircle className={cn(
                  "h-5 w-5 text-indigo-200 group-hover:text-white",
                  collapsed ? "mr-0" : "mr-3"
                )} />
                {!collapsed && <span className="font-medium">Help</span>}
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};
