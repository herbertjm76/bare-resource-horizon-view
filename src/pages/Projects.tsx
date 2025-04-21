
import React from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar';
import { ProjectsList } from '@/components/projects/ProjectsList';
import { AppHeader } from '@/components/AppHeader';
import { useCompany } from '@/context/CompanyContext';
import { Button } from '@/components/ui/button';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AuthGuard from '@/components/AuthGuard';

const HEADER_HEIGHT = 56; // Should match AppHeader minHeight

const Projects = () => {
  const { company, loading: companyLoading, refreshCompany } = useCompany();
  const navigate = useNavigate();

  // Remove redirection effect that was causing loading issues

  return (
    <AuthGuard>
      <SidebarProvider>
        <div className="w-full min-h-screen flex flex-row">
          {/* Sidebar in first column */}
          <div className="flex-shrink-0">
            <DashboardSidebar />
          </div>
          {/* Main content in second column */}
          <div className="flex-1 flex flex-col">
            {/* Header only in main column */}
            <AppHeader />
            {/* Spacer for header height */}
            <div style={{ height: HEADER_HEIGHT }} />
            <div className="flex-1 p-8 bg-background">
              <div className="max-w-6xl mx-auto space-y-8">
                <div className="flex justify-between items-center">
                  <h1 className="text-4xl font-bold" style={{ color: '#8E9196' }}>All Projects</h1>
                  
                  {!companyLoading && !company && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={refreshCompany}
                      className="gap-2"
                    >
                      <RefreshCw className="h-4 w-4" /> 
                      Refresh
                    </Button>
                  )}
                </div>

                {!companyLoading && !company ? (
                  <div className="p-6 rounded-lg border border-red-500/30 bg-red-500/10">
                    <div className="flex items-start gap-4">
                      <AlertCircle className="h-6 w-6 text-red-500 flex-shrink-0 mt-1" />
                      <div className="space-y-3">
                        <h3 className="text-lg font-medium text-white">No company context found</h3>
                        <p className="text-white/80">
                          This could be happening because:
                        </p>
                        <ul className="list-disc pl-5 text-white/80 space-y-1">
                          <li>You're not logged in</li>
                          <li>Your account isn't associated with a company</li>
                          <li>There was an issue retrieving your company data</li>
                        </ul>
                        <div className="flex gap-3 pt-2">
                          <Button onClick={() => navigate('/auth')}>
                            Go to Login
                          </Button>
                          <Button 
                            variant="outline" 
                            onClick={refreshCompany}
                            className="gap-2"
                          >
                            <RefreshCw className="h-4 w-4" /> 
                            Refresh Data
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <ProjectsList />
                )}
              </div>
            </div>
          </div>
        </div>
      </SidebarProvider>
    </AuthGuard>
  );
};

export default Projects;
