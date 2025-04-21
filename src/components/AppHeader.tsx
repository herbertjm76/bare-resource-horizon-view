
import React from "react";
import { useCompany } from "@/context/CompanyContext";
import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { User as UserIcon, LogOut } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";

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

  return (
    <header 
      className="w-full px-4 py-2 flex items-center justify-between z-30 shadow-md bg-white/90 border-b border-white/30"
      style={{minHeight:56}}
    >
      <h1 
        className="text-2xl font-bold tracking-tight select-none" 
        aria-label="Bare Resource"
      >
        {/* White text with black outline for "Bare" */}
        <span 
          className="relative text-white"
          style={{
            WebkitTextStroke: '1.5px black',
            // For fallback and more browser support, also add textShadow:
            textShadow: `
              -1px -1px 0 black,
              1px -1px 0 black,
              -1px 1px 0 black,
              1px 1px 0 black
            `
          }}
        >
          Bare
        </span>
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 via-blue-500 to-pink-500 ml-1">
          Resource
        </span>
      </h1>
      <div className="flex items-center gap-4">
        {!loading && user ? (
          <>
            <span className="hidden sm:inline text-[#8E9196]">{company?.name ? company.name : "Company"}</span>
            <Button 
              asChild 
              variant="ghost" 
              className="text-[#8E9196] hover:bg-[#8E9196]/10"
            >
              <Link to="/profile">
                <UserIcon className="mr-2 h-4 w-4" /> My Profile
              </Link>
            </Button>
            <Button 
              variant="ghost" 
              className="text-[#8E9196] hover:bg-[#8E9196]/10" 
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4" /> Sign Out
            </Button>
          </>
        ) : !loading ? (
          <Button asChild variant="ghost" className="text-[#8E9196] hover:bg-[#8E9196]/10">
            <Link to="/auth">Sign In</Link>
          </Button>
        ) : null}
      </div>
    </header>
  );
};

