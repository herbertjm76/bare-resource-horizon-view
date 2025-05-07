
import React from "react";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Control } from "react-hook-form";
import { UseFormRegister } from "react-hook-form";

const companySizes = [
  { value: "1-5", label: "1-5" },
  { value: "5-25", label: "5-25" },
  { value: "26-50", label: "26-50" },
  { value: "51-100", label: "51-100" },
  { value: "101-500", label: "101-500" },
  { value: "500+", label: "500+" },
];

interface SizeFieldProps {
  control?: Control<any>;
  register?: UseFormRegister<any>;
  errors?: any;
  name?: string;
  label?: string;
  className?: string;
}

const SizeField: React.FC<SizeFieldProps> = ({ 
  control, 
  register,
  errors,
  name = "size", 
  label = "Company Size",
  className 
}) => {
  // If control is provided, use FormField (for react-hook-form's Controller)
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
                  <SelectValue placeholder="Select size..." />
                </SelectTrigger>
                <SelectContent>
                  {companySizes.map(opt => (
                    <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    );
  }

  // If register is provided, use a regular select with register (for non-Controller use)
  return (
    <div className={className}>
      <label htmlFor={name} className="block text-sm font-medium mb-1">{label}</label>
      <select
        id={name}
        {...(register && register(name))}
        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">Select size...</option>
        {companySizes.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      {errors && errors[name] && (
        <p className="text-sm text-red-500 mt-1">{errors[name].message}</p>
      )}
    </div>
  );
};

export default SizeField;
