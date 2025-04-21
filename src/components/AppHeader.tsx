
import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useCompany } from "@/context/CompanyContext";
import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { User as UserIcon, LogOut } from "lucide-react";

export const AppHeader: React.FC = () => {
  const { company } = useCompany();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    let authSubscription: { unsubscribe: () => void } | null = null;
    setLoading(true);
    (async () => {
      // Listen for auth events, update state
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      // Listen for auth changes to update state on login/logout
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
    <header className="w-full bg-[#8E9196] text-white px-4 py-2 flex items-center justify-between z-30 shadow">
      <Link to="/" className="text-2xl font-bold tracking-tight hover:opacity-80">BareResource</Link>
      <div className="flex items-center gap-4">
        {!loading && user ? (
          <>
            <span className="hidden sm:inline">{company?.name ? company.name : "Company"}</span>
            <Button 
              asChild 
              variant="ghost" 
              className="text-white hover:bg-white/10"
            >
              <Link to="/profile">
                <UserIcon className="mr-2 h-4 w-4" /> My Profile
              </Link>
            </Button>
            <Button 
              variant="ghost" 
              className="text-white hover:bg-white/10" 
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4" /> Sign Out
            </Button>
          </>
        ) : !loading ? (
          <Button asChild variant="ghost" className="text-white hover:bg-white/10">
            <Link to="/auth">Sign In</Link>
          </Button>
        ) : null}
      </div>
    </header>
  );
};
