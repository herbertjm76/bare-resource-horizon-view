
import React, { useEffect, useRef } from 'react';
import 'leaflet/dist/leaflet.css';

interface MapComponentProps {
  coordinates: {
    lat: number;
    lng: number;
  };
  company?: {
    name?: string;
    address?: string;
    city?: string;
    country?: string;
  } | null;
}

const MapComponent: React.FC<MapComponentProps> = ({ coordinates, company }) => {
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

        // Create map
        const map = L.map(mapRef.current).setView([coordinates.lat, coordinates.lng], 13);

        // Add tile layer
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        // Add marker with popup
        const marker = L.marker([coordinates.lat, coordinates.lng]).addTo(map);
        
        const popupContent = `
          <div style="text-align: center;">
            <strong>${company?.name || 'Your Company'}</strong>
            ${company?.address ? `<br />${company.address}` : ''}
            ${company?.city && company?.country ? `<br />${company.city}, ${company.country}` : ''}
          </div>
        `;
        
        marker.bindPopup(popupContent);

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
  }, [coordinates.lat, coordinates.lng, company]);

  return (
    <div 
      ref={mapRef} 
      className="h-full w-full rounded-lg"
      style={{ minHeight: '200px' }}
    />
  );
};

export default MapComponent;
