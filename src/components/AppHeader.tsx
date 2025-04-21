
import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useCompany } from "@/context/CompanyContext";
import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { User as UserIcon, LogOut } from "lucide-react";

// Use the standardized light gray for Bare.
const BARE_GRAY = "var(--bare-light-gray)";

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
      const { data: { session } } = await supabase.auth.getSession();
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

  // Only render in the content column, not beyond the sidebar
  return (
    <header 
      className="w-full glass-morphism px-4 py-2 flex items-center justify-between z-50 shadow-lg bg-white/20 backdrop-blur-md border-b border-white/50"
      style={{minHeight:56}}
    >
      <Link 
        to="/" 
        className="text-2xl font-bold tracking-tight hover:opacity-80 flex items-center select-none" 
        aria-label="BareResource"
      >
        <span className="drop-shadow-sm" style={{ color: "var(--bare-light-gray)" }}>Bare</span>
        <span
          className="ml-0.5 bg-clip-text text-transparent bg-gradient-to-r from-[#9b87f5] via-[#1EAEDB] to-[#D946EF] drop-shadow-sm"
          style={{ WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
        >
          Resource
        </span>
      </Link>
      <div className="flex items-center gap-4">
        {!loading && user ? (
          <>
            <span className="hidden sm:inline text-white/80">{company?.name ? company.name : "Company"}</span>
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
