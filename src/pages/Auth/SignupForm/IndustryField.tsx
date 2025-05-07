
import React from "react";
import { industryOptions } from "../companyHelpers";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface IndustryFieldProps {
  value: string;
  onChange: (v: string) => void;
}

const IndustryField: React.FC<IndustryFieldProps> = ({ value, onChange }) => (
  <div>
    <label htmlFor="companyIndustry" className="block text-white font-medium mb-1">Industry</label>
    <Select value={value || ""} onValueChange={onChange}>
      <SelectTrigger 
        id="companyIndustry" 
        className="w-full rounded-lg bg-white/20 text-white border border-white/30 focus:outline-none focus:border-white/50"
      >
        <SelectValue placeholder="Select industry..." />
      </SelectTrigger>
      <SelectContent className="bg-white/90 backdrop-blur-sm border border-white/30">
        {industryOptions.map(opt => (
          <SelectItem key={opt} value={opt} className="text-gray-800 hover:bg-white/80 focus:bg-white/80">
            {opt}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  </div>
);

export default IndustryField;
