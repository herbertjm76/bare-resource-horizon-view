import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Plus, X } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useCompany } from '@/context/CompanyContext';
import { useCustomCardEntries, useAddCardEntry, useRemoveCardEntry } from '@/hooks/useCustomCards';
import { toast } from 'sonner';

interface CustomRundownCardProps {
  cardType: {
    id: string;
    label: string;
    icon?: string;
    color?: string;
  };
  weekStartDate: string;
}

export const CustomRundownCard: React.FC<CustomRundownCardProps> = ({
  cardType,
  weekStartDate
}) => {
  const { company } = useCompany();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedMemberId, setSelectedMemberId] = useState<string>('');
  const [selectedMemberType, setSelectedMemberType] = useState<'active' | 'pre_registered'>('active');
  const [notes, setNotes] = useState('');

  const { data: entries = [], refetch } = useCustomCardEntries(cardType.id, weekStartDate);
  const addEntry = useAddCardEntry();
  const removeEntry = useRemoveCardEntry();

  // Fetch available members
  const { data: profiles = [] } = useQuery({
    queryKey: ['custom-card-profiles', company?.id],
    queryFn: async () => {
      if (!company?.id) return [];
      const { data, error } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, avatar_url')
        .eq('company_id', company.id);
      if (error) throw error;
      return data;
    },
    enabled: !!company?.id
  });

  const { data: invites = [] } = useQuery({
    queryKey: ['custom-card-invites', company?.id],
    queryFn: async () => {
      if (!company?.id) return [];
      const { data, error } = await supabase
        .from('invites')
        .select('id, first_name, last_name, avatar_url')
        .eq('company_id', company.id)
        .eq('invitation_type', 'pre_registered')
        .eq('status', 'pending');
      if (error) throw error;
      return data;
    },
    enabled: !!company?.id
  });

  // Get member details for each entry
  const getMemberDetails = (entry: any) => {
    const allMembers = [
      ...profiles.map(p => ({ ...p, type: 'active' })),
      ...invites.map(i => ({ ...i, type: 'pre_registered' }))
    ];
    return allMembers.find(m => m.id === entry.member_id && m.type === entry.member_type);
  };

  const handleAddMember = async () => {
    if (!selectedMemberId) {
      toast.error('Please select a member');
      return;
    }

    try {
      await addEntry.mutateAsync({
        card_type_id: cardType.id,
        member_id: selectedMemberId,
        member_type: selectedMemberType,
        week_start_date: weekStartDate,
        notes: notes || undefined
      });
      toast.success('Member added successfully');
      setIsDialogOpen(false);
      setSelectedMemberId('');
      setNotes('');
      refetch();
    } catch (error) {
      toast.error('Failed to add member');
      console.error(error);
    }
  };

  const handleRemoveMember = async (entryId: string) => {
    try {
      await removeEntry.mutateAsync(entryId);
      toast.success('Member removed');
      refetch();
    } catch (error) {
      toast.error('Failed to remove member');
      console.error(error);
    }
  };

  return (
    <Card className="h-full flex flex-col min-h-[180px] shadow-sm border min-w-[200px] max-w-[260px]">
      <CardHeader style={{ backgroundColor: cardType.color || 'hsl(var(--muted))' }} className="flex-shrink-0 pb-2">
        <CardTitle className="flex items-center justify-between text-xs font-semibold">
          <span className="flex items-center gap-1.5">
            {cardType.icon && <span className="text-sm">{cardType.icon}</span>}
            {cardType.label}
          </span>
          <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-4">
            {entries.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4 flex-1 overflow-y-auto scrollbar-grey">
        <div className="flex flex-wrap gap-3">
          {entries.map((entry) => {
            const member = getMemberDetails(entry);
            if (!member) return null;
            
            const initials = `${member.first_name?.[0] || ''}${member.last_name?.[0] || ''}`.toUpperCase();
            
            return (
              <div key={entry.id} className="relative flex flex-col items-center gap-1.5">
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  onClick={() => handleRemoveMember(entry.id)}
                >
                  <X className="h-3 w-3" />
                </Button>
                <Avatar className="h-9 w-9">
                  <AvatarImage src={member.avatar_url} />
                  <AvatarFallback className="bg-gradient-modern text-white text-xs">{initials}</AvatarFallback>
                </Avatar>
                <span className="text-xs font-medium text-foreground">{member.first_name}</span>
                {entry.notes && (
                  <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-4">
                    📝
                  </Badge>
                )}
              </div>
            );
          })}
          
          {/* Add Member Button */}
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="h-9 w-9 rounded-full flex items-center justify-center"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Member to {cardType.label}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Member Type</label>
                  <Select value={selectedMemberType} onValueChange={(v: any) => setSelectedMemberType(v)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="pre_registered">Pre-registered</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Member</label>
                  <Select value={selectedMemberId} onValueChange={setSelectedMemberId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a member" />
                    </SelectTrigger>
                    <SelectContent>
                      {selectedMemberType === 'active' 
                        ? profiles.map(p => (
                            <SelectItem key={p.id} value={p.id}>
                              {p.first_name} {p.last_name}
                            </SelectItem>
                          ))
                        : invites.map(i => (
                            <SelectItem key={i.id} value={i.id}>
                              {i.first_name} {i.last_name}
                            </SelectItem>
                          ))
                      }
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Notes (optional)</label>
                  <Textarea
                    placeholder="Add any notes..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={3}
                  />
                </div>
                
                <Button onClick={handleAddMember} className="w-full">
                  Add Member
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardContent>
    </Card>
  );
};
