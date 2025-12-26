
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { UseFormRegister, Controller, Control } from 'react-hook-form';
import { MemberFormData } from './types';
import { useOfficeSettings } from '@/context/officeSettings';
import { useOfficeRates, getRateForReference } from '@/hooks/useOfficeRates';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';

interface OrganizationFieldsProps {
  register: UseFormRegister<MemberFormData>;
  control: Control<MemberFormData>;
}

const OrganizationFields: React.FC<OrganizationFieldsProps> = ({ register, control }) => {
  const { locations, departments, roles, loading } = useOfficeSettings();
  const { data: rates = [] } = useOfficeRates();

  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="office_role_id">Office Role</Label>
        <Controller
          name="office_role_id"
          control={control}
          render={({ field }) => (
            <Select
              disabled={loading}
              value={field.value || ''}
              onValueChange={field.onChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select office role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="not_assigned">Not Assigned</SelectItem>
                {roles.map((role) => {
                  const rate = getRateForReference(rates, role.id, 'role');
                  return (
                    <SelectItem key={role.id} value={role.id}>
                      <span className="flex items-center justify-between w-full gap-3">
                        <span>{role.name}</span>
                        {rate > 0 && (
                          <span className="text-xs text-muted-foreground">${rate}/hr</span>
                        )}
                      </span>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          )}
        />
        <p className="text-xs text-muted-foreground">Used for rate lookup in resource planning</p>
      </div>
      <div className="space-y-2">
        <Label htmlFor="department">Department</Label>
        <Controller
          name="department"
          control={control}
          render={({ field }) => (
            <Select
              disabled={loading}
              value={field.value}
              onValueChange={field.onChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="not_assigned">Not Assigned</SelectItem>
                {departments.map((department) => (
                  <SelectItem key={department.id} value={department.name}>
                    {department.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="job_title">Job Title</Label>
        <Input 
          id="job_title"
          type="text"
          placeholder="Enter job title"
          {...register('job_title')}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="location">Location</Label>
        <Controller
          name="location"
          control={control}
          render={({ field }) => (
            <Select
              disabled={loading}
              value={field.value}
              onValueChange={field.onChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Unassigned">Unassigned</SelectItem>
                {locations.map((location) => (
                  <SelectItem key={location.id} value={location.code}>
                    {location.emoji} {location.city}, {location.country}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="weekly_capacity">Weekly Capacity (hours)</Label>
        <Input 
          id="weekly_capacity"
          type="number"
          min="1"
          max="168"
          placeholder="40"
          {...register('weekly_capacity', { 
            valueAsNumber: true,
            validate: value => !value || value > 0 || "Capacity must be greater than 0"
          })}
        />
      </div>
    </>
  );
};

export default OrganizationFields;
