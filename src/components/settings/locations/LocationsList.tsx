
import React from 'react';
import { LocationListItem } from './LocationListItem';

interface Location {
  id: string;
  code: string;
  city: string;
  country: string;
  emoji?: string;
}

interface LocationsListProps {
  locations: Location[];
  editMode: boolean;
  selectedLocations: string[];
  onSelectLocation: (locationId: string) => void;
  onEdit: (location: Location) => void;
  onDelete: (id: string) => void;
}

export const LocationsList: React.FC<LocationsListProps> = ({
  locations,
  editMode,
  selectedLocations,
  onSelectLocation,
  onEdit,
  onDelete
}) => {
  if (locations.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No office locations defined yet. Click "Add Location" to create your first location.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {locations.map((location) => (
        <LocationListItem
          key={location.id}
          location={location}
          editMode={editMode}
          isSelected={selectedLocations.includes(location.id)}
          onSelect={onSelectLocation}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};
