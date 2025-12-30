import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Check, X } from 'lucide-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCompany } from '@/context/CompanyContext';
import { useAppSettings } from '@/hooks/useAppSettings';

interface AddTeamMemberAllocationProps {
  projectId: string;
  weekStartDate: string;
  existingMemberIds: string[];
  onAdd: () => void;
}

export const AddTeamMemberAllocation: React.FC<AddTeamMemberAllocationProps> = ({
  projectId,
  weekStartDate,
  existingMemberIds,
  onAdd
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [selectedMemberId, setSelectedMemberId] = useState<string>('');
  const [inputValue, setInputValue] = useState('');
  const queryClient = useQueryClient();
  const { company } = useCompany();
  const { displayPreference, workWeekHours } = useAppSettings();

  const { data: members = [] } = useQuery({
    queryKey: ['team-members', company?.id],
    queryFn: async () => {
      if (!company?.id) return [];
      
      const { data, error } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, avatar_url, location, weekly_capacity')
        .eq('company_id', company.id)
        .order('first_name');

      if (error) throw error;
      return data || [];
    },
    enabled: !!company?.id && isAdding
  });

  const availableMembers = members.filter(m => !existingMemberIds.includes(m.id));
  const selectedMember = members.find(m => m.id === selectedMemberId);

  const addMutation = useMutation({
    mutationFn: async () => {
      if (!selectedMember || !company?.id) return;

      const capacity = selectedMember.weekly_capacity || workWeekHours;
      let allocationHours: number;
      
      if (displayPreference === 'percentage') {
        // Convert percentage to hours
        const percentage = parseFloat(inputValue);
        allocationHours = (percentage / 100) * capacity;
      } else {
        allocationHours = parseFloat(inputValue);
      }
      
      const { data, error } = await supabase
        .from('project_resource_allocations')
        .insert({
          project_id: projectId,
          resource_id: selectedMember.id,
          resource_type: 'team_member',
          allocation_date: weekStartDate,
          hours: allocationHours,
          company_id: company.id
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast.success('Team member added');
      queryClient.invalidateQueries({ queryKey: ['comprehensive-weekly-allocations'] });
      setIsAdding(false);
      setSelectedMemberId('');
      setInputValue('');
      onAdd();
    },
    onError: (error) => {
      toast.error('Failed to add team member');
      console.error('Add error:', error);
    }
  });

  const handleSave = () => {
    if (!selectedMember) {
      toast.error('Please select a team member');
      return;
    }
    const value = parseFloat(inputValue);
    if (isNaN(value) || value <= 0) {
      toast.error(`Please enter valid ${displayPreference === 'percentage' ? 'percentage' : 'hours'}`);
      return;
    }
    addMutation.mutate();
  };

  const handleCancel = () => {
    setIsAdding(false);
    setSelectedMemberId('');
    setInputValue('');
  };

  if (isAdding) {
    return (
      <div className="glass rounded-xl p-4">
        <div className="flex items-center gap-2">
          <Select value={selectedMemberId} onValueChange={setSelectedMemberId}>
            <SelectTrigger className="flex-1">
              <SelectValue placeholder="Select team member..." />
            </SelectTrigger>
            <SelectContent>
              {availableMembers.map((member) => (
                <SelectItem key={member.id} value={member.id}>
                  {member.first_name} {member.last_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Input
            type="number"
            placeholder={displayPreference === 'percentage' ? '%' : 'Hours'}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="w-24"
            step={displayPreference === 'percentage' ? '5' : '0.5'}
            min="0"
            max={displayPreference === 'percentage' ? '100' : undefined}
          />
          
          <Button
            size="sm"
            variant="ghost"
            onClick={handleSave}
            disabled={addMutation.isPending}
            className="h-8 w-8 p-0"
          >
            <Check className="h-4 w-4" />
          </Button>
          
          <Button
            size="sm"
            variant="ghost"
            onClick={handleCancel}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <Button
      variant="outline"
      onClick={() => setIsAdding(true)}
      className="w-full glass hover:glass-elevated"
    >
      <Plus className="h-4 w-4 mr-2" />
      Add Team Member
    </Button>
  );
};
