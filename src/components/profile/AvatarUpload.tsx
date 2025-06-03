
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Camera, Upload, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface AvatarUploadProps {
  currentAvatarUrl?: string | null;
  userId: string;
  onAvatarUpdate: (url: string | null) => void;
  userInitials: string;
}

export const AvatarUpload: React.FC<AvatarUploadProps> = ({
  currentAvatarUrl,
  userId,
  onAvatarUpdate,
  userInitials
}) => {
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentAvatarUrl);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB');
      return;
    }

    await uploadAvatar(file);
  };

  const uploadAvatar = async (file: File) => {
    try {
      setUploading(true);

      // Create a unique file name
      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}/avatar.${fileExt}`;

      // Delete existing avatar if it exists
      if (currentAvatarUrl) {
        const oldPath = currentAvatarUrl.split('/').pop();
        if (oldPath) {
          await supabase.storage
            .from('avatars')
            .remove([`${userId}/${oldPath}`]);
        }
      }

      // Upload the new file
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (uploadError) {
        throw uploadError;
      }

      // Get the public URL
      const { data } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      const newAvatarUrl = data.publicUrl;

      // Update the profile in the database
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: newAvatarUrl })
        .eq('id', userId);

      if (updateError) {
        throw updateError;
      }

      setPreviewUrl(newAvatarUrl);
      onAvatarUpdate(newAvatarUrl);
      toast.success('Avatar updated successfully');

    } catch (error) {
      console.error('Error uploading avatar:', error);
      toast.error('Failed to upload avatar');
    } finally {
      setUploading(false);
    }
  };

  const removeAvatar = async () => {
    try {
      setUploading(true);

      // Remove from storage if exists
      if (currentAvatarUrl) {
        const path = currentAvatarUrl.split('/').slice(-2).join('/');
        await supabase.storage
          .from('avatars')
          .remove([path]);
      }

      // Update the profile in the database
      const { error } = await supabase
        .from('profiles')
        .update({ avatar_url: null })
        .eq('id', userId);

      if (error) {
        throw error;
      }

      setPreviewUrl(null);
      onAvatarUpdate(null);
      toast.success('Avatar removed successfully');

    } catch (error) {
      console.error('Error removing avatar:', error);
      toast.error('Failed to remove avatar');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="relative inline-block">
      <Avatar className="h-24 w-24 rounded-lg">
        <AvatarImage src={previewUrl || undefined} alt="Profile picture" className="rounded-lg" />
        <AvatarFallback className="text-lg bg-brand-primary text-white rounded-lg">
          {userInitials}
        </AvatarFallback>
      </Avatar>
      
      {/* Edit/Camera overlay button */}
      <button
        onClick={() => fileInputRef.current?.click()}
        disabled={uploading}
        className="absolute bottom-0 right-0 bg-brand-primary hover:bg-brand-primary/80 text-white rounded-full p-2 shadow-lg disabled:opacity-50 transition-colors"
      >
        {uploading ? (
          <Upload className="h-3 w-3 animate-spin" />
        ) : (
          <Camera className="h-3 w-3" />
        )}
      </button>

      {/* Remove button - only show if there's an image */}
      {previewUrl && (
        <button
          onClick={removeAvatar}
          disabled={uploading}
          className="absolute top-0 right-0 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 shadow-lg disabled:opacity-50"
        >
          <X className="h-3 w-3" />
        </button>
      )}

      <Input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  );
};
