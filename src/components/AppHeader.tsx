
import React from "react";
import { useCompany } from "@/context/CompanyContext";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { User as UserIcon, LogOut } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";

// Standardized colors
const BARE_GRAY = "#8E9196";
const GRADIENT = "linear-gradient(90deg, #9b87f5, #5a7eb7)"; // gentle purple to blue

// Option 1: Bare in white, Resource in gray, with gradient underline
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
      className="w-full px-4 py-2 flex items-center justify-between z-30 shadow-md bg-white/90 border-b border-white/30"
      style={{ minHeight: 56 }}
    >
      <div>
        <h1 className="flex items-end leading-none select-none" aria-label="BareResource">
          <span
            style={{
              color: "#fff",
              fontWeight: 900,
              fontSize: "2.4rem",
              letterSpacing: "0.5px",
              lineHeight: "1.1",
              marginRight: "0.12em",
              // Gentle shadow for white-on-bright
              textShadow:
                "0 4px 18px rgba(40,40,76,0.18), 1px 0 4px rgba(60,60,100,0.22)",
              display: "inline-block",
            }}
          >
            Bare
          </span>
          <span
            style={{
              color: BARE_GRAY,
              fontWeight: 700,
              fontSize: "2.1rem", // 10% smaller
              letterSpacing: "0.5px",
              marginLeft: "0.04em",
              display: "inline-block",
              position: "relative",
              verticalAlign: "bottom",
            }}
          >
            Resource
            <span
              aria-hidden
              style={{
                display: "block",
                height: 3,
                width: "100%",
                borderRadius: 3,
                marginTop: "0.23em",
                background: GRADIENT,
                position: "relative",
                opacity: 0.7,
              }}
            />
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

