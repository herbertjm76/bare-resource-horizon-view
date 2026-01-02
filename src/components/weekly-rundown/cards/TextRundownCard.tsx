import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Pencil, Save } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useCompany } from '@/context/CompanyContext';
import { toast } from 'sonner';

interface TextRundownCardProps {
  cardType: {
    id: string;
    label: string;
    icon?: string;
  };
  weekStartDate: string;
}

export const TextRundownCard: React.FC<TextRundownCardProps> = ({
  cardType,
  weekStartDate
}) => {
  const { company } = useCompany();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [textContent, setTextContent] = useState('');

  // Fetch text content - we'll use the weekly_timeline_entries table with a special marker
  const { data: entry, refetch } = useQuery({
    queryKey: ['text-entry', cardType.id, weekStartDate],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('weekly_timeline_entries')
        .select('*')
        .eq('card_type_id', cardType.id)
        .eq('week_start_date', weekStartDate)
        .eq('title', '__TEXT_CONTENT__')
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!company?.id
  });

  // When entry loads, set local state
  React.useEffect(() => {
    if (entry?.description) {
      setTextContent(entry.description);
    }
  }, [entry]);

  const saveText = useMutation({
    mutationFn: async () => {
      if (!company?.id) throw new Error('No company');
      
      if (entry) {
        // Update existing
        const { error } = await supabase
          .from('weekly_timeline_entries')
          .update({ description: textContent })
          .eq('id', entry.id);
        if (error) throw error;
      } else {
        // Create new
        const { error } = await supabase
          .from('weekly_timeline_entries')
          .insert({
            card_type_id: cardType.id,
            week_start_date: weekStartDate,
            title: '__TEXT_CONTENT__',
            event_date: weekStartDate,
            description: textContent,
            company_id: company.id
          });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      toast.success('Text saved');
      setIsDialogOpen(false);
      refetch();
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to save text');
    }
  });

  const displayText = entry?.description || '';
  const hasContent = displayText.length > 0;

  return (
    <>
      <Card 
        className="h-full flex flex-col min-h-[120px] max-h-[25vh] shadow-sm border border-border bg-card flex-1 min-w-[180px] relative overflow-hidden cursor-pointer hover:border-primary/50 transition-colors"
        onClick={() => {
          setTextContent(displayText);
          setIsDialogOpen(true);
        }}
      >
        <span className="absolute -right-2 -bottom-2 text-[80px] text-muted-foreground/5 pointer-events-none leading-none">
          {cardType.icon || '📝'}
        </span>
        
        <CardHeader className="flex-shrink-0 pb-1 h-[40px] flex items-start pt-3">
          <CardTitle className="flex items-center justify-between w-full text-xs font-semibold text-foreground uppercase tracking-wide">
            <span>{cardType.label}</span>
            {hasContent && (
              <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-4">
                ✓
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 overflow-y-auto scrollbar-grey relative z-10 pb-6">
          {hasContent ? (
            <p className="text-sm leading-relaxed text-foreground whitespace-pre-wrap line-clamp-4">
              {displayText}
            </p>
          ) : (
            <p className="text-sm text-muted-foreground italic">
              Click to add text...
            </p>
          )}
        </CardContent>
        
        {/* Small plus button in lower right */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute bottom-1 right-1 h-5 w-5 rounded-full bg-muted/50 hover:bg-muted z-20"
          onClick={(e) => {
            e.stopPropagation();
            setTextContent(displayText);
            setIsDialogOpen(true);
          }}
        >
          <Pencil className="h-2.5 w-2.5" />
        </Button>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit {cardType.label}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <Textarea
              value={textContent}
              onChange={(e) => setTextContent(e.target.value)}
              placeholder="Enter your text here..."
              rows={8}
              className="resize-none"
            />
            <Button 
              onClick={() => saveText.mutate()} 
              className="w-full"
              disabled={saveText.isPending}
            >
              <Save className="h-4 w-4 mr-2" />
              {saveText.isPending ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
