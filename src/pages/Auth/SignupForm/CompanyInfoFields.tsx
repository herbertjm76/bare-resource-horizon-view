
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
  <div className="space-y-4">
    <div>
      <label htmlFor="companyName" className="block text-white/90 font-medium mb-2 text-sm">Company Name</label>
      <Input
        type="text"
        id="companyName"
        value={company.name}
        onChange={e => handleCompanyChange('name', e.target.value)}
        className="w-full px-4 py-3 rounded-xl bg-white/10 text-white border border-white/20 focus:outline-none focus:border-white/40 focus:bg-white/15 transition-all placeholder:text-white/40"
        required
        placeholder="Your Company"
      />
    </div>
    <div>
      <label className="block text-white/90 font-medium mb-2 text-sm">Company URL</label>
      <div className="space-y-2">
        <div className="w-full px-4 py-3 rounded-xl bg-white/5 text-white/70 border border-white/10">
          bareresource.com/<span className="font-medium text-white">{company.subdomain || 'yourcompany-0000'}</span>
        </div>
        <p className="text-white/50 text-xs">
          Auto-generated from your company name for security
        </p>
      </div>
      {subdomainCheck.isChecking && (
        <p className="text-blue-300 text-xs mt-2 flex items-center gap-1">
          <span className="animate-spin">⏳</span> Checking availability...
        </p>
      )}
      {subdomainCheck.error && (
        <p className="text-red-300 text-xs mt-2">{subdomainCheck.error}</p>
      )}
    </div>
  </div>
);

export default CompanyInfoFields;
