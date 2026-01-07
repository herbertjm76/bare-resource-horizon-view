import React, { useState, useEffect } from "react";
import { useCompany } from "@/context/CompanyContext";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { User as UserIcon, LogOut, HelpCircle, Rocket } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { DateDisplay } from "@/components/ui/date-display";
import { useIsMobile } from "@/hooks/use-mobile";
import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import { ViewAsRoleSwitcher } from "@/components/ViewAsRoleSwitcher";
import { useOnboardingTour } from "@/hooks/useOnboardingTour";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const AppHeader: React.FC = () => {
  const { company } = useCompany();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();
  const { state } = useSidebar();
  const { resetTour } = useOnboardingTour();

  useEffect(() => {
    let authSubscription: { unsubscribe: () => void } | null = null;
    setLoading(true);
    (async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      const { data } = supabase.auth.onAuthStateChange((_event, session) => {
        setUser(session?.user ?? null);
      });
      authSubscription = data.subscription;
      setLoading(false);
    })();
    return () => {
      if (authSubscription) authSubscription.unsubscribe();
    };
  }, [location]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  const handleRestartTour = () => {
    // Use the hook's resetTour which properly clears all keys
    resetTour();
  };

  return (
    <header className="w-full bg-white border-b border-gray-200 sticky top-0 z-30 h-16 shadow-sm">
      <div className="h-full px-4 sm:px-6 py-2 flex items-center justify-between">
        {/* Left side - Sidebar trigger + Date display */}
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <SidebarTrigger className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-700" />
          <div className="min-w-0">
            <DateDisplay 
              showIcon={true}
              showTimezone={false}
              allowFormatSelection={!isMobile}
              defaultFormat={isMobile ? "numeric" : "long"}
              className="text-gray-900 font-bold"
            />
          </div>
        </div>

        {/* Right side - User actions */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {/* View As Role Switcher (admin only) */}
          <ViewAsRoleSwitcher />
          
          {/* Help dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-700 hover:bg-gray-100 hover:text-gray-900"
              >
                <HelpCircle className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Help</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={handleRestartTour} className="cursor-pointer">
                <Rocket className="h-4 w-4 mr-2" />
                Restart Tour
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          {/* Desktop Profile button */}
          <Button
            asChild 
            variant="ghost" 
            size="sm" 
            className="hidden sm:flex text-gray-700 hover:bg-gray-100 hover:text-gray-900"
          >
            <Link to="/profile">
              <UserIcon className="mr-2 h-4 w-4" /> 
              Profile
            </Link>
          </Button>
          
          {/* Mobile profile button */}
          <Button 
            asChild 
            variant="ghost" 
            size="sm" 
            className="sm:hidden text-gray-700 hover:bg-gray-100 hover:text-gray-900"
          >
            <Link to="/profile">
              <UserIcon className="h-4 w-4" />
            </Link>
          </Button>
          
          {/* Desktop Sign out button */}
          <Button
            variant="ghost"
            size="sm"
            className="hidden sm:flex text-gray-700 hover:bg-gray-100 hover:text-gray-900"
            onClick={handleLogout}
          >
            <LogOut className="mr-2 h-4 w-4" /> 
            Sign Out
          </Button>
          
          {/* Mobile sign out button */}
          <Button
            variant="ghost"
            size="sm"
            className="sm:hidden text-gray-700 hover:bg-gray-100 hover:text-gray-900"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  );
};
