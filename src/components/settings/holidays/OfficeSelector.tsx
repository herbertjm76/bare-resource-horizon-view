
import React from "react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { useOfficeSettings } from "@/context/officeSettings";

interface OfficeSelectorProps {
  control: any;
}

export const OfficeSelector: React.FC<OfficeSelectorProps> = ({ control }) => {
  const { locations } = useOfficeSettings();

  return (
    <FormField
      control={control}
      name="offices"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Office Locations</FormLabel>
          <div className="space-y-2 max-h-40 overflow-y-auto border rounded-md p-3">
            {locations.map((location) => (
              <div key={location.id} className="flex items-center space-x-2">
                <Checkbox
                  id={location.id}
                  checked={field.value?.includes(location.id)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      field.onChange([...(field.value || []), location.id]);
                    } else {
                      field.onChange(
                        field.value?.filter((id) => id !== location.id) || []
                      );
                    }
                  }}
                />
                <label
                  htmlFor={location.id}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                >
                  {location.emoji} {location.city}, {location.country}
                </label>
              </div>
            ))}
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
