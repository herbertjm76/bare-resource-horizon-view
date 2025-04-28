
import { Button } from "@/components/ui/button"
import { ChevronRight, ChevronLeft } from "lucide-react"
import LogoIcon from "@/assets/logo.svg"

interface SidebarLogoProps {
  collapsed: boolean
  toggleSidebar: () => void
}

export const SidebarLogo = ({ collapsed, toggleSidebar }: SidebarLogoProps) => {
  const handleToggle = () => {
    console.log("Toggle sidebar called, current state:", collapsed ? "collapsed" : "expanded")
    toggleSidebar()
  }

  return (
    <div className="flex items-center justify-between h-[48px] border-b border-[#7d8086] px-4">
      {collapsed ? (
        <div className="w-full flex items-center justify-center">
          <img 
            src={LogoIcon} 
            alt="BareResource Logo" 
            className="w-5 h-5 opacity-80 hover:opacity-100 transition-opacity" 
          />
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleToggle}
            className="text-white hover:bg-[#7d8086]/30 h-12 w-12 rounded-none flex items-center justify-center z-20 ml-auto"
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
        </div>
      ) : (
        <div className="flex items-center w-full">
          <div className="flex items-center gap-2 flex-grow">
            <img 
              src={LogoIcon} 
              alt="BareResource Logo" 
              className="w-6 h-6 mr-2 opacity-80 hover:opacity-100 transition-opacity" 
            />
            <span className="text-white font-semibold">BareResource</span>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleToggle}
            className="text-white hover:bg-[#7d8086]/30 h-12 w-12 rounded-none flex items-center justify-center"
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
        </div>
      )}
    </div>
  )
}
