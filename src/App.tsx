
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Dashboard from "./pages/Dashboard";
import Projects from "./pages/Projects";
import OfficeSettings from "./pages/OfficeSettings";
import Auth from "./pages/Auth";
import Join from "./pages/Join";
import Profile from "./pages/Profile";
import TeamMembers from "./pages/TeamMembers";
import TeamWorkload from "./pages/TeamWorkload";
import TeamAnnualLeave from "./pages/TeamAnnualLeave";
import WeeklyOverview from "./pages/WeeklyOverview";
import ProjectResourcing from "./pages/ProjectResourcing";
import Help from "./pages/Help";
import { CompanyProvider, useCompany } from "./context/CompanyContext";
import { useEffect, useState } from "react";
import { supabase } from "./integrations/supabase/client";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Component to check authentication and redirect if needed
const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        setIsAuthenticated(!!data.session);
      } catch (error) {
        console.error('Auth check error:', error);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuth();
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
    });
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }
  
  return <>{children}</>;
};

// Component to handle routing based on subdomain status
const AppRoutes = () => {
  const { isSubdomainMode, company, loading } = useCompany();

  // If we're in subdomain mode but no company was found, show not found
  if (isSubdomainMode && !loading && !company) {
    return (
      <Routes>
        <Route path="*" element={<NotFound companyNotFound />} />
      </Routes>
    );
  }

  // Main routes
  return (
    <Routes>
      {/* Public routes always available */}
      <Route path="/auth" element={<Auth />} />
      <Route path="/join" element={<Join />} />
      <Route path="/join/:inviteCode" element={<Join />} />
      
      {/* Root path handling depends on subdomain status */}
      <Route path="/" element={
        isSubdomainMode 
          ? <Navigate to="/dashboard" replace /> 
          : <Index />
      } />
      
      {/* Protected company-specific routes */}
      <Route path="/dashboard" element={
        <AuthGuard>
          <Dashboard />
        </AuthGuard>
      } />
      <Route path="/weekly-overview" element={
        <AuthGuard>
          <WeeklyOverview />
        </AuthGuard>
      } />
      <Route path="/project-resourcing" element={
        <AuthGuard>
          <ProjectResourcing />
        </AuthGuard>
      } />
      <Route path="/projects" element={
        <AuthGuard>
          <Projects />
        </AuthGuard>
      } />
      <Route path="/team-members" element={
        <AuthGuard>
          <TeamMembers />
        </AuthGuard>
      } />
      <Route path="/team-workload" element={
        <AuthGuard>
          <TeamWorkload />
        </AuthGuard>
      } />
      <Route path="/team-annual-leave" element={
        <AuthGuard>
          <TeamAnnualLeave />
        </AuthGuard>
      } />
      <Route path="/office-settings" element={
        <AuthGuard>
          <OfficeSettings />
        </AuthGuard>
      } />
      <Route path="/help" element={
        <AuthGuard>
          <Help />
        </AuthGuard>
      } />
      <Route path="/profile" element={
        <AuthGuard>
          <Profile />
        </AuthGuard>
      } />
      
      {/* Catch-all route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter>
        <CompanyProvider>
          <Toaster />
          <Sonner />
          <AppRoutes />
        </CompanyProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
