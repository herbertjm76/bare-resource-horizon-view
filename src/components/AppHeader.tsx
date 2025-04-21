
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
      className="w-full px-4 py-1 flex items-center justify-between z-30 shadow-md bg-white/90 border-b border-white/30"
      style={{ minHeight: 48 }}
    >
      <div>
        <h1
          className="flex items-end leading-none select-none"
          aria-label="BareResource"
          style={{
            fontWeight: 700,          // Make both bold for uniformity
            fontSize: "2.4rem",
            letterSpacing: "0.1px",   // very tight spacing for the entire word
            lineHeight: 1,
          }}
        >
          <span
            style={{
              color: BARE_MID_GRAY,
              fontWeight: 700,
              fontSize: "2.4rem",
              letterSpacing: "0.1px",
              lineHeight: 1,
              display: "inline-block",
              position: "relative",
              paddingBottom: 0,
              textShadow: `0 4px 18px ${BARE_DARK_GREY_SHADOW}, 1px 0 4px ${BARE_DARK_GREY_SHADOW}`,
            }}
          >
            Bare
          </span>
          <span
            style={{
              fontWeight: 700,
              fontSize: "2.4rem",
              letterSpacing: "0.1px",
              display: "inline-block",
              verticalAlign: "bottom",
              background: RESOURCE_GRADIENT,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              marginLeft: 0, // remove spacing between
            }}
          >
            Resource
          </span>
        </h1>
      </div>
      <div className="flex items-center gap-4">
        {!loading && user ? (
          <>
            <span className="hidden sm:inline text-[#8E9196]">
              {company?.name ? company.name : "Company"}
            </span>
            <Button asChild variant="ghost" className="text-[#8E9196] hover:bg-[#8E9196]/10">
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
