
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { z } from "zod";

const formSchema = z.object({
  type: z.enum(["role", "location"]),
  reference_id: z.string().min(1, "Please select an item"),
  value: z.number().min(0, "Rate must be greater than or equal to 0"),
  unit: z.enum(["hour", "day", "week"])
});

export type RateFormValues = z.infer<typeof formSchema>;

export const useRates = (
  rates: any[], 
  setRates: React.Dispatch<React.SetStateAction<any[]>>, 
  company: any
) => {
  const [open, setOpen] = useState(false);

  const handleSubmit = async (values: RateFormValues) => {
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

  return {
    open,
    setOpen,
    handleSubmit
  };
};
