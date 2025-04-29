
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { UseFormRegister } from 'react-hook-form';
import { MemberFormData } from './types';

interface OrganizationFieldsProps {
  register: UseFormRegister<MemberFormData>;
}

const OrganizationFields: React.FC<OrganizationFieldsProps> = ({ register }) => {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="department">Department</Label>
        <Input 
          id="department"
          placeholder="Department"
          {...register('department')}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="job_title">Job Title</Label>
        <Input 
          id="job_title"
          placeholder="Job title"
          {...register('job_title')}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="location">Location</Label>
        <Input 
          id="location"
          placeholder="Location"
          {...register('location')}
        />
      </div>
    </>
  );
};

export default OrganizationFields;
