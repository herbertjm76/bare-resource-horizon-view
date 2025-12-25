import React, { useState } from 'react';
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
import { PlusCircle } from 'lucide-react';
import { ResourceTypeToggle } from './ResourceTypeToggle';
import { useOfficeRoles } from '@/hooks/useOfficeRoles';
import { useResourceOptions } from '@/components/resources/dialogs/useResourceOptions';

interface ResourceSelectorProps {
  onAdd: (data: {
    referenceId: string;
    referenceType: 'role' | 'member';
    plannedQuantity: number;
    plannedHoursPerPerson: number;
  }) => void;
  isLoading?: boolean;
}

export const ResourceSelector: React.FC<ResourceSelectorProps> = ({
  onAdd,
  isLoading = false
}) => {
  const [resourceType, setResourceType] = useState<'role' | 'member'>('role');
  const [selectedId, setSelectedId] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [hoursPerPerson, setHoursPerPerson] = useState(40);

  const { data: roles = [], isLoading: rolesLoading } = useOfficeRoles();
  const { resourceOptions: members, loading: membersLoading } = useResourceOptions();

  const handleAdd = () => {
    if (!selectedId) return;

    onAdd({
      referenceId: selectedId,
      referenceType: resourceType,
      plannedQuantity: quantity,
      plannedHoursPerPerson: hoursPerPerson
    });

    // Reset form
    setSelectedId('');
    setQuantity(1);
    setHoursPerPerson(40);
  };

  const isDisabled = !selectedId || isLoading;

  return (
    <div className="space-y-3 p-4 border rounded-lg bg-muted/30">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium">Add Resource</Label>
        <ResourceTypeToggle value={resourceType} onChange={(v) => {
          setResourceType(v);
          setSelectedId('');
        }} />
      </div>

      <div className="grid grid-cols-12 gap-3 items-end">
        {/* Resource selector */}
        <div className="col-span-5">
          <Label className="text-xs text-muted-foreground mb-1.5 block">
            {resourceType === 'role' ? 'Role' : 'Team Member'}
          </Label>
          <Select value={selectedId} onValueChange={setSelectedId}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder={`Select ${resourceType === 'role' ? 'a role' : 'a team member'}`} />
            </SelectTrigger>
            <SelectContent>
              {resourceType === 'role' ? (
                rolesLoading ? (
                  <SelectItem value="_loading" disabled>Loading...</SelectItem>
                ) : roles.length === 0 ? (
                  <SelectItem value="_empty" disabled>No roles defined</SelectItem>
                ) : (
                  roles.map((role) => (
                    <SelectItem key={role.id} value={role.id}>
                      {role.name} ({role.code})
                    </SelectItem>
                  ))
                )
              ) : (
                membersLoading ? (
                  <SelectItem value="_loading" disabled>Loading...</SelectItem>
                ) : members.length === 0 ? (
                  <SelectItem value="_empty" disabled>No team members</SelectItem>
                ) : (
                  members.map((member) => (
                    <SelectItem key={member.id} value={member.id}>
                      <span className="flex items-center gap-2">
                        {member.name}
                        {member.type === 'pre-registered' && (
                          <span className="text-xs text-muted-foreground">(pending)</span>
                        )}
                      </span>
                    </SelectItem>
                  ))
                )
              )}
            </SelectContent>
          </Select>
        </div>

        {/* Quantity */}
        <div className="col-span-2">
          <Label className="text-xs text-muted-foreground mb-1.5 block">Quantity</Label>
          <Input
            type="number"
            min={1}
            step={1}
            value={quantity}
            onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
            className="text-center"
          />
        </div>

        {/* Hours per person */}
        <div className="col-span-3">
          <Label className="text-xs text-muted-foreground mb-1.5 block">Hours/Person</Label>
          <Input
            type="number"
            min={1}
            step={1}
            value={hoursPerPerson}
            onChange={(e) => setHoursPerPerson(Math.max(1, parseInt(e.target.value) || 1))}
            className="text-center"
          />
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
      {selectedId && (
        <div className="text-xs text-muted-foreground text-right">
          Total: {quantity} × {hoursPerPerson} = <span className="font-medium text-foreground">{quantity * hoursPerPerson} hours</span>
        </div>
      )}
    </div>
  );
};
