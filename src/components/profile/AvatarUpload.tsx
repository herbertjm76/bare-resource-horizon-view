
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Camera, Upload } from 'lucide-react';
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
  const [isHovered, setIsHovered] = useState(false);
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

  return (
    <div 
      className="relative inline-block cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => fileInputRef.current?.click()}
    >
      <Avatar className="h-24 w-24 rounded-lg">
        <AvatarImage src={previewUrl || undefined} alt="Profile picture" className="rounded-lg" />
        <AvatarFallback className="text-lg bg-brand-primary text-white rounded-lg">
          {userInitials}
        </AvatarFallback>
      </Avatar>
      
      {/* Hover overlay */}
      {(isHovered || uploading) && (
        <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg flex items-center justify-center transition-opacity">
          <div className="text-white text-center">
            {uploading ? (
              <>
                <Upload className="h-5 w-5 animate-spin mx-auto mb-1" />
                <span className="text-xs">Uploading...</span>
              </>
            ) : (
              <>
                <Camera className="h-5 w-5 mx-auto mb-1" />
                <span className="text-xs">Edit Photo</span>
              </>
            )}
          </div>
        </div>
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
