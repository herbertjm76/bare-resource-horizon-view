
import React from "react";
import IndustryField from "../IndustryField";
import { CompanyFormData } from "../../companyHelpers";

interface CompanySizeIndustryFieldsProps {
  size: string;
  industry: string;
  onChange: (field: keyof CompanyFormData, value: string) => void;
  sizeError?: string;
  industryError?: string;
}

const CompanySizeIndustryFields: React.FC<CompanySizeIndustryFieldsProps> = ({ 
  size, 
  industry, 
  onChange,
  sizeError,
  industryError
}) => (
  <div className="grid grid-cols-2 gap-4">
    <div>
      <label htmlFor="companySize" className="block text-white font-medium mb-1">Company Size</label>
      <select
        id="companySize"
        value={size}
        onChange={e => onChange('size', e.target.value)}
        className={`w-full px-4 py-2 rounded-lg bg-white/20 text-white border ${sizeError ? 'border-red-400' : 'border-white/30'} focus:outline-none focus:border-white/50`}
        required
      >
        <option value="">Select size...</option>
        <option value="1-5">1-5 employees</option>
        <option value="5-25">5-25 employees</option>
        <option value="26-50">26-50 employees</option>
        <option value="51-100">51-100 employees</option>
        <option value="101-250">101-250 employees</option>
        <option value="250+">250+ employees</option>
      </select>
      {sizeError && <p className="text-red-400 text-xs mt-1">{sizeError}</p>}
    </div>
    <IndustryField 
      value={industry || ""} 
      onChange={v => onChange('industry', v)} 
      error={industryError}
    />
  </div>
);

export default CompanySizeIndustryFields;
