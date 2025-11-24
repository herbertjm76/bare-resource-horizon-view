
import { useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Sector } from "@/context/officeSettings/types";

export const useSectorOperations = (
  sectors: Sector[],
  setSectors: (sectors: Sector[]) => void,
  companyId: string | undefined
) => {
  const [editingSector, setEditingSector] = useState<Sector | null>(null);
  const [newSectorName, setNewSectorName] = useState("");
  const [newSectorIcon, setNewSectorIcon] = useState("circle");
  const [editMode, setEditMode] = useState(false);
  const [selectedSectors, setSelectedSectors] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);

  const handleSubmit = async () => {
    if (!newSectorName.trim() || !companyId) return;

    setIsSubmitting(true);
    try {
      if (editingSector) {
        const { data, error } = await supabase
          .from('office_sectors')
          .update({ 
            name: newSectorName.trim(),
            icon: newSectorIcon
          })
          .eq('id', editingSector.id)
          .select()
          .single();

        if (error) throw error;

        setSectors(sectors.map(sector => 
          sector.id === editingSector.id ? data : sector
        ));
        toast.success('Sector updated successfully');
      } else {
        const { data, error } = await supabase
          .from('office_sectors')
          .insert([{
            name: newSectorName.trim(),
            icon: newSectorIcon,
            company_id: companyId
          }])
          .select()
          .single();

        if (error) throw error;

        setSectors([...sectors, data]);
        toast.success('Sector added successfully');
      }

      setNewSectorName("");
      setNewSectorIcon("circle");
      setEditingSector(null);
      setShowAddForm(false);
    } catch (error) {
      console.error('Error saving sector:', error);
      toast.error('Failed to save sector');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (sector: Sector) => {
    setEditingSector(sector);
    setNewSectorName(sector.name);
    setNewSectorIcon(sector.icon || "circle");
    setShowAddForm(true);
  };

  const handleDelete = async (sector: Sector) => {
    if (!confirm('Are you sure you want to delete this sector?')) return;

    try {
      const { error } = await supabase
        .from('office_sectors')
        .delete()
        .eq('id', sector.id);

      if (error) throw error;

      setSectors(sectors.filter(s => s.id !== sector.id));
      toast.success('Sector deleted successfully');
    } catch (error) {
      console.error('Error deleting sector:', error);
      toast.error('Failed to delete sector');
    }
  };

  const handleBulkDelete = async () => {
    if (selectedSectors.length === 0) return;
    
    if (!confirm(`Are you sure you want to delete ${selectedSectors.length} sector(s)?`)) return;

    try {
      const { error } = await supabase
        .from('office_sectors')
        .delete()
        .in('id', selectedSectors);

      if (error) throw error;

      setSectors(sectors.filter(sector => !selectedSectors.includes(sector.id)));
      setSelectedSectors([]);
      setEditMode(false);
      toast.success('Sectors deleted successfully');
    } catch (error) {
      console.error('Error deleting sectors:', error);
      toast.error('Failed to delete sectors');
    }
  };

  const handleSelectSector = (sectorId: string) => {
    setSelectedSectors(prev => 
      prev.includes(sectorId) 
        ? prev.filter(id => id !== sectorId)
        : [...prev, sectorId]
    );
  };

  const handleCancel = () => {
    setEditingSector(null);
    setNewSectorName("");
    setNewSectorIcon("circle");
    setShowAddForm(false);
  };

  const toggleEditMode = () => {
    setEditMode(!editMode);
    setSelectedSectors([]);
    if (!editMode) {
      setShowAddForm(false);
      setEditingSector(null);
      setNewSectorName("");
      setNewSectorIcon("circle");
    }
  };

  const handleAddNew = () => {
    setShowAddForm(!showAddForm);
    if (!showAddForm) {
      setEditingSector(null);
      setNewSectorName("");
      setNewSectorIcon("circle");
    }
  };

  const handleConvertToDepartment = async (sector: Sector) => {
    if (!companyId) return;
    
    if (!confirm(`Convert "${sector.name}" to a department?`)) return;

    try {
      const { error: insertError } = await supabase
        .from('office_departments')
        .insert({
          name: sector.name,
          icon: sector.icon,
          company_id: companyId
        });

      if (insertError) throw insertError;

      const { error: deleteError } = await supabase
        .from('office_sectors')
        .delete()
        .eq('id', sector.id);

      if (deleteError) throw deleteError;

      setSectors(sectors.filter(sect => sect.id !== sector.id));
      toast.success("Sector converted to department successfully");
    } catch (error) {
      console.error('Error converting sector to department:', error);
      toast.error("Failed to convert sector to department");
    }
  };

  return {
    editingSector,
    newSectorName,
    setNewSectorName,
    newSectorIcon,
    setNewSectorIcon,
    editMode,
    selectedSectors,
    isSubmitting,
    showAddForm,
    handleSubmit,
    handleEdit,
    handleDelete,
    handleBulkDelete,
    handleSelectSector,
    handleCancel,
    toggleEditMode,
    handleAddNew,
    handleConvertToDepartment
  };
};
