import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Trash2 } from 'lucide-react';
import { useCustomCardTypes } from '@/hooks/useCustomCards';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useCompany } from '@/context/CompanyContext';
import { toast } from 'sonner';

export const ManageCustomCardsDialog: React.FC = () => {
  const { company } = useCompany();
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    label: '',
    icon: '',
    color: '#e0e7ff'
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
          color: formData.color,
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
      setFormData({ label: '', icon: '', color: '#e0e7ff' });
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
        <Button variant="outline" size="sm" className="h-9">
          <Plus className="h-4 w-4 mr-2" />
          <span className="hidden sm:inline">Custom Card</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Manage Custom Cards</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Create new card type */}
          <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded-lg">
            <h3 className="font-semibold">Create New Card Type</h3>
            <div className="grid grid-cols-3 gap-4">
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
                <Label htmlFor="icon">Icon (emoji)</Label>
                <Input
                  id="icon"
                  value={formData.icon}
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                  placeholder="e.g., 🏠"
                  maxLength={2}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="color">Color</Label>
                <Input
                  id="color"
                  type="color"
                  value={formData.color}
                  onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                  className="h-10"
                />
              </div>
            </div>
            <Button type="submit" disabled={createMutation.isPending}>
              {createMutation.isPending ? 'Creating...' : 'Create Card Type'}
            </Button>
          </form>

          {/* Existing card types */}
          <div className="space-y-2">
            <h3 className="font-semibold">Existing Card Types</h3>
            {customCardTypes.length === 0 ? (
              <p className="text-sm text-muted-foreground">No custom card types yet</p>
            ) : (
              <div className="space-y-2">
                {customCardTypes.map((cardType) => (
                  <div
                    key={cardType.id}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-8 h-8 rounded flex items-center justify-center text-sm"
                        style={{ backgroundColor: cardType.color || '#e0e7ff' }}
                      >
                        {cardType.icon || '📋'}
                      </div>
                      <span className="font-medium">{cardType.label}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteMutation.mutate(cardType.id)}
                      disabled={deleteMutation.isPending}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
