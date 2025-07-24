import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Import existing pages
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Projects from "./pages/Projects";
import ContactSupport from "./pages/ContactSupport";
import Solutions from "./pages/Solutions";
import AppTourPage from "./pages/AppTour";
import PricingPage from "./pages/Pricing";
import Presentation from "./pages/Presentation";
import Join from "./pages/Join";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/contact-support" element={<ContactSupport />} />
          <Route path="/solutions" element={<Solutions />} />
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