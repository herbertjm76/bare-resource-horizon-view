
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CompanyProvider } from "./context/CompanyContext";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Auth from "./pages/Auth";
import Profile from "./pages/Profile";
import Projects from "./pages/Projects";
import TeamMembers from "./pages/TeamMembers";
import OfficeSettings from "./pages/OfficeSettings";
import WeekResourcing from "./pages/WeekResourcing";
import WeeklyOverview from "./pages/WeeklyOverview";
import TeamWorkload from "./pages/TeamWorkload";
import TeamAnnualLeave from "./pages/TeamAnnualLeave";
import ProjectResourcing from "./pages/ProjectResourcing";
import Help from "./pages/Help";
import FAQ from "./pages/FAQ";
import Join from "./pages/Join";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <CompanyProvider>
        <TooltipProvider>
          <Toaster />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/team-members" element={<TeamMembers />} />
              <Route path="/office-settings" element={<OfficeSettings />} />
              <Route path="/week-resourcing" element={<WeekResourcing />} />
              <Route path="/weekly-overview" element={<WeeklyOverview />} />
              <Route path="/team-workload" element={<TeamWorkload />} />
              <Route path="/team-annual-leave" element={<TeamAnnualLeave />} />
              <Route path="/project-resourcing" element={<ProjectResourcing />} />
              <Route path="/help" element={<Help />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/join" element={<Join />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </CompanyProvider>
    </QueryClientProvider>
  );
}

export default App;
