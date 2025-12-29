import React, { useState, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Plus, X, FileText, Loader2, ExternalLink } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useCompany } from '@/context/CompanyContext';
import { toast } from 'sonner';

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
  const [previewPdf, setPreviewPdf] = useState<{ url: string; name: string } | null>(null);

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

  const firstPdf = files[0];

  return (
    <>
      <Card className="h-full flex flex-col min-h-[140px] max-h-[140px] shadow-sm border border-border bg-card flex-1 min-w-[180px] relative overflow-hidden">
        {/* If there's a PDF, show it as full card with icon */}
        {firstPdf ? (
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-primary/5">
            {/* PDF icon background */}
            <FileText className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-16 w-16 text-primary/20" />
            
            {/* Overlay with label and count */}
            <div className="absolute inset-0 flex flex-col">
              <div className="flex items-center justify-between p-2">
                <span className="text-xs font-semibold text-foreground uppercase tracking-wide">{cardType.label}</span>
                <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-4">
                  {files.length}
                </Badge>
              </div>
              
              {/* PDF filename - centered */}
              <div className="flex-1 flex items-center justify-center px-3">
                <p className="text-sm font-medium text-foreground text-center truncate max-w-full">
                  {firstPdf.file_name}
                </p>
              </div>
              
              {/* Action buttons */}
              <div className="flex items-center justify-end gap-1 p-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="application/pdf"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <Button
                  variant="outline"
                  size="icon"
                  className="h-7 w-7"
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
                  variant="outline"
                  size="icon"
                  className="h-7 w-7 hover:bg-destructive hover:text-destructive-foreground hover:border-destructive"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteMutation.mutate(firstPdf.id);
                  }}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </div>
        ) : (
          // Empty state - no PDFs yet
          <div className="flex flex-col items-center justify-center h-full p-4">
            <FileText className="h-8 w-8 text-muted-foreground/30 mb-2" />
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">{cardType.label}</span>
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

      {/* PDF Preview Dialog */}
      <Dialog open={!!previewPdf} onOpenChange={() => setPreviewPdf(null)}>
        <DialogContent className="max-w-4xl h-[85vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span className="truncate pr-4">{previewPdf?.name}</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(previewPdf?.url, '_blank')}
              >
                <ExternalLink className="h-4 w-4 mr-1" />
                Open
              </Button>
            </DialogTitle>
          </DialogHeader>
          {previewPdf && (
            <iframe 
              src={previewPdf.url}
              className="w-full flex-1 rounded-lg border"
              title={previewPdf.name}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};