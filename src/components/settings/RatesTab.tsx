import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Pencil } from "lucide-react";
import { AddRateDialog } from './AddRateDialog';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useCompany } from '@/context/CompanyContext';
import { useOfficeSettings } from '@/context/OfficeSettingsContext';
import { RateCard } from './RateCard';

export const RatesTab = () => {
  const [open, setOpen] = useState(false);
  const { company } = useCompany();
  const { roles, locations, rates, setRates } = useOfficeSettings();

  const handleSubmit = async (values: any) => {
    if (!company) {
      toast.error('No company selected');
      return;
    }

    const isDuplicate = rates.some(rate => 
      rate.type === values.type && 
      rate.reference_id === values.reference_id
    );

    if (isDuplicate) {
      toast.error(`A rate for this ${values.type} already exists`);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('office_rates')
        .insert([
          {
            type: values.type,
            reference_id: values.reference_id,
            value: values.value,
            unit: values.unit,
            company_id: company.id
          }
        ])
        .select();
      
      if (error) throw error;
      
      if (data) {
        const newRate = {
          ...data[0],
          type: data[0].type === "role" ? "role" as const : "location" as const,
          unit: (data[0].unit === "hour" || data[0].unit === "day" || data[0].unit === "week" 
            ? data[0].unit 
            : "hour") as "hour" | "day" | "week",
          value: Number(data[0].value)
        };
        
        setRates([...rates, newRate]);
        toast.success('Rate added successfully');
        setOpen(false);
      }
    } catch (error: any) {
      console.error('Error adding rate:', error);
      toast.error('Failed to add rate');
    }
  };

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
          <Button size="sm" onClick={() => setOpen(true)} className="h-9">
            <Plus className="h-4 w-4 mr-2" />
            Add Rate
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-[#6E59A5]">Role Rates</h3>
                <span className="text-sm text-muted-foreground">
                  {roleRates.length} {roleRates.length === 1 ? 'rate' : 'rates'}
                </span>
              </div>
              {roleRates.length === 0 ? (
                <div className="text-center py-8 bg-muted/20 rounded-lg border border-dashed">
                  <p className="text-muted-foreground">No role rates defined yet</p>
                  <Button 
                    variant="link" 
                    onClick={() => setOpen(true)} 
                    className="mt-2"
                  >
                    Add your first role rate
                  </Button>
                </div>
              ) : (
                <div className="grid gap-3">
                  {roleRates.map((rate) => (
                    <RateCard
                      key={rate.id}
                      name={getRateName(rate)}
                      value={rate.value}
                      unit={rate.unit}
                      type={rate.type}
                      onEdit={() => {/* Add edit handler */}}
                    />
                  ))}
                </div>
              )}
            </div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-[#6E59A5]">Location Rates</h3>
                <span className="text-sm text-muted-foreground">
                  {locationRates.length} {locationRates.length === 1 ? 'rate' : 'rates'}
                </span>
              </div>
              {locationRates.length === 0 ? (
                <div className="text-center py-8 bg-muted/20 rounded-lg border border-dashed">
                  <p className="text-muted-foreground">No location rates defined yet</p>
                  <Button 
                    variant="link" 
                    onClick={() => setOpen(true)} 
                    className="mt-2"
                  >
                    Add your first location rate
                  </Button>
                </div>
              ) : (
                <div className="grid gap-3">
                  {locationRates.map((rate) => (
                    <RateCard
                      key={rate.id}
                      name={getRateName(rate)}
                      value={rate.value}
                      unit={rate.unit}
                      type={rate.type}
                      onEdit={() => {/* Add edit handler */}}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          {open && (
            <AddRateDialog
              roles={roles}
              locations={locations}
              onCancel={() => setOpen(false)}
              onSubmit={handleSubmit}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default RatesTab;
