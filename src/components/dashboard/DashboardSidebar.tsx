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
            <div className="flex flex-col h-full bg-[#8E9196]">
              <SidebarLogo collapsed={false} toggleSidebar={toggleSidebar} />
              <SidebarNavigation 
                items={navigationItems} 
                currentPath={location.pathname}
                onItemClick={() => setOpenMobile(false)}
              />
            </div>
          </SheetContent>
        </Sheet>
      </>
    );
  }

  return (
    <Sidebar 
      className="bg-[#8E9196] border-r border-[#7d8086] pt-0 transition-all duration-300 fixed left-0 top-0 bottom-0 z-40 min-h-screen"
      collapsible="icon"
      style={{ marginTop: 0, width: collapsed ? '80px' : '220px' }}
    >
      <SidebarContent className="p-0">
        <SidebarGroup>
          <SidebarLogo collapsed={collapsed} toggleSidebar={toggleSidebar} />
          <SidebarNavigation 
            items={navigationItems} 
            collapsed={collapsed}
            currentPath={location.pathname}
          />
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
