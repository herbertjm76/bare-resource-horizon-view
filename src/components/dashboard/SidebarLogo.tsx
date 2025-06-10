
import { Button } from "@/components/ui/button";
import { ChevronRight, ChevronLeft } from "lucide-react";

interface SidebarLogoProps {
  collapsed: boolean;
  toggleSidebar: () => void;
}

export const SidebarLogo = ({
  collapsed,
  toggleSidebar
}: SidebarLogoProps) => {
  const handleToggle = () => {
    console.log("Toggle sidebar called, current state:", collapsed ? "collapsed" : "expanded");
    toggleSidebar();
  };

  return (
    <div className="flex items-center justify-between h-[48px] border-b border-indigo-600 px-4 bg-gradient-to-r from-indigo-600 to-purple-700">
      {collapsed ? (
        <div className="w-full flex items-center justify-center">
          <img 
            src="/lovable-uploads/ed04e6a3-39d3-470c-8f3f-7b02984281bc.png" 
            alt="BareResource Logo" 
            className="w-[17.2px] h-[17.2px] opacity-90 hover:opacity-100 transition-opacity" 
          />
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleToggle} 
            className="text-indigo-100 hover:bg-indigo-800/40 hover:text-white h-12 w-12 rounded-none flex items-center justify-center z-20 ml-auto transition-all duration-200"
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
        </div>
      ) : (
        <div className="flex items-center w-full">
          <div className="flex items-center flex-grow">
            <img 
              src="/lovable-uploads/ed04e6a3-39d3-470c-8f3f-7b02984281bc.png" 
              alt="BareResource Logo" 
              className="w-[25px] h-[20px] opacity-90 hover:opacity-100 transition-opacity" 
            />
            <span className="text-indigo-100 font-semibold py-0 px-[5px]"> BareResource</span>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleToggle} 
            className="text-indigo-100 hover:bg-indigo-800/40 hover:text-white h-12 w-12 rounded-none flex items-center justify-center transition-all duration-200"
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
        </div>
      )}
    </div>
  );
};
