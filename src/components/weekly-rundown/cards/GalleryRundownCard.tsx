import React, { useState, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Plus, X, Image as ImageIcon, Loader2 } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useCompany } from '@/context/CompanyContext';
import { toast } from 'sonner';

interface GalleryRundownCardProps {
  cardType: {
    id: string;
    label: string;
    icon?: string;
  };
  weekStartDate: string;
}

export const GalleryRundownCard: React.FC<GalleryRundownCardProps> = ({
  cardType,
  weekStartDate
}) => {
  const { company } = useCompany();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const { data: files = [], refetch } = useQuery({
    queryKey: ['custom-card-files', cardType.id, weekStartDate],
    queryFn: async () => {
      if (!company?.id) return [];
      const { data, error } = await supabase
        .from('weekly_custom_card_files')
        .select('*')
        .eq('card_type_id', cardType.id)
        .eq('week_start_date', weekStartDate)
        .eq('company_id', company.id)
        .order('created_at', { ascending: true });
      if (error) throw error;
      return data || [];
    },
    enabled: !!company?.id
  });

  const deleteMutation = useMutation({
    mutationFn: async (fileId: string) => {
      const file = files.find(f => f.id === fileId);
      if (file) {
        // Delete from storage
        const path = file.file_url.split('/').pop();
        if (path) {
          await supabase.storage.from('custom-card-uploads').remove([`${company?.id}/${cardType.id}/${path}`]);
        }
      }
      // Delete from database
      const { error } = await supabase
        .from('weekly_custom_card_files')
        .delete()
        .eq('id', fileId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['custom-card-files', cardType.id, weekStartDate] });
      toast.success('Image deleted');
    },
    onError: () => {
      toast.error('Failed to delete image');
    }
  });

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !company?.id) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    setIsUploading(true);
    try {
      const fileName = `${Date.now()}-${file.name}`;
      const filePath = `${company.id}/${cardType.id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('custom-card-uploads')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('custom-card-uploads')
        .getPublicUrl(filePath);

      const { error: dbError } = await supabase
        .from('weekly_custom_card_files')
        .insert({
          company_id: company.id,
          card_type_id: cardType.id,
          week_start_date: weekStartDate,
          file_url: publicUrl,
          file_name: file.name,
          file_type: file.type,
          file_size: file.size
        });

      if (dbError) throw dbError;

      toast.success('Image uploaded');
      refetch();
    } catch (error: any) {
      toast.error(error.message || 'Failed to upload image');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const firstImage = files[0];

  return (
    <>
      <Card className="h-full flex flex-col min-h-[140px] max-h-[140px] shadow-sm border border-border bg-card flex-1 min-w-[180px] relative overflow-hidden">
        {/* If there's an image, show it full card */}
        {firstImage ? (
          <div className="absolute inset-0">
            <img 
              src={firstImage.file_url} 
              alt={firstImage.file_name}
              className="w-full h-full object-cover"
            />
            {/* Overlay with label and count */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30">
              <div className="absolute top-2 left-2 right-2 flex items-center justify-between">
                <span className="text-xs font-semibold text-white uppercase tracking-wide drop-shadow-md">{cardType.label}</span>
                <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-4 bg-white/20 text-white border-0">
                  {files.length}
                </Badge>
              </div>
              {/* Action buttons */}
              <div className="absolute bottom-2 right-2 flex gap-1">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <Button
                  variant="secondary"
                  size="icon"
                  className="h-7 w-7 bg-white/20 hover:bg-white/40 text-white border-0"
                  onClick={(e) => {
                    e.stopPropagation();
                    fileInputRef.current?.click();
                  }}
                  disabled={isUploading}
                >
                  {isUploading ? (
                    <Loader2 className="h-3 w-3 animate-spin" />
                  ) : (
                    <Plus className="h-3 w-3" />
                  )}
                </Button>
                <Button
                  variant="secondary"
                  size="icon"
                  className="h-7 w-7 bg-white/20 hover:bg-destructive text-white border-0"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteMutation.mutate(firstImage.id);
                  }}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </div>
        ) : (
          // Empty state - no images yet
          <div className="flex flex-col items-center justify-center h-full p-4">
            <ImageIcon className="h-8 w-8 text-muted-foreground/30 mb-2" />
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">{cardType.label}</span>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
            <Button
              variant="outline"
              size="sm"
              className="h-7 text-xs"
              onClick={(e) => {
                e.stopPropagation();
                fileInputRef.current?.click();
              }}
              disabled={isUploading}
            >
              {isUploading ? (
                <Loader2 className="h-3 w-3 animate-spin mr-1" />
              ) : (
                <Plus className="h-3 w-3 mr-1" />
              )}
              Add Image
            </Button>
          </div>
        )}
      </Card>

      {/* Image Preview Dialog */}
      <Dialog open={!!previewImage} onOpenChange={() => setPreviewImage(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{cardType.label}</DialogTitle>
          </DialogHeader>
          {previewImage && (
            <img 
              src={previewImage} 
              alt="Preview"
              className="w-full h-auto max-h-[70vh] object-contain rounded-lg"
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};