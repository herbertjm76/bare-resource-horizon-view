
import React from 'react';
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { useSidebar } from "@/components/ui/sidebar";
import { Link } from "react-router-dom";

export const SidebarLogo = () => {
  const { state, toggleSidebar } = useSidebar();
  const collapsed = state === "collapsed";

  return (
    <div className="flex items-center justify-between h-[48px] border-b border-white/10 px-4">
      {collapsed ? (
        <div className="w-full flex items-center justify-center">
          <Link 
            to="/"
            className="text-indigo-100 hover:bg-indigo-800/40 hover:text-white h-8 w-8 p-0 flex items-center justify-center transition-all duration-200 rounded-md"
          >
            <img 
              src="/lovable-uploads/ed04e6a3-39d3-470c-8f3f-7b02984281bc.png" 
              alt="BareResource Logo" 
              className="w-[16px] h-[16px] opacity-90 hover:opacity-100 transition-opacity" 
            />
          </Link>
        </div>
      ) : (
        <div className="flex items-center w-full">
          <Link to="/" className="flex items-center flex-grow hover:opacity-80 transition-opacity">
            <img 
              src="/lovable-uploads/ed04e6a3-39d3-470c-8f3f-7b02984281bc.png" 
              alt="BareResource Logo" 
              className="w-[25px] h-[20px] opacity-90 hover:opacity-100 transition-opacity" 
            />
            <span className="text-indigo-100 font-semibold py-0 px-[5px]"> BareResource</span>
          </Link>
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
