
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { navigationItems } from "./navigation"
import { SidebarNavSection } from "./SidebarNavSection"

export function DashboardSidebar() {
  return (
    <Sidebar className="bg-transparent backdrop-blur-md border-r border-white/10 glass-morphism">
      <SidebarContent>
        <SidebarGroup>
          <div className="flex items-center justify-between px-4 py-2">
            <p className="text-white font-semibold text-lg">Bare Resource</p>
            <SidebarTrigger className="md:hidden text-white hover:bg-white/10" />
          </div>
          {navigationItems.map((section) => (
            <SidebarNavSection key={section.label} section={section} />
          ))}
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
