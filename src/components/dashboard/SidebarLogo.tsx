
import { Button } from "@/components/ui/button"
import { ChevronRight, ChevronLeft } from "lucide-react"

interface SidebarLogoProps {
  collapsed: boolean
  toggleSidebar: () => void
}

export const SidebarLogo = ({ collapsed, toggleSidebar }: SidebarLogoProps) => (
  <div className="flex items-center justify-center h-[64px] border-b border-[#7d8086] px-4">
    <div className="flex items-center justify-center w-full">
      {collapsed ? (
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={toggleSidebar}
          className="text-white hover:bg-[#7d8086] h-10 w-10 p-4 rounded-full flex items-center justify-center"
        >
          <ChevronRight className="h-6 w-6" />
        </Button>
      ) : (
        <>
          <div className="flex items-center gap-2">
            <span className="text-white font-medium">Bare</span>
            <span className="bg-gradient-to-r from-[#6e5af1] via-[#5948b4] to-[#162c69] bg-clip-text text-transparent font-semibold">Resource</span>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleSidebar}
            className="text-white hover:bg-[#7d8086] h-10 w-10 p-4 rounded-full md:flex hidden ml-auto"
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
        </>
      )}
    </div>
  </div>
)
