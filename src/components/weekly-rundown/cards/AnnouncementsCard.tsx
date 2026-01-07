import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Megaphone, Plus, Pencil, Trash2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { format } from 'date-fns';
import { useQueryClient, useMutation, useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useCompany } from '@/context/CompanyContext';
import { useDemoAuth } from '@/hooks/useDemoAuth';
import { generateDemoAnnouncements } from '@/data/demoData';
import { usePermissions } from '@/hooks/usePermissions';

interface Announcement {
  id: string;
  title: string;
  content: string;
  created_at: string;
}

interface AnnouncementsCardProps {
  weekStartDate: string;
  announcements?: Announcement[];
}

export const AnnouncementsCard: React.FC<AnnouncementsCardProps> = ({ weekStartDate, announcements: prefetchedAnnouncements }) => {
  const { company } = useCompany();
  const { isDemoMode } = useDemoAuth();
  const { isAdmin, permissionsBootstrapping } = usePermissions();
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    content: ''
  });

  // Fetch announcements from weekly_notes with a specific type marker in description
  // For now, we'll use the weekly_notes table and filter by a convention
  const { data: fetchedAnnouncements = [] } = useQuery({
    queryKey: ['weekly-announcements', weekStartDate, isDemoMode ? 'demo' : company?.id],
    queryFn: async () => {
      // Demo mode: return demo announcements
      if (isDemoMode) {
        return generateDemoAnnouncements();
      }

      if (!company?.id) return [];

      const { data, error } = await supabase
        .from('weekly_notes')
        .select('id, start_date, end_date, description')
        .eq('company_id', company.id)
        .eq('week_start_date', weekStartDate)
        .like('description', '[ANNOUNCEMENT]%')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      // Parse announcements from description format: [ANNOUNCEMENT]Title|Content
      return (data || []).map(note => {
        const content = note.description.replace('[ANNOUNCEMENT]', '');
        const [title, ...rest] = content.split('|');
        return {
          id: note.id,
          title: title || 'Announcement',
          content: rest.join('|') || '',
          created_at: note.start_date
        };
      });
    },
    enabled: (isDemoMode || !!company?.id) && !prefetchedAnnouncements,
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });

  const announcements = prefetchedAnnouncements || fetchedAnnouncements;

  const saveMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      if (!company?.id) throw new Error('No company ID');

      const description = `[ANNOUNCEMENT]${data.title}|${data.content}`;
      const today = format(new Date(), 'yyyy-MM-dd');

      if (editingAnnouncement) {
        const { error } = await supabase
          .from('weekly_notes')
          .update({
            description
          })
          .eq('id', editingAnnouncement.id);
        
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('weekly_notes')
          .insert({
            company_id: company.id,
            week_start_date: weekStartDate,
            start_date: today,
            description
          });
        
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['weekly-announcements'] });
      queryClient.invalidateQueries({ queryKey: ['weekly-notes'] });
      toast.success(editingAnnouncement ? 'Announcement updated' : 'Announcement added');
      setDialogOpen(false);
      resetForm();
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to save announcement');
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
      queryClient.invalidateQueries({ queryKey: ['weekly-announcements'] });
      queryClient.invalidateQueries({ queryKey: ['weekly-notes'] });
      toast.success('Announcement deleted');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete announcement');
    }
  });

  const resetForm = () => {
    setFormData({ title: '', content: '' });
    setEditingAnnouncement(null);
  };

  const handleEdit = (announcement: Announcement) => {
    setEditingAnnouncement(announcement);
    setFormData({
      title: announcement.title,
      content: announcement.content
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

  return (
    <>
      <Card className="h-full flex flex-col min-h-[120px] max-h-[25vh] shadow-sm border border-border bg-card flex-1 relative overflow-hidden">
        {/* Background watermark icon */}
        <Megaphone className="absolute -right-4 -bottom-4 h-24 w-24 text-muted-foreground/5 pointer-events-none" />
        
        <CardHeader className="pb-1 flex-shrink-0 h-[40px] flex items-start pt-3">
          <div className="flex items-center justify-between w-full">
            <CardTitle className="text-xs font-semibold text-foreground uppercase tracking-wide">Announcements</CardTitle>
            {permissionsBootstrapping ? (
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0 -mt-1 cursor-wait" disabled title="Loading permissions…">
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              </Button>
            ) : (
              isAdmin && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 -mt-1"
                  onClick={(e) => { e.stopPropagation(); handleAdd(); }}
                >
                  <Plus className="h-3.5 w-3.5" />
                </Button>
              )
            )}
          </div>
        </CardHeader>
        <CardContent className="flex-1 overflow-y-auto scrollbar-grey relative z-10">
          {announcements.length === 0 ? (
            <p className="text-sm text-muted-foreground">No announcements this week</p>
          ) : (
            <ul className="space-y-2">
              {announcements.map((announcement) => (
                <li key={announcement.id} className="text-sm group">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <p className="font-medium text-foreground">{announcement.title}</p>
                      {announcement.content && (
                        <p className="text-xs text-muted-foreground line-clamp-2">{announcement.content}</p>
                      )}
                    </div>
                    {isAdmin && (
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0"
                          onClick={() => handleEdit(announcement)}
                        >
                          <Pencil className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0"
                          onClick={() => deleteMutation.mutate(announcement.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    )}
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
            <DialogTitle>{editingAnnouncement ? 'Edit Announcement' : 'Add Announcement'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g., Team Meeting"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="content">Details (Optional)</Label>
              <Textarea
                id="content"
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="Additional details..."
                rows={3}
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
