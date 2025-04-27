
import React, { useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Profile } from './TeamManagement';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm } from 'react-hook-form';

interface MemberDialogProps {
  isOpen: boolean;
  onClose: () => void;
  member: Profile | null;
  onSave: (data: Partial<Profile>) => void;
  title: string;
}

interface MemberFormData {
  first_name: string;
  last_name: string;
  email: string;
  role: "owner" | "admin" | "member"; // Updated to use the literal union type
  department?: string;
  location?: string;
  job_title?: string;
}

const MemberDialog: React.FC<MemberDialogProps> = ({
  isOpen,
  onClose,
  member,
  onSave,
  title
}) => {
  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<MemberFormData>({
    defaultValues: {
      first_name: '',
      last_name: '',
      email: '',
      role: 'member',
      department: '',
      location: '',
      job_title: ''
    }
  });

  useEffect(() => {
    if (member) {
      // Pre-fill form with member data if editing
      setValue('first_name', member.first_name || '');
      setValue('last_name', member.last_name || '');
      setValue('email', member.email);
      setValue('role', member.role);
      setValue('department', member.department || '');
      setValue('location', member.location || '');
      setValue('job_title', member.job_title || '');
    } else {
      // Reset form for new member
      reset({
        first_name: '',
        last_name: '',
        email: '',
        role: 'member',
        department: '',
        location: '',
        job_title: ''
      });
    }
  }, [member, setValue, reset]);

  const onSubmit = (data: MemberFormData) => {
    onSave({
      ...data,
      id: member?.id  // Include the ID if editing an existing member
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) onClose();
    }}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            {member ? 'Edit the details for this team member.' : 'Add a new team member to your organization.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-4 py-4">
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
            <div className="space-y-2">
              <Label htmlFor="role">System Role</Label>
              <Select 
                defaultValue={member?.role || "member"}
                onValueChange={(value: "owner" | "admin" | "member") => setValue('role', value)} // Type cast for onValueChange
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
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {member ? 'Save Changes' : 'Add Member'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default MemberDialog;
