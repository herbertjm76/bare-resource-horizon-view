
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useResourceOptions } from './useResourceOptions';
import { useAddResource } from './useAddResource';
import { ResourceSelectOption } from './ResourceSelectOption';

interface AddResourceDialogProps {
  projectId: string;
  onClose: () => void;
  onAdd: (resource: { staffId: string, name: string, role?: string, isPending?: boolean }) => void;
}

export const AddResourceDialog: React.FC<AddResourceDialogProps> = ({ 
  projectId, 
  onClose, 
  onAdd
}) => {
  const { resourceOptions, loading: optionsLoading } = useResourceOptions();
  const { 
    selectedResource, 
    loading: addLoading, 
    setSelectedResource, 
    handleAdd 
  } = useAddResource({ projectId, onAdd, onClose });
  
  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Resource to Project</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="resource">Team Member</Label>
            <Select value={selectedResource} onValueChange={setSelectedResource}>
              <SelectTrigger>
                <SelectValue placeholder="Select team member" />
              </SelectTrigger>
              <SelectContent>
                {resourceOptions.length === 0 && (
                  <div className="text-center py-2 text-sm text-muted-foreground">
                    {optionsLoading ? 'Loading...' : 'No team members found'}
                  </div>
                )}
                
                {resourceOptions.map(member => (
                  <SelectItem key={member.id} value={member.id}>
                    <ResourceSelectOption member={member} />
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button 
            isLoading={addLoading} 
            onClick={handleAdd} 
            disabled={!selectedResource || addLoading || optionsLoading}
          >
            Add Resource
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
