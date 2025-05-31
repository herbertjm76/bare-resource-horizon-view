
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { MapPin, Building2, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCompany } from '@/context/CompanyContext';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default markers in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

export const OfficeOverviewCard = () => {
  const { company } = useCompany();

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
    <div className="bg-gradient-to-r from-violet-400 via-blue-400 to-pink-400 rounded-2xl p-3">
      <Card className="bg-white/20 backdrop-blur-md border border-white/30 shadow-elevation-2 transition-all duration-300 hover:bg-white/25 hover:shadow-elevation-3">
        <div className="p-4">
          <div className="grid grid-cols-4 gap-4 h-64">
            {/* Logo and Company Info Section - 1/4 width */}
            <div className="col-span-1 flex flex-col justify-center space-y-3">
              {/* Logo Display and Upload */}
              <div className="flex flex-col items-center space-y-3">
                <div className="w-20 h-20 border-2 border-dashed border-white/40 rounded-lg flex items-center justify-center bg-white/10 relative group">
                  {company?.logo_url ? (
                    <img 
                      src={company.logo_url} 
                      alt="Office Logo" 
                      className="w-full h-full object-contain rounded-lg"
                    />
                  ) : (
                    <Building2 className="h-10 w-10 text-white/60" />
                  )}
                  
                  {/* Upload overlay */}
                  <div className="absolute inset-0 bg-black/50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Upload className="h-5 w-5 text-white" />
                  </div>
                  
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                </div>
                
                <div className="text-center">
                  <h2 className="text-lg font-semibold text-white leading-tight">
                    {company?.name || 'Your Company'}
                  </h2>
                  <p className="text-xs text-white/80 mt-1">
                    {company?.address ? `${company.address}` : 'Address not set'}
                  </p>
                  {company?.city && company?.country && (
                    <p className="text-xs text-white/70 mt-1">
                      {company.city}, {company.country}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Map Section - 3/4 width */}
            <div className="col-span-3">
              <div className="h-full bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 overflow-hidden">
                <MapContainer
                  center={[officeCoordinates.lat, officeCoordinates.lng]}
                  zoom={13}
                  style={{ height: '100%', width: '100%' }}
                  className="rounded-lg"
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  />
                  <Marker position={[officeCoordinates.lat, officeCoordinates.lng]}>
                    <Popup>
                      <div className="text-center">
                        <strong>{company?.name || 'Your Company'}</strong>
                        <br />
                        {company?.address && (
                          <>
                            {company.address}
                            <br />
                          </>
                        )}
                        {company?.city && company?.country && (
                          <>{company.city}, {company.country}</>
                        )}
                      </div>
                    </Popup>
                  </Marker>
                </MapContainer>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};
