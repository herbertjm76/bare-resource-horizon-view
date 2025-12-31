
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CountrySelect } from "@/components/ui/CountrySelect";
import { CitySelect } from "@/components/ui/CitySelect";
import { logger } from '@/utils/logger';

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
  logger.debug('LocationForm: Current formData:', formData);

  const handleCountryChange = (countryName: string, code?: string, flag?: string) => {
    logger.debug('LocationForm: Country changed:', { countryName, code, flag });
    setFormData({
      ...formData,
      country: countryName,
      emoji: flag || '',
      city: '', // Reset city when country changes
      code: '' // Reset code when country changes for consistency
    });
  };

  const handleCityChange = (cityName: string) => {
    logger.debug('LocationForm: City changed:', cityName);
    setFormData({
      ...formData,
      city: cityName
    });
  };

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    logger.debug('LocationForm: Code changed:', e.target.value);
    setFormData({
      ...formData,
      code: e.target.value
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
          <div className="text-xs text-gray-500 mt-1">
            Current country: "{formData.country}" (length: {formData.country.length})
          </div>
        </div>
        <div>
          <label className="text-sm font-medium">City <span className="text-red-500">*</span></label>
          <CitySelect
            key={`${formData.country}-${Date.now()}`} // Force re-render when country changes
            value={formData.city}
            onChange={handleCityChange}
            country={formData.country}
            placeholder="Select or enter city"
          />
          <div className="text-xs text-gray-500 mt-1">
            Country passed to CitySelect: "{formData.country}" | City: "{formData.city}"
          </div>
        </div>
        <div>
          <label className="text-sm font-medium">Code <span className="text-red-500">*</span></label>
          <Input
            value={formData.code}
            onChange={handleCodeChange}
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
