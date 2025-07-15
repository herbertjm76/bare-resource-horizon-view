
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

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <BrowserRouter>
          <Routes>
            {/* Public routes without CompanyProvider */}
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/join" element={<Join />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/solutions" element={<SolutionsPage />} />
            <Route path="/app-tour" element={<AppTourPage />} />
            <Route path="/documentation" element={<Documentation />} />
            <Route path="/help" element={<Help />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/contact-support" element={<ContactSupport />} />
            
            {/* Protected routes with CompanyProvider */}
            <Route path="/dashboard" element={
              <CompanyProvider>
                <Dashboard />
              </CompanyProvider>
            } />
            <Route path="/profile" element={
              <CompanyProvider>
                <Profile />
              </CompanyProvider>
            } />
            <Route path="/projects" element={
              <CompanyProvider>
                <Projects />
              </CompanyProvider>
            } />
            <Route path="/team-members" element={
              <CompanyProvider>
                <TeamMembers />
              </CompanyProvider>
            } />
            <Route path="/team-members/:id" element={
              <CompanyProvider>
                <TeamMemberDetail />
              </CompanyProvider>
            } />
            <Route path="/office-settings" element={
              <CompanyProvider>
                <OfficeSettings />
              </CompanyProvider>
            } />
            <Route path="/weekly-overview" element={
              <CompanyProvider>
                <WeeklyOverview />
              </CompanyProvider>
            } />
            <Route path="/team-workload" element={
              <CompanyProvider>
                <TeamWorkload />
              </CompanyProvider>
            } />
            <Route path="/team-annual-leave" element={
              <CompanyProvider>
                <TeamAnnualLeave />
              </CompanyProvider>
            } />
            <Route path="/project-resourcing" element={
              <CompanyProvider>
                <ProjectResourcing />
              </CompanyProvider>
            } />
            <Route path="/financial-overview" element={
              <CompanyProvider>
                <FinancialOverview />
              </CompanyProvider>
            } />
            <Route path="/project-profit-dashboard" element={
              <CompanyProvider>
                <ProjectProfitDashboard />
              </CompanyProvider>
            } />
            <Route path="/project-billing" element={
              <CompanyProvider>
                <ProjectBilling />
              </CompanyProvider>
            } />
            <Route path="/aging-invoices" element={
              <CompanyProvider>
                <AgingInvoices />
              </CompanyProvider>
            } />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
