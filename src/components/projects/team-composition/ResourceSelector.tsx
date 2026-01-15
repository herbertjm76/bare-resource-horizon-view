import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { PlusCircle, DollarSign, Percent, ChevronsUpDown, Check } from 'lucide-react';
import { useOfficeRoles } from '@/hooks/useOfficeRoles';
import { useOfficeRates, getRateForReference } from '@/hooks/useOfficeRates';
import { useResourceOptions } from '@/components/resources/dialogs/useResourceOptions';
import { useAppSettings } from '@/hooks/useAppSettings';
import { cn } from '@/lib/utils';

interface ResourceSelectorProps {
  onAdd: (data: {
    referenceId: string;
    referenceType: 'role' | 'member';
    plannedQuantity: number;
    plannedHoursPerPerson: number;
    rateSnapshot: number;
    assignedMemberId?: string;
  }) => void;
  isLoading?: boolean;
  contractedWeeks?: number;
}

export const ResourceSelector: React.FC<ResourceSelectorProps> = ({
  onAdd,
  isLoading = false,
  contractedWeeks = 0
}) => {
  const { workWeekHours } = useAppSettings();
  const [open, setOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState('');
  const [allocationPercent, setAllocationPercent] = useState(100);

  const { data: roles = [], isLoading: rolesLoading } = useOfficeRoles();
  const { data: rates = [] } = useOfficeRates();
  const { resourceOptions: members, loading: membersLoading } = useResourceOptions();

  // Parse selected value to determine if it's a role or member
  const selectionType = useMemo(() => {
    if (!selectedValue) return null;
    if (selectedValue.startsWith('role:')) return 'role';
    if (selectedValue.startsWith('member:')) return 'member';
    return null;
  }, [selectedValue]);

  const selectedId = selectedValue.split(':')[1] || '';

  // Get the selected role (either directly or from member)
  const selectedRoleId = useMemo(() => {
    if (selectionType === 'role') return selectedId;
    if (selectionType === 'member') {
      const member = members.find(m => m.id === selectedId);
      return member?.officeRoleId || '';
    }
    return '';
  }, [selectionType, selectedId, members]);

  const selectedRole = roles.find(r => r.id === selectedRoleId);

  // Get display label for selected value
  const selectedLabel = useMemo(() => {
    if (!selectedValue) return '';
    if (selectionType === 'role') {
      const role = roles.find(r => r.id === selectedId);
      return role?.name || '';
    }
    if (selectionType === 'member') {
      const member = members.find(m => m.id === selectedId);
      return member?.name || '';
    }
    return '';
  }, [selectedValue, selectionType, selectedId, roles, members]);

  // Get rate for selected role
  const selectedRate = useMemo(() => {
    if (!selectedRoleId) return 0;
    return getRateForReference(rates, selectedRoleId, 'role');
  }, [selectedRoleId, rates]);

  // Calculate hours based on allocation percentage and contracted weeks
  const weeklyHours = (allocationPercent / 100) * workWeekHours;
  const totalHours = contractedWeeks > 0 ? weeklyHours * contractedWeeks : weeklyHours;
  const totalBudget = totalHours * selectedRate;

  const handleAdd = () => {
    if (!selectedValue || !selectionType) return;

    if (selectionType === 'member') {
      onAdd({
        referenceId: selectedId,
        referenceType: 'member',
        plannedQuantity: 1,
        plannedHoursPerPerson: totalHours,
        rateSnapshot: selectedRate,
        assignedMemberId: selectedId
      });
    } else {
      // Just a role placeholder
      onAdd({
        referenceId: selectedId,
        referenceType: 'role',
        plannedQuantity: 1,
        plannedHoursPerPerson: totalHours,
        rateSnapshot: selectedRate
      });
    }

    // Reset form
    setSelectedValue('');
    setAllocationPercent(100);
  };

  const isDisabled = !selectedValue || isLoading;
  const isLoaderActive = rolesLoading || membersLoading;

  return (
    <div className="space-y-3 p-4 border rounded-lg bg-muted/30">
      <Label className="text-sm font-medium">Add Resource</Label>

      <div className="grid grid-cols-12 gap-3 items-end">
        {/* Unified Role/Person selector with search */}
        <div className="col-span-8">
          <Label className="text-xs text-muted-foreground mb-1.5 block">
            Role or Person <span className="text-destructive">*</span>
          </Label>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                type="button"
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="w-full justify-between font-normal"
              >
                {selectedLabel || "Select a role or person..."}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[400px] p-0" align="start">
              <Command>
                <CommandInput placeholder="Search roles or people..." />
                <CommandList>
                  <CommandEmpty>
                    {isLoaderActive ? 'Loading...' : 'No results found.'}
                  </CommandEmpty>
                  
                  {/* Roles section */}
                  {roles.length > 0 && (
                    <CommandGroup heading="Roles (unassigned)">
                      {roles.map((role) => (
                        <CommandItem
                          key={`role:${role.id}`}
                          value={`role:${role.id}:${role.name}`}
                          onSelect={() => {
                            setSelectedValue(`role:${role.id}`);
                            setOpen(false);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              selectedValue === `role:${role.id}` ? "opacity-100" : "opacity-0"
                            )}
                          />
                          {role.name}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  )}
                  
                  {/* People section */}
                  {members.length > 0 && (
                    <CommandGroup heading="Team Members">
                      {members.map((member) => (
                        <CommandItem
                          key={`member:${member.id}`}
                          value={`member:${member.id}:${member.name}`}
                          onSelect={() => {
                            setSelectedValue(`member:${member.id}`);
                            setOpen(false);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              selectedValue === `member:${member.id}` ? "opacity-100" : "opacity-0"
                            )}
                          />
                          {member.name}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  )}
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>

        {/* Allocation % */}
        <div className="col-span-2">
          <Label className="text-xs text-muted-foreground mb-1.5 block">
            <Percent className="h-3 w-3 inline mr-1" />
            Allocation
          </Label>
          <div className="relative">
            <Input
              type="number"
              min={5}
              max={100}
              step={5}
              value={allocationPercent}
              onChange={(e) => setAllocationPercent(parseInt(e.target.value) || 0)}
              onBlur={(e) => {
                const value = parseInt(e.target.value) || 100;
                setAllocationPercent(Math.min(100, Math.max(5, value)));
              }}
              className="text-center pr-6"
            />
            <span className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">%</span>
          </div>
        </div>

        {/* Add button */}
        <div className="col-span-2">
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={handleAdd}
            disabled={isDisabled}
          >
            <PlusCircle className="h-4 w-4 mr-1.5" />
            Add
          </Button>
        </div>
      </div>

      {/* Preview calculation */}
      {selectedValue && (
        <div className="flex items-center justify-between text-xs text-muted-foreground pt-1 border-t border-border/50">
          <div className="flex items-center gap-1">
            {selectedRate > 0 ? (
              <>
                <DollarSign className="h-3 w-3" />
                <span>
                  Rate: <span className="font-medium text-foreground">${selectedRate}/hr</span>
                  {selectedRole && <span className="ml-1">({selectedRole.name})</span>}
                </span>
              </>
            ) : (
              <span className="text-amber-500">
                No rate configured for this role
              </span>
            )}
          </div>
          <div>
            {allocationPercent}% × {contractedWeeks > 0 ? `${contractedWeeks} weeks` : '1 week'} = 
            <span className="font-medium text-foreground ml-1">{Math.round(totalHours)} hrs</span>
            {selectedRate > 0 && (
              <span className="ml-2">
                (${totalBudget.toLocaleString()})
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
