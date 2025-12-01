
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Camera, Upload, X } from 'lucide-react';
import { toast } from 'sonner';

interface AvatarUploadFieldProps {
  currentAvatarUrl?: string;
  onImageChange: (file: File | null, previewUrl: string | null) => void;
  memberName?: string;
}

export const AvatarUploadField: React.FC<AvatarUploadFieldProps> = ({
  currentAvatarUrl,
  onImageChange,
  memberName = 'Member'
}) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentAvatarUrl || null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getUserInitials = () => {
    const names = memberName.split(' ');
    return names.map(name => name.charAt(0)).join('').toUpperCase().slice(0, 2);
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select a valid image file');
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('Image size must be less than 10MB');
      return;
    }

    // Create preview URL
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    setSelectedFile(file);
    onImageChange(file, url);
  };

  const handleRemoveImage = () => {
    if (previewUrl && previewUrl !== currentAvatarUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(currentAvatarUrl || null);
    setSelectedFile(null);
    onImageChange(null, null);
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-700">
        Profile Picture
      </label>
      
      <div className="flex items-center gap-4">
        {/* Avatar Display - Clickable */}
        <button
          type="button"
          onClick={triggerFileInput}
          className="relative group cursor-pointer"
        >
          <Avatar className="h-20 w-20 border-2 border-gray-200 transition-all duration-200 group-hover:border-primary">
            <AvatarImage src={previewUrl || undefined} />
            <AvatarFallback className="bg-gradient-modern text-white text-lg font-semibold">
              {getUserInitials()}
            </AvatarFallback>
          </Avatar>
          
          {/* Camera overlay - always visible on hover */}
          <div className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <Camera className="h-6 w-6 text-white" />
          </div>
        </button>

        {/* Upload Controls */}
        <div className="flex flex-col gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={triggerFileInput}
            className="flex items-center gap-2"
          >
            <Upload className="h-4 w-4" />
            Upload Photo
          </Button>
          
          {(selectedFile || previewUrl) && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleRemoveImage}
              className="flex items-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <X className="h-4 w-4" />
              Remove
            </Button>
          )}
          
          <p className="text-xs text-gray-500">
            JPG, PNG up to 10MB
          </p>
        </div>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />
      
      {selectedFile && (
        <p className="text-sm text-green-600">
          New image selected: {selectedFile.name}
        </p>
      )}
    </div>
  );
};
