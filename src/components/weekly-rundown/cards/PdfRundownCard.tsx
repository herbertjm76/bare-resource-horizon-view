import React, { useState, useRef, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Plus, FileText, Loader2, ExternalLink, ChevronLeft, ChevronRight, Trash2 } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useCompany } from '@/context/CompanyContext';
import { toast } from 'sonner';
import { PdfThumbnail } from './PdfThumbnail';

interface PdfRundownCardProps {
  cardType: {
    id: string;
    label: string;
    icon?: string;
  };
  weekStartDate: string;
}

export const PdfRundownCard: React.FC<PdfRundownCardProps> = ({
  cardType,
  weekStartDate
}) => {
  const { company } = useCompany();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isManageOpen, setIsManageOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

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

  // Reset index when files change
  useEffect(() => {
    if (currentIndex >= files.length) {
      setCurrentIndex(Math.max(0, files.length - 1));
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
      toast.success('PDF deleted');
    },
    onError: () => {
      toast.error('Failed to delete PDF');
    }
  });

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !company?.id) return;

    if (file.type !== 'application/pdf') {
      toast.error('Please select a PDF file');
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

      toast.success('PDF uploaded');
      refetch();
    } catch (error: any) {
      toast.error(error.message || 'Failed to upload PDF');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const currentPdf = files[currentIndex];

  const goToPrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === 0 ? files.length - 1 : prev - 1));
  };

  const goToNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === files.length - 1 ? 0 : prev + 1));
  };

  return (
    <>
      <Card 
        className="h-full flex flex-col min-h-[140px] max-h-[140px] shadow-sm border border-border bg-card flex-1 min-w-[180px] relative overflow-hidden cursor-pointer group"
        onClick={() => setIsManageOpen(true)}
      >
        {currentPdf ? (
          // Render first page via PDF.js -> consistent cross-browser preview
          <div className="absolute inset-0 bg-muted">
            <PdfThumbnail url={currentPdf.file_url} className="absolute inset-0" />

            {/* Overlay gradient for readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-background/40 pointer-events-none" />

            {/* Label at top */}
            <div className="absolute top-0 left-0 right-0 flex items-center justify-between p-2 pointer-events-none">
              <span className="text-xs font-semibold text-foreground uppercase tracking-wide">
                {cardType.label}
              </span>
              <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-4">
                {files.length}
              </Badge>
            </div>

            {/* Navigation arrows */}
            {files.length > 1 && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute left-1 top-1/2 -translate-y-1/2 h-6 w-6 bg-background/60 hover:bg-background/80 text-foreground opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={goToPrev}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6 bg-background/60 hover:bg-background/80 text-foreground opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={goToNext}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </>
            )}

            {/* Dots indicator */}
            {files.length > 1 && (
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 pointer-events-none">
                {files.map((_, idx) => (
                  <div
                    key={idx}
                    className={`w-1.5 h-1.5 rounded-full transition-colors ${
                      idx === currentIndex ? 'bg-foreground' : 'bg-foreground/40'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        ) : (
          // Empty state
          <div className="flex flex-col items-center justify-center h-full p-4">
            <FileText className="h-8 w-8 text-muted-foreground/30 mb-2" />
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
              {cardType.label}
            </span>
            <input
              ref={fileInputRef}
              type="file"
              accept="application/pdf"
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
              Add PDF
            </Button>
          </div>
        )}
      </Card>

      {/* Manage PDFs Dialog */}
      <Dialog open={isManageOpen} onOpenChange={setIsManageOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>Manage {cardType.label}</span>
              <div className="flex items-center gap-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="application/pdf"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                >
                  {isUploading ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-1" />
                  ) : (
                    <Plus className="h-4 w-4 mr-1" />
                  )}
                  Add PDF
                </Button>
              </div>
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-3 max-h-[60vh] overflow-y-auto">
            {files.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No PDFs uploaded yet</p>
            ) : (
              files.map((file) => (
                <div 
                  key={file.id} 
                  className="flex items-center gap-3 p-3 border rounded-lg hover:bg-muted/50"
                >
                  <FileText className="h-8 w-8 text-primary flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{file.file_name}</p>
                    <p className="text-xs text-muted-foreground">
                      {file.file_size ? `${(file.file_size / 1024).toFixed(1)} KB` : 'Unknown size'}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(file.file_url, '_blank')}
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="hover:bg-destructive hover:text-destructive-foreground hover:border-destructive"
                      onClick={() => deleteMutation.mutate(file.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};