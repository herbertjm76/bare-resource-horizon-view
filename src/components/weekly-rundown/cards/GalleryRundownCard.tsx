import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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

  return (
    <>
      <Card className="h-full flex flex-col min-h-[140px] max-h-[140px] shadow-sm border border-border bg-card flex-1 min-w-[180px] relative overflow-hidden">
        <span className="absolute -right-2 -bottom-2 text-[80px] text-muted-foreground/5 pointer-events-none leading-none">
          {cardType.icon || '🖼️'}
        </span>
        
        <CardHeader className="flex-shrink-0 pb-2 h-[44px] flex items-start pt-4">
          <CardTitle className="flex items-center justify-between w-full text-xs font-semibold text-foreground uppercase tracking-wide">
            <span>{cardType.label}</span>
            <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-4">
              {files.length}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4 flex-1 overflow-y-auto scrollbar-grey relative z-10">
          <div className="flex flex-wrap gap-2">
            {files.slice(0, 4).map((file) => (
              <div 
                key={file.id} 
                className="relative w-10 h-10 rounded overflow-hidden cursor-pointer hover:ring-2 hover:ring-primary transition-all"
                onClick={() => setPreviewImage(file.file_url)}
              >
                <img 
                  src={file.file_url} 
                  alt={file.file_name}
                  className="w-full h-full object-cover"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteMutation.mutate(file.id);
                  }}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ))}
            {files.length > 4 && (
              <div className="w-10 h-10 rounded bg-muted flex items-center justify-center text-xs font-medium">
                +{files.length - 4}
              </div>
            )}
            
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
              className="h-10 w-10 rounded flex items-center justify-center"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
            >
              {isUploading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Plus className="h-4 w-4" />
              )}
            </Button>
          </div>
        </CardContent>
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