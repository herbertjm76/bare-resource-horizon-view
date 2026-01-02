import React, { useState, useRef, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Plus, X, Image as ImageIcon, Loader2, ChevronLeft, ChevronRight, GripVertical } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useCompany } from '@/context/CompanyContext';
import { toast } from 'sonner';
import { useDemoAuth } from '@/hooks/useDemoAuth';
import { DEMO_GALLERY_IMAGES } from '@/data/demoData';

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
  const { isDemoMode } = useDemoAuth();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dialogFileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isManageOpen, setIsManageOpen] = useState(false);
  const [draggedId, setDraggedId] = useState<string | null>(null);

  const { data: files = [], refetch } = useQuery({
    queryKey: ['custom-card-files', cardType.id, weekStartDate, isDemoMode ? 'demo' : company?.id],
    queryFn: async () => {
      // Demo mode: return demo gallery images
      if (isDemoMode) {
        return DEMO_GALLERY_IMAGES;
      }

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
    enabled: isDemoMode || !!company?.id
  });

  // Auto-rotate images every 4 seconds
  useEffect(() => {
    if (files.length <= 1) return;
    
    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % files.length);
    }, 4000);
    
    return () => clearInterval(interval);
  }, [files.length]);

  // Reset index if it's out of bounds
  useEffect(() => {
    if (currentIndex >= files.length && files.length > 0) {
      setCurrentIndex(0);
    }
  }, [files.length, currentIndex]);

  const deleteMutation = useMutation({
    mutationFn: async (fileId: string) => {
      const file = files.find(f => f.id === fileId);
      if (file) {
        const path = file.file_url.split('/').pop();
        if (path) {
          await supabase.storage.from('custom-card-uploads').remove([`${company?.id}/${cardType.id}/${path}`]);
        }
      }
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
      if (fileInputRef.current) fileInputRef.current.value = '';
      if (dialogFileInputRef.current) dialogFileInputRef.current.value = '';
    }
  };

  const goNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex(prev => (prev + 1) % files.length);
  };

  const goPrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex(prev => (prev - 1 + files.length) % files.length);
  };

  const handleCardClick = () => {
    setIsManageOpen(true);
  };

  const currentImage = files[currentIndex];

  return (
    <>
      <Card 
        className="h-full flex flex-col min-h-[140px] max-h-[140px] shadow-sm border border-border bg-card flex-1 min-w-[180px] relative overflow-hidden cursor-pointer"
        onClick={handleCardClick}
      >
        {/* If there's an image, show it full card */}
        {currentImage ? (
          <div className="absolute inset-0">
            <img 
              src={currentImage.file_url} 
              alt={currentImage.file_name}
              className="w-full h-full object-cover transition-opacity duration-500"
              key={currentImage.id}
            />
            {/* Overlay with label and count */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30">
              <div className="absolute top-2 left-2 right-2 flex items-center justify-between">
                <span className="text-xs font-semibold text-white uppercase tracking-wide drop-shadow-md">{cardType.label}</span>
                <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-4 bg-white/20 text-white border-0">
                  {currentIndex + 1}/{files.length}
                </Badge>
              </div>
              
              {/* Navigation arrows - only show if more than 1 image */}
              {files.length > 1 && (
                <>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute left-1 top-1/2 -translate-y-1/2 h-6 w-6 bg-black/30 hover:bg-black/50 text-white"
                    onClick={goPrev}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6 bg-black/30 hover:bg-black/50 text-white"
                    onClick={goNext}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </>
              )}

              {/* Dot indicators */}
              {files.length > 1 && (
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                  {files.map((_, idx) => (
                    <div
                      key={idx}
                      className={`w-1.5 h-1.5 rounded-full transition-all ${
                        idx === currentIndex ? 'bg-white w-3' : 'bg-white/50'
                      }`}
                    />
                  ))}
                </div>
              )}
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

      {/* Manage Images Dialog */}
      <Dialog open={isManageOpen} onOpenChange={setIsManageOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>{cardType.label}</span>
              <input
                ref={dialogFileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => dialogFileInputRef.current?.click()}
                disabled={isUploading}
              >
                {isUploading ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-1" />
                ) : (
                  <Plus className="h-4 w-4 mr-1" />
                )}
                Add Image
              </Button>
            </DialogTitle>
          </DialogHeader>
          
          <div className="flex-1 overflow-y-auto">
            {files.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                <ImageIcon className="h-12 w-12 mb-4 opacity-30" />
                <p>No images yet</p>
                <p className="text-sm">Click "Add Image" to upload</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-1">
                {files.map((file, index) => (
                  <div
                    key={file.id}
                    className="relative group aspect-square rounded-lg overflow-hidden border border-border bg-muted"
                  >
                    <img
                      src={file.file_url}
                      alt={file.file_name}
                      className="w-full h-full object-cover"
                    />
                    {/* Overlay on hover */}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <Button
                        variant="destructive"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => deleteMutation.mutate(file.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    {/* Index badge */}
                    <div className="absolute top-1 left-1 bg-black/60 text-white text-[10px] px-1.5 py-0.5 rounded">
                      {index + 1}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};