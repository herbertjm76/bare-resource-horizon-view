
import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Building, MapPin } from 'lucide-react';

interface ProjectLocationInfoProps {
  country: string;
  office: string;
  countries: string[];
  offices: Array<{ id: string; city: string; country: string; code?: string; emoji?: string }>;
  onCountryChange: (value: string) => void;
  onOfficeChange: (value: string) => void;
}

export const ProjectLocationInfo: React.FC<ProjectLocationInfoProps> = ({
  country,
  office,
  countries,
  offices,
  onCountryChange,
  onOfficeChange,
}) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <Label htmlFor="country" className="flex items-center gap-1">
          <MapPin className="w-4 h-4" />Country
        </Label>
        <Select value={country || "no_country"} onValueChange={(value) => onCountryChange(value === "no_country" ? "" : value)} required>
          <SelectTrigger>
            <SelectValue placeholder="Select a country" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="no_country">Select a country</SelectItem>
            {countries
              .filter((c) => c && c.trim() !== "")
              .map((country) => (
                <SelectItem key={country} value={country}>{country}</SelectItem>
              ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="office" className="flex items-center gap-1">
          <Building className="w-4 h-4" />Office
        </Label>
        <Select value={office || "no_office"} onValueChange={(value) => onOfficeChange(value === "no_office" ? "" : value)} required>
          <SelectTrigger>
            <SelectValue placeholder="Select an office" />
          </SelectTrigger>
          <SelectContent className="bg-white">
            {offices.length > 0 ? (
              <>
                <SelectItem value="no_office">Select an office</SelectItem>
                {offices
                  .filter((office) => office.id && office.id.trim() !== "")
                  .map((office) => (
                    <SelectItem key={office.id} value={office.id}>
                      {office.emoji ? `${office.emoji} ` : ''}{office.city}, {office.country}
                    </SelectItem>
                  ))}
              </>
            ) : (
              <SelectItem value="no_office_available" disabled>No offices available</SelectItem>
            )}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
