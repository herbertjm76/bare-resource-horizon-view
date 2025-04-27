
import { Button } from "@/components/ui/button"
import { ChevronRight, ChevronLeft } from "lucide-react"

interface SidebarLogoProps {
  collapsed: boolean
  toggleSidebar: () => void
}

export const SidebarLogo = ({ collapsed, toggleSidebar }: SidebarLogoProps) => (
  <div className="flex items-center justify-between h-[48px] border-b border-[#7d8086] px-4">
    {collapsed ? (
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={toggleSidebar}
        className="text-white hover:bg-[#7d8086]/30 h-12 w-12 rounded-none flex items-center justify-center ml-auto"
      >
        <ChevronRight className="h-6 w-6" />
      </Button>
    ) : (
      <>
        <div className="flex items-center gap-2">
          <span className="text-white font-medium">Bare</span>
          <span className="bg-gradient-to-r from-[#895CF7] via-[#5669F7] to-[#E64FC4] bg-clip-text text-transparent font-semibold">Resource</span>
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={toggleSidebar}
          className="text-white hover:bg-[#7d8086]/30 h-12 w-12 rounded-none flex items-center justify-center"
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>
      </>
    )}
  </div>
)
