
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Pencil } from "lucide-react";
import { AddRateDialog } from './AddRateDialog';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useCompany } from '@/context/CompanyContext';
import { useOfficeSettings } from '@/context/OfficeSettingsContext';

export const RatesTab = () => {
  const [open, setOpen] = useState(false);
  const { company } = useCompany();
  const { roles, locations, rates, setRates } = useOfficeSettings();

  const handleSubmit = async (values: any) => {
    if (!company) {
      toast.error('No company selected');
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
        // Explicitly cast the rate type to ensure it matches the expected "role" | "location" union type
        const newRate = {
          ...data[0],
          type: data[0].type === "role" ? "role" : "location",
          unit: data[0].unit === "hour" || data[0].unit === "day" || data[0].unit === "week" 
            ? data[0].unit 
            : "hour",
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

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle>Office Rates</CardTitle>
        <Button size="sm" onClick={() => setOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Rate
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {rates.length === 0 ? (
            <div className="text-center py-4 text-muted-foreground">
              No rates defined yet. Click "Add Rate" to create your first rate.
            </div>
          ) : (
            <div className="grid gap-4">
              {rates.map((rate) => (
                <div
                  key={rate.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div>
                    <div className="font-medium">{getRateName(rate)}</div>
                    <div className="text-sm text-muted-foreground">
                      ${rate.value}/{rate.unit}
                    </div>
                  </div>
                  <Button variant="ghost" size="icon">
                    <Pencil className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
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
  );
};

export default RatesTab;
