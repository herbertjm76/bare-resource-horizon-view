
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Calendar as CalendarIcon } from "lucide-react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter,
  DialogDescription
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";

// Sample data - in a real app this would come from the database
const mockHolidays = [
  { id: "1", description: "New Year's Day", startDate: new Date(2025, 0, 1), endDate: new Date(2025, 0, 1), office: "New York" },
  { id: "2", description: "Christmas Holiday", startDate: new Date(2025, 11, 24), endDate: new Date(2025, 11, 26), office: "London" },
  { id: "3", description: "Golden Week", startDate: new Date(2025, 4, 3), endDate: new Date(2025, 4, 6), office: "Tokyo" }
];

const mockOffices = [
  { id: "1", name: "New York" },
  { id: "2", name: "London" },
  { id: "3", name: "Tokyo" }
];

const formSchema = z.object({
  description: z.string().min(1, "Description is required"),
  startDate: z.date({ required_error: "Start date is required" }),
  endDate: z.date({ required_error: "End date is required" }),
  office: z.string().min(1, "Office is required"),
});

type HolidayFormValues = z.infer<typeof formSchema>;
type Holiday = typeof mockHolidays[0];

export const HolidaysTab = () => {
  const [holidays, setHolidays] = useState(mockHolidays);
  const [open, setOpen] = useState(false);
  const [editingHoliday, setEditingHoliday] = useState<Holiday | null>(null);

  const form = useForm<HolidayFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: "",
      startDate: new Date(),
      endDate: new Date(),
      office: ""
    }
  });

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
      office: mockOffices.find(o => o.name === holiday.office)?.id || ""
    });
    setOpen(true);
  };

  const onSubmit = (values: HolidayFormValues) => {
    const officeName = mockOffices.find(o => o.id === values.office)?.name || "";
    
    if (editingHoliday) {
      // Update existing holiday
      setHolidays(holidays.map(holiday => 
        holiday.id === editingHoliday.id ? 
        { ...holiday, 
          description: values.description,
          startDate: values.startDate,
          endDate: values.endDate,
          office: officeName 
        } : holiday
      ));
    } else {
      // Add new holiday with proper typing
      const newHoliday: Holiday = { 
        id: Date.now().toString(), 
        description: values.description,
        startDate: values.startDate,
        endDate: values.endDate,
        office: officeName 
      };
      setHolidays([...holidays, newHoliday]);
    }
    setOpen(false);
    form.reset();
    setEditingHoliday(null);
  };

  // Function to disable weekends
  const disableWeekends = (date: Date) => {
    const day = date.getDay();
    return day === 0 || day === 6; // 0 is Sunday, 6 is Saturday
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle>Office Holidays</CardTitle>
        <Button size="sm" onClick={() => setOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Holiday
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="text-sm text-muted-foreground mb-4">
            Manage office holidays and closures.
          </div>
          
          {holidays.length > 0 ? (
            <div className="grid gap-4">
              {holidays.map((holiday) => (
                <div 
                  key={holiday.id}
                  className="flex items-center justify-between p-3 border rounded-md"
                >
                  <div>
                    <div className="font-medium">{holiday.description}</div>
                    <div className="text-sm text-muted-foreground">
                      {format(holiday.startDate, "PPP")} to {format(holiday.endDate, "PPP")} • {holiday.office}
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => handleEdit(holiday)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
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
                name="office"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Office</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select an office" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {mockOffices.map((office) => (
                          <SelectItem key={office.id} value={office.id}>
                            {office.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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
