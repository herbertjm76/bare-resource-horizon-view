
import React from "react";
import { Input } from "@/components/ui/input";
import { UseFormRegister } from "react-hook-form";
import { CompanyFormData } from "../CompanyRegistrationForm";

interface WebsiteFieldProps {
  register: UseFormRegister<CompanyFormData>;
}

const WebsiteField: React.FC<WebsiteFieldProps> = ({ register }) => (
  <div>
    <label htmlFor="website" className="block text-sm font-medium text-gray-200">
      Website (optional)
    </label>
    <Input
      id="website"
      type="url"
      placeholder="https://yourcompany.com"
      {...register('website')}
      className="mt-1"
    />
  </div>
);

export default WebsiteField;
