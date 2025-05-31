
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
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <Building2 className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h3 className="text-xl font-semibold">Office Overview</h3>
            <p className="text-sm text-muted-foreground">Manage your office information and location</p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Office Info Section */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Office Name</label>
              <div className="p-3 border rounded-lg bg-gray-50">
                <p className="font-medium">{company?.name || 'Your Company Name'}</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Office Logo</label>
              <div className="space-y-3">
                {/* Logo Display */}
                <div className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50">
                  {company?.logo_url ? (
                    <img 
                      src={company.logo_url} 
                      alt="Office Logo" 
                      className="w-full h-full object-contain rounded-lg"
                    />
                  ) : (
                    <div className="text-center">
                      <Building2 className="h-8 w-8 text-gray-400 mx-auto mb-1" />
                      <p className="text-xs text-gray-500">No logo</p>
                    </div>
                  )}
                </div>
                
                {/* Upload Button */}
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="hidden"
                    id="logo-upload"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => document.getElementById('logo-upload')?.click()}
                    className="gap-2"
                  >
                    <Upload className="h-4 w-4" />
                    Upload Logo
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Map Section */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Office Location</label>
              <div className="space-y-3">
                {/* Address Display */}
                <div className="p-3 border rounded-lg bg-gray-50">
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-gray-500 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">{company?.address || 'Address not set'}</p>
                      <p className="text-xs text-gray-500">
                        {company?.city && company?.country ? `${company.city}, ${company.country}` : 'City, Country'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Mini Map Placeholder */}
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
          </div>
        </div>
      </div>
    </Card>
  );
};
