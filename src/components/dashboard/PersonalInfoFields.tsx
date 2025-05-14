
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FormField } from '@/components/ui/form';
import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { MemberFormData } from './memberDialog/types';

interface PersonalInfoFieldsProps {
  register: UseFormRegister<MemberFormData>;
  errors: FieldErrors<MemberFormData>;
}

const PersonalInfoFields: React.FC<PersonalInfoFieldsProps> = ({ register, errors }) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="first_name">First Name</Label>
        <Input 
          id="first_name"
          placeholder="First name"
          {...register('first_name', { required: "First name is required" })}
        />
        {errors.first_name && (
          <p className="text-sm text-red-500">{errors.first_name.message}</p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="last_name">Last Name</Label>
        <Input 
          id="last_name"
          placeholder="Last name"
          {...register('last_name', { required: "Last name is required" })}
        />
        {errors.last_name && (
          <p className="text-sm text-red-500">{errors.last_name.message}</p>
        )}
      </div>
    </div>
  );
};

export default PersonalInfoFields;
