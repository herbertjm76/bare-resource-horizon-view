
import React from 'react';
import { Button } from "@/components/ui/button";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { useSidebar } from "@/components/ui/sidebar";

export const SidebarLogo = () => {
  const { state, toggleSidebar } = useSidebar();
  const collapsed = state === "collapsed";

  return (
    <div className="flex items-center justify-between h-[48px] border-b border-[hsl(var(--theme-border))] opacity-30 px-4">
      {collapsed ? (
        <div className="w-full flex items-center justify-center">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleSidebar} 
            className="text-indigo-100 hover:bg-indigo-800/40 hover:text-white h-8 w-8 p-0 flex items-center justify-center transition-all duration-200"
          >
            <img 
              src="/lovable-uploads/ed04e6a3-39d3-470c-8f3f-7b02984281bc.png" 
              alt="BareResource Logo" 
              className="w-[16px] h-[16px] opacity-90 hover:opacity-100 transition-opacity" 
            />
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
            onClick={toggleSidebar} 
            className="text-indigo-100 hover:bg-indigo-800/40 hover:text-white h-12 w-12 rounded-none flex items-center justify-center transition-all duration-200"
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
        </div>
      )}
    </div>
  );
};
