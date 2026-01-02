import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Plus, X } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useCompany } from '@/context/CompanyContext';
import { toast } from 'sonner';
import { GalleryRundownCard } from './GalleryRundownCard';
import { PdfRundownCard } from './PdfRundownCard';
import { TimelineRundownCard } from './TimelineRundownCard';
import { SurveyRundownCard } from './SurveyRundownCard';
import { TextRundownCard } from './TextRundownCard';

interface CustomRundownCardProps {
  cardType: {
    id: string;
    label: string;
    icon?: string;
    color?: string;
    display_type?: 'list' | 'gallery' | 'pdf' | 'dates' | 'timeline' | 'survey' | 'text';
    survey_type?: 'multiple_choice' | 'poll' | 'rating';
  };
  weekStartDate: string;
}

export const CustomRundownCard: React.FC<CustomRundownCardProps> = ({
  cardType,
  weekStartDate
}) => {
  // Switch between card types based on display_type
  if (cardType.display_type === 'gallery') {
    return <GalleryRundownCard cardType={cardType} weekStartDate={weekStartDate} />;
  }
  
  if (cardType.display_type === 'pdf') {
    return <PdfRundownCard cardType={cardType} weekStartDate={weekStartDate} />;
  }

  if (cardType.display_type === 'dates' || cardType.display_type === 'timeline') {
    return <TimelineRundownCard cardType={cardType} weekStartDate={weekStartDate} />;
  }

  if (cardType.display_type === 'survey') {
    return <SurveyRundownCard cardType={cardType} weekStartDate={weekStartDate} />;
  }

  if (cardType.display_type === 'text') {
    return <TextRundownCard cardType={cardType} weekStartDate={weekStartDate} />;
  }

  // Default: List card (original behavior)
  return <ListRundownCard cardType={cardType} weekStartDate={weekStartDate} />;
};

// List card component - manual bullet point entries
const ListRundownCard: React.FC<CustomRundownCardProps> = ({
  cardType,
  weekStartDate
}) => {
  const { company } = useCompany();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newItem, setNewItem] = useState('');

  // Use timeline entries table with a marker to store list items
  const { data: entries = [], refetch } = useQuery({
    queryKey: ['list-entries', cardType.id, weekStartDate],
    queryFn: async () => {
      if (!company?.id) return [];
      const { data, error } = await supabase
        .from('weekly_timeline_entries')
        .select('*')
        .eq('card_type_id', cardType.id)
        .eq('week_start_date', weekStartDate)
        .eq('title', '__LIST_ITEM__')
        .order('created_at', { ascending: true });
      if (error) throw error;
      return data || [];
    },
    enabled: !!company?.id
  });

  const addItem = async () => {
    if (!newItem.trim() || !company?.id) return;
    
    try {
      const { error } = await supabase
        .from('weekly_timeline_entries')
        .insert({
          card_type_id: cardType.id,
          week_start_date: weekStartDate,
          title: '__LIST_ITEM__',
          event_date: weekStartDate,
          description: newItem.trim(),
          company_id: company.id
        });
      if (error) throw error;
      
      toast.success('Item added');
      setNewItem('');
      setIsDialogOpen(false);
      refetch();
    } catch (error: any) {
      toast.error(error.message || 'Failed to add item');
    }
  };

  const removeItem = async (entryId: string) => {
    try {
      const { error } = await supabase
        .from('weekly_timeline_entries')
        .delete()
        .eq('id', entryId);
      if (error) throw error;
      
      toast.success('Item removed');
      refetch();
    } catch (error: any) {
      toast.error(error.message || 'Failed to remove item');
    }
  };

  return (
    <Card className="h-full flex flex-col min-h-[120px] max-h-[25vh] shadow-sm border border-border bg-card flex-1 min-w-[180px] relative overflow-hidden">
      <span className="absolute -right-2 -bottom-2 text-[80px] text-muted-foreground/5 pointer-events-none leading-none">
        {cardType.icon || '📋'}
      </span>
      
      <CardHeader className="flex-shrink-0 pb-1 h-[40px] flex items-start pt-3">
        <CardTitle className="flex items-center justify-between w-full text-xs font-semibold text-foreground uppercase tracking-wide">
          <span>{cardType.label}</span>
          <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-4">
            {entries.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto scrollbar-grey relative z-10 pb-6">
        <ul className="space-y-1">
          {entries.map((entry) => (
            <li 
              key={entry.id} 
              className="flex items-start gap-2 group"
            >
              <span className="text-primary mt-0.5 text-sm">•</span>
              <span className="flex-1 text-sm leading-relaxed text-foreground">{entry.description}</span>
              <Button
                variant="ghost"
                size="icon"
                className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
                onClick={() => removeItem(entry.id)}
              >
                <X className="h-3 w-3" />
              </Button>
            </li>
          ))}
        </ul>
      </CardContent>
      
      {/* Small plus button in lower right */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="absolute bottom-1 right-1 h-5 w-5 rounded-full bg-muted/50 hover:bg-muted z-20"
          >
            <Plus className="h-2.5 w-2.5" />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Item to {cardType.label}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <Textarea
              value={newItem}
              onChange={(e) => setNewItem(e.target.value)}
              placeholder="Enter your item..."
              rows={3}
            />
            <Button 
              onClick={addItem} 
              className="w-full"
              disabled={!newItem.trim()}
            >
              Add Item
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
};
