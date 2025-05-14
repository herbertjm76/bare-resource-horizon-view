
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { CompanyProvider } from './context/CompanyContext';
import { Toaster } from 'sonner';
import Index from './pages/Index';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';
import TeamMembers from './pages/TeamMembers';
import TeamWorkload from './pages/TeamWorkload';
import TeamAnnualLeave from './pages/TeamAnnualLeave';
import ProjectResourcing from './pages/ProjectResourcing';
import WeeklyOverview from './pages/WeeklyOverview';
import OfficeSettings from './pages/OfficeSettings';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';
import Join from './pages/Join';
import Help from './pages/Help';
import './App.css';

// Create a QueryClient instance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

function App() {
  return (
    <Router>
      <QueryClientProvider client={queryClient}>
        <CompanyProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/team" element={<TeamMembers />} />
            <Route path="/team/workload" element={<TeamWorkload />} />
            <Route path="/team/annual-leave" element={<TeamAnnualLeave />} />
            <Route path="/resources" element={<ProjectResourcing />} />
            <Route path="/weekly-overview" element={<WeeklyOverview />} />
            <Route path="/office-settings" element={<OfficeSettings />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/join/:token" element={<Join />} />
            <Route path="/help" element={<Help />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          
          {/* Add the Sonner Toaster component */}
          <Toaster />
        </CompanyProvider>
      </QueryClientProvider>
    </Router>
  );
}

export default App;
