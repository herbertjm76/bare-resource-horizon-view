import React, { useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MapPin, Folder, Layers, Building, Briefcase, Currency, Calendar, Palette, Building2, Shapes } from 'lucide-react';
import { CountriesTab } from '@/components/settings/CountriesTab';
import { StagesTab } from '@/components/settings/StagesTab';
import { LocationsTab } from '@/components/settings/LocationsTab';
import { RolesTab } from '@/components/settings/roles/RolesTab';
import { RatesTab } from '@/components/settings/RatesTab';
import { HolidaysTab } from '@/components/settings/HolidaysTab';
import { DepartmentsTab } from '@/components/settings/DepartmentsTab';
import { SectorsTab } from '@/components/settings/SectorsTab';
import { ThemeTab } from '@/components/settings/ThemeTab';
import { CompanyTab } from '@/components/settings/CompanyTab';

export const OfficeSettingsTabs: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState('company');

  const tabs = [
    { value: 'company', label: 'Company', icon: Building2 },
    { value: 'locations', label: 'Office Locations', icon: MapPin },
    { value: 'areas', label: 'Project Areas', icon: Folder },
    { value: 'stages', label: 'Stages', icon: Layers },
    { value: 'sectors', label: 'Sectors', icon: Shapes },
    { value: 'departments', label: 'Departments', icon: Building },
    { value: 'roles', label: 'Roles', icon: Briefcase },
    { value: 'rates', label: 'Rates', icon: Currency },
    { value: 'holidays', label: 'Holidays', icon: Calendar },
    { value: 'theme', label: 'Theme', icon: Palette },
  ];

  return (
    <div className="w-full space-y-6">
      <Select value={selectedTab} onValueChange={setSelectedTab}>
        <SelectTrigger className="w-full sm:w-[280px]">
          <SelectValue placeholder="Select settings category" />
        </SelectTrigger>
        <SelectContent>
          {tabs.map((tab) => (
            <SelectItem key={tab.value} value={tab.value}>
              <div className="flex items-center gap-2">
                <tab.icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      <div>
        {selectedTab === 'company' && <CompanyTab />}
        {selectedTab === 'locations' && <LocationsTab />}
        {selectedTab === 'areas' && <CountriesTab />}
        {selectedTab === 'stages' && <StagesTab />}
        {selectedTab === 'sectors' && <SectorsTab />}
        {selectedTab === 'departments' && <DepartmentsTab />}
        {selectedTab === 'roles' && <RolesTab />}
        {selectedTab === 'rates' && <RatesTab />}
        {selectedTab === 'holidays' && <HolidaysTab />}
        {selectedTab === 'theme' && <ThemeTab />}
      </div>
    </div>
  );
};
