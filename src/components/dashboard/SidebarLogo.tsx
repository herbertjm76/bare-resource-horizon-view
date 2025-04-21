
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface SidebarLogoProps {
  collapsed: boolean
  toggleSidebar: () => void
}

export const SidebarLogo = ({ collapsed, toggleSidebar }: SidebarLogoProps) => (
  <div className="flex items-center justify-between px-6 py-4 h-[64px] border-b border-[#7d8086]">
    <span className="text-2xl font-bold select-none whitespace-nowrap">
      {collapsed ? (
        <span className="text-white">B</span>
      ) : (
        <>
          <span className="text-white">Bare</span>
          <span className="bg-gradient-to-r from-[#6e5af1] via-[#5948b4] to-[#162c69] bg-clip-text text-transparent font-semibold">Resource</span>
        </>
      )}
    </span>
    <Button 
      variant="ghost" 
      size="icon" 
      onClick={toggleSidebar}
      className="text-white hover:bg-[#7d8086] h-10 w-10 p-2 rounded-full md:flex hidden"
    >
      {collapsed ? (
        <ChevronRight className="h-6 w-6" />
      ) : (
        <ChevronLeft className="h-6 w-6" />
      )}
    </Button>
  </div>
)
