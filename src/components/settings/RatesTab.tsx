
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { AddRateDialog } from './AddRateDialog';
import { useCompany } from '@/context/CompanyContext';
import { useOfficeSettings } from '@/context/OfficeSettingsContext';
import { RatesList } from './rates/RatesList';
import { useRates } from './rates/useRates';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

export const RatesTab = () => {
  const { company } = useCompany();
  const { roles, locations, rates, setRates } = useOfficeSettings();
  const { 
    open, 
    setOpen, 
    handleSubmit, 
    handleEdit,
    editingRate,
    setEditingRate 
  } = useRates(rates, setRates, company);

  const getRateName = (rate: any) => {
    if (rate.type === 'role') {
      const role = roles.find(r => r.id === rate.reference_id);
      return role ? role.name : 'Unknown Role';
    } else {
      const location = locations.find(l => l.id === rate.reference_id);
      return location ? `${location.city}, ${location.country}` : 'Unknown Location';
    }
  };

  const roleRates = rates.filter(rate => rate.type === 'role');
  const locationRates = rates.filter(rate => rate.type === 'location');

  const handleDeleteRate = async (rate: any) => {
    if (!company) return;
    
    try {
      const { error } = await supabase
        .from('office_rates')
        .delete()
        .eq('id', rate.id);
        
      if (error) throw error;
      
      setRates(rates.filter(r => r.id !== rate.id));
      toast.success('Rate deleted successfully');
    } catch (error) {
      console.error('Error deleting rate:', error);
      toast.error('Failed to delete rate');
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardTitle>Office Rates</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Manage rates for roles and locations across your organization
            </p>
          </div>
          <Button size="sm" onClick={() => {
            setEditingRate(null);
            setOpen(true);
          }} className="h-9">
            <Plus className="h-4 w-4 mr-2" />
            Add Rate
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
            <RatesList
              title="Role Rates"
              type="role"
              rates={roleRates}
              getRateName={getRateName}
              onAddRate={() => {
                setEditingRate(null);
                setOpen(true);
              }}
              onEditRate={handleEdit}
              onDeleteRate={handleDeleteRate}
            />
            <RatesList
              title="Location Rates"
              type="location"
              rates={locationRates}
              getRateName={getRateName}
              onAddRate={() => {
                setEditingRate(null);
                setOpen(true);
              }}
              onEditRate={handleEdit}
              onDeleteRate={handleDeleteRate}
            />
          </div>

          {open && (
            <AddRateDialog
              roles={roles}
              locations={locations}
              onCancel={() => {
                setOpen(false);
                setEditingRate(null);
              }}
              onSubmit={handleSubmit}
              editingRate={editingRate}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default RatesTab;
