
import React from "react";
import { Input } from "@/components/ui/input";
import { CompanyFormData } from "../../companyHelpers";

interface CompanyNameFieldProps {
  name: string;
  onChange: (field: keyof CompanyFormData, value: string) => void;
  error?: string;
}

const CompanyNameField: React.FC<CompanyNameFieldProps> = ({ 
  name, 
  onChange,
  error 
}) => (
  <div>
    <label htmlFor="companyName" className="block text-white font-medium mb-1">Company Name</label>
    <Input
      type="text"
      id="companyName"
      value={name}
      onChange={e => onChange('name', e.target.value)}
      className={`w-full px-4 py-2 rounded-lg bg-white/20 text-white border ${error ? 'border-red-400' : 'border-white/30'} focus:outline-none focus:border-white/50`}
      required
      placeholder="Your Company"
    />
    {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
  </div>
);

export default CompanyNameField;
