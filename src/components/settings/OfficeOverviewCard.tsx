
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { MapPin, Building2, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCompany } from '@/context/CompanyContext';

export const OfficeOverviewCard = () => {
  const { company } = useCompany();
  const [mapboxToken, setMapboxToken] = useState('');

  // Mock coordinates for demonstration - in a real app, these would come from the company data
  const officeCoordinates = {
    lng: -74.006, // New York City coordinates as example
    lat: 40.7128
  };

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Handle logo upload logic here
      console.log('Logo uploaded:', file.name);
    }
  };

  return (
    <Card className="p-6">
      <div className="grid gap-6 md:grid-cols-2">
        {/* Logo and Name Section */}
        <div className="space-y-4">
          {/* Logo Display and Upload */}
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50 relative group">
              {company?.logo_url ? (
                <img 
                  src={company.logo_url} 
                  alt="Office Logo" 
                  className="w-full h-full object-contain rounded-lg"
                />
              ) : (
                <Building2 className="h-8 w-8 text-gray-400" />
              )}
              
              {/* Upload overlay */}
              <div className="absolute inset-0 bg-black/50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Upload className="h-4 w-4 text-white" />
              </div>
              
              <input
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
            </div>
            
            <div>
              <h2 className="text-2xl font-semibold text-foreground">
                {company?.name || 'Your Company Name'}
              </h2>
              <p className="text-sm text-muted-foreground">
                {company?.address ? `${company.address}` : 'Address not set'}
              </p>
              {company?.city && company?.country && (
                <p className="text-xs text-muted-foreground">
                  {company.city}, {company.country}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Map Section */}
        <div className="space-y-3">
          {/* Mini Map */}
          <div className="relative">
            <div className="h-48 bg-gray-100 rounded-lg border flex items-center justify-center">
              {mapboxToken ? (
                <div className="text-center">
                  <MapPin className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Interactive map would render here</p>
                  <p className="text-xs text-gray-500">with Mapbox integration</p>
                </div>
              ) : (
                <div className="text-center space-y-2">
                  <MapPin className="h-8 w-8 text-gray-400 mx-auto" />
                  <p className="text-sm text-gray-600">Add Mapbox token to view map</p>
                  <div className="max-w-48">
                    <Input
                      placeholder="Enter Mapbox public token"
                      value={mapboxToken}
                      onChange={(e) => setMapboxToken(e.target.value)}
                      className="text-xs"
                    />
                  </div>
                  <p className="text-xs text-gray-500">
                    Get your token from{' '}
                    <a 
                      href="https://mapbox.com/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      mapbox.com
                    </a>
                  </p>
                </div>
              )}
            </div>
            
            {/* Location Pin Overlay */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="relative">
                <MapPin className="h-6 w-6 text-red-500 drop-shadow-lg" />
                <div className="absolute -top-1 -left-1 w-8 h-8 bg-red-500/20 rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};
