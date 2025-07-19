import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface VideoUploadProps {
  onVideoUploaded: (url: string) => void;
  currentVideoUrl?: string;
}

export const VideoUpload: React.FC<VideoUploadProps> = ({ 
  onVideoUploaded, 
  currentVideoUrl 
}) => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('video/')) {
      toast({
        title: "Invalid file type",
        description: "Please select a video file",
        variant: "destructive"
      });
      return;
    }

    // Validate file size (max 50MB)
    const maxSize = 50 * 1024 * 1024; // 50MB
    if (file.size > maxSize) {
      toast({
        title: "File too large",
        description: "Please select a video file smaller than 50MB",
        variant: "destructive"
      });
      return;
    }

    await uploadVideo(file);
  };

  const uploadVideo = async (file: File) => {
    setUploading(true);
    setUploadProgress(0);

    try {
      const fileName = `logo-${Date.now()}.${file.name.split('.').pop()}`;
      const filePath = `${fileName}`;

      const { data, error } = await supabase.storage
        .from('videos')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) throw error;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('videos')
        .getPublicUrl(filePath);

      onVideoUploaded(publicUrl);
      
      toast({
        title: "Success!",
        description: "Video uploaded successfully",
      });

    } catch (error: any) {
      console.error('Error uploading video:', error);
      toast({
        title: "Upload failed",
        description: error.message || "Failed to upload video",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const removeVideo = () => {
    onVideoUploaded('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Button
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          variant="outline"
          className="flex items-center gap-2"
        >
          <Upload className="w-4 h-4" />
          {uploading ? 'Uploading...' : 'Upload Video Logo'}
        </Button>
        
        {currentVideoUrl && (
          <Button
            onClick={removeVideo}
            variant="destructive"
            size="sm"
            className="flex items-center gap-2"
          >
            <X className="w-4 h-4" />
            Remove
          </Button>
        )}
      </div>

      {uploading && (
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${uploadProgress}%` }}
          />
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="video/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      {currentVideoUrl && (
        <div className="mt-4">
          <p className="text-sm text-gray-600 mb-2">Current video logo:</p>
          <video
            src={currentVideoUrl}
            autoPlay
            loop
            muted
            className="w-32 h-32 object-contain border rounded"
          />
        </div>
      )}
    </div>
  );
};