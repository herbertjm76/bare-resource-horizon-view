
import React, { useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useForm } from 'react-hook-form';
import { Profile, PendingMember, TeamMember } from './types';
import MemberForm from './memberDialog/MemberForm';
import { MemberFormData } from './memberDialog/types';

interface MemberDialogProps {
  isOpen: boolean;
  onClose: () => void;
  member: TeamMember | null;
  onSave: (data: Partial<Profile | PendingMember>) => void;
  title: string;
  isLoading?: boolean;
}

const MemberDialog: React.FC<MemberDialogProps> = ({
  isOpen,
  onClose,
  member,
  onSave,
  title,
  isLoading = false
}) => {
  const form = useForm<MemberFormData>({
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

  const { reset } = form;

  // Helper function to determine if a member is pending
  const isPendingMember = (member: TeamMember | null): boolean => {
    return Boolean(member && 'isPending' in member && member.isPending === true);
  };

  useEffect(() => {
    if (member) {
      const memberIsPending = isPendingMember(member);
      console.log('Populating form with member data:', member, 'isPending:', memberIsPending);
      
      // Pre-fill form with member data if editing
      reset({
        first_name: member.first_name || '',
        last_name: member.last_name || '',
        email: member.email,
        role: (member.role as MemberFormData['role']) || 'member',
        department: member.department || '',
        location: member.location || '',
        job_title: member.job_title || ''
      });
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
  }, [member, reset]);

  const handleFormSubmit = (data: MemberFormData) => {
    const memberIsPending = isPendingMember(member);
    
    const formData: Partial<Profile | PendingMember> = {
      ...data,
      id: member?.id
    };
    
    // If editing a pending member, ensure the proper flags are set
    if (memberIsPending) {
      console.log('Submitting form for a pending member, preserving isPending flag');
      (formData as Partial<PendingMember>).isPending = true;
      (formData as Partial<PendingMember>).invitation_type = 'pre_registered';
    } else {
      console.log('Submitting form for an active member or new member');
    }
    
    onSave(formData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) onClose();
    }}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            {member 
              ? 'Update the team member\'s information using the form below.'
              : 'Add a new team member to your organization using the form below.'}
          </DialogDescription>
        </DialogHeader>
        <MemberForm
          form={form}
          onClose={onClose}
          isEditing={!!member}
          isLoading={isLoading}
          onSubmit={handleFormSubmit}
        />
      </DialogContent>
    </Dialog>
  );
};

export default MemberDialog;
