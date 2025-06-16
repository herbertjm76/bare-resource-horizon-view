
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
    <div>
      <Select 
        value={filters.office}
        onValueChange={value => onFilterChange('office', value)}
        disabled={isLoading}
      >
        <SelectTrigger className="w-full text-sm">
          <span className="text-xs mr-2 text-muted-foreground">Office:</span>
          <SelectValue placeholder="All Offices" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Offices</SelectItem>
          {officeLocations
            .filter(office => office.code && office.code.trim() !== "")
            .map(office => (
              <SelectItem key={office.id} value={office.code}>
                {office.code} - {office.city}, {office.country}
              </SelectItem>
            ))}
        </SelectContent>
      </Select>
    </div>
  );
};
