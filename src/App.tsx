
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
import TeamMemberDetail from "./pages/TeamMemberDetail";
import OfficeSettings from "./pages/OfficeSettings";
import WeeklyOverview from "./pages/WeeklyOverview";
import TeamWorkload from "./pages/TeamWorkload";
import TeamAnnualLeave from "./pages/TeamAnnualLeave";
import ProjectResourcing from "./pages/ProjectResourcing";
import Help from "./pages/Help";
import FAQ from "./pages/FAQ";
import Documentation from "./pages/Documentation";
import ContactSupport from "./pages/ContactSupport";
import Join from "./pages/Join";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import NotFound from "./pages/NotFound";
import FinancialOverview from "./pages/FinancialOverview";
import ProjectProfitDashboard from "./pages/ProjectProfitDashboard";
import ProjectBilling from "./pages/ProjectBilling";
import AgingInvoices from "./pages/AgingInvoices";
import SolutionsPage from "./pages/Solutions";
import AppTourPage from "./pages/AppTour";
import PricingPage from "./pages/Pricing";
import FinancialControl from "./pages/FinancialControl";
import ProjectMonitoring from "./pages/ProjectMonitoring";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <BrowserRouter>
          <CompanyProvider>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/team-members" element={<TeamMembers />} />
              <Route path="/team-members/:id" element={<TeamMemberDetail />} />
              <Route path="/office-settings" element={<OfficeSettings />} />
              <Route path="/weekly-overview" element={<WeeklyOverview />} />
              <Route path="/team-workload" element={<TeamWorkload />} />
              <Route path="/team-annual-leave" element={<TeamAnnualLeave />} />
              <Route path="/project-resourcing" element={<ProjectResourcing />} />
              <Route path="/financial-control" element={<FinancialControl />} />
              <Route path="/project-monitoring" element={<ProjectMonitoring />} />
              <Route path="/financial-overview" element={<FinancialOverview />} />
              <Route path="/project-profit-dashboard" element={<ProjectProfitDashboard />} />
              <Route path="/project-billing" element={<ProjectBilling />} />
              <Route path="/aging-invoices" element={<AgingInvoices />} />
              <Route path="/documentation" element={<Documentation />} />
              <Route path="/help" element={<Help />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/contact-support" element={<ContactSupport />} />
              <Route path="/solutions" element={<SolutionsPage />} />
              <Route path="/app-tour" element={<AppTourPage />} />
              <Route path="/pricing" element={<PricingPage />} />
              <Route path="/join" element={<Join />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </CompanyProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
