
import React, { useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useForm } from 'react-hook-form';
import { Profile, PendingMember, TeamMember } from './types';
import MemberForm from './memberDialog/MemberForm';
import { MemberFormData } from './memberDialog/types';
import { OfficeSettingsProvider } from '@/context/OfficeSettingsContext';
import { logger } from '@/utils/logger';

interface MemberDialogProps {
  isOpen: boolean;
  onClose: () => void;
  member: TeamMember | null;
  onSave: (data: Partial<Profile | PendingMember> & { avatarFile?: File | null }) => Promise<boolean>;
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
      location: 'Unassigned',
      job_title: '',
      weekly_capacity: undefined // null = use company default
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
      logger.debug('Populating form with member data:', member, 'isPending:', memberIsPending);
      
      // Pre-fill form with member data if editing
      // weekly_capacity: null/undefined = use company default, number = exception
      reset({
        first_name: member.first_name || '',
        last_name: member.last_name || '',
        email: member.email,
        role: 'member', // Default role for form, actual role managed in user_roles table
        department: member.department || '',
        location: member.location || 'Unassigned',
        job_title: member.job_title || '',
        weekly_capacity: member.weekly_capacity ?? undefined
      });
    } else {
      // Reset form for new member - leave capacity empty to use company default
      reset({
        first_name: '',
        last_name: '',
        email: '',
        role: 'member',
        department: '',
        location: 'Unassigned',
        job_title: '',
        weekly_capacity: undefined
      });
    }
  }, [member, reset]);

  const handleFormSubmit = async (data: MemberFormData & { avatarFile?: File | null; avatarPreviewUrl?: string | null }) => {
    const isPending = isPendingMember(member);
    
    // Create a consistent data structure for both profile and pending member
    const formData: Partial<Profile | PendingMember> & { avatarFile?: File | null } = {
      ...data,
      id: member?.id,
      avatarFile: data.avatarFile
    };
    
    // Remove avatar-related fields from the main data object as they're handled separately
    delete (formData as any).avatarPreviewUrl;
    
    // If editing a pending member, ensure the proper flags are set
    if (isPending) {
      logger.debug('Submitting form for a pending member, preserving isPending flag');
      (formData as Partial<PendingMember>).isPending = true;
      (formData as Partial<PendingMember>).invitation_type = 'pre_registered';
    } else {
      logger.debug('Submitting form for an active member or new member');
    }
    
    const success = await onSave(formData);
    return success;
  };

  const getCurrentAvatarUrl = () => {
    return member?.avatar_url || undefined;
  };

  const getMemberName = () => {
    if (!member) return undefined;
    return `${member.first_name || ''} ${member.last_name || ''}`.trim() || 'Team Member';
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) onClose();
    }}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            {member 
              ? 'Update the team member\'s information using the form below.'
              : 'Add a new team member to your organization using the form below.'}
          </DialogDescription>
        </DialogHeader>
        <OfficeSettingsProvider>
          <MemberForm
            form={form}
            onClose={onClose}
            isEditing={!!member}
            isLoading={isLoading}
            onSubmit={handleFormSubmit}
            currentAvatarUrl={getCurrentAvatarUrl()}
            memberName={getMemberName()}
          />
        </OfficeSettingsProvider>
      </DialogContent>
    </Dialog>
  );
};

export default MemberDialog;
