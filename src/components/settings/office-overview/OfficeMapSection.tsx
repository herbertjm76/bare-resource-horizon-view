
import React, { useState, useEffect } from 'react';
import { MapPin } from 'lucide-react';

// Simple dynamic import without lazy loading
const MapComponent = React.lazy(() => 
  import('../map/MapComponent').catch(() => ({
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

interface OfficeMapSectionProps {
  locations: any[] | null;
  company: any;
}

export const OfficeMapSection: React.FC<OfficeMapSectionProps> = ({
  locations,
  company
}) => {
  const [showMap, setShowMap] = useState(false);

  // Initialize map after component mounts
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowMap(true);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  return (
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
  );
};
