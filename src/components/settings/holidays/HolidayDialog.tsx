
import React, { useState } from 'react';
import { format } from 'date-fns';
import { CalendarIcon, CalendarRangeIcon } from 'lucide-react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { Holiday, HolidayFormValues, holidayFormSchema } from './types';
import { useOfficeSettings } from '@/context/OfficeSettingsContext';
import { DateRange } from '@/components/ui/date-range-picker';

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
  const [useDateRange, setUseDateRange] = useState<boolean>(false);
  
  const form = useForm<HolidayFormValues>({
    resolver: zodResolver(holidayFormSchema),
    defaultValues: {
      name: editingHoliday?.name || "",
      date: editingHoliday?.date || new Date(),
      end_date: editingHoliday?.end_date || undefined,
      offices: editingHoliday?.offices || [],
    }
  });

  React.useEffect(() => {
    if (editingHoliday) {
      form.reset({
        name: editingHoliday.name,
        date: editingHoliday.date,
        end_date: editingHoliday.end_date,
        offices: editingHoliday.offices
      });
      setUseDateRange(!!editingHoliday.end_date);
    } else if (open) {
      form.reset({
        name: "",
        date: new Date(),
        end_date: undefined,
        offices: []
      });
      setUseDateRange(false);
    }
  }, [editingHoliday, open, form]);

  // Disable weekends
  const disableWeekends = (date: Date) => {
    const day = date.getDay();
    return day === 0 || day === 6;
  };

  const handleSubmit = (values: HolidayFormValues) => {
    // If not using date range, ensure end_date is undefined
    if (!useDateRange) {
      values.end_date = undefined;
    }
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
            
            <div className="flex items-center space-x-2">
              <Switch
                id="use-date-range"
                checked={useDateRange}
                onCheckedChange={setUseDateRange}
              />
              <label htmlFor="use-date-range" className="text-sm font-medium">
                Use date range
              </label>
            </div>

            {!useDateRange ? (
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
            ) : (
              <div className="grid gap-2">
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Start Date</FormLabel>
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
                                <span>Pick start date</span>
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
                  name="end_date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>End Date</FormLabel>
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
                                <span>Pick end date</span>
                              )}
                              <CalendarRangeIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            defaultMonth={form.getValues().date}
                            fromDate={form.getValues().date}
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
            )}
            
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
