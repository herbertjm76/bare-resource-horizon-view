
import React, { useState } from 'react';
import { Building2, Upload } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { ImageCropDialog } from '@/components/dashboard/memberDialog/ImageCropDialog';

interface CompanyLogoSectionProps {
  company: any;
  onLogoUpdate: () => void;
}

export const CompanyLogoSection: React.FC<CompanyLogoSectionProps> = ({
  company,
  onLogoUpdate
}) => {
  const [uploading, setUploading] = useState(false);
  const [imageToCrop, setImageToCrop] = useState<string | null>(null);
  const [isCropDialogOpen, setIsCropDialogOpen] = useState(false);

  const handleLogoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !company?.id) {
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
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
    if (!company?.id) return;
    
    setUploading(true);

    try {
      // Create a unique filename
      const fileName = `${company.id}/logo.jpg`;

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('company-logos')
        .upload(fileName, croppedBlob, {
          cacheControl: '3600',
          upsert: true
        });

      if (uploadError) {
        console.error('Upload error:', uploadError);
        toast.error('Failed to upload logo');
        return;
      }

      // Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from('company-logos')
        .getPublicUrl(fileName);

      // Update company logo URL in database
      const { error: updateError } = await supabase
        .from('companies')
        .update({ logo_url: publicUrl })
        .eq('id', company.id);

      if (updateError) {
        console.error('Update error:', updateError);
        toast.error('Failed to update logo');
        return;
      }

      // Refresh company data to show new logo
      await onLogoUpdate();
      toast.success('Logo updated successfully');

    } catch (error) {
      console.error('Logo upload error:', error);
      toast.error('Failed to upload logo');
    } finally {
      setUploading(false);
    }
    
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
  };

  return (
    <div className="w-20 h-20 border-2 border-dashed border-white/40 rounded-lg flex items-center justify-center bg-white/10 relative group">
      {company?.logo_url ? (
        <img 
          src={company.logo_url} 
          alt="Office Logo" 
          className="w-full h-full object-contain rounded-lg"
        />
      ) : (
        <Building2 className="h-10 w-10 text-white/60" />
      )}
      
      {/* Upload overlay */}
      <div className="absolute inset-0 bg-black/50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
        {uploading ? (
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
        ) : (
          <Upload className="h-5 w-5 text-white" />
        )}
      </div>
      
      <input
        type="file"
        accept="image/*"
        onChange={handleLogoUpload}
        disabled={uploading}
        className="absolute inset-0 opacity-0 cursor-pointer disabled:cursor-not-allowed"
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
