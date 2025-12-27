
import { useState } from 'react';
import { useOfficeSettings } from "@/context/OfficeSettingsContext";
import { useCompany } from "@/context/CompanyContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface LocationFormData {
  code: string;
  city: string;
  country: string;
  emoji: string;
}

export const useLocationOperations = () => {
  const { locations, setLocations } = useOfficeSettings();
  const { company } = useCompany();
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

      return true;
    } catch (error: any) {
      toast.error(`Error saving location: ${error.message}`);
      return false;
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
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this location? Any associated holidays will also be deleted.')) return;

    try {
      // First delete any associated holidays
      const { error: holidaysError } = await supabase
        .from('office_holidays')
        .delete()
        .eq('location_id', id);

      if (holidaysError) throw holidaysError;

      // Then delete the location
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

  const handleBulkDelete = async (selectedLocations: string[]) => {
    if (selectedLocations.length === 0) return;
    
    if (!confirm(`Are you sure you want to delete ${selectedLocations.length} location(s)? Any associated holidays will also be deleted.`)) return;

    try {
      // First delete any associated holidays
      const { error: holidaysError } = await supabase
        .from('office_holidays')
        .delete()
        .in('location_id', selectedLocations);

      if (holidaysError) throw holidaysError;

      // Then delete the locations
      const { error } = await supabase
        .from('office_locations')
        .delete()
        .in('id', selectedLocations);

      if (error) throw error;

      setLocations(locations.filter(loc => !selectedLocations.includes(loc.id)));
      toast.success('Locations deleted successfully');
      return true;
    } catch (error: any) {
      toast.error(`Error deleting locations: ${error.message}`);
      return false;
    }
  };

  const resetForm = () => {
    setEditingLocation(null);
    setFormData({ code: '', city: '', country: '', emoji: '' });
  };

  return {
    formData,
    setFormData,
    editingLocation,
    handleSubmit,
    handleEdit,
    handleDelete,
    handleBulkDelete,
    resetForm
  };
};
