import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Trash2, ArrowUp, ArrowDown, List, Image, FileText, Calendar, BarChart3 } from 'lucide-react';
import { useCustomCardTypes } from '@/hooks/useCustomCards';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useCompany } from '@/context/CompanyContext';
import { toast } from 'sonner';

interface ManageCustomCardsDialogProps {
  iconOnly?: boolean;
}

type DisplayType = 'list' | 'gallery' | 'pdf' | 'timeline' | 'survey';
type SurveyType = 'multiple_choice' | 'poll' | 'rating';

export const ManageCustomCardsDialog: React.FC<ManageCustomCardsDialogProps> = ({ iconOnly = false }) => {
  const { company } = useCompany();
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    label: '',
    icon: '',
    display_type: 'list' as DisplayType,
    survey_type: 'poll' as SurveyType
  });

  const { data: customCardTypes = [] } = useCustomCardTypes();

  const createMutation = useMutation({
    mutationFn: async () => {
      if (!company?.id) throw new Error('No company ID');
      const { data, error } = await supabase
        .from('weekly_custom_card_types')
        .insert({
          company_id: company.id,
          label: formData.label,
          icon: formData.icon || null,
          display_type: formData.display_type,
          survey_type: formData.display_type === 'survey' ? formData.survey_type : null,
          order_index: customCardTypes.length
        })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['custom-card-types'] });
      toast.success('Card type created');
      setFormData({ label: '', icon: '', display_type: 'list', survey_type: 'poll' });
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to create card type');
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (cardTypeId: string) => {
      const { error } = await supabase
        .from('weekly_custom_card_types')
        .delete()
        .eq('id', cardTypeId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['custom-card-types'] });
      toast.success('Card type deleted');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete card type');
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.label.trim()) {
      toast.error('Please enter a label');
      return;
    }
    createMutation.mutate();
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        {iconOnly ? (
          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all">
            <Plus className="h-4 w-4" />
          </Button>
        ) : (
          <Button variant="outline" size="sm" className="h-9">
            <Plus className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Custom Card</span>
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Manage Custom Cards</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Create new card type */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="label">Label *</Label>
              <Input
                id="label"
                value={formData.label}
                onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                placeholder="e.g., WFH This Week"
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Card Type</Label>
              <div className="grid grid-cols-5 gap-2">
                <Button
                  type="button"
                  variant={formData.display_type === 'list' ? 'default' : 'outline'}
                  className="flex flex-col items-center gap-1 h-auto py-3"
                  onClick={() => setFormData({ ...formData, display_type: 'list' })}
                >
                  <List className="h-5 w-5" />
                  <span className="text-xs">List</span>
                </Button>
                <Button
                  type="button"
                  variant={formData.display_type === 'gallery' ? 'default' : 'outline'}
                  className="flex flex-col items-center gap-1 h-auto py-3"
                  onClick={() => setFormData({ ...formData, display_type: 'gallery' })}
                >
                  <Image className="h-5 w-5" />
                  <span className="text-xs">Gallery</span>
                </Button>
                <Button
                  type="button"
                  variant={formData.display_type === 'pdf' ? 'default' : 'outline'}
                  className="flex flex-col items-center gap-1 h-auto py-3"
                  onClick={() => setFormData({ ...formData, display_type: 'pdf' })}
                >
                  <FileText className="h-5 w-5" />
                  <span className="text-xs">PDF</span>
                </Button>
                <Button
                  type="button"
                  variant={formData.display_type === 'timeline' ? 'default' : 'outline'}
                  className="flex flex-col items-center gap-1 h-auto py-3"
                  onClick={() => setFormData({ ...formData, display_type: 'timeline' })}
                >
                  <Calendar className="h-5 w-5" />
                  <span className="text-xs">Timeline</span>
                </Button>
                <Button
                  type="button"
                  variant={formData.display_type === 'survey' ? 'default' : 'outline'}
                  className="flex flex-col items-center gap-1 h-auto py-3"
                  onClick={() => setFormData({ ...formData, display_type: 'survey' })}
                >
                  <BarChart3 className="h-5 w-5" />
                  <span className="text-xs">Survey</span>
                </Button>
              </div>
            </div>
            
            {/* Survey Type Selection */}
            {formData.display_type === 'survey' && (
              <div className="space-y-2">
                <Label>Survey Type</Label>
                <Select 
                  value={formData.survey_type} 
                  onValueChange={(v: SurveyType) => setFormData({ ...formData, survey_type: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="multiple_choice">Multiple Choice (single answer)</SelectItem>
                    <SelectItem value="poll">Poll (with live results)</SelectItem>
                    <SelectItem value="rating">Rating Scale (1-5 stars)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
            <Button type="submit" disabled={createMutation.isPending}>
              {createMutation.isPending ? 'Creating...' : 'Create Card'}
            </Button>
          </form>

          {/* Existing card types - only show if there are cards */}
          {customCardTypes.length > 0 && (
            <div className="space-y-2 pt-4 border-t">
              <h3 className="font-semibold text-sm text-muted-foreground">Your Cards</h3>
              <div className="space-y-2">
                {customCardTypes.map((cardType) => (
                  <div
                    key={cardType.id}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded border flex items-center justify-center text-sm">
                        {cardType.icon || '📋'}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-medium">{cardType.label}</span>
                        <span className="text-xs text-muted-foreground capitalize">
                          {(cardType as any).display_type || 'list'}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={async () => {
                          const idx = customCardTypes.findIndex(c => c.id === cardType.id);
                          if (idx <= 0) return;
                          const prev = customCardTypes[idx - 1];
                          
                          // Swap order indices
                          const currentOrder = cardType.order_index;
                          const prevOrder = prev.order_index;
                          
                          await supabase.from('weekly_custom_card_types').update({ order_index: prevOrder }).eq('id', cardType.id);
                          await supabase.from('weekly_custom_card_types').update({ order_index: currentOrder }).eq('id', prev.id);
                          
                          queryClient.invalidateQueries({ queryKey: ['custom-card-types'] });
                          toast.success('Card moved up');
                        }}
                        disabled={customCardTypes.findIndex(c => c.id === cardType.id) === 0}
                        title="Move up"
                      >
                        <ArrowUp className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={async () => {
                          const idx = customCardTypes.findIndex(c => c.id === cardType.id);
                          if (idx >= customCardTypes.length - 1) return;
                          const next = customCardTypes[idx + 1];
                          
                          // Swap order indices
                          const currentOrder = cardType.order_index;
                          const nextOrder = next.order_index;
                          
                          await supabase.from('weekly_custom_card_types').update({ order_index: nextOrder }).eq('id', cardType.id);
                          await supabase.from('weekly_custom_card_types').update({ order_index: currentOrder }).eq('id', next.id);
                          
                          queryClient.invalidateQueries({ queryKey: ['custom-card-types'] });
                          toast.success('Card moved down');
                        }}
                        disabled={customCardTypes.findIndex(c => c.id === cardType.id) === customCardTypes.length - 1}
                        title="Move down"
                      >
                        <ArrowDown className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteMutation.mutate(cardType.id)}
                        disabled={deleteMutation.isPending}
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
