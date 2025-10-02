
import React, { useState, useEffect } from "react";
import { useCompany } from "@/context/CompanyContext";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { User as UserIcon, LogOut } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { DateDisplay } from "@/components/ui/date-display";
import { useIsMobile } from "@/hooks/use-mobile";
import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";

export const AppHeader: React.FC = () => {
  const { company } = useCompany();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();
  const { state } = useSidebar();

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

  return (
    <header className="w-full bg-gradient-modern border-b border-border sticky top-0 z-30 h-16 text-white">
      <div className="h-full px-4 py-2 flex items-center justify-between">
        {/* Left side - Sidebar trigger + Date display */}
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <SidebarTrigger className="p-2 text-white hover:bg-white/10" />
          <div className="min-w-0">
            <DateDisplay 
              showIcon={true}
              showTimezone={false}
              allowFormatSelection={!isMobile}
              defaultFormat={isMobile ? "numeric" : "long"}
              className="text-white/90"
            />
          </div>
        </div>

        {/* Right side - User actions */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Desktop Profile button */}
          <Button 
            asChild 
            variant="ghost" 
            size="sm" 
            className="text-white hover:bg-white/10 hidden sm:flex"
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
            className="text-white hover:bg-white/10 sm:hidden"
          >
            <Link to="/profile">
              <UserIcon className="h-4 w-4" />
            </Link>
          </Button>
          
          {/* Desktop Sign out button */}
          <Button
            variant="ghost"
            size="sm"
            className="text-white hover:bg-white/10 hidden sm:flex"
            onClick={handleLogout}
          >
            <LogOut className="mr-2 h-4 w-4" /> 
            Sign Out
          </Button>
          
          {/* Mobile sign out button */}
          <Button
            variant="ghost"
            size="sm"
            className="text-white hover:bg-white/10 sm:hidden"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  );
};
