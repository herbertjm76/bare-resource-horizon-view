
import React from "react";
import { Input } from "@/components/ui/input";
import { FieldErrors, UseFormSetValue, UseFormWatch } from "react-hook-form";
import { CompanyFormData } from "../CompanyRegistrationForm";

interface AddressFieldProps {
  watch: UseFormWatch<CompanyFormData>;
  setValue: UseFormSetValue<CompanyFormData>;
  errors: FieldErrors<CompanyFormData>;
}

const AddressField: React.FC<AddressFieldProps> = ({ watch, setValue, errors }) => {
  const addressValue = watch("address");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue("address", e.target.value);
  };

  return (
    <div>
      <label htmlFor="address" className="block text-sm font-medium text-gray-200">
        Company Address
      </label>
      <Input
        id="address"
        type="text"
        value={addressValue || ""}
        onChange={handleChange}
        placeholder="Enter address manually"
        className="mt-1"
      />
      {errors.address && (
        <p className="text-red-500 text-sm mt-1">{errors.address.message}</p>
      )}
    </div>
  );
};

export default AddressField;
