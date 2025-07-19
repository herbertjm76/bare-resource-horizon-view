
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { navItems } from "./nav-items";

// Import all pages
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Resources from "./pages/Resources";
import Workload from "./pages/Workload";
import WeekResource from "./pages/WeekResource";
import Projects from "./pages/Projects";
import TeamManagement from "./pages/TeamManagement";
import Settings from "./pages/Settings";
import Onboarding from "./pages/Onboarding";
import Join from "./pages/Join";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import CookiePolicy from "./pages/CookiePolicy";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import TestingGround from "./pages/TestingGround";
import ContactSupport from "./pages/ContactSupport";
import ClientFeedback from "./pages/ClientFeedback";
import TimeEntries from "./pages/TimeEntries";
import PublicHolidays from "./pages/PublicHolidays";
import LeaveManagement from "./pages/LeaveManagement";
import LeavePlanning from "./pages/LeavePlanning";
import OfficeSettings from "./pages/OfficeSettings";
import TeamMemberProfiles from "./pages/TeamMemberProfiles";
import BillingIntegration from "./pages/BillingIntegration";
import ClientManagement from "./pages/ClientManagement";
import ProjectBilling from "./pages/ProjectBilling";
import AgingInvoices from "./pages/AgingInvoices";
import SolutionsPage from "./pages/Solutions";
import AppTourPage from "./pages/AppTour";
import PricingPage from "./pages/Pricing";
import Presentation from "./pages/Presentation";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          {navItems.map(({ to, page }) => (
            <Route key={to} path={to} element={page} />
          ))}
          {/* Additional pages */}
          <Route path="/login" element={<Login />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/testing-ground" element={<TestingGround />} />
          <Route path="/contact-support" element={<ContactSupport />} />
          <Route path="/solutions" element={<SolutionsPage />} />
          <Route path="/app-tour" element={<AppTourPage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/presentation" element={<Presentation />} />
          <Route path="/join" element={<Join />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
