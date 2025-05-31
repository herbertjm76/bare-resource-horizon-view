
import React, { useEffect, useRef } from 'react';
import 'leaflet/dist/leaflet.css';

interface Location {
  id: string;
  city: string;
  country: string;
  code: string;
  emoji?: string;
  company_id: string;
}

interface MapComponentProps {
  locations: Location[];
  company?: {
    name?: string;
    address?: string;
    city?: string;
    country?: string;
  } | null;
}

const MapComponent: React.FC<MapComponentProps> = ({ locations, company }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);

  useEffect(() => {
    const initializeMap = async () => {
      if (!mapRef.current) return;

      try {
        // Dynamic import to avoid SSR issues
        const L = await import('leaflet');
        
        // Fix for default markers
        delete (L.Icon.Default.prototype as any)._getIconUrl;
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
          iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
        });

        // Default center coordinates (will be adjusted based on locations)
        let centerLat = 40.7128;
        let centerLng = -74.006;
        let zoomLevel = 2;

        // If we have locations, center the map on them
        if (locations && locations.length > 0) {
          // Calculate center point of all locations
          const bounds = L.latLngBounds([]);
          
          // For now, we'll use approximate coordinates based on country
          // In a real app, you'd want to geocode the city/country combinations
          const locationCoords = locations.map(location => {
            // Simple mapping - in production you'd use a geocoding service
            const coords = getApproxCoordinates(location.city, location.country);
            return { ...location, lat: coords.lat, lng: coords.lng };
          });

          locationCoords.forEach(location => {
            bounds.extend([location.lat, location.lng]);
          });

          if (locationCoords.length === 1) {
            centerLat = locationCoords[0].lat;
            centerLng = locationCoords[0].lng;
            zoomLevel = 10;
          } else if (locationCoords.length > 1) {
            const center = bounds.getCenter();
            centerLat = center.lat;
            centerLng = center.lng;
            zoomLevel = 2;
          }
        }

        // Create map
        const map = L.map(mapRef.current).setView([centerLat, centerLng], zoomLevel);

        // Add tile layer
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        // Add markers for each location
        if (locations && locations.length > 0) {
          const locationCoords = locations.map(location => {
            const coords = getApproxCoordinates(location.city, location.country);
            return { ...location, lat: coords.lat, lng: coords.lng };
          });

          locationCoords.forEach(location => {
            const marker = L.marker([location.lat, location.lng]).addTo(map);
            
            const popupContent = `
              <div style="text-align: center;">
                <div style="font-size: 18px; margin-bottom: 4px;">${location.emoji || '📍'}</div>
                <strong>${location.city}, ${location.country}</strong>
                <br />
                <small>${company?.name || 'Office Location'}</small>
              </div>
            `;
            
            marker.bindPopup(popupContent);
          });

          // Fit map to show all markers if multiple locations
          if (locationCoords.length > 1) {
            const bounds = L.latLngBounds([]);
            locationCoords.forEach(location => {
              bounds.extend([location.lat, location.lng]);
            });
            map.fitBounds(bounds, { padding: [20, 20] });
          }
        }

        mapInstanceRef.current = map;
      } catch (error) {
        console.error('Error initializing map:', error);
      }
    };

    initializeMap();

    // Cleanup
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [locations, company]);

  return (
    <div 
      ref={mapRef} 
      className="h-full w-full rounded-lg"
      style={{ minHeight: '200px' }}
    />
  );
};

// Simple coordinate mapping - in production, use a proper geocoding service
const getApproxCoordinates = (city: string, country: string) => {
  // Very basic coordinate mapping for demonstration
  const cityCoords: { [key: string]: { lat: number; lng: number } } = {
    'new york': { lat: 40.7128, lng: -74.0060 },
    'london': { lat: 51.5074, lng: -0.1278 },
    'paris': { lat: 48.8566, lng: 2.3522 },
    'tokyo': { lat: 35.6762, lng: 139.6503 },
    'sydney': { lat: -33.8688, lng: 151.2093 },
    'berlin': { lat: 52.5200, lng: 13.4050 },
    'toronto': { lat: 43.6532, lng: -79.3832 },
    'singapore': { lat: 1.3521, lng: 103.8198 },
    'mumbai': { lat: 19.0760, lng: 72.8777 },
    'dubai': { lat: 25.2048, lng: 55.2708 }
  };

  const key = city.toLowerCase();
  
  if (cityCoords[key]) {
    return cityCoords[key];
  }

  // Country-based fallback coordinates
  const countryCoords: { [key: string]: { lat: number; lng: number } } = {
    'united states': { lat: 39.8283, lng: -98.5795 },
    'united kingdom': { lat: 55.3781, lng: -3.4360 },
    'france': { lat: 46.6034, lng: 1.8883 },
    'germany': { lat: 51.1657, lng: 10.4515 },
    'japan': { lat: 36.2048, lng: 138.2529 },
    'australia': { lat: -25.2744, lng: 133.7751 },
    'canada': { lat: 56.1304, lng: -106.3468 },
    'singapore': { lat: 1.3521, lng: 103.8198 },
    'india': { lat: 20.5937, lng: 78.9629 },
    'uae': { lat: 23.4241, lng: 53.8478 }
  };

  const countryKey = country.toLowerCase();
  return countryCoords[countryKey] || { lat: 40.7128, lng: -74.006 };
};

export default MapComponent;
