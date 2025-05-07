
import React from "react";
import { industryOptions } from "../companyHelpers";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Control } from "react-hook-form";

interface IndustryFieldProps {
  control?: Control<any>;
  name?: string;
  label?: string;
  description?: string;
  className?: string;
  value?: string;
  onChange?: (value: string) => void;
}

const IndustryField: React.FC<IndustryFieldProps> = ({ 
  control, 
  name = "industry", 
  label = "Industry", 
  description,
  className,
  value,
  onChange
}) => {
  // If control is provided, use FormField component (react-hook-form Controller)
  if (control) {
    return (
      <FormField
        control={control}
        name={name}
        render={({ field }) => (
          <FormItem className={className}>
            <FormLabel>{label}</FormLabel>
            <FormControl>
              <Select onValueChange={field.onChange} defaultValue={field.value || ""}>
                <SelectTrigger>
                  <SelectValue placeholder="Select industry..." />
                </SelectTrigger>
                <SelectContent>
                  {industryOptions.map(opt => (
                    <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormControl>
            {description && <FormDescription>{description}</FormDescription>}
            <FormMessage />
          </FormItem>
        )}
      />
    );
  }

  // If value and onChange are provided, use controlled component
  return (
    <div className={className}>
      <label htmlFor="industry" className="block text-white font-medium mb-1">{label}</label>
      <select
        id="industry"
        value={value || ""}
        onChange={(e) => onChange && onChange(e.target.value)}
        className="w-full px-4 py-2 rounded-lg bg-white/20 text-white border border-white/30 focus:outline-none focus:border-white/50"
        required
      >
        <option value="">Select industry...</option>
        {industryOptions.map(opt => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
      {description && (
        <p className="text-sm text-white/70 mt-1">{description}</p>
      )}
    </div>
  );
};

export default IndustryField;
