
import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Database } from '@/integrations/supabase/types';
import { UseFormSetValue } from 'react-hook-form';
import { MemberFormData } from './types';

type UserRole = Database['public']['Enums']['user_role'];

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
        onValueChange={(value: UserRole) => setValue('role', value)}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select role" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="member">Member</SelectItem>
          <SelectItem value="admin">Admin</SelectItem>
          <SelectItem value="owner">Owner</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default RoleSelectField;
