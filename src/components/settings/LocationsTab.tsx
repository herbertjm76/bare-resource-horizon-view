import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Edit, Trash2, Check, X } from "lucide-react";
import { useOfficeSettings } from "@/context/OfficeSettingsContext";
import { useCompany } from "@/context/CompanyContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";
import { CountrySelect } from "@/components/ui/CountrySelect";
import { CitySelect } from "@/components/ui/CitySelect";

interface LocationFormData {
  code: string;
  city: string;
  country: string;
  emoji: string;
}

export const LocationsTab = () => {
  const { locations, setLocations, loading } = useOfficeSettings();
  const { company } = useCompany();
  const [editMode, setEditMode] = useState(false);
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingLocation, setEditingLocation] = useState<any>(null);
  const [formData, setFormData] = useState<LocationFormData>({
    code: '',
    city: '',
    country: '',
    emoji: ''
  });

  const handleSubmit = async () => {
    if (!company || !formData.code || !formData.city || !formData.country) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      if (editingLocation) {
        const { error } = await supabase
          .from('office_locations')
          .update(formData)
          .eq('id', editingLocation.id);

        if (error) throw error;

        setLocations(locations.map(loc => 
          loc.id === editingLocation.id ? { ...loc, ...formData } : loc
        ));
        toast.success('Location updated successfully');
      } else {
        const { data, error } = await supabase
          .from('office_locations')
          .insert([{ ...formData, company_id: company.id }])
          .select();

        if (error) throw error;

        if (data && data[0]) {
          setLocations([...locations, data[0]]);
          toast.success('Location added successfully');
        }
      }

      setShowForm(false);
      setEditingLocation(null);
      setFormData({ code: '', city: '', country: '', emoji: '' });
    } catch (error: any) {
      toast.error(`Error saving location: ${error.message}`);
    }
  };

  const handleEdit = (location: any) => {
    setEditingLocation(location);
    setFormData({
      code: location.code,
      city: location.city,
      country: location.country,
      emoji: location.emoji || ''
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this location?')) return;

    try {
      const { error } = await supabase
        .from('office_locations')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setLocations(locations.filter(loc => loc.id !== id));
      toast.success('Location deleted successfully');
    } catch (error: any) {
      toast.error(`Error deleting location: ${error.message}`);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedLocations.length === 0) return;
    
    if (!confirm(`Are you sure you want to delete ${selectedLocations.length} location(s)?`)) return;

    try {
      const { error } = await supabase
        .from('office_locations')
        .delete()
        .in('id', selectedLocations);

      if (error) throw error;

      setLocations(locations.filter(loc => !selectedLocations.includes(loc.id)));
      setSelectedLocations([]);
      setEditMode(false);
      toast.success('Locations deleted successfully');
    } catch (error: any) {
      toast.error(`Error deleting locations: ${error.message}`);
    }
  };

  const handleSelectLocation = (locationId: string) => {
    setSelectedLocations(prev => 
      prev.includes(locationId) 
        ? prev.filter(id => id !== locationId)
        : [...prev, locationId]
    );
  };

  const handleCountryChange = (countryName: string, code?: string, flag?: string) => {
    setFormData(prev => ({
      ...prev,
      country: countryName,
      emoji: flag || '',
      city: '' // Reset city when country changes
    }));
  };

  const handleCityChange = (cityName: string) => {
    setFormData(prev => ({
      ...prev,
      city: cityName
    }));
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
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle>Office Locations</CardTitle>
        <div className="flex gap-2">
          <Button 
            size="sm" 
            variant={editMode ? "secondary" : "outline"}
            onClick={() => {
              setEditMode(!editMode);
              setSelectedLocations([]);
            }}
            disabled={showForm}
          >
            <Edit className="h-4 w-4 mr-2" />
            {editMode ? "Done" : "Edit"}
          </Button>
          <Button 
            size="sm" 
            onClick={() => {
              setEditingLocation(null);
              setFormData({ code: '', city: '', country: '', emoji: '' });
              setShowForm(true);
            }}
            disabled={showForm}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Location
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="text-sm text-muted-foreground">
            Define office locations where your team members are based. Select a country first, then choose from suggested cities.
          </div>

          {editMode && selectedLocations.length > 0 && (
            <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
              <span className="text-sm text-muted-foreground">
                {selectedLocations.length} location(s) selected
              </span>
              <Button 
                size="sm" 
                variant="destructive"
                onClick={handleBulkDelete}
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Delete Selected
              </Button>
            </div>
          )}

          {showForm && (
            <div className="border rounded-lg p-4 space-y-4">
              <h3 className="font-medium">
                {editingLocation ? 'Edit Location' : 'Add New Location'}
              </h3>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="text-sm font-medium">Country <span className="text-red-500">*</span></label>
                  <CountrySelect
                    value={formData.country}
                    onChange={handleCountryChange}
                    placeholder="Select country"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">City <span className="text-red-500">*</span></label>
                  <CitySelect
                    value={formData.city}
                    onChange={handleCityChange}
                    country={formData.country}
                    placeholder="Select or enter city"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Code <span className="text-red-500">*</span></label>
                  <Input
                    value={formData.code}
                    onChange={(e) => setFormData({...formData, code: e.target.value})}
                    placeholder="e.g., NYC, LON, TKY"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button onClick={handleSubmit}>
                  {editingLocation ? 'Update' : 'Add'} Location
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setShowForm(false);
                    setEditingLocation(null);
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {locations.length === 0 && !showForm ? (
            <div className="text-center py-8 text-muted-foreground">
              No office locations defined yet. Click "Add Location" to create your first location.
            </div>
          ) : (
            <div className="space-y-2">
              {locations.map((location) => (
                <div
                  key={location.id}
                  className={`group flex items-center justify-between p-4 border rounded-lg transition-all duration-200 ${
                    editMode ? 'hover:bg-accent/30' : 'hover:border-[#6E59A5]/20 hover:bg-[#6E59A5]/5'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {editMode && (
                      <Checkbox
                        checked={selectedLocations.includes(location.id)}
                        onCheckedChange={() => handleSelectLocation(location.id)}
                      />
                    )}
                    <div className="flex items-center gap-2">
                      {location.emoji && <span className="text-lg">{location.emoji}</span>}
                      <div>
                        <div className="font-medium">{location.code}</div>
                        <div className="text-sm text-muted-foreground">
                          {location.city}, {location.country}
                        </div>
                      </div>
                    </div>
                  </div>
                  {!editMode && (
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleEdit(location)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleDelete(location.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default LocationsTab;
