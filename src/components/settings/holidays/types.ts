
import { z } from "zod";

export type Holiday = {
  id: string;
  name: string;
  date: Date;
  offices: string[];
  company_id?: string;
  location_id?: string;
  is_recurring: boolean;
};

export const holidayFormSchema = z.object({
  name: z.string().min(1, "Description is required"),
  date: z.date({ required_error: "Start date is required" }),
  offices: z.array(z.string()).min(1, "Select at least one office."),
});

export type HolidayFormValues = z.infer<typeof holidayFormSchema>;
