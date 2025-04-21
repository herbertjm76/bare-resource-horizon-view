
import React from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Folder, Layers, MapPin, Briefcase, Currency, Calendar } from 'lucide-react';
import { CountriesTab } from '@/components/settings/CountriesTab';
import { StagesTab } from '@/components/settings/StagesTab';
import { LocationsTab } from '@/components/settings/LocationsTab';
import { RolesTab } from '@/components/settings/RolesTab';
import { RatesTab } from '@/components/settings/RatesTab';
import { HolidaysTab } from '@/components/settings/HolidaysTab';
import { OfficeSettingsProvider } from '@/context/OfficeSettingsContext';
import { AuthGuard } from '@/components/AuthGuard';

// Responsive styling: tab bar will scroll horizontally on small screens.
const tabBarClass =
  "w-full mb-4 overflow-x-auto scrollbar-hide sm:grid sm:grid-cols-6 gap-1 flex-nowrap rounded-none bg-transparent p-0";

const OfficeSettings = () => {
  return (
    <AuthGuard requiredRole={['owner', 'admin']}>
      <SidebarProvider>
        <div className="min-h-screen flex w-full">
          <DashboardSidebar />
          <div className="flex-1 p-2 sm:p-8 bg-background">
            <div className="max-w-6xl mx-auto space-y-8">
              <div className="flex justify-between items-center px-2 sm:px-0">
                <h1 className="text-4xl font-bold">Office Settings</h1>
              </div>
              <div className="rounded-md bg-slate-50 dark:bg-slate-900 p-4 border border-muted">
                <h2 className="font-semibold mb-1">Personalize your office settings</h2>
                <p className="text-muted-foreground text-sm">
                  Every office is unique. Please set your office settings to match your working environment.
                  Configure your locations, countries, roles, rates, stages, and holidays according to your organization's requirements.
                  This will help personalize your resource management and planning experience.
                </p>
              </div>
              <OfficeSettingsProvider>
                <Tabs defaultValue="areas" className="w-full">
                  {/* Responsive tab list */}
                  <TabsList className={tabBarClass + " flex sm:grid"}>
                    <TabsTrigger value="areas" className="flex items-center gap-2 min-w-max">
                      <Folder className="h-4 w-4" />
                      <span className="hidden xs:inline">Project Areas</span>
                    </TabsTrigger>
                    <TabsTrigger value="stages" className="flex items-center gap-2 min-w-max">
                      <Layers className="h-4 w-4" />
                      <span className="hidden xs:inline">Stages</span>
                    </TabsTrigger>
                    <TabsTrigger value="locations" className="flex items-center gap-2 min-w-max">
                      <MapPin className="h-4 w-4" />
                      <span className="hidden xs:inline">Locations</span>
                    </TabsTrigger>
                    <TabsTrigger value="roles" className="flex items-center gap-2 min-w-max">
                      <Briefcase className="h-4 w-4" />
                      <span className="hidden xs:inline">Roles</span>
                    </TabsTrigger>
                    <TabsTrigger value="rates" className="flex items-center gap-2 min-w-max">
                      <Currency className="h-4 w-4" />
                      <span className="hidden xs:inline">Rates</span>
                    </TabsTrigger>
                    <TabsTrigger value="holidays" className="flex items-center gap-2 min-w-max">
                      <Calendar className="h-4 w-4" />
                      <span className="hidden xs:inline">Holidays</span>
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="areas" className="mt-4">
                    <CountriesTab />
                  </TabsContent>
                  <TabsContent value="stages" className="mt-4">
                    <StagesTab />
                  </TabsContent>
                  <TabsContent value="locations" className="mt-4">
                    <LocationsTab />
                  </TabsContent>
                  <TabsContent value="roles" className="mt-4">
                    <RolesTab />
                  </TabsContent>
                  <TabsContent value="rates" className="mt-4">
                    <RatesTab />
                  </TabsContent>
                  <TabsContent value="holidays" className="mt-4">
                    <HolidaysTab />
                  </TabsContent>
                </Tabs>
              </OfficeSettingsProvider>
            </div>
          </div>
        </div>
      </SidebarProvider>
    </AuthGuard>
  );
};

export default OfficeSettings;
