
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
import { useEffect } from "react";

const queryClient = new QueryClient();

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
      
      {/* Company-specific routes */}
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/weekly-overview" element={<WeeklyOverview />} />
      <Route path="/project-resourcing" element={<ProjectResourcing />} />
      <Route path="/projects" element={<Projects />} />
      <Route path="/team-members" element={<TeamMembers />} />
      <Route path="/team-workload" element={<TeamWorkload />} />
      <Route path="/team-annual-leave" element={<TeamAnnualLeave />} />
      <Route path="/office-settings" element={<OfficeSettings />} />
      <Route path="/help" element={<Help />} />
      <Route path="/profile" element={<Profile />} />
      
      {/* Catch-all route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <CompanyProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </CompanyProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
