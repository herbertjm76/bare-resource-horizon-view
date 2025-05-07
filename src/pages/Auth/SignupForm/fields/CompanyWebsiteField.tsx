
import React from "react";
import { Input } from "@/components/ui/input";
import { CompanyFormData } from "../../companyHelpers";

interface CompanyWebsiteFieldProps {
  website: string | undefined;
  onChange: (field: keyof CompanyFormData, value: string) => void;
}

const CompanyWebsiteField: React.FC<CompanyWebsiteFieldProps> = ({ website, onChange }) => (
  <div>
    <label htmlFor="website" className="block text-white font-medium mb-1">
      Website <span className="text-xs text-white/50">(optional)</span>
    </label>
    <Input
      id="website"
      type="url"
      value={website || ''}
      onChange={e => onChange('website', e.target.value)}
      className="w-full px-4 py-2 rounded-lg bg-white/20 text-white border border-white/30 focus:outline-none focus:border-white/50"
      placeholder="https://yourcompany.com"
    />
  </div>
);

export default CompanyWebsiteField;
