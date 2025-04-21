
import React from "react";
import AddressAutocomplete from "@/components/ui/AddressAutocomplete";
import { FieldErrors, UseFormSetValue, UseFormWatch } from "react-hook-form";
import { CompanyFormData } from "../CompanyRegistrationForm";

interface AddressFieldProps {
  watch: UseFormWatch<CompanyFormData>;
  setValue: UseFormSetValue<CompanyFormData>;
  errors: FieldErrors<CompanyFormData>;
  handleAddressSuggestion: (address: string, city: string) => void;
}

const AddressField: React.FC<AddressFieldProps> = ({
  watch,
  setValue,
  errors,
  handleAddressSuggestion,
}) => {
  const selectedCountry = watch("country");
  const addressValue = watch("address");

  return (
    <div>
      <label htmlFor="address" className="block text-sm font-medium text-gray-200">
        Company Address
      </label>
      <AddressAutocomplete
        value={addressValue || ""}
        country={selectedCountry || ""}
        onChange={addr => setValue("address", addr)}
        disabled={!selectedCountry}
        placeholder={selectedCountry ? "Type address..." : "Select country above first"}
        onSelectSuggestion={handleAddressSuggestion}
      />
      {errors.address && (
        <p className="text-red-500 text-sm mt-1">{errors.address.message}</p>
      )}
    </div>
  );
};

export default AddressField;
