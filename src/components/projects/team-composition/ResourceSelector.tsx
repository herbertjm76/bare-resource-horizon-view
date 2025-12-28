import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { PlusCircle, DollarSign, Percent } from 'lucide-react';
import { useOfficeRoles } from '@/hooks/useOfficeRoles';
import { useOfficeRates, getRateForReference } from '@/hooks/useOfficeRates';
import { useResourceOptions } from '@/components/resources/dialogs/useResourceOptions';
import { useAppSettings } from '@/hooks/useAppSettings';

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
        {/* Unified Role/Person selector */}
        <div className="col-span-8">
          <Label className="text-xs text-muted-foreground mb-1.5 block">
            Role or Person <span className="text-destructive">*</span>
          </Label>
          <Select value={selectedValue} onValueChange={setSelectedValue}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a role or person" />
            </SelectTrigger>
            <SelectContent>
              {isLoaderActive ? (
                <SelectItem value="_loading" disabled>Loading...</SelectItem>
              ) : (
                <>
                  {/* Roles section */}
                  {roles.length > 0 && (
                    <>
                      <SelectItem value="_roles_header" disabled className="py-1">
                        <span className="text-xs font-medium text-muted-foreground">— Roles (unassigned) —</span>
                      </SelectItem>
                      {roles.map((role) => {
                        const rate = getRateForReference(rates, role.id, 'role');
                        return (
                          <SelectItem key={`role:${role.id}`} value={`role:${role.id}`}>
                            <span className="flex items-center justify-between w-full gap-3">
                              <span>{role.name} ({role.code})</span>
                              {rate > 0 && (
                                <span className="text-xs text-muted-foreground">${rate}/hr</span>
                              )}
                            </span>
                          </SelectItem>
                        );
                      })}
                    </>
                  )}
                  
                  {/* People section */}
                  {members.length > 0 && (
                    <>
                      <SelectItem value="_members_header" disabled className="py-1">
                        <span className="text-xs font-medium text-muted-foreground">— Team Members —</span>
                      </SelectItem>
                      {members.map((member) => {
                        const memberRole = member.officeRoleId 
                          ? roles.find(r => r.id === member.officeRoleId)
                          : null;
                        return (
                          <SelectItem key={`member:${member.id}`} value={`member:${member.id}`}>
                            <span className="flex items-center gap-2">
                              {member.name}
                              {memberRole && (
                                <span className="text-xs text-muted-foreground">• {memberRole.name}</span>
                              )}
                              {member.type === 'pre-registered' && (
                                <span className="text-xs text-muted-foreground">(pending)</span>
                              )}
                            </span>
                          </SelectItem>
                        );
                      })}
                    </>
                  )}
                  
                  {roles.length === 0 && members.length === 0 && (
                    <SelectItem value="_empty" disabled>No roles or members available</SelectItem>
                  )}
                </>
              )}
            </SelectContent>
          </Select>
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
              onChange={(e) => setAllocationPercent(Math.min(100, Math.max(5, parseInt(e.target.value) || 100)))}
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
