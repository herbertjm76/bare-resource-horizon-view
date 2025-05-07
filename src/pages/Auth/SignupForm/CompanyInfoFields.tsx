
import React from "react";
import { CompanyFormData } from "../companyHelpers";
import { UseFormWatch } from "react-hook-form";
import CompanyNameField from "./fields/CompanyNameField";
import CompanySubdomainField from "./fields/CompanySubdomainField";
import CompanyWebsiteField from "./fields/CompanyWebsiteField";
import CompanyAddressField from "./fields/CompanyAddressField";
import CompanyCityCountryFields from "./fields/CompanyCityCountryFields";
import CompanySizeIndustryFields from "./fields/CompanySizeIndustryFields";

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
}) => {
  const handleAddressSuggestionSelect = (address: string, city: string) => {
    handleCompanyChange('address', address);
    if (city) handleCompanyChange('city', city);
  };

  return (
    <div className="space-y-2">
      <h3 className="text-lg font-bold text-white mb-2">Company Information</h3>
      <div className="space-y-4 bg-white/10 rounded-xl px-6 py-4 glass">
        <CompanyNameField 
          name={company.name} 
          onChange={handleCompanyChange} 
        />
        
        <CompanySubdomainField 
          subdomain={company.subdomain} 
          onChange={handleCompanyChange}
          subdomainCheck={subdomainCheck}
        />
        
        <CompanyWebsiteField 
          website={company.website} 
          onChange={handleCompanyChange} 
        />
        
        <CompanyAddressField 
          address={company.address}
          country={company.country}
          onChange={handleCompanyChange}
          onSelectSuggestion={handleAddressSuggestionSelect}
        />
        
        <CompanyCityCountryFields 
          city={company.city}
          onChange={handleCompanyChange}
          watch={watch}
          setValue={setValue}
          errors={errors}
        />
        
        <CompanySizeIndustryFields 
          size={company.size}
          industry={company.industry}
          onChange={handleCompanyChange}
        />
      </div>
    </div>
  );
};

export default CompanyInfoFields;
