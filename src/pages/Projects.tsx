import React, { useState, useEffect } from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar';
import { ProjectsList } from '@/components/projects/ProjectsList';
import { AppHeader } from '@/components/AppHeader';
import { useCompany } from '@/context/CompanyContext';
import { Button } from '@/components/ui/button';
import { AlertCircle, RefreshCw, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const HEADER_HEIGHT = 56; // Should match AppHeader minHeight

const Projects = () => {
  const { company, loading: companyLoading, refreshCompany, error: companyError } = useCompany();
  const navigate = useNavigate();
  const [authLoading, setAuthLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    let isMounted = true;
    const loadingTimeout = setTimeout(() => {
      if (isMounted && authLoading) {
        console.log("Loading timeout reached, setting authLoading to false");
        setAuthLoading(false);
      }
    }, 5000);
    
    const checkAuth = async () => {
      try {
        console.log("Projects: Checking auth directly");
        setAuthLoading(true);
        setAuthError(null);
        
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error("Projects: Session error", sessionError);
          if (isMounted) {
            setAuthError("Failed to verify your session");
            setAuthLoading(false);
          }
          return;
        }
        
        if (!session) {
          console.log("Projects: No session found, redirecting to auth");
          if (isMounted) {
            toast.error("Please sign in to continue");
            navigate('/auth');
          }
          return;
        }
        
        console.log("Projects: Session found, user is authenticated");
        if (isMounted) {
          setUser(session.user);
          setAuthLoading(false);
          setAuthError(null);
        }
      } catch (error: any) {
        console.error("Projects: Auth error:", error);
        if (isMounted) {
          setAuthError(error.message || "Authentication error");
          setAuthLoading(false);
        }
      }
    };
    
    checkAuth();
    
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Projects: Auth state changed:", event);
      if (!isMounted) return;
      
      if (event === 'SIGNED_OUT') {
        navigate('/auth');
        return;
      }
      
      if (event === 'SIGNED_IN' && session) {
        setUser(session.user);
        setAuthLoading(false);
      }
    });
    
    return () => {
      console.log("Projects: Cleanup");
      isMounted = false;
      clearTimeout(loadingTimeout);
      authListener.subscription.unsubscribe();
    };
  }, [navigate]);
  
  const isLoading = authLoading || companyLoading;
  const error = authError || companyError;

  const handleRefresh = () => {
    console.log('Manually refreshing company data from Projects');
    window.location.reload(); // Force complete page refresh
  };

  if (isLoading) {
    return (
      <SidebarProvider>
        <div className="w-full min-h-screen flex flex-row">
          <DashboardSidebar />
          <div className="flex-1 flex flex-col pl-[240px]">
            <AppHeader />
            <div className="pt-[56px]">
              <div className="flex justify-center items-center min-h-[calc(100vh-56px)] bg-background">
                <div className="flex flex-col items-center gap-2">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <p className="text-sm text-muted-foreground">Loading projects...</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </SidebarProvider>
    );
  }

  return (
    <SidebarProvider>
      <div className="w-full min-h-screen flex flex-row">
        <DashboardSidebar />
        <div className="flex-1 flex flex-col pl-[240px]">
          <AppHeader />
          <div className="pt-[56px]">
            <div className="flex-1 p-8 bg-background">
              <div className="max-w-6xl mx-auto space-y-8">
                <div className="flex justify-between items-center">
                  <h1 className="text-4xl font-bold text-[#6E59A5]">All Projects</h1>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => refreshCompany()}
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
                            onClick={() => refreshCompany()}
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
      </div>
    </SidebarProvider>
  );
};

export default Projects;
