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

  return (
    <header
      className="w-full px-6 py-4 flex items-center justify-between z-30 bg-white/95 backdrop-blur-sm border-b border-neutral-100"
      style={{ height: "72px" }}
    >
      <h1
        className="flex items-center text-[2.25rem] sm:text-[2.5rem] font-black select-none leading-none"
        aria-label="BareResource"
      >
        <span
          className="bare-logo-shadow"
          style={{
            color: "white",
            textShadow:
              "0 6px 10px rgba(0, 0, 0, 0.95), 0 0 10px rgba(0, 0, 0, 0.85), 0 0 7px rgba(0,0,0,0.7)",
            fontWeight: 900,
            letterSpacing: "0.5px",
            display: "inline-block",
            marginRight: 0,
          }}
        >
          Bare
        </span>
        <span
          className="bare-logo-shadow"
          style={{
            background:
              "linear-gradient(90deg, #7c52a0 0%, #5863a9 45%, #5a7eb7 65%, #c153bd 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            fontWeight: 900,
            letterSpacing: "0.5px",
            display: "inline-block",
          }}
        >
          Resource
        </span>
      </h1>
      <div className="flex items-center gap-3">
        {!loading && user ? (
          <>
            <span className="hidden sm:inline text-neutral-500 font-medium">
              {company?.name ? company.name : "Company"}
            </span>
            <Button asChild variant="ghost" className="text-neutral-500 hover:bg-neutral-100/80">
              <Link to="/profile">
                <UserIcon className="mr-1.5 h-4 w-4" /> Profile
              </Link>
            </Button>
            <Button
              variant="ghost"
              className="text-neutral-500 hover:bg-neutral-100/80"
              onClick={handleLogout}
            >
              <LogOut className="mr-1.5 h-4 w-4" /> Sign Out
            </Button>
          </>
        ) : !loading ? (
          <Button asChild variant="ghost" className="text-neutral-500 hover:bg-neutral-100/80">
            <Link to="/auth">Sign In</Link>
          </Button>
        ) : null}
      </div>
    </header>
  );
};
