
import React from "react";
import { useCompany } from "@/context/CompanyContext";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { User as UserIcon, LogOut } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { DateDisplay } from "@/components/ui/date-display";

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
    <header className="w-full px-2 sm:px-6 py-2 flex items-center justify-between bg-white border-b border-gray-200 fixed top-0 left-0 right-0 z-30 h-[64px] sm:ml-[280px] transition-all duration-300">
      {/* Left side - Date display */}
      <div className="flex items-center flex-1 min-w-0 mr-2 sm:mr-4">
        <DateDisplay 
          showIcon={true}
          showTimezone={false}
          allowFormatSelection={true}
          defaultFormat="long"
          className="text-gray-600 max-w-full truncate"
        />
      </div>

      {/* Right side - User actions */}
      <div className="flex items-center gap-1 sm:gap-4 flex-shrink-0">
        <Button asChild variant="ghost" size="sm" className="text-gray-600 hover:bg-gray-100 hidden sm:flex">
          <Link to="/profile">
            <UserIcon className="mr-2 h-4 w-4" /> My Profile
          </Link>
        </Button>
        <Button asChild variant="ghost" size="sm" className="text-gray-600 hover:bg-gray-100 sm:hidden p-2">
          <Link to="/profile">
            <UserIcon className="h-4 w-4" />
          </Link>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="text-gray-600 hover:bg-gray-100 hidden sm:flex"
          onClick={handleLogout}
        >
          <LogOut className="mr-2 h-4 w-4" /> Sign Out
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="text-gray-600 hover:bg-gray-100 sm:hidden p-2"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
    </header>
  );
};
