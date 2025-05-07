
import React from "react";
import { CompanyFormData } from "../../companyHelpers";
import AddressAutocomplete from "@/components/ui/AddressAutocomplete";

interface CompanyAddressFieldProps {
  address: string;
  country: string;
  onChange: (field: keyof CompanyFormData, value: string) => void;
  onSelectSuggestion: (address: string, city: string) => void;
  error?: string;
}

const CompanyAddressField: React.FC<CompanyAddressFieldProps> = ({ 
  address, 
  country, 
  onChange, 
  onSelectSuggestion,
  error
}) => (
  <div>
    <label htmlFor="companyAddress" className="block text-white font-medium mb-1">Company Address</label>
    <AddressAutocomplete
      value={address}
      country={country}
      onChange={(address) => onChange('address', address)}
      onSelectSuggestion={(address, city) => onSelectSuggestion(address, city)}
      placeholder="Enter company address"
      disabled={false}
      className={`w-full rounded-lg bg-white/20 border ${error ? 'border-red-400' : 'border-white/30'} text-white`}
    />
    {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
  </div>
);

export default CompanyAddressField;
