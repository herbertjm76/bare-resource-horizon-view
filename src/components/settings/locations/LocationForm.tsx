
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CountrySelect } from "@/components/ui/CountrySelect";
import { CitySelect } from "@/components/ui/CitySelect";

interface LocationFormData {
  code: string;
  city: string;
  country: string;
  emoji: string;
}

interface LocationFormProps {
  formData: LocationFormData;
  setFormData: (data: LocationFormData) => void;
  editingLocation: any;
  onSubmit: () => Promise<boolean>;
  onCancel: () => void;
}

export const LocationForm: React.FC<LocationFormProps> = ({
  formData,
  setFormData,
  editingLocation,
  onSubmit,
  onCancel
}) => {
  const handleCountryChange = (countryName: string, code?: string, flag?: string) => {
    setFormData({
      ...formData,
      country: countryName,
      emoji: flag || '',
      city: '' // Reset city when country changes
    });
  };

  const handleCityChange = (cityName: string) => {
    setFormData({
      ...formData,
      city: cityName
    });
  };

  const handleSubmit = async () => {
    const success = await onSubmit();
    if (success) {
      onCancel();
    }
  };

  return (
    <div className="border rounded-lg p-4 space-y-4">
      <h3 className="font-medium">
        {editingLocation ? 'Edit Location' : 'Add New Location'}
      </h3>
      <div className="grid grid-cols-1 gap-4">
        <div>
          <label className="text-sm font-medium">Country <span className="text-red-500">*</span></label>
          <CountrySelect
            value={formData.country}
            onChange={handleCountryChange}
            placeholder="Select country"
          />
        </div>
        <div>
          <label className="text-sm font-medium">City <span className="text-red-500">*</span></label>
          <CitySelect
            value={formData.city}
            onChange={handleCityChange}
            country={formData.country}
            placeholder="Select or enter city"
          />
        </div>
        <div>
          <label className="text-sm font-medium">Code <span className="text-red-500">*</span></label>
          <Input
            value={formData.code}
            onChange={(e) => setFormData({...formData, code: e.target.value})}
            placeholder="e.g., NYC, LON, TKY"
          />
        </div>
      </div>
      <div className="flex gap-2">
        <Button onClick={handleSubmit}>
          {editingLocation ? 'Update' : 'Add'} Location
        </Button>
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </div>
  );
};
