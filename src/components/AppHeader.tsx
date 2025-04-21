import React from "react";
import { useCompany } from "@/context/CompanyContext";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { User as UserIcon, LogOut } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";

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

  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString('en-US', {
    weekday: 'short',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).toUpperCase();

  return (
    <header className="w-full px-6 py-2 flex items-center justify-between bg-white border-b border-gray-200 fixed top-0 right-0 z-30 h-[64px] pl-[280px]">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-gray-400 text-sm">MON</span>
          <span className="text-gray-600">|</span>
          <span className="text-gray-600 text-sm">21 APRIL 2024</span>
        </div>
      </div>
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
