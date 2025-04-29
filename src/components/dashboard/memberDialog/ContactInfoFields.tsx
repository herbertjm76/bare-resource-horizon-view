
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { MemberFormData } from './types';

interface ContactInfoFieldsProps {
  register: UseFormRegister<MemberFormData>;
  errors: FieldErrors<MemberFormData>;
}

const ContactInfoFields: React.FC<ContactInfoFieldsProps> = ({ register, errors }) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="email">Email</Label>
      <Input 
        id="email"
        type="email"
        placeholder="Email address"
        {...register('email', { 
          required: "Email is required",
          pattern: {
            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
            message: "Invalid email address"
          }
        })}
      />
      {errors.email && (
        <p className="text-sm text-red-500">{errors.email.message}</p>
      )}
    </div>
  );
};

export default ContactInfoFields;
