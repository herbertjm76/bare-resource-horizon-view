import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Plus, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { format } from 'date-fns';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useCompany } from '@/context/CompanyContext';

interface WeeklyNote {
  id: string;
  start_date: string;
  end_date?: string;
  description: string;
}

interface NotesCardProps {
  notes: WeeklyNote[];
  weekStartDate: string;
}

export const NotesCard: React.FC<NotesCardProps> = ({ notes, weekStartDate }) => {
  const { company } = useCompany();
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<WeeklyNote | null>(null);
  const [formData, setFormData] = useState({
    start_date: '',
    end_date: '',
    description: ''
  });

  const saveMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      if (!company?.id) throw new Error('No company ID');

      if (editingNote) {
        const { error } = await supabase
          .from('weekly_notes')
          .update({
            start_date: data.start_date,
            end_date: data.end_date || null,
            description: data.description
          })
          .eq('id', editingNote.id);
        
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('weekly_notes')
          .insert({
            company_id: company.id,
            week_start_date: weekStartDate,
            start_date: data.start_date,
            end_date: data.end_date || null,
            description: data.description
          });
        
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['weekly-notes'] });
      toast.success(editingNote ? 'Note updated' : 'Note added');
      setDialogOpen(false);
      resetForm();
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to save note');
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('weekly_notes')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['weekly-notes'] });
      toast.success('Note deleted');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete note');
    }
  });

  const resetForm = () => {
    setFormData({ start_date: '', end_date: '', description: '' });
    setEditingNote(null);
  };

  const handleEdit = (note: WeeklyNote) => {
    setEditingNote(note);
    setFormData({
      start_date: note.start_date,
      end_date: note.end_date || '',
      description: note.description
    });
    setDialogOpen(true);
  };

  const handleAdd = () => {
    resetForm();
    setDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveMutation.mutate(formData);
  };

  const formatDateRange = (startDate: string, endDate?: string) => {
    if (!endDate || startDate === endDate) {
      return format(new Date(startDate), 'MMM d');
    }
    return `${format(new Date(startDate), 'MMM d')}-${format(new Date(endDate), 'd')}`;
  };

  return (
    <>
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="bg-green-50 dark:bg-green-950/30 p-2 rounded-lg">
                <FileText className="h-4 w-4 text-green-500" />
              </div>
              <CardTitle className="text-sm font-medium">Notes</CardTitle>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={handleAdd}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {notes.length === 0 ? (
            <p className="text-sm text-muted-foreground">No notes this week</p>
          ) : (
            <ul className="space-y-2">
              {notes.map((note) => (
                <li key={note.id} className="flex items-start gap-2 text-sm group">
                  <span className="text-muted-foreground">•</span>
                  <div className="flex-1">
                    <span className="font-medium text-foreground">
                      {formatDateRange(note.start_date, note.end_date)}:
                    </span>{' '}
                    <span className="text-muted-foreground">{note.description}</span>
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0"
                      onClick={() => handleEdit(note)}
                    >
                      <Pencil className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0"
                      onClick={() => deleteMutation.mutate(note.id)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingNote ? 'Edit Note' : 'Add Note'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="start_date">Start Date</Label>
              <Input
                id="start_date"
                type="date"
                value={formData.start_date}
                onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="end_date">End Date (Optional)</Label>
              <Input
                id="end_date"
                type="date"
                value={formData.end_date}
                onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="e.g., Conference"
                required
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={saveMutation.isPending}>
                {saveMutation.isPending ? 'Saving...' : 'Save'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};
