
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Folder, Layers, MapPin, Briefcase, Currency, Calendar, Building, Palette } from 'lucide-react';
import { CountriesTab } from '@/components/settings/CountriesTab';
import { StagesTab } from '@/components/settings/StagesTab';
import { LocationsTab } from '@/components/settings/LocationsTab';
import { RolesTab } from '@/components/settings/roles/RolesTab';
import { RatesTab } from '@/components/settings/RatesTab';
import { HolidaysTab } from '@/components/settings/HolidaysTab';
import { DepartmentsTab } from '@/components/settings/DepartmentsTab';
import { ThemeTab } from '@/components/settings/ThemeTab';

export const OfficeSettingsTabs: React.FC = () => {
  return (
    <Tabs defaultValue="locations" className="w-full">
      <TabsList className="w-full mb-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-8 gap-2 h-auto bg-transparent p-2 rounded-lg">
        <TabsTrigger 
          value="locations" 
          className="flex items-center gap-2 px-3 py-3 h-auto whitespace-nowrap text-xs sm:text-sm font-medium"
        >
          <MapPin className="h-4 w-4 flex-shrink-0" />
          <span className="hidden xs:inline sm:hidden lg:inline">Office Locations</span>
          <span className="xs:hidden sm:inline lg:hidden">Locations</span>
        </TabsTrigger>
        
        <TabsTrigger 
          value="areas" 
          className="flex items-center gap-2 px-3 py-3 h-auto whitespace-nowrap text-xs sm:text-sm font-medium"
        >
          <Folder className="h-4 w-4 flex-shrink-0" />
          <span className="hidden xs:inline sm:hidden lg:inline">Project Areas</span>
          <span className="xs:hidden sm:inline lg:hidden">Areas</span>
        </TabsTrigger>
        
        <TabsTrigger 
          value="stages" 
          className="flex items-center gap-2 px-3 py-3 h-auto whitespace-nowrap text-xs sm:text-sm font-medium"
        >
          <Layers className="h-4 w-4 flex-shrink-0" />
          <span>Stages</span>
        </TabsTrigger>
        
        <TabsTrigger 
          value="departments" 
          className="flex items-center gap-2 px-3 py-3 h-auto whitespace-nowrap text-xs sm:text-sm font-medium"
        >
          <Building className="h-4 w-4 flex-shrink-0" />
          <span className="hidden xs:inline">Departments</span>
          <span className="xs:hidden">Depts</span>
        </TabsTrigger>
        
        <TabsTrigger 
          value="roles" 
          className="flex items-center gap-2 px-3 py-3 h-auto whitespace-nowrap text-xs sm:text-sm font-medium"
        >
          <Briefcase className="h-4 w-4 flex-shrink-0" />
          <span>Roles</span>
        </TabsTrigger>
        
        <TabsTrigger 
          value="rates" 
          className="flex items-center gap-2 px-3 py-3 h-auto whitespace-nowrap text-xs sm:text-sm font-medium"
        >
          <Currency className="h-4 w-4 flex-shrink-0" />
          <span>Rates</span>
        </TabsTrigger>
        
        <TabsTrigger 
          value="holidays" 
          className="flex items-center gap-2 px-3 py-3 h-auto whitespace-nowrap text-xs sm:text-sm font-medium"
        >
          <Calendar className="h-4 w-4 flex-shrink-0" />
          <span>Holidays</span>
        </TabsTrigger>
        
        <TabsTrigger 
          value="theme" 
          className="flex items-center gap-2 px-3 py-3 h-auto whitespace-nowrap text-xs sm:text-sm font-medium"
        >
          <Palette className="h-4 w-4 flex-shrink-0" />
          <span>Theme</span>
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
        <TabsContent value="theme">
          <ThemeTab />
        </TabsContent>
      </div>
    </Tabs>
  );
};
