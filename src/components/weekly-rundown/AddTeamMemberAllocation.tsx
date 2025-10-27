import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Check, X } from 'lucide-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useCompany } from '@/context/CompanyContext';

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
  const [selectedMember, setSelectedMember] = useState<any>(null);
  const [hours, setHours] = useState('');
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const { company } = useCompany();

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

  const addMutation = useMutation({
    mutationFn: async () => {
      if (!selectedMember || !company?.id) return;

      const allocationHours = parseFloat(hours);
      
      const { data, error } = await supabase
        .from('project_resource_allocations')
        .insert({
          project_id: projectId,
          resource_id: selectedMember.id,
          resource_type: 'team_member',
          week_start_date: weekStartDate,
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
      setSelectedMember(null);
      setHours('');
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
    const allocationHours = parseFloat(hours);
    if (isNaN(allocationHours) || allocationHours <= 0) {
      toast.error('Please enter valid hours');
      return;
    }
    addMutation.mutate();
  };

  const handleCancel = () => {
    setIsAdding(false);
    setSelectedMember(null);
    setHours('');
  };

  if (isAdding) {
    return (
      <div className="glass rounded-xl p-4">
        <div className="flex items-center gap-2">
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="flex-1 justify-between"
              >
                {selectedMember
                  ? `${selectedMember.first_name} ${selectedMember.last_name}`
                  : "Select team member..."}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[300px] p-0">
              <Command>
                <CommandInput placeholder="Search team members..." />
                <CommandEmpty>No team member found.</CommandEmpty>
                <CommandGroup>
                  {availableMembers.map((member) => (
                    <CommandItem
                      key={member.id}
                      value={`${member.first_name} ${member.last_name}`}
                      onSelect={() => {
                        setSelectedMember(member);
                        setOpen(false);
                      }}
                    >
                      {member.first_name} {member.last_name}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>
          
          <Input
            type="number"
            placeholder="Hours"
            value={hours}
            onChange={(e) => setHours(e.target.value)}
            className="w-24"
            step="0.5"
            min="0"
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
