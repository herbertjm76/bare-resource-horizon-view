
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import PersonalInfoFields from './PersonalInfoFields';
import ContactInfoFields from './ContactInfoFields';
import RoleSelectField from './RoleSelectField';
import OrganizationFields from './OrganizationFields';
import { MemberFormData } from './types';

interface MemberFormProps {
  form: UseFormReturn<MemberFormData>;
  onClose: () => void;
  isEditing: boolean;
  isLoading?: boolean;
}

const MemberForm: React.FC<MemberFormProps> = ({ 
  form, 
  onClose, 
  isEditing,
  isLoading = false 
}) => {
  const { register, handleSubmit, setValue, formState: { errors } } = form;

  return (
    <form onSubmit={handleSubmit(() => {})} className="space-y-4">
      <div className="grid gap-4">
        <PersonalInfoFields register={register} errors={errors} />
        <ContactInfoFields register={register} errors={errors} />
        <RoleSelectField 
          defaultValue={form.getValues('role')} 
          setValue={setValue} 
        />
        <OrganizationFields register={register} />
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
