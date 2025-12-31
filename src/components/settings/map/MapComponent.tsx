
import React, { useEffect, useRef } from 'react';
import 'leaflet/dist/leaflet.css';
import { logger } from '@/utils/logger';

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
          logger.log('Office locations to map:', locations);
          
          // Calculate center point of all locations
          const bounds = L.latLngBounds([]);
          
          // Get coordinates for each office location
          const locationCoords = locations.map(location => {
            const coords = getCoordinatesForLocation(location.city, location.country);
            logger.log(`Mapping ${location.city}, ${location.country} to coordinates:`, coords);
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
            zoomLevel = 4;
          }
        }

        // Create map
        const map = L.map(mapRef.current).setView([centerLat, centerLng], zoomLevel);

        // Add tile layer
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        // Add markers for each office location
        if (locations && locations.length > 0) {
          const locationCoords = locations.map(location => {
            const coords = getCoordinatesForLocation(location.city, location.country);
            return { ...location, lat: coords.lat, lng: coords.lng };
          });

          locationCoords.forEach(location => {
            const marker = L.marker([location.lat, location.lng]).addTo(map);
            
            const popupContent = `
              <div style="text-align: center; padding: 8px;">
                <div style="font-size: 18px; margin-bottom: 4px;">${location.emoji || '🏢'}</div>
                <strong>${location.code}</strong>
                <br />
                <span style="color: #666;">${location.city}, ${location.country}</span>
                <br />
                <small style="color: #999;">${company?.name || 'Office Location'}</small>
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
            map.fitBounds(bounds, { padding: [30, 30] });
          }
        }

        mapInstanceRef.current = map;
      } catch (error) {
        logger.error('Error initializing map:', error);
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

// Enhanced coordinate mapping with more cities and better country fallbacks
const getCoordinatesForLocation = (city: string, country: string) => {
  const cityKey = `${city.toLowerCase()}, ${country.toLowerCase()}`;
  const cityOnly = city.toLowerCase();
  const countryOnly = country.toLowerCase();

  logger.log(`Looking up coordinates for: "${cityKey}" (city: "${cityOnly}", country: "${countryOnly}")`);

  // Comprehensive city coordinates mapping
  const cityCoords: { [key: string]: { lat: number; lng: number } } = {
    // Major cities with country for precision
    'new york, united states': { lat: 40.7128, lng: -74.0060 },
    'new york, usa': { lat: 40.7128, lng: -74.0060 },
    'london, united kingdom': { lat: 51.5074, lng: -0.1278 },
    'london, uk': { lat: 51.5074, lng: -0.1278 },
    'paris, france': { lat: 48.8566, lng: 2.3522 },
    'tokyo, japan': { lat: 35.6762, lng: 139.6503 },
    'sydney, australia': { lat: -33.8688, lng: 151.2093 },
    'berlin, germany': { lat: 52.5200, lng: 13.4050 },
    'toronto, canada': { lat: 43.6532, lng: -79.3832 },
    'singapore, singapore': { lat: 1.3521, lng: 103.8198 },
    'mumbai, india': { lat: 19.0760, lng: 72.8777 },
    'dubai, united arab emirates': { lat: 25.2048, lng: 55.2708 },
    'dubai, uae': { lat: 25.2048, lng: 55.2708 },
    'los angeles, united states': { lat: 34.0522, lng: -118.2437 },
    'chicago, united states': { lat: 41.8781, lng: -87.6298 },
    'boston, united states': { lat: 42.3601, lng: -71.0589 },
    'san francisco, united states': { lat: 37.7749, lng: -122.4194 },
    'manchester, united kingdom': { lat: 53.4808, lng: -2.2426 },
    'birmingham, united kingdom': { lat: 52.4862, lng: -1.8904 },
    'melbourne, australia': { lat: -37.8136, lng: 144.9631 },
    'vancouver, canada': { lat: 49.2827, lng: -123.1207 },
    'montreal, canada': { lat: 45.5017, lng: -73.5673 },
    'amsterdam, netherlands': { lat: 52.3676, lng: 4.9041 },
    'madrid, spain': { lat: 40.4168, lng: -3.7038 },
    'rome, italy': { lat: 41.9028, lng: 12.4964 },
    'milan, italy': { lat: 45.4642, lng: 9.1900 },
    'zurich, switzerland': { lat: 47.3769, lng: 8.5417 },
    'stockholm, sweden': { lat: 59.3293, lng: 18.0686 },
    'oslo, norway': { lat: 59.9139, lng: 10.7522 },
    'copenhagen, denmark': { lat: 55.6761, lng: 12.5683 },
    'helsinki, finland': { lat: 60.1699, lng: 24.9384 },
    'vienna, austria': { lat: 48.2082, lng: 16.3738 },
    'prague, czech republic': { lat: 50.0755, lng: 14.4378 },
    'warsaw, poland': { lat: 52.2297, lng: 21.0122 },
    'budapest, hungary': { lat: 47.4979, lng: 19.0402 },
    'brussels, belgium': { lat: 50.8503, lng: 4.3517 },
    'dublin, ireland': { lat: 53.3498, lng: -6.2603 },
    'lisbon, portugal': { lat: 38.7223, lng: -9.1393 },
    'athens, greece': { lat: 37.9838, lng: 23.7275 },
    'istanbul, turkey': { lat: 41.0082, lng: 28.9784 },
    'moscow, russia': { lat: 55.7558, lng: 37.6176 },
    'beijing, china': { lat: 39.9042, lng: 116.4074 },
    'shanghai, china': { lat: 31.2304, lng: 121.4737 },
    'hong kong, hong kong': { lat: 22.3193, lng: 114.1694 },
    'seoul, south korea': { lat: 37.5665, lng: 126.9780 },
    'bangkok, thailand': { lat: 13.7563, lng: 100.5018 },
    'kuala lumpur, malaysia': { lat: 3.1390, lng: 101.6869 },
    'jakarta, indonesia': { lat: -6.2088, lng: 106.8456 },
    'manila, philippines': { lat: 14.5995, lng: 120.9842 },
    'delhi, india': { lat: 28.7041, lng: 77.1025 },
    'bangalore, india': { lat: 12.9716, lng: 77.5946 },
    'pune, india': { lat: 18.5204, lng: 73.8567 },
    'hyderabad, india': { lat: 17.3850, lng: 78.4867 },
    'chennai, india': { lat: 13.0827, lng: 80.2707 },
    'kolkata, india': { lat: 22.5726, lng: 88.3639 },
    'cairo, egypt': { lat: 30.0444, lng: 31.2357 },
    'cape town, south africa': { lat: -33.9249, lng: 18.4241 },
    'johannesburg, south africa': { lat: -26.2041, lng: 28.0473 },
    'lagos, nigeria': { lat: 6.5244, lng: 3.3792 },
    'nairobi, kenya': { lat: -1.2921, lng: 36.8219 },
    'casablanca, morocco': { lat: 33.5731, lng: -7.5898 },
    'buenos aires, argentina': { lat: -34.6118, lng: -58.3960 },
    'rio de janeiro, brazil': { lat: -22.9068, lng: -43.1729 },
    'são paulo, brazil': { lat: -23.5505, lng: -46.6333 },
    'mexico city, mexico': { lat: 19.4326, lng: -99.1332 },
    'santiago, chile': { lat: -33.4489, lng: -70.6693 },
    'lima, peru': { lat: -12.0464, lng: -77.0428 },
    'bogotá, colombia': { lat: 4.7110, lng: -74.0721 },
    'caracas, venezuela': { lat: 10.4806, lng: -66.9036 },
    
    // Vietnam cities
    'ho chi minh city, vietnam': { lat: 10.8231, lng: 106.6297 },
    'hanoi, vietnam': { lat: 21.0285, lng: 105.8542 },
    'da nang, vietnam': { lat: 16.0544, lng: 108.2022 },
    'can tho, vietnam': { lat: 10.0452, lng: 105.7469 },
    'hai phong, vietnam': { lat: 20.8449, lng: 106.6881 },
    'bien hoa, vietnam': { lat: 10.9447, lng: 106.8229 },
    'hue, vietnam': { lat: 16.4637, lng: 107.5909 },
    'nha trang, vietnam': { lat: 12.2388, lng: 109.1967 },
    'vung tau, vietnam': { lat: 10.3460, lng: 107.0843 },
    'quy nhon, vietnam': { lat: 13.7563, lng: 109.2297 },
    
    // City-only fallbacks (less precise)
    'new york': { lat: 40.7128, lng: -74.0060 },
    'london': { lat: 51.5074, lng: -0.1278 },
    'paris': { lat: 48.8566, lng: 2.3522 },
    'tokyo': { lat: 35.6762, lng: 139.6503 },
    'sydney': { lat: -33.8688, lng: 151.2093 },
    'berlin': { lat: 52.5200, lng: 13.4050 },
    'toronto': { lat: 43.6532, lng: -79.3832 },
    'singapore': { lat: 1.3521, lng: 103.8198 },
    'mumbai': { lat: 19.0760, lng: 72.8777 },
    'dubai': { lat: 25.2048, lng: 55.2708 },
    'amsterdam': { lat: 52.3676, lng: 4.9041 },
    'madrid': { lat: 40.4168, lng: -3.7038 },
    'rome': { lat: 41.9028, lng: 12.4964 },
    'zurich': { lat: 47.3769, lng: 8.5417 },
    'stockholm': { lat: 59.3293, lng: 18.0686 },
    'oslo': { lat: 59.9139, lng: 10.7522 },
    'copenhagen': { lat: 55.6761, lng: 12.5683 },
    'vienna': { lat: 48.2082, lng: 16.3738 },
    'prague': { lat: 50.0755, lng: 14.4378 },
    'warsaw': { lat: 52.2297, lng: 21.0122 },
    'budapest': { lat: 47.4979, lng: 19.0402 },
    'brussels': { lat: 50.8503, lng: 4.3517 },
    'dublin': { lat: 53.3498, lng: -6.2603 },
    'lisbon': { lat: 38.7223, lng: -9.1393 },
    'athens': { lat: 37.9838, lng: 23.7275 },
    'istanbul': { lat: 41.0082, lng: 28.9784 },
    'moscow': { lat: 55.7558, lng: 37.6176 },
    'beijing': { lat: 39.9042, lng: 116.4074 },
    'shanghai': { lat: 31.2304, lng: 121.4737 },
    'seoul': { lat: 37.5665, lng: 126.9780 },
    'bangkok': { lat: 13.7563, lng: 100.5018 },
    'jakarta': { lat: -6.2088, lng: 106.8456 },
    'manila': { lat: 14.5995, lng: 120.9842 },
    'delhi': { lat: 28.7041, lng: 77.1025 },
    'bangalore': { lat: 12.9716, lng: 77.5946 },
    'pune': { lat: 18.5204, lng: 73.8567 },
    'hyderabad': { lat: 17.3850, lng: 78.4867 },
    'chennai': { lat: 13.0827, lng: 80.2707 },
    'kolkata': { lat: 22.5726, lng: 88.3639 },
    'cairo': { lat: 30.0444, lng: 31.2357 },
    'ho chi minh city': { lat: 10.8231, lng: 106.6297 },
    'hanoi': { lat: 21.0285, lng: 105.8542 },
    'da nang': { lat: 16.0544, lng: 108.2022 }
  };

  // Try exact match first (city, country)
  if (cityCoords[cityKey]) {
    logger.log(`Found exact match for "${cityKey}":`, cityCoords[cityKey]);
    return cityCoords[cityKey];
  }

  // Try city-only match
  if (cityCoords[cityOnly]) {
    logger.log(`Found city-only match for "${cityOnly}":`, cityCoords[cityOnly]);
    return cityCoords[cityOnly];
  }

  // Country-based fallback coordinates (capital cities)
  const countryCoords: { [key: string]: { lat: number; lng: number } } = {
    'united states': { lat: 38.9072, lng: -77.0369 }, // Washington DC
    'usa': { lat: 38.9072, lng: -77.0369 },
    'united kingdom': { lat: 51.5074, lng: -0.1278 }, // London
    'uk': { lat: 51.5074, lng: -0.1278 },
    'france': { lat: 48.8566, lng: 2.3522 }, // Paris
    'germany': { lat: 52.5200, lng: 13.4050 }, // Berlin
    'japan': { lat: 35.6762, lng: 139.6503 }, // Tokyo
    'australia': { lat: -35.2809, lng: 149.1300 }, // Canberra
    'canada': { lat: 45.4215, lng: -75.6972 }, // Ottawa
    'singapore': { lat: 1.3521, lng: 103.8198 },
    'india': { lat: 28.6139, lng: 77.2090 }, // New Delhi
    'united arab emirates': { lat: 24.4539, lng: 54.3773 }, // Abu Dhabi
    'uae': { lat: 24.4539, lng: 54.3773 },
    'netherlands': { lat: 52.3676, lng: 4.9041 }, // Amsterdam
    'spain': { lat: 40.4168, lng: -3.7038 }, // Madrid
    'italy': { lat: 41.9028, lng: 12.4964 }, // Rome
    'switzerland': { lat: 46.9481, lng: 7.4474 }, // Bern
    'sweden': { lat: 59.3293, lng: 18.0686 }, // Stockholm
    'norway': { lat: 59.9139, lng: 10.7522 }, // Oslo
    'denmark': { lat: 55.6761, lng: 12.5683 }, // Copenhagen
    'finland': { lat: 60.1699, lng: 24.9384 }, // Helsinki
    'austria': { lat: 48.2082, lng: 16.3738 }, // Vienna
    'czech republic': { lat: 50.0755, lng: 14.4378 }, // Prague
    'poland': { lat: 52.2297, lng: 21.0122 }, // Warsaw
    'hungary': { lat: 47.4979, lng: 19.0402 }, // Budapest
    'belgium': { lat: 50.8503, lng: 4.3517 }, // Brussels
    'ireland': { lat: 53.3498, lng: -6.2603 }, // Dublin
    'portugal': { lat: 38.7223, lng: -9.1393 }, // Lisbon
    'greece': { lat: 37.9838, lng: 23.7275 }, // Athens
    'turkey': { lat: 39.9334, lng: 32.8597 }, // Ankara
    'russia': { lat: 55.7558, lng: 37.6176 }, // Moscow
    'china': { lat: 39.9042, lng: 116.4074 }, // Beijing
    'south korea': { lat: 37.5665, lng: 126.9780 }, // Seoul
    'thailand': { lat: 13.7563, lng: 100.5018 }, // Bangkok
    'malaysia': { lat: 3.1390, lng: 101.6869 }, // Kuala Lumpur
    'indonesia': { lat: -6.2088, lng: 106.8456 }, // Jakarta
    'philippines': { lat: 14.5995, lng: 120.9842 }, // Manila
    'egypt': { lat: 30.0444, lng: 31.2357 }, // Cairo
    'south africa': { lat: -25.7479, lng: 28.2293 }, // Pretoria
    'nigeria': { lat: 9.0765, lng: 7.3986 }, // Abuja
    'kenya': { lat: -1.2921, lng: 36.8219 }, // Nairobi
    'morocco': { lat: 34.0209, lng: -6.8416 }, // Rabat
    'argentina': { lat: -34.6118, lng: -58.3960 }, // Buenos Aires
    'brazil': { lat: -15.8267, lng: -47.9218 }, // Brasília
    'mexico': { lat: 19.4326, lng: -99.1332 }, // Mexico City
    'chile': { lat: -33.4489, lng: -70.6693 }, // Santiago
    'peru': { lat: -12.0464, lng: -77.0428 }, // Lima
    'colombia': { lat: 4.7110, lng: -74.0721 }, // Bogotá
    'venezuela': { lat: 10.4806, lng: -66.9036 }, // Caracas
    'vietnam': { lat: 21.0285, lng: 105.8542 } // Hanoi
  };

  // Use country fallback
  if (countryCoords[countryOnly]) {
    logger.log(`Found country fallback for "${countryOnly}":`, countryCoords[countryOnly]);
    return countryCoords[countryOnly];
  }

  // Ultimate fallback - return a default location (London)
  logger.warn(`No coordinates found for "${city}, ${country}". Using default location (London).`);
  return { lat: 51.5074, lng: -0.1278 };
};

export default MapComponent;
