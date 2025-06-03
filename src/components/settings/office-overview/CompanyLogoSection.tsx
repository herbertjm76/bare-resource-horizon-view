
import React, { useState } from 'react';
import { Building2, Upload } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface CompanyLogoSectionProps {
  company: any;
  onLogoUpdate: () => void;
}

export const CompanyLogoSection: React.FC<CompanyLogoSectionProps> = ({
  company,
  onLogoUpdate
}) => {
  const [uploading, setUploading] = useState(false);

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

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB');
      return;
    }

    setUploading(true);

    try {
      // Create a unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${company.id}/logo.${fileExt}`;

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('company-logos')
        .upload(fileName, file, {
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
    </div>
  );
};
