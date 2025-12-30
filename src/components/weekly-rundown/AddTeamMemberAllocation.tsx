import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Check, X, Search, ChevronsUpDown } from 'lucide-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useCompany } from '@/context/CompanyContext';
import { useAppSettings } from '@/hooks/useAppSettings';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

interface TeamMemberOption {
  id: string;
  first_name: string | null;
  last_name: string | null;
  avatar_url: string | null;
  location: string | null;
  weekly_capacity: number | null;
  type: 'active' | 'pre_registered';
}

interface AddTeamMemberAllocationProps {
  projectId: string;
  weekStartDate: string;
  existingMemberIds?: string[];
  onAdd?: () => void;
  variant?: 'default' | 'compact';
}

export const AddTeamMemberAllocation: React.FC<AddTeamMemberAllocationProps> = ({
  projectId,
  weekStartDate,
  existingMemberIds = [],
  onAdd,
  variant = 'default'
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [selectedMemberId, setSelectedMemberId] = useState<string>('');
  const [inputValue, setInputValue] = useState('');
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const { company } = useCompany();
  const { displayPreference, workWeekHours } = useAppSettings();

  // Fetch active members from profiles
  const { data: activeMembers = [] } = useQuery({
    queryKey: ['team-members-active', company?.id],
    queryFn: async () => {
      if (!company?.id) return [];
      
      const { data, error } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, avatar_url, location, weekly_capacity')
        .eq('company_id', company.id)
        .order('first_name');

      if (error) throw error;
      return (data || []).map(m => ({ ...m, type: 'active' as const }));
    },
    enabled: !!company?.id && isAdding
  });

  // Fetch pre-registered members from invites
  const { data: preRegisteredMembers = [] } = useQuery({
    queryKey: ['team-members-preregistered', company?.id],
    queryFn: async () => {
      if (!company?.id) return [];
      
      const { data, error } = await supabase
        .from('invites')
        .select('id, first_name, last_name, avatar_url, location, weekly_capacity')
        .eq('company_id', company.id)
        .eq('invitation_type', 'pre_registered')
        .eq('status', 'pending')
        .order('first_name');

      if (error) throw error;
      return (data || []).map(m => ({ ...m, type: 'pre_registered' as const }));
    },
    enabled: !!company?.id && isAdding
  });

  // Combine and filter members
  const allMembers: TeamMemberOption[] = useMemo(() => {
    return [...activeMembers, ...preRegisteredMembers];
  }, [activeMembers, preRegisteredMembers]);

  const availableMembers = useMemo(() => {
    return allMembers.filter(m => !existingMemberIds.includes(m.id));
  }, [allMembers, existingMemberIds]);

  const selectedMember = allMembers.find(m => m.id === selectedMemberId);

  const addMutation = useMutation({
    mutationFn: async () => {
      if (!selectedMember || !company?.id) return;

      const capacity = selectedMember.weekly_capacity || workWeekHours;
      let allocationHours: number;
      
      if (displayPreference === 'percentage') {
        const percentage = parseFloat(inputValue);
        allocationHours = (percentage / 100) * capacity;
      } else {
        allocationHours = parseFloat(inputValue);
      }
      
      const resourceType = selectedMember.type === 'pre_registered' ? 'pre_registered' : 'active';
      
      const { data, error } = await supabase
        .from('project_resource_allocations')
        .insert({
          project_id: projectId,
          resource_id: selectedMember.id,
          resource_type: resourceType,
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
      onAdd?.();
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

  const getInitials = (firstName: string | null, lastName: string | null) => {
    return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase() || '?';
  };

  const getDisplayName = (member: TeamMemberOption) => {
    const name = `${member.first_name || ''} ${member.last_name || ''}`.trim();
    return name || 'Unknown';
  };

  if (isAdding) {
    // Compact variant for grid view - stacked layout
    if (variant === 'compact') {
      return (
        <div className="flex flex-col items-center gap-2 p-2 bg-background/90 backdrop-blur-sm rounded-lg border border-border min-w-[120px]">
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                size="sm"
                className="w-full justify-between text-xs h-8"
              >
                {selectedMember ? (
                  <span className="truncate">{getDisplayName(selectedMember).split(' ')[0]}</span>
                ) : (
                  <span className="truncate">team member...</span>
                )}
                <ChevronsUpDown className="ml-1 h-3 w-3 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[250px] p-0" align="center">
              <Command>
                <CommandInput placeholder="Search team members..." />
                <CommandList>
                  <CommandEmpty>No team member found.</CommandEmpty>
                  <CommandGroup>
                    {availableMembers.map((member) => (
                      <CommandItem
                        key={member.id}
                        value={`${member.first_name || ''} ${member.last_name || ''} ${member.id}`}
                        onSelect={() => {
                          setSelectedMemberId(member.id);
                          setOpen(false);
                        }}
                      >
                        <div className="flex items-center gap-2 flex-1">
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={member.avatar_url || ''} />
                            <AvatarFallback className="text-xs">
                              {getInitials(member.first_name, member.last_name)}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm">{getDisplayName(member)}</span>
                        </div>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
          
          <Input
            type="number"
            placeholder={displayPreference === 'percentage' ? '%' : 'Hours'}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="w-full h-8 text-center text-xs"
            step={displayPreference === 'percentage' ? '5' : '0.5'}
            min="0"
            max={displayPreference === 'percentage' ? '100' : undefined}
          />
          
          <div className="flex gap-1">
            <Button
              size="sm"
              variant="ghost"
              onClick={handleSave}
              disabled={addMutation.isPending}
              className="h-6 w-6 p-0"
            >
              <Check className="h-3 w-3" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={handleCancel}
              className="h-6 w-6 p-0"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        </div>
      );
    }

    // Default variant - horizontal layout
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
                {selectedMember ? (
                  <div className="flex items-center gap-2">
                    <Avatar className="h-5 w-5">
                      <AvatarImage src={selectedMember.avatar_url || ''} />
                      <AvatarFallback className="text-xs">
                        {getInitials(selectedMember.first_name, selectedMember.last_name)}
                      </AvatarFallback>
                    </Avatar>
                    <span>{getDisplayName(selectedMember)}</span>
                    {selectedMember.type === 'pre_registered' && (
                      <span className="text-xs text-muted-foreground">(pending)</span>
                    )}
                  </div>
                ) : (
                  "Select team member..."
                )}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[300px] p-0" align="start">
              <Command>
                <CommandInput placeholder="Search team members..." />
                <CommandList>
                  <CommandEmpty>No team member found.</CommandEmpty>
                  <CommandGroup>
                    {availableMembers.map((member) => (
                      <CommandItem
                        key={member.id}
                        value={`${member.first_name || ''} ${member.last_name || ''} ${member.id}`}
                        onSelect={() => {
                          setSelectedMemberId(member.id);
                          setOpen(false);
                        }}
                      >
                        <div className="flex items-center gap-2 flex-1">
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={member.avatar_url || ''} />
                            <AvatarFallback className="text-xs">
                              {getInitials(member.first_name, member.last_name)}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm">{getDisplayName(member)}</span>
                        </div>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
          
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

  if (variant === 'compact') {
    return (
      <button
        onClick={() => setIsAdding(true)}
        className="flex flex-col items-center gap-1 group"
      >
        <div className="w-12 h-12 rounded-full border-2 border-dashed border-muted-foreground/30 flex items-center justify-center bg-muted/20 hover:bg-muted/40 hover:border-primary/50 transition-all group-hover:scale-105">
          <Plus className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
        </div>
        <span className="text-[10px] text-muted-foreground group-hover:text-foreground transition-colors">Add</span>
      </button>
    );
  }

  return (
    <button
      onClick={() => setIsAdding(true)}
      className="flex flex-col items-center gap-1 group"
    >
      <div className="w-16 h-16 rounded-full border-2 border-dashed border-muted-foreground/30 flex items-center justify-center bg-muted/20 hover:bg-muted/40 hover:border-primary/50 transition-all group-hover:scale-105">
        <Plus className="h-6 w-6 text-muted-foreground group-hover:text-primary transition-colors" />
      </div>
      <span className="text-xs text-muted-foreground group-hover:text-foreground transition-colors">Add</span>
    </button>
  );
};
