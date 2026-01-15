import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
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
import { PlusCircle, DollarSign, Percent, ChevronsUpDown, Check, X, Users } from 'lucide-react';
import { useOfficeRoles } from '@/hooks/useOfficeRoles';
import { useOfficeRates, getRateForReference } from '@/hooks/useOfficeRates';
import { useResourceOptions } from '@/components/resources/dialogs/useResourceOptions';
import { useAppSettings } from '@/hooks/useAppSettings';
import { cn } from '@/lib/utils';

interface SelectedResource {
  value: string;
  type: 'role' | 'member';
  id: string;
  name: string;
  roleId: string;
  rate: number;
}

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
  const [selectedResources, setSelectedResources] = useState<SelectedResource[]>([]);
  const [allocationPercent, setAllocationPercent] = useState(100);

  const { data: roles = [], isLoading: rolesLoading } = useOfficeRoles();
  const { data: rates = [] } = useOfficeRates();
  const { resourceOptions: members, loading: membersLoading } = useResourceOptions();

  // Calculate hours based on allocation percentage and contracted weeks
  const weeklyHours = (allocationPercent / 100) * workWeekHours;
  const totalHours = contractedWeeks > 0 ? weeklyHours * contractedWeeks : weeklyHours;

  // Calculate totals for all selected resources
  const selectionTotals = useMemo(() => {
    const totalBudget = selectedResources.reduce((sum, res) => sum + (totalHours * res.rate), 0);
    const avgRate = selectedResources.length > 0 
      ? selectedResources.reduce((sum, res) => sum + res.rate, 0) / selectedResources.length 
      : 0;
    return { totalBudget, avgRate, count: selectedResources.length };
  }, [selectedResources, totalHours]);

  const toggleSelection = (value: string, type: 'role' | 'member', id: string, name: string, roleId: string) => {
    const rate = roleId ? getRateForReference(rates, roleId, 'role') : 0;
    
    setSelectedResources(prev => {
      const exists = prev.find(r => r.value === value);
      if (exists) {
        return prev.filter(r => r.value !== value);
      }
      return [...prev, { value, type, id, name, roleId, rate }];
    });
  };

  const removeSelection = (value: string) => {
    setSelectedResources(prev => prev.filter(r => r.value !== value));
  };

  const isSelected = (value: string) => selectedResources.some(r => r.value === value);

  const handleAdd = () => {
    if (selectedResources.length === 0) return;

    // Add each selected resource
    selectedResources.forEach(resource => {
      if (resource.type === 'member') {
        onAdd({
          referenceId: resource.id,
          referenceType: 'member',
          plannedQuantity: 1,
          plannedHoursPerPerson: totalHours,
          rateSnapshot: resource.rate,
          assignedMemberId: resource.id
        });
      } else {
        onAdd({
          referenceId: resource.id,
          referenceType: 'role',
          plannedQuantity: 1,
          plannedHoursPerPerson: totalHours,
          rateSnapshot: resource.rate
        });
      }
    });

    // Reset form
    setSelectedResources([]);
    setAllocationPercent(100);
  };

  const isDisabled = selectedResources.length === 0 || isLoading;
  const isLoaderActive = rolesLoading || membersLoading;

  // Display text for trigger button
  const triggerLabel = useMemo(() => {
    if (selectedResources.length === 0) return "Select roles or people...";
    if (selectedResources.length === 1) return selectedResources[0].name;
    return `${selectedResources.length} resources selected`;
  }, [selectedResources]);

  return (
    <div className="space-y-3 p-4 border rounded-lg bg-muted/30">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium">Add Resources</Label>
        {selectedResources.length > 1 && (
          <Badge variant="secondary" className="text-xs">
            <Users className="h-3 w-3 mr-1" />
            Bulk mode: {selectedResources.length} selected
          </Badge>
        )}
      </div>

      {/* Selected resources chips */}
      {selectedResources.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {selectedResources.map(resource => (
            <Badge 
              key={resource.value} 
              variant="secondary" 
              className="pl-2 pr-1 py-1 flex items-center gap-1"
            >
              <span className="text-xs">{resource.name}</span>
              {resource.rate > 0 && (
                <span className="text-xs text-muted-foreground">(${resource.rate}/hr)</span>
              )}
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0 hover:bg-destructive/20"
                onClick={() => removeSelection(resource.value)}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          ))}
        </div>
      )}

      <div className="grid grid-cols-12 gap-3 items-end">
        {/* Multi-select Role/Person selector */}
        <div className="col-span-8">
          <Label className="text-xs text-muted-foreground mb-1.5 block">
            Roles or People <span className="text-destructive">*</span>
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
                {triggerLabel}
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
                      {roles.map((role) => {
                        const value = `role:${role.id}`;
                        return (
                          <CommandItem
                            key={value}
                            value={`role:${role.id}:${role.name}`}
                            onSelect={() => toggleSelection(value, 'role', role.id, role.name, role.id)}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                isSelected(value) ? "opacity-100" : "opacity-0"
                              )}
                            />
                            {role.name}
                          </CommandItem>
                        );
                      })}
                    </CommandGroup>
                  )}
                  
                  {/* People section */}
                  {members.length > 0 && (
                    <CommandGroup heading="Team Members">
                      {members.map((member) => {
                        const value = `member:${member.id}`;
                        return (
                          <CommandItem
                            key={value}
                            value={`member:${member.id}:${member.name}`}
                            onSelect={() => toggleSelection(value, 'member', member.id, member.name, member.officeRoleId || '')}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                isSelected(value) ? "opacity-100" : "opacity-0"
                              )}
                            />
                            {member.name}
                          </CommandItem>
                        );
                      })}
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
              value={allocationPercent || ''}
              onChange={(e) => {
                const rawValue = e.target.value;
                const cleanValue = rawValue.replace(/^0+(?=\d)/, '');
                setAllocationPercent(parseInt(cleanValue) || 0);
              }}
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
            {selectedResources.length > 1 ? `Add (${selectedResources.length})` : 'Add'}
          </Button>
        </div>
      </div>

      {/* Preview calculation */}
      {selectedResources.length > 0 && (
        <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t border-border/50">
          <div className="flex items-center gap-1">
            {selectionTotals.avgRate > 0 ? (
              <>
                <DollarSign className="h-3 w-3" />
                <span>
                  {selectedResources.length === 1 ? (
                    <>Rate: <span className="font-medium text-foreground">${selectedResources[0].rate}/hr</span></>
                  ) : (
                    <>Avg rate: <span className="font-medium text-foreground">${Math.round(selectionTotals.avgRate)}/hr</span></>
                  )}
                </span>
              </>
            ) : (
              <span className="text-amber-500">
                No rates configured
              </span>
            )}
          </div>
          <div>
            {selectedResources.length > 1 && (
              <span className="mr-2">{selectedResources.length} × </span>
            )}
            {allocationPercent}% × {contractedWeeks > 0 ? `${contractedWeeks} weeks` : '1 week'} = 
            <span className="font-medium text-foreground ml-1">
              {Math.round(totalHours * selectedResources.length)} hrs
            </span>
            {selectionTotals.totalBudget > 0 && (
              <span className="ml-2">
                (${selectionTotals.totalBudget.toLocaleString()})
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
