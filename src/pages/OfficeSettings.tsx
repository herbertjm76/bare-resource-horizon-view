
import React, { useEffect, useState } from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Folder, Layers, MapPin, Briefcase, Currency, Calendar, AlertCircle, RefreshCw, Loader2, Building } from 'lucide-react';
import { CountriesTab } from '@/components/settings/CountriesTab';
import { StagesTab } from '@/components/settings/StagesTab';
import { LocationsTab } from '@/components/settings/LocationsTab';
import { RolesTab } from '@/components/settings/RolesTab';
import { RatesTab } from '@/components/settings/RatesTab';
import { HolidaysTab } from '@/components/settings/HolidaysTab';
import { DepartmentsTab } from '@/components/settings/DepartmentsTab';
import { OfficeSettingsProvider } from '@/context/officeSettings';
import { useNavigate } from 'react-router-dom';
import { useCompany } from '@/context/CompanyContext';
import { AppHeader } from '@/components/AppHeader';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuthorization } from '@/hooks/useAuthorization';
import { ModernDashboardHeader } from '@/components/dashboard/ModernDashboardHeader';

const tabBarClass =
  "w-full mb-6 overflow-x-auto scrollbar-hide sm:grid sm:grid-cols-7 gap-2 flex-nowrap rounded-none bg-transparent p-0";

const HEADER_HEIGHT = 56;

const OfficeSettings = () => {
  const { company, loading: companyLoading, refreshCompany, error: companyError } = useCompany();
  const navigate = useNavigate();
  const { loading: authLoading, error: authError, isAuthorized } = useAuthorization({
    requiredRole: ['owner', 'admin'], 
    redirectTo: '/dashboard'
  });
  
  const isLoading = authLoading || companyLoading;
  const error = authError || companyError;
  
  const handleRefresh = () => {
    console.log('Manually refreshing company data from OfficeSettings');
    refreshCompany();
  };

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

  if (!isLoading && (!isAuthorized || !company)) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-background">
        <div className="p-6 rounded-lg border border-red-500/30 bg-red-500/10 max-w-lg">
          <div className="flex items-start gap-4">
            <AlertCircle className="h-6 w-6 text-red-500 flex-shrink-0 mt-1" />
            <div className="space-y-3">
              <h3 className="text-lg font-medium text-foreground">
                {!isAuthorized ? "Access Denied" : "No Company Data Found"}
              </h3>
              <p className="text-muted-foreground">
                {!isAuthorized 
                  ? "You don't have permission to access this page. Only owners and admins can manage office settings."
                  : "Unable to load company data. This could be because your account isn't associated with a company."}
              </p>
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
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="w-full min-h-screen flex flex-row">
        <div className="flex-shrink-0">
          <DashboardSidebar />
        </div>
        <div className="flex-1 flex flex-col">
          <AppHeader />
          <div style={{ height: HEADER_HEIGHT }} />
          <div className="flex-1 p-4 sm:p-8 bg-gradient-to-br from-white via-gray-50/30 to-gray-100/20">
            <div className="max-w-6xl mx-auto space-y-8">
              <div className="flex justify-between items-start">
                <ModernDashboardHeader />
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleRefresh}
                  className="gap-2 h-9 mt-2"
                >
                  <RefreshCw className="h-4 w-4" /> 
                  Refresh Data
                </Button>
              </div>
              
              <OfficeSettingsProvider>
                <Tabs defaultValue="areas" className="w-full">
                  <TabsList className={tabBarClass + " flex sm:grid"}>
                    <TabsTrigger value="areas" className="flex items-center gap-2 min-w-max px-4 h-10">
                      <Folder className="h-4 w-4" />
                      <span className="hidden xs:inline">Project Areas</span>
                    </TabsTrigger>
                    <TabsTrigger value="stages" className="flex items-center gap-2 min-w-max px-4 h-10">
                      <Layers className="h-4 w-4" />
                      <span className="hidden xs:inline">Stages</span>
                    </TabsTrigger>
                    <TabsTrigger value="locations" className="flex items-center gap-2 min-w-max px-4 h-10">
                      <MapPin className="h-4 w-4" />
                      <span className="hidden xs:inline">Locations</span>
                    </TabsTrigger>
                    <TabsTrigger value="departments" className="flex items-center gap-2 min-w-max px-4 h-10">
                      <Building className="h-4 w-4" />
                      <span className="hidden xs:inline">Departments</span>
                    </TabsTrigger>
                    <TabsTrigger value="roles" className="flex items-center gap-2 min-w-max px-4 h-10">
                      <Briefcase className="h-4 w-4" />
                      <span className="hidden xs:inline">Roles</span>
                    </TabsTrigger>
                    <TabsTrigger value="rates" className="flex items-center gap-2 min-w-max px-4 h-10">
                      <Currency className="h-4 w-4" />
                      <span className="hidden xs:inline">Rates</span>
                    </TabsTrigger>
                    <TabsTrigger value="holidays" className="flex items-center gap-2 min-w-max px-4 h-10">
                      <Calendar className="h-4 w-4" />
                      <span className="hidden xs:inline">Holidays</span>
                    </TabsTrigger>
                  </TabsList>
                  <div className="mt-6">
                    <TabsContent value="areas">
                      <CountriesTab />
                    </TabsContent>
                    <TabsContent value="stages">
                      <StagesTab />
                    </TabsContent>
                    <TabsContent value="locations">
                      <LocationsTab />
                    </TabsContent>
                    <TabsContent value="departments">
                      <DepartmentsTab />
                    </TabsContent>
                    <TabsContent value="roles">
                      <RolesTab />
                    </TabsContent>
                    <TabsContent value="rates">
                      <RatesTab />
                    </TabsContent>
                    <TabsContent value="holidays">
                      <HolidaysTab />
                    </TabsContent>
                  </div>
                </Tabs>
              </OfficeSettingsProvider>
            </div>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default OfficeSettings;
