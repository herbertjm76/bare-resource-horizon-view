import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, X, Calendar } from 'lucide-react';
import { useQuery, useMutation } from '@tanstack/react-query';
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
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    event_date: ''
  });

  const { data: entries = [], refetch } = useQuery({
    queryKey: ['timeline-entries', cardType.id, weekStartDate],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('weekly_timeline_entries')
        .select('*')
        .eq('card_type_id', cardType.id)
        .eq('week_start_date', weekStartDate)
        .neq('title', '__TEXT_CONTENT__')
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
          company_id: company.id
        });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('Date added');
      setFormData({ title: '', event_date: '' });
      setIsDialogOpen(false);
      refetch();
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to add date');
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
      toast.success('Date removed');
      refetch();
    }
  });

  return (
    <Card className="h-full flex flex-col min-h-[140px] max-h-[140px] shadow-sm border border-border bg-card flex-1 min-w-[180px] relative overflow-hidden">
      <span className="absolute -right-2 -bottom-2 text-[80px] text-muted-foreground/5 pointer-events-none leading-none">
        {cardType.icon || '📅'}
      </span>
      
      <CardHeader className="flex-shrink-0 pb-1 h-[40px] flex items-start pt-3">
        <CardTitle className="flex items-center justify-between w-full text-xs font-semibold text-foreground uppercase tracking-wide">
          <span>{cardType.label}</span>
          <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-4">
            {entries.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto scrollbar-grey relative z-10">
        <div className="space-y-1">
          {entries.map((entry) => (
            <div 
              key={entry.id} 
              className="flex items-center justify-between gap-2 py-1 px-2 rounded bg-muted/50 group"
            >
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-[10px] font-medium text-primary whitespace-nowrap">
                  {format(parseISO(entry.event_date), 'MMM d')}
                </span>
                <span className="text-xs text-foreground truncate">{entry.title}</span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-4 w-4 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
                onClick={() => removeEntry.mutate(entry.id)}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ))}
          
          {/* Add Button */}
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="sm" className="w-full h-6 text-xs mt-1">
                <Plus className="h-3 w-3 mr-1" /> Add Date
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Date to {cardType.label}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label>Title *</Label>
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g., Team Meeting"
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
                <Button 
                  onClick={() => addEntry.mutate()} 
                  className="w-full"
                  disabled={!formData.title || !formData.event_date}
                >
                  Add Date
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardContent>
    </Card>
  );
};
