
import { Routes, Route } from 'react-router-dom';
import { Toaster as ShadcnToaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";
import './index.css'
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

const App = () => {
  return (
    <>
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
      <ShadcnToaster />
      <SonnerToaster />
    </>
  );
};

export default App;
