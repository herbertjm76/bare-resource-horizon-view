
import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in react-leaflet - do this inside a component effect
const initializeLeafletIcons = () => {
  // Only initialize if not already done
  if ((L.Icon.Default.prototype as any)._getIconUrl) {
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
      iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    });
  }
};

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
  useEffect(() => {
    initializeLeafletIcons();
  }, []);

  return (
    <MapContainer
      center={[coordinates.lat, coordinates.lng]}
      zoom={13}
      style={{ height: '100%', width: '100%' }}
      className="rounded-lg"
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <Marker position={[coordinates.lat, coordinates.lng]}>
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
  );
};

export default MapComponent;
