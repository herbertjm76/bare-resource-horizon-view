
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
    <div className="space-y-2">
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
