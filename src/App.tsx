import { lazy, Suspense } from 'react';
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { CompanyProvider } from "./context/CompanyContext";
import { DemoDataProvider } from "./context/DemoDataContext";
import { ViewAsProvider } from "./hooks/usePermissions";
import { useTheme } from "./hooks/useTheme";
import { PermissionGuard } from "./components/auth/PermissionGuard";
import { ErrorBoundary } from "./components/ui/ErrorBoundary";
import { PageLoader } from "./components/ui/PageLoader";

// Eager load - Critical path pages
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";

// Lazy load - App pages (code-split by route)
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Profile = lazy(() => import("./pages/Profile"));
const Projects = lazy(() => import("./pages/Projects"));
const ProjectsOnboarding = lazy(() => import("./pages/ProjectsOnboarding"));
const TeamMembers = lazy(() => import("./pages/TeamMembers"));
const TeamMemberDetail = lazy(() => import("./pages/TeamMemberDetail"));
const OfficeSettings = lazy(() => import("./pages/OfficeSettings"));
const WeeklyOverview = lazy(() => import("./pages/WeeklyOverview"));
const CapacityHeatmap = lazy(() => import("./pages/CapacityHeatmap"));
const TeamLeave = lazy(() => import("./pages/TeamLeave"));
const ResourceScheduling = lazy(() => import("./pages/ResourceScheduling"));
const Timeline = lazy(() => import("./pages/Timeline"));
const CapacityPlanning = lazy(() => import("./pages/CapacityPlanning"));
const ResourcePlanning = lazy(() => import("./pages/ResourcePlanning"));
const WeeklyRundown = lazy(() => import("./pages/WeeklyRundown"));
const CompanyLanding = lazy(() => import("./pages/CompanyLanding"));

// Lazy load - Financial pages
const FinancialOverview = lazy(() => import("./pages/FinancialOverview"));
const ProjectProfitDashboard = lazy(() => import("./pages/ProjectProfitDashboard"));
const ProjectBilling = lazy(() => import("./pages/ProjectBilling"));
const AgingInvoices = lazy(() => import("./pages/AgingInvoices"));
const FinancialControl = lazy(() => import("./pages/FinancialControl"));
const WorkflowPage = lazy(() => import("./pages/WorkflowPage").then(m => ({ default: m.WorkflowPage })));

// Lazy load - Marketing/Static pages
const Help = lazy(() => import("./pages/Help"));
const FAQ = lazy(() => import("./pages/FAQ"));
const Documentation = lazy(() => import("./pages/Documentation"));
const ContactSupport = lazy(() => import("./pages/ContactSupport"));
const HelpCenter = lazy(() => import("./pages/HelpCenter"));
const SolutionsPage = lazy(() => import("./pages/Solutions"));
const AppTourPage = lazy(() => import("./pages/AppTour"));
const PricingPage = lazy(() => import("./pages/Pricing"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const Join = lazy(() => import("./pages/Join"));
const Screenshots = lazy(() => import("./pages/Screenshots"));

const queryClient = new QueryClient();

// Wrapper component to ensure theme hook has access to CompanyProvider
function AppWithTheme() {
  useTheme(); // Load theme from company or localStorage
  
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* Public marketing routes */}
        <Route path="/" element={<Index />} />
        <Route path="/solutions" element={<SolutionsPage />} />
        <Route path="/app-tour" element={<AppTourPage />} />
        <Route path="/screenshots" element={<Screenshots />} />
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
        
        {/* Protected: Projects (requires view:projects) */}
        <Route path="/:companySlug/projects" element={
          <PermissionGuard requiredPermission="view:projects">
            <Projects />
          </PermissionGuard>
        } />
        <Route path="/:companySlug/projects/onboarding" element={
          <PermissionGuard requiredPermission="view:projects">
            <ProjectsOnboarding />
          </PermissionGuard>
        } />
        {/* Redirect old pipeline route to resource-planning */}
        <Route path="/:companySlug/pipeline" element={<Navigate to="../resource-planning" replace />} />
        <Route path="/:companySlug/resource-planning" element={
          <PermissionGuard requiredPermission="view:projects">
            <ResourcePlanning />
          </PermissionGuard>
        } />
        
        {/* Team routes (accessible to all) */}
        <Route path="/:companySlug/team-members" element={<TeamMembers />} />
        <Route path="/:companySlug/team-members/:id" element={<TeamMemberDetail />} />
        <Route path="/:companySlug/team-workload" element={<Navigate to="capacity-heatmap" replace />} />
        <Route path="/:companySlug/capacity-heatmap" element={<CapacityHeatmap />} />
        <Route path="/:companySlug/team-leave" element={<TeamLeave />} />
        <Route path="/:companySlug/team-annual-leave" element={<Navigate to="team-leave" replace />} />
        
        {/* Protected: Settings (requires view:settings) */}
        <Route path="/:companySlug/office-settings" element={
          <PermissionGuard requiredPermission="view:settings">
            <OfficeSettings />
          </PermissionGuard>
        } />
        
        {/* Overview routes (accessible to all) */}
        <Route path="/:companySlug/weekly-overview" element={<WeeklyOverview />} />
        <Route path="/:companySlug/weekly-rundown" element={<WeeklyRundown />} />
        
        {/* Protected: Resource Scheduling (requires view:scheduling) */}
        <Route path="/:companySlug/resource-scheduling" element={
          <PermissionGuard requiredPermission="view:scheduling">
            <ResourceScheduling />
          </PermissionGuard>
        } />
        <Route path="/:companySlug/timeline" element={
          <PermissionGuard requiredPermission="view:scheduling">
            <Timeline />
          </PermissionGuard>
        } />
        <Route path="/:companySlug/capacity-planning" element={
          <PermissionGuard requiredPermission="view:scheduling">
            <CapacityPlanning />
          </PermissionGuard>
        } />
        
        {/* Legacy scheduling redirects - also protected */}
        <Route path="/:companySlug/project-resourcing" element={
          <PermissionGuard requiredPermission="view:scheduling">
            <ResourceScheduling />
          </PermissionGuard>
        } />
        
        {/* Protected: Financial routes (requires view:projects) */}
        <Route path="/:companySlug/financial-control" element={
          <PermissionGuard requiredPermission="view:projects">
            <FinancialControl />
          </PermissionGuard>
        } />
        <Route path="/:companySlug/financial-overview" element={
          <PermissionGuard requiredPermission="view:projects">
            <FinancialOverview />
          </PermissionGuard>
        } />
        <Route path="/:companySlug/project-profit-dashboard" element={
          <PermissionGuard requiredPermission="view:projects">
            <ProjectProfitDashboard />
          </PermissionGuard>
        } />
        <Route path="/:companySlug/project-billing" element={
          <PermissionGuard requiredPermission="view:projects">
            <ProjectBilling />
          </PermissionGuard>
        } />
        <Route path="/:companySlug/aging-invoices" element={
          <PermissionGuard requiredPermission="view:projects">
            <AgingInvoices />
          </PermissionGuard>
        } />
        <Route path="/:companySlug/workflow" element={
          <PermissionGuard requiredPermission="view:projects">
            <WorkflowPage />
          </PermissionGuard>
        } />
        
        {/* Help center (accessible to all with settings access) */}
        <Route path="/:companySlug/help-center" element={<HelpCenter />} />
        
        {/* Fallback for legacy routes without company slug */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
        
        {/* Protected: Projects */}
        <Route path="/projects" element={
          <PermissionGuard requiredPermission="view:projects">
            <Projects />
          </PermissionGuard>
        } />
        <Route path="/projects/onboarding" element={
          <PermissionGuard requiredPermission="view:projects">
            <ProjectsOnboarding />
          </PermissionGuard>
        } />
        <Route path="/pipeline" element={<Navigate to="/resource-planning" replace />} />
        <Route path="/resource-planning" element={
          <PermissionGuard requiredPermission="view:projects">
            <ResourcePlanning />
          </PermissionGuard>
        } />
        
        {/* Team routes */}
        <Route path="/team-members" element={<TeamMembers />} />
        <Route path="/team-members/:id" element={<TeamMemberDetail />} />
        <Route path="/team-workload" element={<Navigate to="/capacity-heatmap" replace />} />
        <Route path="/capacity-heatmap" element={<CapacityHeatmap />} />
        <Route path="/team-leave" element={<TeamLeave />} />
        <Route path="/team-annual-leave" element={<Navigate to="/team-leave" replace />} />
        
        {/* Protected: Settings */}
        <Route path="/office-settings" element={
          <PermissionGuard requiredPermission="view:settings">
            <OfficeSettings />
          </PermissionGuard>
        } />
        
        {/* Overview routes */}
        <Route path="/weekly-overview" element={<WeeklyOverview />} />
        <Route path="/weekly-rundown" element={<WeeklyRundown />} />
        
        {/* Protected: Scheduling */}
        <Route path="/resource-scheduling" element={
          <PermissionGuard requiredPermission="view:scheduling">
            <ResourceScheduling />
          </PermissionGuard>
        } />
        <Route path="/timeline" element={
          <PermissionGuard requiredPermission="view:scheduling">
            <Timeline />
          </PermissionGuard>
        } />
        <Route path="/capacity-planning" element={
          <PermissionGuard requiredPermission="view:scheduling">
            <CapacityPlanning />
          </PermissionGuard>
        } />
        <Route path="/project-resourcing" element={
          <PermissionGuard requiredPermission="view:scheduling">
            <ResourceScheduling />
          </PermissionGuard>
        } />
        
        {/* Protected: Financial */}
        <Route path="/financial-control" element={
          <PermissionGuard requiredPermission="view:projects">
            <FinancialControl />
          </PermissionGuard>
        } />
        <Route path="/financial-overview" element={
          <PermissionGuard requiredPermission="view:projects">
            <FinancialOverview />
          </PermissionGuard>
        } />
        <Route path="/project-profit-dashboard" element={
          <PermissionGuard requiredPermission="view:projects">
            <ProjectProfitDashboard />
          </PermissionGuard>
        } />
        <Route path="/project-billing" element={
          <PermissionGuard requiredPermission="view:projects">
            <ProjectBilling />
          </PermissionGuard>
        } />
        <Route path="/aging-invoices" element={
          <PermissionGuard requiredPermission="view:projects">
            <AgingInvoices />
          </PermissionGuard>
        } />
        <Route path="/workflow" element={
          <PermissionGuard requiredPermission="view:projects">
            <WorkflowPage />
          </PermissionGuard>
        } />
        
        {/* Help center */}
        <Route path="/help-center" element={<HelpCenter />} />
        
        {/* Company-scoped join route (alternate format) */}
        <Route path="/:companySlug/join/:inviteCode?" element={<Join />} />
        <Route path="/:companySlug/join" element={<Join />} />
        
        {/* Company landing page with smart redirect */}
        <Route path="/:companySlug" element={<CompanyLanding />} />
        
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <TooltipProvider>
            <Toaster />
            <CompanyProvider>
              <ViewAsProvider>
                <AppWithTheme />
              </ViewAsProvider>
            </CompanyProvider>
          </TooltipProvider>
        </BrowserRouter>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
