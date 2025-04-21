import React from "react";
import { useCompany } from "@/context/CompanyContext";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { User as UserIcon, LogOut } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";

// Colors
const BARE_DARK_GREY_SHADOW = "#222";
const RESOURCE_GRADIENT = "linear-gradient(90deg, #9b87f5, #7E69AB, #5a7eb7)";
const BARE_MID_GRAY = "#8A898C";

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
    <header
      className="w-full px-6 py-2 flex items-center justify-end bg-white border-b border-gray-200 fixed top-0 right-0 z-30 h-[56px]"
    >
      <div className="flex items-center gap-4">
        <span className="text-sm font-medium text-gray-500">ADMIN</span>
        <Button asChild variant="ghost" size="sm" className="text-gray-600 hover:bg-gray-100">
          <Link to="/profile">
            <UserIcon className="mr-2 h-4 w-4" /> My Profile
          </Link>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="text-gray-600 hover:bg-gray-100"
          onClick={handleLogout}
        >
          <LogOut className="mr-2 h-4 w-4" /> Sign Out
        </Button>
      </div>
    </header>
  );
};
