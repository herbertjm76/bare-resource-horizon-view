
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CompanyProvider } from "./context/CompanyContext";
import { useTheme } from "./hooks/useTheme";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Auth from "./pages/Auth";
import Profile from "./pages/Profile";
import Projects from "./pages/Projects";
import ProjectsOnboarding from "./pages/ProjectsOnboarding";
import TeamMembers from "./pages/TeamMembers";
import TeamMemberDetail from "./pages/TeamMemberDetail";
import OfficeSettings from "./pages/OfficeSettings";
import WeeklyOverview from "./pages/WeeklyOverview";
import TeamWorkload from "./pages/TeamWorkload";
import TeamAnnualLeave from "./pages/TeamAnnualLeave";
import ProjectResourcing from "./pages/ProjectResourcing";
import ResourceScheduling from "./pages/ResourceScheduling";
import HelpCenter from "./pages/HelpCenter";
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
import { WorkflowPage } from "./pages/WorkflowPage";
import WeeklyRundown from "./pages/WeeklyRundown";
import CompanyLanding from "./pages/CompanyLanding";
import Timeline from "./pages/Timeline";
import CapacityPlanning from "./pages/CapacityPlanning";
import Pipeline from "./pages/Pipeline";

const queryClient = new QueryClient();

function App() {
  useTheme(); // Load saved theme on app start
  
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <BrowserRouter>
          <CompanyProvider>
            <Routes>
              {/* Public marketing routes */}
              <Route path="/" element={<Index />} />
              <Route path="/solutions" element={<SolutionsPage />} />
              <Route path="/app-tour" element={<AppTourPage />} />
              <Route path="/pricing" element={<PricingPage />} />
              <Route path="/help" element={<Help />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/documentation" element={<Documentation />} />
              <Route path="/contact-support" element={<ContactSupport />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              
              {/* Auth routes */}
              <Route path="/auth" element={<Auth />} />
              
              {/* Company-scoped join route: /join/:companySlug/:inviteCode? */}
              <Route path="/join/:companySlug/:inviteCode?" element={<Join />} />
              <Route path="/join/:companySlug" element={<Join />} />
              
              {/* Company-scoped app routes: /:companySlug/* */}
              <Route path="/:companySlug/dashboard" element={<Dashboard />} />
              <Route path="/:companySlug/profile" element={<Profile />} />
              <Route path="/:companySlug/projects" element={<Projects />} />
              <Route path="/:companySlug/projects/onboarding" element={<ProjectsOnboarding />} />
              <Route path="/:companySlug/pipeline" element={<Pipeline />} />
              <Route path="/:companySlug/team-members" element={<TeamMembers />} />
              <Route path="/:companySlug/team-members/:id" element={<TeamMemberDetail />} />
              <Route path="/:companySlug/team-workload" element={<TeamWorkload />} />
              <Route path="/:companySlug/office-settings" element={<OfficeSettings />} />
              <Route path="/:companySlug/weekly-overview" element={<WeeklyOverview />} />
              <Route path="/:companySlug/weekly-rundown" element={<WeeklyRundown />} />
              <Route path="/:companySlug/resource-scheduling" element={<ResourceScheduling />} />
              <Route path="/:companySlug/timeline" element={<Timeline />} />
              <Route path="/:companySlug/capacity-planning" element={<CapacityPlanning />} />
              {/* Legacy routes - redirect to unified scheduling */}
              <Route path="/:companySlug/team-workload" element={<ResourceScheduling />} />
              <Route path="/:companySlug/project-resourcing" element={<ResourceScheduling />} />
              <Route path="/:companySlug/team-annual-leave" element={<TeamAnnualLeave />} />
              <Route path="/:companySlug/financial-control" element={<FinancialControl />} />
              <Route path="/:companySlug/help-center" element={<HelpCenter />} />
              <Route path="/:companySlug/workflow" element={<WorkflowPage />} />
              <Route path="/:companySlug/financial-overview" element={<FinancialOverview />} />
              <Route path="/:companySlug/project-profit-dashboard" element={<ProjectProfitDashboard />} />
              <Route path="/:companySlug/project-billing" element={<ProjectBilling />} />
              <Route path="/:companySlug/aging-invoices" element={<AgingInvoices />} />
              
              {/* Fallback for legacy routes without company slug - redirect to auth */}
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/projects/onboarding" element={<ProjectsOnboarding />} />
              <Route path="/pipeline" element={<Pipeline />} />
              <Route path="/team-members" element={<TeamMembers />} />
              <Route path="/team-members/:id" element={<TeamMemberDetail />} />
              <Route path="/team-workload" element={<TeamWorkload />} />
              <Route path="/office-settings" element={<OfficeSettings />} />
              <Route path="/weekly-overview" element={<WeeklyOverview />} />
              <Route path="/weekly-rundown" element={<WeeklyRundown />} />
              <Route path="/resource-scheduling" element={<ResourceScheduling />} />
              <Route path="/timeline" element={<Timeline />} />
              <Route path="/capacity-planning" element={<CapacityPlanning />} />
              {/* Legacy routes - redirect to unified scheduling */}
              <Route path="/team-workload" element={<ResourceScheduling />} />
              <Route path="/project-resourcing" element={<ResourceScheduling />} />
              <Route path="/team-annual-leave" element={<TeamAnnualLeave />} />
              <Route path="/financial-control" element={<FinancialControl />} />
              <Route path="/help-center" element={<HelpCenter />} />
              <Route path="/workflow" element={<WorkflowPage />} />
              <Route path="/financial-overview" element={<FinancialOverview />} />
              <Route path="/project-profit-dashboard" element={<ProjectProfitDashboard />} />
              <Route path="/project-billing" element={<ProjectBilling />} />
              <Route path="/aging-invoices" element={<AgingInvoices />} />
              
              {/* Company landing page with smart redirect */}
              <Route path="/:companySlug" element={<CompanyLanding />} />
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </CompanyProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
