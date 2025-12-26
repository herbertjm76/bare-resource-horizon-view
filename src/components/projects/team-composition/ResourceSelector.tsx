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
  const [selectedRoleId, setSelectedRoleId] = useState('');
  const [assignedMemberId, setAssignedMemberId] = useState('');
  const [allocationPercent, setAllocationPercent] = useState(100);

  const { data: roles = [], isLoading: rolesLoading } = useOfficeRoles();
  const { data: rates = [] } = useOfficeRates();
  const { resourceOptions: members, loading: membersLoading } = useResourceOptions();

  // Get rate for selected role
  const selectedRate = useMemo(() => {
    if (!selectedRoleId) return 0;
    return getRateForReference(rates, selectedRoleId, 'role');
  }, [selectedRoleId, rates]);

  // Filter members that match the selected role
  const eligibleMembers = useMemo(() => {
    if (!selectedRoleId) return [];
    return members.filter(m => m.officeRoleId === selectedRoleId);
  }, [selectedRoleId, members]);

  // Calculate hours based on allocation percentage and contracted weeks
  // Assume 40 hours/week as base
  const weeklyHours = (allocationPercent / 100) * 40;
  const totalHours = contractedWeeks > 0 ? weeklyHours * contractedWeeks : weeklyHours;
  const totalBudget = totalHours * selectedRate;

  const handleAdd = () => {
    if (!selectedRoleId) return;

    // If a member is assigned, use member as the reference
    if (assignedMemberId) {
      onAdd({
        referenceId: assignedMemberId,
        referenceType: 'member',
        plannedQuantity: 1,
        plannedHoursPerPerson: totalHours,
        rateSnapshot: selectedRate,
        assignedMemberId
      });
    } else {
      // Just a role placeholder
      onAdd({
        referenceId: selectedRoleId,
        referenceType: 'role',
        plannedQuantity: 1,
        plannedHoursPerPerson: totalHours,
        rateSnapshot: selectedRate
      });
    }

    // Reset form
    setSelectedRoleId('');
    setAssignedMemberId('');
    setAllocationPercent(100);
  };

  const selectedRole = roles.find(r => r.id === selectedRoleId);
  const isDisabled = !selectedRoleId || isLoading;

  return (
    <div className="space-y-3 p-4 border rounded-lg bg-muted/30">
      <Label className="text-sm font-medium">Add Resource</Label>

      <div className="grid grid-cols-12 gap-3 items-end">
        {/* Role selector (required) */}
        <div className="col-span-4">
          <Label className="text-xs text-muted-foreground mb-1.5 block">
            Role <span className="text-destructive">*</span>
          </Label>
          <Select value={selectedRoleId} onValueChange={(v) => {
            setSelectedRoleId(v);
            setAssignedMemberId(''); // Reset member when role changes
          }}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a role" />
            </SelectTrigger>
            <SelectContent>
              {rolesLoading ? (
                <SelectItem value="_loading" disabled>Loading...</SelectItem>
              ) : roles.length === 0 ? (
                <SelectItem value="_empty" disabled>No roles defined</SelectItem>
              ) : (
                roles.map((role) => {
                  const rate = getRateForReference(rates, role.id, 'role');
                  return (
                    <SelectItem key={role.id} value={role.id}>
                      <span className="flex items-center justify-between w-full gap-3">
                        <span>{role.name} ({role.code})</span>
                        {rate > 0 && (
                          <span className="text-xs text-muted-foreground">${rate}/hr</span>
                        )}
                      </span>
                    </SelectItem>
                  );
                })
              )}
            </SelectContent>
          </Select>
        </div>

        {/* Member placeholder (optional) */}
        <div className="col-span-4">
          <Label className="text-xs text-muted-foreground mb-1.5 block">
            Assign Person <span className="text-muted-foreground">(optional)</span>
          </Label>
          <Select 
            value={assignedMemberId} 
            onValueChange={setAssignedMemberId}
            disabled={!selectedRoleId}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder={selectedRoleId ? "Select person or leave empty" : "Select role first"} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="_unassigned">
                <span className="text-muted-foreground italic">Unassigned ({selectedRole?.name || 'Role'})</span>
              </SelectItem>
              {membersLoading ? (
                <SelectItem value="_loading" disabled>Loading...</SelectItem>
              ) : eligibleMembers.length === 0 ? (
                <SelectItem value="_no_match" disabled>
                  No team members with this role
                </SelectItem>
              ) : (
                eligibleMembers.map((member) => (
                  <SelectItem key={member.id} value={member.id}>
                    <span className="flex items-center gap-2">
                      {member.name}
                      {member.type === 'pre-registered' && (
                        <span className="text-xs text-muted-foreground">(pending)</span>
                      )}
                    </span>
                  </SelectItem>
                ))
              )}
              {/* Also show all members option */}
              {selectedRoleId && members.filter(m => m.officeRoleId !== selectedRoleId).length > 0 && (
                <>
                  <SelectItem value="_divider" disabled className="py-1">
                    <span className="text-xs text-muted-foreground">— Other team members —</span>
                  </SelectItem>
                  {members.filter(m => m.officeRoleId !== selectedRoleId).map((member) => {
                    const memberRole = member.officeRoleId 
                      ? roles.find(r => r.id === member.officeRoleId)
                      : null;
                    return (
                      <SelectItem key={member.id} value={member.id}>
                        <span className="flex items-center gap-2">
                          {member.name}
                          {memberRole && (
                            <span className="text-xs text-muted-foreground">• {memberRole.name}</span>
                          )}
                        </span>
                      </SelectItem>
                    );
                  })}
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
      {selectedRoleId && (
        <div className="flex items-center justify-between text-xs text-muted-foreground pt-1 border-t border-border/50">
          <div className="flex items-center gap-1">
            {selectedRate > 0 ? (
              <>
                <DollarSign className="h-3 w-3" />
                <span>
                  Rate: <span className="font-medium text-foreground">${selectedRate}/hr</span>
                  <span className="ml-1">({selectedRole?.name})</span>
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
