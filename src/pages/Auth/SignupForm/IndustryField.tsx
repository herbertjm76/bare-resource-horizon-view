
import React from "react";
import { industryOptions } from "../companyHelpers";

interface IndustryFieldProps {
  value: string;
  onChange: (v: string) => void;
}

const IndustryField: React.FC<IndustryFieldProps> = ({ value, onChange }) => (
  <div>
    <label htmlFor="companyIndustry" className="block text-white font-medium mb-1">Industry</label>
    <select
      id="companyIndustry"
      value={value || ""}
      onChange={e => onChange(e.target.value)}
      className="w-full px-4 py-2 rounded-lg bg-white/20 text-white border border-white/30 focus:outline-none focus:border-white/50"
      required
    >
      <option value="">Select industry...</option>
      {industryOptions.map(opt => (
        <option key={opt} value={opt}>{opt}</option>
      ))}
    </select>
  </div>
);

export default IndustryField;
