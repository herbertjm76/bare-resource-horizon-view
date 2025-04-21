
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
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { useCompany } from "@/context/CompanyContext";
import { useOfficeSettings } from "@/context/OfficeSettingsContext";
import { toast } from "sonner";

const formSchema = z.object({
  description: z.string().min(1, "Description is required"),
  startDate: z.date({ required_error: "Start date is required" }),
  endDate: z.date({ required_error: "End date is required" }),
  offices: z.array(z.string()).min(1, "Select at least one office."),
});

type HolidayFormValues = z.infer<typeof formSchema>;

type Holiday = {
  id: string;
  description: string;
  startDate: Date;
  endDate: Date;
  offices: string[];
  company_id?: string;
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
      description: "",
      startDate: new Date(),
      endDate: new Date(),
      offices: [],
    }
  });

  const fetchHolidays = async () => {
    if (!company) return;
    
    setLoading(true);
    console.log("Fetching holidays for company:", company.id);
    
    try {
      // Get holidays from localStorage first
      const storedHolidays = localStorage.getItem("office_holidays");
      let holidaysData: Holiday[] = [];
      
      if (storedHolidays) {
        try {
          const parsed = JSON.parse(storedHolidays);
          holidaysData = Array.isArray(parsed) ? parsed : [];
        } catch (err) {
          console.error("Error parsing localStorage holidays:", err);
        }
      }
      
      console.log("Loaded holidays from localStorage:", holidaysData);
      setHolidays(holidaysData);
    } catch (error) {
      console.error("Error fetching holidays:", error);
      toast("Failed to load holidays");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHolidays();
  }, [company]);

  const persistHolidays = (updatedHolidays: Holiday[]) => {
    try {
      localStorage.setItem("office_holidays", JSON.stringify(updatedHolidays));
    } catch (err) {
      console.error("Error saving holidays to localStorage:", err);
    }
  };

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
      description: holiday.description,
      startDate: holiday.startDate,
      endDate: holiday.endDate,
      offices: holiday.offices
    });
    setOpen(true);
  };

  const handleSelect = (id: string) => {
    setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const handleBulkDelete = () => {
    const updatedHolidays = holidays.filter(h => !selected.includes(h.id));
    setHolidays(updatedHolidays);
    persistHolidays(updatedHolidays);
    setSelected([]);
    setEditMode(false);
    toast("Holidays deleted", { description: "Selected holidays have been deleted" });
  };

  const onSubmit = (values: HolidayFormValues) => {
    if (editingHoliday) {
      const updatedHolidays = holidays.map(holiday => 
        holiday.id === editingHoliday.id
        ? { ...holiday, ...values }
        : holiday
      );
      setHolidays(updatedHolidays);
      persistHolidays(updatedHolidays);
      toast("Holiday updated");
    } else {
      const newHoliday: Holiday = { 
        id: Date.now().toString(), 
        description: values.description,
        startDate: values.startDate,
        endDate: values.endDate,
        offices: values.offices,
        company_id: company?.id 
      };
      const updatedHolidays = [...holidays, newHoliday];
      setHolidays(updatedHolidays);
      persistHolidays(updatedHolidays);
      toast("Holiday added");
    }
    setOpen(false);
    form.reset();
    setEditingHoliday(null);
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
                    <div className="font-medium">{holiday.description}</div>
                    <div className="text-sm text-muted-foreground">
                      {format(holiday.startDate, "PPP")} to {format(holiday.endDate, "PPP")} • {holiday.offices.map(id => locations.find(o=>o.id===id)?.city).filter(Boolean).join(", ")}
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
                name="description"
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
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Start Date</FormLabel>
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
                  name="endDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>End Date</FormLabel>
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
              </div>
              
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
                <Button type="submit">{editingHoliday ? 'Update' : 'Add'} Holiday</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </Card>
  );
};
