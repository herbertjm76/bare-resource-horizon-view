
import React from "react";
import IndustryField from "../IndustryField";
import { CompanyFormData } from "../../companyHelpers";

interface CompanySizeIndustryFieldsProps {
  size: string;
  industry: string;
  onChange: (field: keyof CompanyFormData, value: string) => void;
}

const CompanySizeIndustryFields: React.FC<CompanySizeIndustryFieldsProps> = ({ 
  size, 
  industry, 
  onChange 
}) => (
  <div className="grid grid-cols-2 gap-4">
    <div>
      <label htmlFor="companySize" className="block text-white font-medium mb-1">Size</label>
      <select
        id="companySize"
        value={size}
        onChange={e => onChange('size', e.target.value)}
        className="w-full px-4 py-2 rounded-lg bg-white/20 text-white border border-white/30 focus:outline-none focus:border-white/50"
        required
      >
        <option value="">Select size...</option>
        <option value="1-5">1-5</option>
        <option value="5-25">5-25</option>
        <option value="26-50">26-50</option>
        <option value="51-100">51-100</option>
      </select>
    </div>
    <IndustryField value={industry || ""} onChange={v => onChange('industry', v)} />
  </div>
);

export default CompanySizeIndustryFields;
