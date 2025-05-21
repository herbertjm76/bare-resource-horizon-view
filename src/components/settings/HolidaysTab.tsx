
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2, Calendar as CalendarIcon } from "lucide-react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter,
  DialogDescription
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format, parseISO } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { useCompany } from "@/context/CompanyContext";
import { useOfficeSettings } from "@/context/OfficeSettingsContext";
import { toast } from "sonner";

const formSchema = z.object({
  name: z.string().min(1, "Description is required"),
  date: z.date({ required_error: "Start date is required" }),
  offices: z.array(z.string()).min(1, "Select at least one office."),
});

type HolidayFormValues = z.infer<typeof formSchema>;

type Holiday = {
  id: string;
  name: string;
  date: Date;
  offices: string[];
  company_id?: string;
  location_id?: string;
  is_recurring: boolean;
};

export const HolidaysTab = () => {
  const [holidays, setHolidays] = useState<Holiday[]>([]);
  const [open, setOpen] = useState(false);
  const [editingHoliday, setEditingHoliday] = useState<Holiday | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const { company } = useCompany();
  const { locations } = useOfficeSettings();

  const form = useForm<HolidayFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      date: new Date(),
      offices: [],
    }
  });

  const fetchHolidays = async () => {
    if (!company) return;
    
    setLoading(true);
    console.log("Fetching holidays for company:", company.id);
    
    try {
      // Fetch holidays from Supabase
      const { data, error } = await supabase
        .from('office_holidays')
        .select('*')
        .eq('company_id', company.id);
        
      if (error) {
        throw error;
      }
      
      // Transform the data format
      const transformedHolidays: Holiday[] = data.map(holiday => ({
        id: holiday.id,
        name: holiday.name,
        date: new Date(holiday.date),
        offices: holiday.location_id ? [holiday.location_id] : [], // Handle location_id as offices array
        is_recurring: holiday.is_recurring,
        company_id: holiday.company_id,
        location_id: holiday.location_id
      }));
      
      console.log("Loaded holidays from database:", transformedHolidays.length);
      setHolidays(transformedHolidays);
    } catch (error) {
      console.error("Error fetching holidays:", error);
      toast.error("Failed to load holidays");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHolidays();
  }, [company]);

  const onOpenChange = (open: boolean) => {
    setOpen(open);
    if (!open) {
      form.reset();
      setEditingHoliday(null);
    }
  };

  const handleEdit = (holiday: Holiday) => {
    setEditingHoliday(holiday);
    form.reset({
      name: holiday.name,
      date: holiday.date,
      offices: holiday.offices
    });
    setOpen(true);
  };

  const handleSelect = (id: string) => {
    setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const handleBulkDelete = async () => {
    if (!selected.length || !company) return;
    
    setLoading(true);
    try {
      // Delete from Supabase
      const { error } = await supabase
        .from('office_holidays')
        .delete()
        .in('id', selected);
        
      if (error) throw error;
      
      // Update local state
      const updatedHolidays = holidays.filter(h => !selected.includes(h.id));
      setHolidays(updatedHolidays);
      setSelected([]);
      setEditMode(false);
      toast.success("Holidays deleted");
    } catch (error) {
      console.error("Error deleting holidays:", error);
      toast.error("Failed to delete holidays");
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (values: HolidayFormValues) => {
    if (!company) return;
    
    setLoading(true);
    
    try {
      if (editingHoliday) {
        // Update existing holiday
        const { error } = await supabase
          .from('office_holidays')
          .update({
            name: values.name,
            date: values.date.toISOString().split('T')[0],
            location_id: values.offices[0], // Use first office as location_id for now
            updated_at: new Date()
          })
          .eq('id', editingHoliday.id);
          
        if (error) throw error;
        
        // Update local state
        setHolidays(prev => prev.map(holiday => 
          holiday.id === editingHoliday.id
            ? { 
                ...holiday, 
                name: values.name,
                date: values.date,
                offices: values.offices
              }
            : holiday
        ));
        
        toast.success("Holiday updated");
      } else {
        // Create new holiday
        const { data, error } = await supabase
          .from('office_holidays')
          .insert({
            name: values.name,
            date: values.date.toISOString().split('T')[0],
            location_id: values.offices[0], // Use first office as location_id for now
            company_id: company.id,
            is_recurring: false // Default to non-recurring
          })
          .select();
          
        if (error) throw error;
        
        const newHoliday: Holiday = { 
          id: data[0].id, 
          name: values.name,
          date: values.date,
          offices: values.offices,
          is_recurring: false,
          company_id: company.id,
          location_id: values.offices[0]
        };
        
        // Update local state
        setHolidays(prev => [...prev, newHoliday]);
        
        toast.success("Holiday added");
      }
    } catch (error) {
      console.error("Error saving holiday:", error);
      toast.error("Failed to save holiday");
    } finally {
      setLoading(false);
      setOpen(false);
      form.reset();
      setEditingHoliday(null);
    }
  };

  // Disable weekends
  const disableWeekends = (date: Date) => {
    const day = date.getDay();
    return day === 0 || day === 6;
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 gap-2">
        <CardTitle>Office Holidays</CardTitle>
        <div className="flex gap-2">
          <Button size="sm" variant={editMode ? "secondary" : "outline"} onClick={() => setEditMode(em => !em)} disabled={loading}>
            <Edit className="h-4 w-4 mr-2" /> Edit
          </Button>
          <Button size="sm" onClick={() => setOpen(true)} disabled={loading}>
            <Plus className="h-4 w-4 mr-2" />
            Add Holiday
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="text-sm text-muted-foreground mb-4">
            Manage office holidays and closures.
          </div>
          {editMode && (
            <div className="flex items-center gap-2 mb-2">
              <Button
                variant="destructive"
                size="sm"
                disabled={selected.length === 0 || loading}
                onClick={handleBulkDelete}
              >
                <Trash2 className="h-4 w-4 mr-1" /> Delete Selected
              </Button>
              <span className="text-xs text-muted-foreground">{selected.length} selected</span>
            </div>
          )}
          {loading ? (
            <div className="text-center p-4 border rounded-md border-dashed">Loading...</div>
          ) : holidays.length > 0 ? (
            <div className="grid gap-4">
              {holidays.map((holiday) => (
                <div 
                  key={holiday.id}
                  className={`flex items-center justify-between p-3 border rounded-md ${editMode && "ring-2"} `}
                  style={editMode && selected.includes(holiday.id) ? { borderColor: "#dc2626", background: "#fee2e2" } : {}}
                >
                  <div>
                    <div className="font-medium">{holiday.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {format(holiday.date, "PPP")} • 
                      {holiday.offices.map(id => locations.find(o=>o.id===id)?.city).filter(Boolean).join(", ")}
                    </div>
                  </div>
                  {editMode ? (
                    <input
                      type="checkbox"
                      className="w-4 h-4 accent-purple-600"
                      checked={selected.includes(holiday.id)}
                      onChange={() => handleSelect(holiday.id)}
                    />
                  ) : (
                    <Button variant="ghost" size="sm" onClick={() => handleEdit(holiday)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center p-4 border rounded-md border-dashed">
              No holidays added yet. Click "Add Holiday" to get started.
            </div>
          )}
        </div>
      </CardContent>

      {/* Add/Edit Dialog */}
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{editingHoliday ? 'Edit' : 'Add'} Office Holiday</DialogTitle>
            <DialogDescription>
              Enter the details for this office holiday.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., New Year's Day" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={`w-full pl-3 text-left font-normal ${!field.value && "text-muted-foreground"}`}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={disableWeekends}
                          initialFocus
                          className="p-3 pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="offices"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Offices</FormLabel>
                    <div className="grid grid-cols-2 gap-2">
                      {locations.map(office => (
                        <label key={office.id} className="inline-flex items-center gap-2">
                          <input
                            type="checkbox"
                            value={office.id}
                            checked={field.value.includes(office.id)}
                            onChange={(e) => {
                              const newValue = e.target.checked
                                ? [...field.value, office.id]
                                : field.value.filter((id: string) => id !== office.id);
                              field.onChange(newValue);
                            }}
                          />
                          <span>{office.city}</span>
                        </label>
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="submit" disabled={loading}>
                  {loading ? "Saving..." : editingHoliday ? 'Update' : 'Add'} Holiday
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </Card>
  );
};
