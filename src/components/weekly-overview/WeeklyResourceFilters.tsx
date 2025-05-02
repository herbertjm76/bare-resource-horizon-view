
import React from 'react';
import { useQuery } from "@tanstack/react-query";
import { useCompany } from "@/context/CompanyContext";
import { supabase } from "@/integrations/supabase/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface WeeklyResourceFiltersProps {
  filters: {
    office: string;
  };
  onFilterChange: (key: string, value: string) => void;
}

export const WeeklyResourceFilters: React.FC<WeeklyResourceFiltersProps> = ({
  filters,
  onFilterChange
}) => {
  const { company } = useCompany();
  
  // Fetch office locations for filter
  const { data: officeLocations = [], isLoading } = useQuery({
    queryKey: ['office-locations', company?.id],
    queryFn: async () => {
      if (!company?.id) return [];
      
      const { data, error } = await supabase
        .from('office_locations')
        .select('id, code, city, country')
        .eq('company_id', company.id);
      
      if (error) throw error;
      return data;
    },
    enabled: !!company?.id
  });
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      <div className="space-y-1">
        <label htmlFor="office-filter" className="text-sm font-medium text-muted-foreground">
          Office
        </label>
        <Select 
          value={filters.office}
          onValueChange={value => onFilterChange('office', value)}
          disabled={isLoading}
        >
          <SelectTrigger id="office-filter" className="w-full">
            <SelectValue placeholder="Select office" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Offices</SelectItem>
            {officeLocations.map(office => (
              <SelectItem key={office.id} value={office.code}>
                {office.code} - {office.city}, {office.country}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
