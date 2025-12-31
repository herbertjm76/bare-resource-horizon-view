
import { supabase } from "@/integrations/supabase/client";
import { HolidayFormValues, Holiday } from "./types";
import { toast } from "sonner";
import { format, parseISO } from "date-fns";
import { logger } from '@/utils/logger';

const toDbDate = (date: Date) => format(date, "yyyy-MM-dd");
const fromDbDate = (date: string) => parseISO(date);

export const fetchHolidays = async (companyId: string): Promise<Holiday[]> => {
  if (!companyId) return [];
  
  logger.debug("Fetching holidays for company:", companyId);
  
  try {
    const { data, error } = await supabase
      .from('office_holidays')
      .select('*')
      .eq('company_id', companyId);
      
    if (error) {
      throw error;
    }
    
    // Transform the data format
    const transformedHolidays: Holiday[] = data.map((holiday) => ({
      id: holiday.id,
      name: holiday.name,
      date: fromDbDate(String(holiday.date)),
      end_date:
        "end_date" in holiday && holiday.end_date
          ? fromDbDate(String(holiday.end_date))
          : undefined,
      offices: holiday.location_id ? [holiday.location_id] : [],
      is_recurring: holiday.is_recurring,
      company_id: holiday.company_id,
      location_id: holiday.location_id,
    }));
    
    logger.debug("Loaded holidays from database:", transformedHolidays.length);
    return transformedHolidays;
  } catch (error) {
    console.error("Error fetching holidays:", error);
    toast.error("Failed to load holidays");
    return [];
  }
};

export const createHoliday = async (values: HolidayFormValues, companyId: string): Promise<Holiday | null> => {
  try {
    logger.debug("Creating holiday with values:", values);
    
    // Create a holiday entry for each selected office
    const holidayInserts = values.offices.map((officeId) => ({
      name: values.name,
      date: toDbDate(values.date),
      end_date: values.end_date ? toDbDate(values.end_date) : null,
      location_id: officeId,
      company_id: companyId,
      is_recurring: false, // Default to non-recurring
    }));
    
    const { data, error } = await supabase
      .from('office_holidays')
      .insert(holidayInserts)
      .select();
      
    if (error) {
      console.error("Database error creating holiday:", error);
      throw error;
    }
    
    logger.debug("Holiday created successfully:", data);
    
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

export const updateHoliday = async (
  id: string,
  values: HolidayFormValues,
  originalName: string,
  originalDate: Date
): Promise<boolean> => {
  try {
    logger.debug("Updating holiday:", id, values, "Original:", originalName, originalDate);

    const { data: originalHoliday, error: fetchOriginalError } = await supabase
      .from("office_holidays")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (fetchOriginalError) throw fetchOriginalError;
    if (!originalHoliday) throw new Error("Holiday not found");

    // Find all related entries by original name + date (for multi-office holidays)
    const originalDateStr = toDbDate(originalDate);
    const { data: existingHolidays, error: fetchError } = await supabase
      .from("office_holidays")
      .select("*")
      .eq("name", originalName)
      .eq("date", originalDateStr)
      .eq("company_id", originalHoliday.company_id);

    if (fetchError) throw fetchError;

    const existingIds = existingHolidays?.map((h) => h.id) || [id];
    const { error: deleteError } = await supabase
      .from("office_holidays")
      .delete()
      .in("id", existingIds);

    if (deleteError) throw deleteError;

    const holidayInserts = values.offices.map((officeId) => ({
      name: values.name,
      date: toDbDate(values.date),
      end_date: values.end_date ? toDbDate(values.end_date) : null,
      location_id: officeId,
      company_id: originalHoliday.company_id,
      is_recurring: false,
    }));

    const { error: insertError } = await supabase
      .from("office_holidays")
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
