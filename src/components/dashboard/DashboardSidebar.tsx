
import React from 'react';
import { cn } from '@/lib/utils';
import { SidebarLogo } from './SidebarLogo';
import { SidebarNavigation } from './SidebarNavigation';
import { useIsMobile } from '@/hooks/use-mobile';
import { Sheet, SheetContent } from '@/components/ui/sheet';

interface DashboardSidebarProps {
  collapsed: boolean;
  toggleSidebar: () => void;
  onCollapseChange?: (collapsed: boolean) => void;
}

export const DashboardSidebar: React.FC<DashboardSidebarProps> = ({ 
  collapsed, 
  toggleSidebar,
  onCollapseChange 
}) => {
  const isMobile = useIsMobile();

  // Notify parent of collapse state changes
  React.useEffect(() => {
    if (onCollapseChange) {
      onCollapseChange(collapsed);
    }
  }, [collapsed, onCollapseChange]);

  // Mobile sidebar as a sheet/drawer
  if (isMobile) {
    return (
      <Sheet open={!collapsed} onOpenChange={() => toggleSidebar()}>
        <SheetContent side="left" className="w-[280px] p-0 bg-gradient-to-b from-[#6F4BF6] to-purple-700 text-white border-[#6F4BF6]">
          <div className="h-full flex flex-col">
            <SidebarLogo collapsed={false} toggleSidebar={toggleSidebar} />
            <SidebarNavigation collapsed={false} />
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  // Desktop sidebar
  return (
    <aside className={cn(
      "h-full bg-gradient-to-b from-[#6F4BF6] to-purple-700 text-white transition-all duration-300 z-40 shadow-xl border-r border-[#6F4BF6] flex-shrink-0 hidden md:block",
      collapsed ? "w-16" : "w-[280px]"
    )}>
      <SidebarLogo collapsed={collapsed} toggleSidebar={toggleSidebar} />
      <SidebarNavigation collapsed={collapsed} />
    </aside>
  );
};
