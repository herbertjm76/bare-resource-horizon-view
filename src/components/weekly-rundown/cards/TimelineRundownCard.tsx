import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, X, Calendar } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useCompany } from '@/context/CompanyContext';
import { toast } from 'sonner';
import { format, parseISO } from 'date-fns';

interface TimelineRundownCardProps {
  cardType: {
    id: string;
    label: string;
    icon?: string;
  };
  weekStartDate: string;
}

export const TimelineRundownCard: React.FC<TimelineRundownCardProps> = ({
  cardType,
  weekStartDate
}) => {
  const { company } = useCompany();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    event_date: '',
    description: ''
  });

  const { data: entries = [], refetch } = useQuery({
    queryKey: ['timeline-entries', cardType.id, weekStartDate],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('weekly_timeline_entries')
        .select('*')
        .eq('card_type_id', cardType.id)
        .eq('week_start_date', weekStartDate)
        .order('event_date', { ascending: true });
      if (error) throw error;
      return data || [];
    },
    enabled: !!company?.id
  });

  const addEntry = useMutation({
    mutationFn: async () => {
      if (!company?.id) throw new Error('No company');
      const { error } = await supabase
        .from('weekly_timeline_entries')
        .insert({
          card_type_id: cardType.id,
          week_start_date: weekStartDate,
          title: formData.title,
          event_date: formData.event_date,
          description: formData.description || null,
          company_id: company.id
        });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('Event added');
      setFormData({ title: '', event_date: '', description: '' });
      setIsDialogOpen(false);
      refetch();
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to add event');
    }
  });

  const removeEntry = useMutation({
    mutationFn: async (entryId: string) => {
      const { error } = await supabase
        .from('weekly_timeline_entries')
        .delete()
        .eq('id', entryId);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('Event removed');
      refetch();
    }
  });

  return (
    <Card className="h-full flex flex-col min-h-[140px] max-h-[140px] shadow-sm border border-border bg-card flex-1 min-w-[180px] relative overflow-hidden">
      <span className="absolute -right-2 -bottom-2 text-[80px] text-muted-foreground/5 pointer-events-none leading-none">
        {cardType.icon || '📅'}
      </span>
      
      <CardHeader className="flex-shrink-0 pb-2 h-[44px] flex items-start pt-4">
        <CardTitle className="flex items-center justify-between w-full text-xs font-semibold text-foreground uppercase tracking-wide">
          <span>{cardType.label}</span>
          <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-4">
            {entries.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-2 flex-1 overflow-y-auto scrollbar-grey relative z-10">
        <div className="space-y-2">
          {entries.map((entry) => (
            <div 
              key={entry.id} 
              className="flex items-start gap-2 p-2 rounded-lg bg-muted/50 group relative"
            >
              <Button
                variant="ghost"
                size="icon"
                className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-destructive text-destructive-foreground hover:bg-destructive/90 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => removeEntry.mutate(entry.id)}
              >
                <X className="h-3 w-3" />
              </Button>
              <div className="flex flex-col items-center text-center min-w-[40px]">
                <Calendar className="h-3 w-3 text-primary mb-0.5" />
                <span className="text-[10px] font-medium text-muted-foreground">
                  {format(parseISO(entry.event_date), 'MMM d')}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-foreground truncate">{entry.title}</p>
                {entry.description && (
                  <p className="text-[10px] text-muted-foreground truncate">{entry.description}</p>
                )}
              </div>
            </div>
          ))}
          
          {/* Add Button */}
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="sm" className="w-full h-7 text-xs">
                <Plus className="h-3 w-3 mr-1" /> Add Event
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Event to {cardType.label}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label>Title *</Label>
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Event title"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Date *</Label>
                  <Input
                    type="date"
                    value={formData.event_date}
                    onChange={(e) => setFormData({ ...formData, event_date: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Description (optional)</Label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Add details..."
                    rows={2}
                  />
                </div>
                <Button 
                  onClick={() => addEntry.mutate()} 
                  className="w-full"
                  disabled={!formData.title || !formData.event_date}
                >
                  Add Event
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardContent>
    </Card>
  );
};
