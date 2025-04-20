
import React from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Flag, Layers, MapPin, Briefcase, Currency, Calendar } from 'lucide-react';
import { CountriesTab } from '@/components/settings/CountriesTab';
import { StagesTab } from '@/components/settings/StagesTab';
import { LocationsTab } from '@/components/settings/LocationsTab';
import { RolesTab } from '@/components/settings/RolesTab';
import { RatesTab } from '@/components/settings/RatesTab';
import { HolidaysTab } from '@/components/settings/HolidaysTab';

const OfficeSettings = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <DashboardSidebar />
        <div className="flex-1 p-8 bg-background">
          <div className="max-w-6xl mx-auto space-y-8">
            <div className="flex justify-between items-center">
              <h1 className="text-4xl font-bold">Office Settings</h1>
            </div>
            
            <Tabs defaultValue="countries" className="w-full">
              <TabsList className="grid grid-cols-6 w-full">
                <TabsTrigger value="countries" className="flex items-center gap-2">
                  <Flag className="h-4 w-4" />
                  <span>Countries</span>
                </TabsTrigger>
                <TabsTrigger value="stages" className="flex items-center gap-2">
                  <Layers className="h-4 w-4" />
                  <span>Stages</span>
                </TabsTrigger>
                <TabsTrigger value="locations" className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span>Locations</span>
                </TabsTrigger>
                <TabsTrigger value="roles" className="flex items-center gap-2">
                  <Briefcase className="h-4 w-4" />
                  <span>Roles</span>
                </TabsTrigger>
                <TabsTrigger value="rates" className="flex items-center gap-2">
                  <Currency className="h-4 w-4" />
                  <span>Rates</span>
                </TabsTrigger>
                <TabsTrigger value="holidays" className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>Holidays</span>
                </TabsTrigger>
              </TabsList>
              <TabsContent value="countries" className="mt-6">
                <CountriesTab />
              </TabsContent>
              <TabsContent value="stages" className="mt-6">
                <StagesTab />
              </TabsContent>
              <TabsContent value="locations" className="mt-6">
                <LocationsTab />
              </TabsContent>
              <TabsContent value="roles" className="mt-6">
                <RolesTab />
              </TabsContent>
              <TabsContent value="rates" className="mt-6">
                <RatesTab />
              </TabsContent>
              <TabsContent value="holidays" className="mt-6">
                <HolidaysTab />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default OfficeSettings;
