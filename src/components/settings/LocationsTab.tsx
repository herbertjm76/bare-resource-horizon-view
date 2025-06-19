
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { useOfficeSettings } from "@/context/OfficeSettingsContext";
import { useLocationOperations } from './locations/useLocationOperations';
import { LocationsHeader } from './locations/LocationsHeader';
import { LocationForm } from './locations/LocationForm';
import { BulkOperations } from './locations/BulkOperations';
import { LocationsList } from './locations/LocationsList';

export const LocationsTab = () => {
  const { locations, loading } = useOfficeSettings();
  const [editMode, setEditMode] = useState(false);
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [showForm, setShowForm] = useState(false);
  
  const {
    formData,
    setFormData,
    editingLocation,
    handleSubmit,
    handleEdit,
    handleDelete,
    handleBulkDelete,
    resetForm
  } = useLocationOperations();

  const handleToggleEditMode = () => {
    setEditMode(!editMode);
    setSelectedLocations([]);
  };

  const handleAddLocation = () => {
    resetForm();
    setShowForm(true);
  };

  const handleCancelForm = () => {
    setShowForm(false);
    resetForm();
  };

  const handleEditLocation = (location: any) => {
    handleEdit(location);
    setShowForm(true);
  };

  const handleSelectLocation = (locationId: string) => {
    setSelectedLocations(prev => 
      prev.includes(locationId) 
        ? prev.filter(id => id !== locationId)
        : [...prev, locationId]
    );
  };

  const handleBulkDeleteClick = async () => {
    const success = await handleBulkDelete(selectedLocations);
    if (success) {
      setSelectedLocations([]);
      setEditMode(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="text-muted-foreground">Loading locations...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <LocationsHeader
        editMode={editMode}
        showForm={showForm}
        onToggleEditMode={handleToggleEditMode}
        onAddLocation={handleAddLocation}
      />
      <CardContent>
        <div className="space-y-4">
          <div className="text-sm text-muted-foreground">
            Define office locations where your team members are based. Select a country first, then choose from suggested cities.
          </div>

          {editMode && (
            <BulkOperations
              selectedCount={selectedLocations.length}
              onBulkDelete={handleBulkDeleteClick}
            />
          )}

          {showForm && (
            <LocationForm
              formData={formData}
              setFormData={setFormData}
              editingLocation={editingLocation}
              onSubmit={handleSubmit}
              onCancel={handleCancelForm}
            />
          )}

          <LocationsList
            locations={locations}
            editMode={editMode}
            selectedLocations={selectedLocations}
            onSelectLocation={handleSelectLocation}
            onEdit={handleEditLocation}
            onDelete={handleDelete}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default LocationsTab;
