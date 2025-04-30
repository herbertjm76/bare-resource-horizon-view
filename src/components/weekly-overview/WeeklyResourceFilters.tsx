
import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

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
  // Fetch offices from the database
  const { data: officeLocations = [] } = useQuery({
    queryKey: ['officeLocations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('office_locations')
        .select('id, code, city, country');
      
      if (error) throw error;
      return data;
    }
  });

  return (
    <div className="mb-6 border rounded-lg p-6 bg-background">
      <p className="text-sm text-muted-foreground mb-4">
        View and manage all your weekly resource allocation. Use the filters below to narrow down the list by office.
      </p>
      
      <div className="flex flex-wrap gap-4 items-end">
        <Select
          value={filters.office}
          onValueChange={(value) => onFilterChange('office', value)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="All Offices" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Offices</SelectItem>
            {officeLocations.map((office) => (
              <SelectItem key={office.id} value={office.code}>
                {office.code} - {office.city}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Input 
          className="w-[240px]" 
          placeholder="Search team members..." 
        />
      </div>
    </div>
  );
};
