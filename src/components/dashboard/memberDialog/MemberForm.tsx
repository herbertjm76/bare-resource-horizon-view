
import React, { useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import PersonalInfoFields from './PersonalInfoFields';
import ContactInfoFields from './ContactInfoFields';
import RoleSelectField from './RoleSelectField';
import OrganizationFields from './OrganizationFields';
import { AvatarUploadField } from './AvatarUploadField';
import { MemberFormData } from './types';

interface MemberFormProps {
  form: UseFormReturn<MemberFormData>;
  onClose: () => void;
  isEditing: boolean;
  isLoading?: boolean;
  onSubmit: (data: MemberFormData & { avatarFile?: File | null; avatarPreviewUrl?: string | null }) => void;
  currentAvatarUrl?: string;
  memberName?: string;
}

const MemberForm: React.FC<MemberFormProps> = ({ 
  form, 
  onClose, 
  isEditing,
  isLoading = false,
  onSubmit,
  currentAvatarUrl,
  memberName
}) => {
  const { register, handleSubmit, setValue, control, formState: { errors }, watch } = form;
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreviewUrl, setAvatarPreviewUrl] = useState<string | null>(null);

  const firstName = watch('first_name');
  const lastName = watch('last_name');
  const displayName = `${firstName || ''} ${lastName || ''}`.trim() || memberName || 'Team Member';

  const handleAvatarChange = (file: File | null, previewUrl: string | null) => {
    setAvatarFile(file);
    setAvatarPreviewUrl(previewUrl);
  };

  const handleFormSubmit = (data: MemberFormData) => {
    onSubmit({
      ...data,
      avatarFile,
      avatarPreviewUrl
    });
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <div className="grid gap-4">
        <AvatarUploadField
          currentAvatarUrl={currentAvatarUrl}
          onImageChange={handleAvatarChange}
          memberName={displayName}
        />
        
        <PersonalInfoFields register={register} errors={errors} />
        <ContactInfoFields register={register} errors={errors} />
        <RoleSelectField 
          defaultValue={form.getValues('role')} 
          setValue={setValue} 
        />
        <OrganizationFields register={register} control={control} />
      </div>
      
      <DialogFooter className="gap-2">
        <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? (
            <>
              <span className="mr-2">Saving...</span>
              <span className="animate-spin">⏳</span>
            </>
          ) : isEditing ? 'Save Changes' : 'Add Member'}
        </Button>
      </DialogFooter>
    </form>
  );
};

export default MemberForm;
