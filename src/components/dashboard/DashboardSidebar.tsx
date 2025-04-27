
import { Menu } from "lucide-react"
import { Link, useLocation } from "react-router-dom"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  useSidebar
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { useIsMobile } from "@/hooks/use-mobile"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { navigationItems } from "./sidebarConfig"
import { SidebarLogo } from "./SidebarLogo"
import { SidebarNavigation } from "./SidebarNavigation"

export function DashboardSidebar() {
  const { state, toggleSidebar, openMobile, setOpenMobile } = useSidebar();
  const location = useLocation();
  const isMobile = useIsMobile();
  const collapsed = state === "collapsed";

  const renderSidebarContent = () => (
    <div className="relative w-full h-full">
      {/* Back-plate gradient */}
      <div className="fixed inset-y-0 left-0 w-[220px] -z-10 transition-all duration-300"
           style={{ width: collapsed ? '80px' : '220px' }}>
        <div className="absolute inset-0 bg-[linear-gradient(180deg,#1E1745_0%,#171E47_45%,#0E183C_100%)]" />
      </div>

      {/* Top highlight gradient */}
      <div className="fixed inset-x-0 top-0 h-28 -z-10 pointer-events-none
        bg-[radial-gradient(120%_30%_at_50%_0%,rgba(255,255,255,0.18)_0%,rgba(255,255,255,0)_70%)]" />

      <SidebarLogo collapsed={collapsed} toggleSidebar={toggleSidebar} />
      <SidebarNavigation 
        items={navigationItems} 
        collapsed={collapsed}
        currentPath={location.pathname}
      />
    </div>
  );

  if (isMobile) {
    return (
      <>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setOpenMobile(true)}
          className="fixed left-4 top-4 z-50 md:hidden"
        >
          <Menu className="h-6 w-6" />
        </Button>
        
        <Sheet open={openMobile} onOpenChange={setOpenMobile}>
          <SheetContent side="left" className="p-0 w-[220px]">
            <div className="flex flex-col h-full">
              {renderSidebarContent()}
            </div>
          </SheetContent>
        </Sheet>
      </>
    );
  }

  return (
    <Sidebar 
      className="bg-transparent border-r border-[#7d8086] pt-0 transition-all duration-300 fixed left-0 top-0 bottom-0 z-40 min-h-screen"
      collapsible="icon"
      style={{ marginTop: 0, width: collapsed ? '80px' : '220px' }}
    >
      <SidebarContent className="p-0">
        <SidebarGroup>
          {renderSidebarContent()}
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
