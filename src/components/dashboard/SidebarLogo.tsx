
import { Button } from "@/components/ui/button"
import { ChevronRight, ChevronLeft } from "lucide-react"

interface SidebarLogoProps {
  collapsed: boolean
  toggleSidebar: () => void
}

export const SidebarLogo = ({ collapsed, toggleSidebar }: SidebarLogoProps) => (
  <div className="h-[64px] border-b border-[#7d8086]">
    <Button 
      variant="ghost" 
      onClick={toggleSidebar}
      className="w-full h-full px-4 flex items-center justify-between text-white hover:bg-white/5"
    >
      {!collapsed && (
        <div className="flex items-center gap-2">
          <span className="font-medium">Bare</span>
          <span className="bg-gradient-to-r from-[#895CF7] via-[#5669F7] to-[#E64FC4] bg-clip-text text-transparent font-semibold">
            Resource
          </span>
        </div>
      )}
      {collapsed ? (
        <ChevronRight className="h-5 w-5 ml-auto" />
      ) : (
        <ChevronLeft className="h-5 w-5" />
      )}
    </Button>
  </div>
)
