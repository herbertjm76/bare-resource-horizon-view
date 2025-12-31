
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Camera, Upload } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { ImageCropDialog } from '@/components/dashboard/memberDialog/ImageCropDialog';
import { logger } from '@/utils/logger';

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
  const [imageToCrop, setImageToCrop] = useState<string | null>(null);
  const [isCropDialogOpen, setIsCropDialogOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Please select a valid image file (JPEG, PNG, WebP, or GIF)');
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('File size must be less than 10MB');
      return;
    }

    // Create preview URL and open crop dialog
    const url = URL.createObjectURL(file);
    setImageToCrop(url);
    setIsCropDialogOpen(true);
  };

  const handleCropComplete = async (croppedBlob: Blob) => {
    // Convert blob to file
    const croppedFile = new File([croppedBlob], 'avatar.jpg', { type: 'image/jpeg' });
    await uploadAvatar(croppedFile);
    
    // Clean up the original image URL
    if (imageToCrop) {
      URL.revokeObjectURL(imageToCrop);
    }
    setImageToCrop(null);
  };

  const handleCropCancel = () => {
    if (imageToCrop) {
      URL.revokeObjectURL(imageToCrop);
    }
    setImageToCrop(null);
    setIsCropDialogOpen(false);
    
    // Clear the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const uploadAvatar = async (file: File) => {
    try {
      setUploading(true);
      logger.debug('Starting avatar upload for user:', userId);

      // Create a unique file name with timestamp to avoid caching issues
      const fileExt = file.name.split('.').pop();
      const timestamp = Date.now();
      const fileName = `${userId}/avatar-${timestamp}.${fileExt}`;

      logger.debug('Uploading file to path:', fileName);

      // Delete existing avatar if it exists
      if (currentAvatarUrl) {
        try {
          // Extract the file path from the current URL
          const urlParts = currentAvatarUrl.split('/');
          const bucketIndex = urlParts.findIndex(part => part === 'avatars');
          if (bucketIndex !== -1 && bucketIndex < urlParts.length - 1) {
            const filePath = urlParts.slice(bucketIndex + 1).join('/');
            logger.debug('Attempting to remove old avatar:', filePath);
            
            const { error: deleteError } = await supabase.storage
              .from('avatars')
              .remove([filePath]);
            
            if (deleteError) {
              console.warn('Could not delete old avatar:', deleteError);
              // Don't throw error, just warn as this shouldn't block the upload
            }
          }
        } catch (deleteError) {
          console.warn('Error trying to delete old avatar:', deleteError);
          // Continue with upload even if deletion fails
        }
      }

      // Upload the new file
      const { error: uploadError, data } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (uploadError) {
        console.error('Upload error:', uploadError);
        throw new Error(`Upload failed: ${uploadError.message}`);
      }

      logger.debug('Upload successful:', data);

      // Get the public URL
      const { data: urlData } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      const newAvatarUrl = urlData.publicUrl;
      logger.debug('New avatar URL:', newAvatarUrl);

      // Update the profile in the database
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: newAvatarUrl })
        .eq('id', userId);

      if (updateError) {
        console.error('Database update error:', updateError);
        throw new Error(`Failed to update profile: ${updateError.message}`);
      }

      logger.debug('Profile updated successfully');
      setPreviewUrl(newAvatarUrl);
      onAvatarUpdate(newAvatarUrl);
      toast.success('Avatar updated successfully!');

    } catch (error) {
      console.error('Error uploading avatar:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      toast.error(`Failed to upload avatar: ${errorMessage}`);
    } finally {
      setUploading(false);
      // Clear the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleClick = () => {
    if (!uploading) {
      fileInputRef.current?.click();
    }
  };

  return (
    <div 
      className="relative inline-block cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
    >
      <Avatar className="h-24 w-24 rounded-lg">
        <AvatarImage 
          src={previewUrl || undefined} 
          alt="Profile picture" 
          className="rounded-lg object-cover"
          onError={() => {
            console.warn('Failed to load avatar image:', previewUrl);
            setPreviewUrl(null);
          }}
        />
        <AvatarFallback className="bg-gradient-modern text-white text-lg rounded-lg">
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
        accept="image/jpeg,image/png,image/webp,image/gif"
        onChange={handleFileSelect}
        className="hidden"
        disabled={uploading}
      />

      {/* Crop Dialog */}
      {imageToCrop && (
        <ImageCropDialog
          isOpen={isCropDialogOpen}
          imageSrc={imageToCrop}
          onClose={handleCropCancel}
          onCropComplete={handleCropComplete}
        />
      )}
    </div>
  );
};
