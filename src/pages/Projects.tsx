
import React from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar';
import { ProjectsList } from '@/components/projects/ProjectsList';
import { AppHeader } from '@/components/AppHeader';
import { useCompany } from '@/context/CompanyContext';
import { Button } from '@/components/ui/button';
import { AlertCircle, RefreshCw, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthorization } from '@/hooks/useAuthorization';

const HEADER_HEIGHT = 56; // Should match AppHeader minHeight

const Projects = () => {
  const { company, loading: companyLoading, refreshCompany, error: companyError } = useCompany();
  const navigate = useNavigate();
  const { loading: authLoading, error: authError } = useAuthorization();
  
  const isLoading = authLoading || companyLoading;
  const error = authError || companyError;

  const handleRefresh = () => {
    console.log('Manually refreshing company data from Projects');
    refreshCompany();
  };

  // Show a loading spinner while authenticating or loading company data
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-background">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">
            {authLoading ? "Verifying access..." : "Loading company data..."}
          </p>
          {error && (
            <div className="text-sm text-red-500 mt-2 max-w-md text-center">
              {error}
              <Button 
                variant="link" 
                className="ml-2 p-0 h-auto" 
                onClick={() => window.location.reload()}
              >
                Reload page
              </Button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
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
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleRefresh}
                  className="gap-2"
                >
                  <RefreshCw className="h-4 w-4" /> 
                  Refresh
                </Button>
              </div>

              {company ? (
                <ProjectsList />
              ) : (
                <div className="p-6 rounded-lg border border-red-500/30 bg-red-500/10">
                  <div className="flex items-start gap-4">
                    <AlertCircle className="h-6 w-6 text-red-500 flex-shrink-0 mt-1" />
                    <div className="space-y-3">
                      <h3 className="text-lg font-medium text-foreground">No company data found</h3>
                      <p className="text-muted-foreground">
                        This could be happening because:
                      </p>
                      <ul className="list-disc pl-5 text-muted-foreground space-y-1">
                        <li>Your account isn't associated with a company</li>
                        <li>There was an issue retrieving your company data</li>
                      </ul>
                      <div className="flex gap-3 pt-2">
                        <Button onClick={() => navigate('/dashboard')}>
                          Go to Dashboard
                        </Button>
                        <Button 
                          variant="outline" 
                          onClick={handleRefresh}
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
  );
};

export default Projects;
