
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Holiday, HolidayFormValues, holidayFormSchema } from "./types";
import { DatePickerField } from "./DatePickerField";
import { OfficeSelector } from "./OfficeSelector";

interface HolidayFormProps {
  onSubmit: (values: HolidayFormValues) => void;
  onCancel: () => void;
  editingHoliday?: Holiday | null;
  loading?: boolean;
}

export const HolidayForm: React.FC<HolidayFormProps> = ({
  onSubmit,
  onCancel,
  editingHoliday,
  loading = false,
}) => {
  const form = useForm<HolidayFormValues>({
    resolver: zodResolver(holidayFormSchema),
    defaultValues: {
      name: "",
      date: new Date(),
      end_date: undefined,
      offices: [],
    },
  });

  React.useEffect(() => {
    if (editingHoliday) {
      form.reset({
        name: editingHoliday.name,
        date: editingHoliday.date,
        end_date: editingHoliday.end_date,
        offices: editingHoliday.offices,
      });
    } else {
      form.reset({
        name: "",
        date: new Date(),
        end_date: undefined,
        offices: [],
      });
    }
  }, [editingHoliday, form]);

  const handleSubmit = (values: HolidayFormValues) => {
    onSubmit(values);
    form.reset();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Holiday Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Christmas Day" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <DatePickerField
          control={form.control}
          name="date"
          label="Start Date"
        />

        <DatePickerField
          control={form.control}
          name="end_date"
          label="End Date (Optional)"
          placeholder="Pick an end date"
        />

        <OfficeSelector control={form.control} />

        <div className="flex justify-end space-x-2">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? "Saving..." : editingHoliday ? "Update" : "Add"} Holiday
          </Button>
        </div>
      </form>
    </Form>
  );
};
