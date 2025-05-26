
import React from 'react';
import { MapPin } from 'lucide-react';
import { getLocationEmoji, getTopLocations } from '../utils/teamSummaryUtils';

interface LocationsSectionProps {
  locationStats: Record<string, number>;
}

export const LocationsSection: React.FC<LocationsSectionProps> = ({ locationStats }) => {
  const topLocations = getTopLocations(locationStats, 3);
  
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-white/20 rounded-lg">
          <MapPin className="h-5 w-5 text-white" />
        </div>
        <div>
          <div className="text-sm text-white/80">Locations</div>
          <div className="text-2xl font-bold text-white">{Object.keys(locationStats).length}</div>
        </div>
      </div>
      
      <div className="space-y-2">
        {topLocations.length > 0 ? (
          <>
            {topLocations.slice(0, 2).map(([location, count]) => (
              <div key={location} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-base">{getLocationEmoji(location)}</span>
                  <span className="text-white/90">
                    {location === 'Unknown' ? 'Not specified' : location}
                  </span>
                </div>
                <span className="font-medium text-white">{count}</span>
              </div>
            ))}
            
            {Object.keys(locationStats).length > 2 && (
              <div className="text-sm text-white/70">
                +{Object.keys(locationStats).length - 2} more
              </div>
            )}
          </>
        ) : (
          <div className="text-sm text-white/70">No locations specified</div>
        )}
      </div>
    </div>
  );
};
