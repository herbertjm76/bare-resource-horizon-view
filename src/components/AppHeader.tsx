
import React from "react";
import { useCompany } from "@/context/CompanyContext";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { User as UserIcon, LogOut } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";

// Use the standardized light gray for Bare.
const BARE_GRAY = "var(--bare-light-gray)";

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
        className="flex items-center text-[2.5rem] sm:text-[3.25rem] font-black select-none leading-none"
        aria-label="Bare Resource"
      >
        <span
          style={{
            color: "white",
            WebkitTextStroke: "2.5px black",
            fontWeight: 900,
            letterSpacing: "0.5px",
            lineHeight: 1.1,
            marginRight: "0.5rem",
            display: "inline-block",
          }}
        >
          Bare
        </span>
        <span
          className="font-extrabold ml-2 px-2 rounded-[0.25em]"
          style={{
            background: "rgba(154, 129, 237, 0.07)", // subtle purple background
            backgroundClip: "padding-box",
            display: "inline-block",
          }}
        >
          <span
            style={{
              background: "linear-gradient(90deg,#6C4AB6 0%,#4D7AD8 35%,#D450C2 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              fontWeight: 900,
              fontSize: "inherit",
              letterSpacing: "0.5px",
            }}
            className="leading-none"
          >
            Resource
          </span>
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
