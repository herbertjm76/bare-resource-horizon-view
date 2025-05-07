
import React from "react";
import { FieldErrors, UseFormRegister } from "react-hook-form";
import { CompanyFormData } from "../CompanyRegistrationForm";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

const companySizes = [
  { value: "1-5", label: "1-5" },
  { value: "5-25", label: "5-25" },
  { value: "26-50", label: "26-50" },
  { value: "51-100", label: "51-100" },
];

interface SizeFieldProps {
  register: UseFormRegister<CompanyFormData>;
  errors: FieldErrors<CompanyFormData>;
}

const SizeField: React.FC<SizeFieldProps> = ({ register, errors }) => {
  // This is a bridge implementation that uses register but applies it to our Shadcn Select
  const registerSize = register('size', { required: "Size is required" });
  
  return (
    <div>
      <FormItem>
        <FormLabel className="text-sm font-medium text-gray-200">Company Size</FormLabel>
        <Select
          onValueChange={(value) => {
            registerSize.onChange({
              target: { name: 'size', value }
            });
          }}
          defaultValue=""
        >
          <FormControl>
            <SelectTrigger className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
              <SelectValue placeholder="Select size..." />
            </SelectTrigger>
          </FormControl>
          <SelectContent>
            {companySizes.map(opt => (
              <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.size && (
          <FormMessage>{errors.size.message}</FormMessage>
        )}
      </FormItem>
    </div>
  );
};

export default SizeField;
