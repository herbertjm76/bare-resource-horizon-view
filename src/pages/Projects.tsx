
import React, { useEffect } from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar';
import { ProjectsList } from '@/components/projects/ProjectsList';
import { AppHeader } from '@/components/AppHeader';
import { useCompany } from '@/context/CompanyContext';
import { Button } from '@/components/ui/button';
import { AlertCircle, RefreshCw, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AuthGuard from '@/components/AuthGuard';

const HEADER_HEIGHT = 56; // Should match AppHeader minHeight

const Projects = () => {
  const { company, loading: companyLoading, refreshCompany } = useCompany();
  const navigate = useNavigate();

  useEffect(() => {
    console.log('Projects page mounted', { 
      hasCompany: !!company, 
      companyLoading 
    });
    
    if (!companyLoading && !company) {
      console.log('No company found, refreshing company data');
      refreshCompany();
    }
  }, [company, companyLoading, refreshCompany]);

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
                      onClick={() => {
                        console.log('Manually refreshing company data');
                        refreshCompany();
                      }}
                      className="gap-2"
                    >
                      <RefreshCw className="h-4 w-4" /> 
                      Refresh
                    </Button>
                  )}
                </div>

                {companyLoading ? (
                  <div className="flex justify-center items-center h-64">
                    <div className="flex flex-col items-center gap-2">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                      <p className="text-sm text-muted-foreground">Loading company data...</p>
                    </div>
                  </div>
                ) : company ? (
                  <ProjectsList />
                ) : (
                  <div className="p-6 rounded-lg border border-red-500/30 bg-red-500/10">
                    <div className="flex items-start gap-4">
                      <AlertCircle className="h-6 w-6 text-red-500 flex-shrink-0 mt-1" />
                      <div className="space-y-3">
                        <h3 className="text-lg font-medium text-foreground">No company context found</h3>
                        <p className="text-muted-foreground">
                          This could be happening because:
                        </p>
                        <ul className="list-disc pl-5 text-muted-foreground space-y-1">
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
                            onClick={() => {
                              console.log('Manually refreshing company data');
                              refreshCompany();
                            }}
                            className="gap-2"
                          >
                            <RefreshCw className="h-4 w-4" /> 
                            Refresh Data
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
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
