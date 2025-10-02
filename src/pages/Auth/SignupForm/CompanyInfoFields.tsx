
import React from "react";
import { Input } from "@/components/ui/input";
import { CompanyFormData, industryOptions } from "../companyHelpers";
import AddressAutocomplete from "@/components/ui/AddressAutocomplete";
import CountryField from "@/components/CompanyRegistrationForm/CountryField";
import IndustryField from "./IndustryField";
import { UseFormWatch } from "react-hook-form";

interface CompanyInfoFieldsProps {
  company: CompanyFormData;
  handleCompanyChange: (field: keyof CompanyFormData, value: string) => void;
  subdomainCheck: { isChecking: boolean; error: string };
}

const CompanyInfoFields: React.FC<CompanyInfoFieldsProps> = ({
  company,
  handleCompanyChange,
  subdomainCheck
}) => (
  <div className="space-y-2">
    <h3 className="text-lg font-bold text-white mb-2">Company Information</h3>
    <div className="space-y-4 bg-white/10 rounded-xl px-6 py-4 glass">
      <div>
        <label htmlFor="companyName" className="block text-white font-medium mb-1">Company Name</label>
        <Input
          type="text"
          id="companyName"
          value={company.name}
          onChange={e => handleCompanyChange('name', e.target.value)}
          className="w-full px-4 py-2 rounded-lg bg-white/20 text-white border border-white/30 focus:outline-none focus:border-white/50"
          required
          placeholder="Your Company"
        />
      </div>
      <div>
        <label htmlFor="companySubdomain" className="block text-white font-medium mb-1">Subdomain</label>
        <div className="flex items-center">
          <Input
            type="text"
            id="companySubdomain"
            value={company.subdomain}
            onChange={e => handleCompanyChange('subdomain', e.target.value)}
            className="w-full px-4 py-2 rounded-lg bg-white/20 text-white border border-white/30 focus:outline-none focus:border-white/50"
            required
            placeholder="yourcompany"
          />
          <span className="ml-2 text-gray-300 text-sm whitespace-nowrap">.bareresource.com</span>
        </div>
        {subdomainCheck.isChecking && (
          <p className="text-blue-400 text-sm mt-1">Checking availability...</p>
        )}
        {subdomainCheck.error && (
          <p className="text-red-400 text-sm mt-1">{subdomainCheck.error}</p>
        )}
      </div>
      {/* Optional fields hidden - can be added in profile settings later */}
    </div>
  </div>
);

export default CompanyInfoFields;
