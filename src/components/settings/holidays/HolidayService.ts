
import { supabase } from "@/integrations/supabase/client";
import { HolidayFormValues, Holiday } from "./types";
import { toast } from "sonner";

export const fetchHolidays = async (companyId: string): Promise<Holiday[]> => {
  if (!companyId) return [];
  
  console.log("Fetching holidays for company:", companyId);
  
  try {
    const { data, error } = await supabase
      .from('office_holidays')
      .select('*')
      .eq('company_id', companyId);
      
    if (error) {
      throw error;
    }
    
    // Transform the data format
    const transformedHolidays: Holiday[] = data.map(holiday => ({
      id: holiday.id,
      name: holiday.name,
      date: new Date(holiday.date),
      // Safely handle end_date which might not exist in the database schema yet
      end_date: 'end_date' in holiday && holiday.end_date ? 
        new Date(String(holiday.end_date)) : undefined,
      offices: holiday.location_id ? [holiday.location_id] : [], // Handle location_id as offices array
      is_recurring: holiday.is_recurring,
      company_id: holiday.company_id,
      location_id: holiday.location_id
    }));
    
    console.log("Loaded holidays from database:", transformedHolidays.length);
    return transformedHolidays;
  } catch (error) {
    console.error("Error fetching holidays:", error);
    toast.error("Failed to load holidays");
    return [];
  }
};

export const createHoliday = async (values: HolidayFormValues, companyId: string): Promise<Holiday | null> => {
  try {
    console.log("Creating holiday with values:", values);
    
    // Create a holiday entry for each selected office
    const holidayInserts = values.offices.map(officeId => ({
      name: values.name,
      date: values.date.toISOString().split('T')[0], // Convert Date to YYYY-MM-DD string
      end_date: values.end_date ? values.end_date.toISOString().split('T')[0] : null, // Include end_date if available
      location_id: officeId,
      company_id: companyId,
      is_recurring: false // Default to non-recurring
    }));
    
    const { data, error } = await supabase
      .from('office_holidays')
      .insert(holidayInserts)
      .select();
      
    if (error) {
      console.error("Database error creating holiday:", error);
      throw error;
    }
    
    console.log("Holiday created successfully:", data);
    
    const newHoliday: Holiday = { 
      id: data[0].id, 
      name: values.name,
      date: values.date,
      end_date: values.end_date,
      offices: values.offices,
      is_recurring: false,
      company_id: companyId,
      location_id: values.offices[0]
    };
    
    toast.success("Holiday added");
    return newHoliday;
  } catch (error) {
    console.error("Error creating holiday:", error);
    toast.error("Failed to create holiday");
    return null;
  }
};

export const updateHoliday = async (id: string, values: HolidayFormValues): Promise<boolean> => {
  try {
    console.log("Updating holiday:", id, values);
    
    // For updates, we need to handle this differently since we're dealing with multiple locations
    // First, get the existing holiday to find all related entries
    const { data: existingHolidays, error: fetchError } = await supabase
      .from('office_holidays')
      .select('*')
      .eq('name', values.name)
      .eq('date', values.date.toISOString().split('T')[0]);
    
    if (fetchError) throw fetchError;
    
    // Delete all existing entries for this holiday
    const existingIds = existingHolidays?.map(h => h.id) || [];
    if (existingIds.length > 0) {
      const { error: deleteError } = await supabase
        .from('office_holidays')
        .delete()
        .in('id', existingIds);
      
      if (deleteError) throw deleteError;
    }
    
    // Create new entries for each selected office
    const holidayInserts = values.offices.map(officeId => ({
      name: values.name,
      date: values.date.toISOString().split('T')[0],
      end_date: values.end_date ? values.end_date.toISOString().split('T')[0] : null,
      location_id: officeId,
      company_id: existingHolidays?.[0]?.company_id,
      is_recurring: false
    }));
    
    const { error: insertError } = await supabase
      .from('office_holidays')
      .insert(holidayInserts);
      
    if (insertError) throw insertError;
    
    toast.success("Holiday updated");
    return true;
  } catch (error) {
    console.error("Error updating holiday:", error);
    toast.error("Failed to update holiday");
    return false;
  }
};

export const deleteHolidays = async (ids: string[]): Promise<boolean> => {
  if (!ids.length) return false;
  
  try {
    const { error } = await supabase
      .from('office_holidays')
      .delete()
      .in('id', ids);
      
    if (error) throw error;
    toast.success("Holidays deleted");
    return true;
  } catch (error) {
    console.error("Error deleting holidays:", error);
    toast.error("Failed to delete holidays");
    return false;
  }
};
