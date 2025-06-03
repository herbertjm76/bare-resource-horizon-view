
import React from "react";
import { useCompany } from "@/context/CompanyContext";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { User as UserIcon, LogOut, Menu } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { ResponsiveDateDisplay } from "@/components/ui/responsive-date-display";

export const AppHeader: React.FC = () => {
  const { company } = useCompany();
  const [user, setUser] = React.useState<User | null>(null);
  const [loading, setLoading] = React.useState(true);
  const navigate = useNavigate();
  const location = useLocation();

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
    <header className="w-full px-3 sm:px-6 py-2 flex items-center justify-between bg-white border-b border-gray-200 fixed top-0 right-0 z-30 h-[64px] pl-[280px] lg:pl-[280px] md:pl-[280px] sm:pl-4 transition-all duration-300">
      {/* Left side - Date display */}
      <div className="flex items-center min-w-0 flex-1">
        <ResponsiveDateDisplay />
      </div>

      {/* Right side - User actions */}
      <div className="flex items-center gap-1 sm:gap-2 lg:gap-4 flex-shrink-0">
        {/* Desktop navigation */}
        <div className="hidden md:flex items-center gap-2 lg:gap-4">
          <Button asChild variant="ghost" size="sm" className="text-gray-600 hover:bg-gray-100 text-xs sm:text-sm">
            <Link to="/profile">
              <UserIcon className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden lg:inline">My Profile</span>
              <span className="lg:hidden">Profile</span>
            </Link>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-600 hover:bg-gray-100 text-xs sm:text-sm"
            onClick={handleLogout}
          >
            <LogOut className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden lg:inline">Sign Out</span>
            <span className="lg:hidden">Out</span>
          </Button>
        </div>

        {/* Mobile navigation */}
        <div className="md:hidden">
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-600 hover:bg-gray-100 p-2"
            onClick={() => {
              // For now, just show the logout action on mobile
              // In a real app, this would open a mobile menu
              handleLogout();
            }}
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  );
};
