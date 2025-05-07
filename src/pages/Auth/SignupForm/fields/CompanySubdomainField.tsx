
import React from "react";
import { Input } from "@/components/ui/input";
import { CompanyFormData } from "../../companyHelpers";

interface CompanySubdomainFieldProps {
  subdomain: string;
  onChange: (field: keyof CompanyFormData, value: string) => void;
  subdomainCheck: { isChecking: boolean; error: string };
}

const CompanySubdomainField: React.FC<CompanySubdomainFieldProps> = ({ 
  subdomain, 
  onChange,
  subdomainCheck 
}) => (
  <div>
    <label htmlFor="companySubdomain" className="block text-white font-medium mb-1">Subdomain</label>
    <div className="flex items-center">
      <Input
        type="text"
        id="companySubdomain"
        value={subdomain}
        onChange={e => onChange('subdomain', e.target.value)}
        className="w-full px-4 py-2 rounded-lg bg-white/20 text-white border border-white/30 focus:outline-none focus:border-white/50"
        required
      />
      <span className="ml-2 text-gray-300">.bareresource.com</span>
    </div>
    {subdomainCheck.isChecking && (
      <p className="text-blue-400 text-sm mt-1">Checking availability...</p>
    )}
    {subdomainCheck.error && (
      <p className="text-red-400 text-sm mt-1">{subdomainCheck.error}</p>
    )}
  </div>
);

export default CompanySubdomainField;
