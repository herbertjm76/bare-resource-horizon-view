import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { MapPin, Building2, Upload } from 'lucide-react';
import { useCompany } from '@/context/CompanyContext';
import { useOfficeSettings } from '@/context/OfficeSettingsContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Simple dynamic import without lazy loading
const MapComponent = React.lazy(() => 
  import('./map/MapComponent').catch(() => ({
    default: () => (
      <div className="h-full w-full flex items-center justify-center text-white/60">
        <div className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          <span>Map unavailable</span>
        </div>
      </div>
    )
  }))
);

export const OfficeOverviewCard = () => {
  const { company, refreshCompany } = useCompany();
  const { locations } = useOfficeSettings();
  const [showMap, setShowMap] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Initialize map after component mounts
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowMap(true);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  // Mock coordinates for demonstration - in a real app, these would come from the company data
  const officeCoordinates = {
    lng: -74.006, // New York City coordinates as example
    lat: 40.7128
  };

  const handleLogoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !company?.id) {
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB');
      return;
    }

    setUploading(true);

    try {
      // Create a unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${company.id}/logo.${fileExt}`;

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('company-logos')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (uploadError) {
        console.error('Upload error:', uploadError);
        toast.error('Failed to upload logo');
        return;
      }

      // Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from('company-logos')
        .getPublicUrl(fileName);

      // Update company logo URL in database
      const { error: updateError } = await supabase
        .from('companies')
        .update({ logo_url: publicUrl })
        .eq('id', company.id);

      if (updateError) {
        console.error('Update error:', updateError);
        toast.error('Failed to update logo');
        return;
      }

      // Refresh company data to show new logo
      await refreshCompany();
      toast.success('Logo updated successfully');

    } catch (error) {
      console.error('Logo upload error:', error);
      toast.error('Failed to upload logo');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div 
      className="rounded-3xl p-5 border-2"
      style={{
        background: 'linear-gradient(to right, #eef2ff, #fdf2ff)',
        borderImage: 'linear-gradient(to right, #eef2ff, #fdf2ff) 1',
        borderColor: 'transparent'
      }}
    >
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
                    {uploading ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    ) : (
                      <Upload className="h-5 w-5 text-white" />
                    )}
                  </div>
                  
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    disabled={uploading}
                    className="absolute inset-0 opacity-0 cursor-pointer disabled:cursor-not-allowed"
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
                  {locations && locations.length > 0 && (
                    <p className="text-xs text-white/70 mt-2">
                      {locations.length} office location{locations.length > 1 ? 's' : ''}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Map Section - 3/4 width */}
            <div className="col-span-3">
              <div className="h-full bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 overflow-hidden">
                {showMap ? (
                  <React.Suspense 
                    fallback={
                      <div className="h-full w-full flex items-center justify-center">
                        <div className="text-white/60 flex items-center gap-2">
                          <MapPin className="h-5 w-5 animate-pulse" />
                          <span>Loading map...</span>
                        </div>
                      </div>
                    }
                  >
                    <MapComponent 
                      locations={locations || []}
                      company={company}
                    />
                  </React.Suspense>
                ) : (
                  <div className="h-full w-full flex items-center justify-center">
                    <div className="text-white/60 flex items-center gap-2">
                      <MapPin className="h-5 w-5" />
                      <span>Initializing map...</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};
