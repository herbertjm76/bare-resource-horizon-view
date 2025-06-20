
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Folder, Layers, MapPin, Briefcase, Currency, Calendar, Building } from 'lucide-react';
import { CountriesTab } from '@/components/settings/CountriesTab';
import { StagesTab } from '@/components/settings/StagesTab';
import { LocationsTab } from '@/components/settings/LocationsTab';
import { RolesTab } from '@/components/settings/roles/RolesTab';
import { RatesTab } from '@/components/settings/RatesTab';
import { HolidaysTab } from '@/components/settings/HolidaysTab';
import { DepartmentsTab } from '@/components/settings/DepartmentsTab';

const tabBarClass =
  "w-full mb-6 overflow-x-auto scrollbar-hide flex gap-1 rounded-none bg-transparent p-1";

export const OfficeSettingsTabs: React.FC = () => {
  return (
    <Tabs defaultValue="locations" className="w-full">
      <TabsList className={tabBarClass}>
        <TabsTrigger value="locations" className="flex items-center gap-2 min-w-max px-3 py-2 h-auto whitespace-nowrap">
          <MapPin className="h-4 w-4 flex-shrink-0" />
          <span className="text-xs sm:text-sm">
            <span className="sm:hidden">Locations</span>
            <span className="hidden sm:inline">Office Locations</span>
          </span>
        </TabsTrigger>
        <TabsTrigger value="areas" className="flex items-center gap-2 min-w-max px-3 py-2 h-auto whitespace-nowrap">
          <Folder className="h-4 w-4 flex-shrink-0" />
          <span className="text-xs sm:text-sm">
            <span className="sm:hidden">Areas</span>
            <span className="hidden sm:inline">Project Areas</span>
          </span>
        </TabsTrigger>
        <TabsTrigger value="stages" className="flex items-center gap-2 min-w-max px-3 py-2 h-auto whitespace-nowrap">
          <Layers className="h-4 w-4 flex-shrink-0" />
          <span className="text-xs sm:text-sm">
            <span className="sm:hidden">Stages</span>
            <span className="hidden sm:inline">Stages</span>
          </span>
        </TabsTrigger>
        <TabsTrigger value="departments" className="flex items-center gap-2 min-w-max px-3 py-2 h-auto whitespace-nowrap">
          <Building className="h-4 w-4 flex-shrink-0" />
          <span className="text-xs sm:text-sm">
            <span className="sm:hidden">Depts</span>
            <span className="hidden sm:inline">Departments</span>
          </span>
        </TabsTrigger>
        <TabsTrigger value="roles" className="flex items-center gap-2 min-w-max px-3 py-2 h-auto whitespace-nowrap">
          <Briefcase className="h-4 w-4 flex-shrink-0" />
          <span className="text-xs sm:text-sm">
            <span className="sm:hidden">Roles</span>
            <span className="hidden sm:inline">Roles</span>
          </span>
        </TabsTrigger>
        <TabsTrigger value="rates" className="flex items-center gap-2 min-w-max px-3 py-2 h-auto whitespace-nowrap">
          <Currency className="h-4 w-4 flex-shrink-0" />
          <span className="text-xs sm:text-sm">
            <span className="sm:hidden">Rates</span>
            <span className="hidden sm:inline">Rates</span>
          </span>
        </TabsTrigger>
        <TabsTrigger value="holidays" className="flex items-center gap-2 min-w-max px-3 py-2 h-auto whitespace-nowrap">
          <Calendar className="h-4 w-4 flex-shrink-0" />
          <span className="text-xs sm:text-sm">
            <span className="sm:hidden">Holidays</span>
            <span className="hidden sm:inline">Holidays</span>
          </span>
        </TabsTrigger>
      </TabsList>
      <div className="mt-6">
        <TabsContent value="locations">
          <LocationsTab />
        </TabsContent>
        <TabsContent value="areas">
          <CountriesTab />
        </TabsContent>
        <TabsContent value="stages">
          <StagesTab />
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
  );
};
