
import React from 'react';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Holiday, HolidayFormValues, holidayFormSchema } from './types';
import { useOfficeSettings } from '@/context/OfficeSettingsContext';

interface HolidayDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: HolidayFormValues) => void;
  editingHoliday: Holiday | null;
  loading: boolean;
}

export const HolidayDialog: React.FC<HolidayDialogProps> = ({
  open,
  onOpenChange,
  onSubmit,
  editingHoliday,
  loading
}) => {
  const { locations } = useOfficeSettings();
  
  const form = useForm<HolidayFormValues>({
    resolver: zodResolver(holidayFormSchema),
    defaultValues: {
      name: editingHoliday?.name || "",
      date: editingHoliday?.date || new Date(),
      offices: editingHoliday?.offices || [],
    }
  });

  React.useEffect(() => {
    if (editingHoliday) {
      form.reset({
        name: editingHoliday.name,
        date: editingHoliday.date,
        offices: editingHoliday.offices
      });
    } else if (open) {
      form.reset({
        name: "",
        date: new Date(),
        offices: []
      });
    }
  }, [editingHoliday, open, form]);

  // Disable weekends
  const disableWeekends = (date: Date) => {
    const day = date.getDay();
    return day === 0 || day === 6;
  };

  const handleSubmit = (values: HolidayFormValues) => {
    onSubmit(values);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{editingHoliday ? 'Edit' : 'Add'} Office Holiday</DialogTitle>
          <DialogDescription>
            Enter the details for this office holiday.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
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
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
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
  );
};
