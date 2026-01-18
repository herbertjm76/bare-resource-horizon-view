
import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Database } from '@/integrations/supabase/types';
import { UseFormSetValue } from 'react-hook-form';
import { MemberFormData } from './types';

type AppRole = Database['public']['Enums']['app_role'];

interface RoleSelectFieldProps {
  defaultValue?: string;
  setValue: UseFormSetValue<MemberFormData>;
}

const RoleSelectField: React.FC<RoleSelectFieldProps> = ({ defaultValue = 'member', setValue }) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="role">System Role</Label>
      <Select 
        defaultValue={defaultValue}
        onValueChange={(value: AppRole) => setValue('role', value as any)}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select role" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="member">Member</SelectItem>
          <SelectItem value="project_manager">PM (Project Manager)</SelectItem>
          <SelectItem value="admin">Admin</SelectItem>
          <SelectItem value="owner">Super Admin</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default RoleSelectField;
