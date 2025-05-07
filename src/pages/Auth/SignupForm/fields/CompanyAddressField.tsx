
import React from "react";
import { CompanyFormData } from "../../companyHelpers";
import AddressAutocomplete from "@/components/ui/AddressAutocomplete";

interface CompanyAddressFieldProps {
  address: string;
  country: string;
  onChange: (field: keyof CompanyFormData, value: string) => void;
  onSelectSuggestion: (address: string, city: string) => void;
}

const CompanyAddressField: React.FC<CompanyAddressFieldProps> = ({ 
  address, 
  country, 
  onChange, 
  onSelectSuggestion 
}) => (
  <div>
    <label htmlFor="companyAddress" className="block text-white font-medium mb-1">Address</label>
    <AddressAutocomplete
      value={address}
      country={country}
      onChange={(address) => onChange('address', address)}
      onSelectSuggestion={(address, city) => onSelectSuggestion(address, city)}
      placeholder="Enter company address"
      disabled={false}
      className="w-full rounded-lg bg-white/20 border border-white/30 text-white"
    />
  </div>
);

export default CompanyAddressField;
