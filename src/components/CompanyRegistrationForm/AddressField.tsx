
import React from "react";
import { FieldErrors, UseFormSetValue, UseFormWatch } from "react-hook-form";
import { CompanyFormData } from "../CompanyRegistrationForm";
import AddressAutocomplete from "@/components/ui/AddressAutocomplete";

interface AddressFieldProps {
  watch: UseFormWatch<CompanyFormData>;
  setValue: UseFormSetValue<CompanyFormData>;
  errors: FieldErrors<CompanyFormData>;
}

const AddressField: React.FC<AddressFieldProps> = ({ watch, setValue, errors }) => {
  const addressValue = watch("address");
  const countryValue = watch("country");

  return (
    <div>
      <label htmlFor="address" className="block text-sm font-medium text-gray-200">
        Company Address
      </label>
      <AddressAutocomplete
        value={addressValue || ""}
        country={countryValue || ""}
        onChange={(address) => setValue("address", address)}
        onSelectSuggestion={(address, city) => {
          setValue("address", address);
          setValue("city", city);
        }}
        placeholder="Enter company address"
        className="mt-1"
      />
      {errors.address && (
        <p className="text-red-500 text-sm mt-1">{errors.address.message}</p>
      )}
    </div>
  );
};

export default AddressField;
