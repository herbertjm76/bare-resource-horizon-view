
import React from "react";
import { useCompany } from "@/context/CompanyContext";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { User as UserIcon, LogOut, Menu } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { DateDisplay } from "@/components/ui/date-display";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

interface AppHeaderProps {
  onMenuToggle?: () => void;
  sidebarCollapsed?: boolean;
}

export const AppHeader: React.FC<AppHeaderProps> = ({ onMenuToggle, sidebarCollapsed = true }) => {
  const { company } = useCompany();
  const [user, setUser] = React.useState<User | null>(null);
  const [loading, setLoading] = React.useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();

  React.useEffect(() => {
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
    <header className="w-full bg-white border-b border-gray-200 fixed top-0 left-0 right-0 z-30 h-16">
      {/* Container that handles sidebar margin dynamically */}
      <div className={cn(
        "h-full px-4 py-2 flex items-center justify-between transition-all duration-300",
        !isMobile && !sidebarCollapsed && "md:ml-[280px]",
        !isMobile && sidebarCollapsed && "md:ml-16"
      )}>
        {/* Left side - Mobile hamburger menu + Date display */}
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {isMobile && onMenuToggle && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onMenuToggle}
              className="p-2 text-gray-600 hover:bg-gray-100 flex-shrink-0"
            >
              <Menu className="h-5 w-5" />
            </Button>
          )}
          <div className="min-w-0">
            <DateDisplay 
              showIcon={true}
              showTimezone={false}
              allowFormatSelection={!isMobile}
              defaultFormat={isMobile ? "numeric" : "long"}
              className="text-gray-600"
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
            className="text-gray-600 hover:bg-gray-100 hidden sm:flex"
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
            className="text-gray-600 hover:bg-gray-100 sm:hidden"
          >
            <Link to="/profile">
              <UserIcon className="h-4 w-4" />
            </Link>
          </Button>
          
          {/* Desktop Sign out button */}
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-600 hover:bg-gray-100 hidden sm:flex"
            onClick={handleLogout}
          >
            <LogOut className="mr-2 h-4 w-4" /> 
            Sign Out
          </Button>
          
          {/* Mobile sign out button */}
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-600 hover:bg-gray-100 sm:hidden"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  );
};
