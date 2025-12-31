
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Check, X } from 'lucide-react';

interface EditableProfileSectionProps {
  editedProfile: {
    first_name: string;
    last_name: string;
    job_title: string;
    bio: string;
  };
  saving: boolean;
  onEditChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onSave: () => void;
  onCancel: () => void;
}

export const EditableProfileSection: React.FC<EditableProfileSectionProps> = ({
  editedProfile,
  saving,
  onEditChange,
  onSave,
  onCancel
}) => {
  return (
    <div className="space-y-3">
      <div className="flex gap-3">
        <Input
          name="first_name"
          value={editedProfile.first_name}
          onChange={onEditChange}
          placeholder="First Name"
          className="bg-white/20 border-white/30 text-white placeholder:text-white/70"
        />
        <Input
          name="last_name"
          value={editedProfile.last_name}
          onChange={onEditChange}
          placeholder="Last Name"
          className="bg-white/20 border-white/30 text-white placeholder:text-white/70"
        />
      </div>
      <Input
        name="job_title"
        value={editedProfile.job_title}
        onChange={onEditChange}
        placeholder="Job Title"
        className="bg-white/20 border-white/30 text-white placeholder:text-white/70"
      />
      <Textarea
        name="bio"
        value={editedProfile.bio}
        onChange={onEditChange}
        placeholder="Tell us about yourself..."
        rows={3}
        className="bg-white/20 border-white/30 text-white placeholder:text-white/70 resize-none"
      />
      <div className="flex gap-2">
        <Button
          onClick={onSave}
          disabled={saving}
          size="sm"
          className="bg-white text-brand-primary hover:bg-white/90"
        >
          <Check className="h-4 w-4 mr-1" />
          {saving ? 'Saving...' : 'Save'}
        </Button>
        <Button
          onClick={onCancel}
          size="sm"
          variant="outline"
          className="border-white/30 text-white hover:bg-white/10"
        >
          <X className="h-4 w-4 mr-1" />
          Cancel
        </Button>
      </div>
    </div>
  );
};
