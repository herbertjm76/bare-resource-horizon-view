
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
  watch: UseFormWatch<CompanyFormData>;
  setValue: (field: keyof CompanyFormData, value: string) => void;
  errors: any;
  subdomainCheck: { isChecking: boolean; error: string };
}

const CompanyInfoFields: React.FC<CompanyInfoFieldsProps> = ({
  company,
  handleCompanyChange,
  watch,
  setValue,
  errors,
  subdomainCheck
}) => (
  <div className="space-y-2">
    <h3 className="text-lg font-bold text-white mb-2">Company Information</h3>
    <div className="space-y-4 bg-white/10 rounded-xl px-6 py-4 glass">
      <div>
        <label htmlFor="companyName" className="block text-white font-medium mb-1">Name</label>
        <Input
          type="text"
          id="companyName"
          value={company.name}
          onChange={e => handleCompanyChange('name', e.target.value)}
          className="w-full px-4 py-2 rounded-lg bg-white/20 text-white border border-white/30 focus:outline-none focus:border-white/50"
          required
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
      <div>
        <label htmlFor="website" className="block text-white font-medium mb-1">
          Website <span className="text-xs text-white/50">(optional)</span>
        </label>
        <Input
          id="website"
          type="url"
          value={company.website || ''}
          onChange={e => handleCompanyChange('website', e.target.value)}
          className="w-full px-4 py-2 rounded-lg bg-white/20 text-white border border-white/30 focus:outline-none focus:border-white/50"
          placeholder="https://yourcompany.com"
        />
      </div>
      <div>
        <label htmlFor="companyAddress" className="block text-white font-medium mb-1">Address</label>
        <AddressAutocomplete
          value={company.address}
          country={company.country}
          onChange={(address) => handleCompanyChange('address', address)}
          onSelectSuggestion={(address, city) => {
            handleCompanyChange('address', address);
            if (city) handleCompanyChange('city', city);
          }}
          placeholder="Enter company address"
          disabled={false}
          className="w-full rounded-lg bg-white/20 border border-white/30 text-white"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="companyCity" className="block text-white font-medium mb-1">City</label>
          <Input
            type="text"
            id="companyCity"
            value={company.city}
            onChange={e => handleCompanyChange('city', e.target.value)}
            className="w-full px-4 py-2 rounded-lg bg-white/20 text-white border border-white/30 focus:outline-none focus:border-white/50"
            required
          />
        </div>
        <div>
          <CountryField
            watch={watch}
            setValue={(field, value) => {
              setValue(field as any, value);
              handleCompanyChange(field as keyof typeof company, value);
            }}
            errors={errors}
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="companySize" className="block text-white font-medium mb-1">Size</label>
          <select
            id="companySize"
            value={company.size}
            onChange={e => handleCompanyChange('size', e.target.value)}
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
        <IndustryField value={company.industry || ""} onChange={v => handleCompanyChange('industry', v)} />
      </div>
    </div>
  </div>
);

export default CompanyInfoFields;
