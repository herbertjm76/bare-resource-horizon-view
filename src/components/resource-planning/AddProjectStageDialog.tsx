import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Plus, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useCompany } from '@/context/CompanyContext';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';

interface OfficeStage {
  id: string;
  name: string;
  code?: string | null;
}

interface AddProjectStageDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: string;
  projectName: string;
  currentStages: string[];
  availableStages: OfficeStage[];
  onSuccess?: () => void;
}

export const AddProjectStageDialog: React.FC<AddProjectStageDialogProps> = ({
  open,
  onOpenChange,
  projectId,
  projectName,
  currentStages,
  availableStages,
  onSuccess
}) => {
  const { company } = useCompany();
  const queryClient = useQueryClient();
  const [selectedStages, setSelectedStages] = useState<string[]>(currentStages);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [newStageName, setNewStageName] = useState('');
  const [newStageCode, setNewStageCode] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isCreatingStage, setIsCreatingStage] = useState(false);

  const toggleStage = (stageName: string) => {
    setSelectedStages(prev =>
      prev.includes(stageName)
        ? prev.filter(s => s !== stageName)
        : [...prev, stageName]
    );
  };

  const handleCreateNewStage = async () => {
    if (!company?.id || !newStageName.trim()) return;

    setIsCreatingStage(true);
    try {
      // Get max order_index
      const { data: existingStages } = await supabase
        .from('office_stages')
        .select('order_index')
        .eq('company_id', company.id)
        .order('order_index', { ascending: false })
        .limit(1);

      const nextOrderIndex = (existingStages?.[0]?.order_index || 0) + 1;

      const { data: newStage, error } = await supabase
        .from('office_stages')
        .insert({
          company_id: company.id,
          name: newStageName.trim(),
          code: newStageCode.trim() || newStageName.trim().substring(0, 3).toUpperCase(),
          order_index: nextOrderIndex
        })
        .select()
        .single();

      if (error) throw error;

      // Add to selected stages
      setSelectedStages(prev => [...prev, newStage.name]);
      
      // Reset form
      setNewStageName('');
      setNewStageCode('');
      setIsCreatingNew(false);

      // Invalidate queries to refresh stage list
      queryClient.invalidateQueries({ queryKey: ['office-stages'] });
      
      toast.success(`Stage "${newStage.name}" created`);
    } catch (error: any) {
      console.error('Error creating stage:', error);
      toast.error(error.message || 'Failed to create stage');
    } finally {
      setIsCreatingStage(false);
    }
  };

  const handleSave = async () => {
    if (!projectId) return;

    setIsSaving(true);
    try {
      // Update project stages
      const { error: projectError } = await supabase
        .from('projects')
        .update({ stages: selectedStages })
        .eq('id', projectId);

      if (projectError) throw projectError;

      // Create project_stages entries for new stages
      for (const stageName of selectedStages) {
        const { data: existingStage } = await supabase
          .from('project_stages')
          .select('id')
          .eq('project_id', projectId)
          .eq('stage_name', stageName)
          .maybeSingle();

        if (!existingStage) {
          await supabase
            .from('project_stages')
            .insert({
              project_id: projectId,
              stage_name: stageName,
              fee: 0,
              company_id: company?.id
            });
        }
      }

      // Invalidate queries
      queryClient.invalidateQueries({ queryKey: ['planning-projects'] });
      queryClient.invalidateQueries({ queryKey: ['project-stages-data'] });

      toast.success('Project stages updated');
      onSuccess?.();
      onOpenChange(false);
    } catch (error: any) {
      console.error('Error updating project stages:', error);
      toast.error(error.message || 'Failed to update stages');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Manage Project Stages</DialogTitle>
          <DialogDescription>
            Select stages for <span className="font-medium">{projectName}</span>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Available Stages */}
          <div>
            <Label className="text-sm font-medium mb-2 block">Available Stages</Label>
            <ScrollArea className="h-48 border rounded-lg p-2">
              <div className="space-y-2">
                {availableStages.map(stage => (
                  <label
                    key={stage.id}
                    htmlFor={`stage-${stage.id}`}
                    className="flex items-center gap-3 p-2 rounded-md hover:bg-muted/50 cursor-pointer"
                  >
                    <Checkbox
                      id={`stage-${stage.id}`}
                      checked={selectedStages.includes(stage.name)}
                      onCheckedChange={() => toggleStage(stage.name)}
                    />
                    <div className="flex-1 flex items-center">
                      <span className="text-sm font-medium">{stage.name}</span>
                      {stage.code && (
                        <Badge variant="outline" className="ml-2 text-xs">
                          {stage.code}
                        </Badge>
                      )}
                    </div>
                  </label>
                ))}

                {availableStages.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No stages defined. Create your first stage below.
                  </p>
                )}
              </div>
            </ScrollArea>
          </div>

          {/* Create New Stage */}
          {isCreatingNew ? (
            <div className="space-y-3 p-3 border rounded-lg bg-muted/30">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="new-stage-name" className="text-xs">Stage Name</Label>
                  <Input
                    id="new-stage-name"
                    value={newStageName}
                    onChange={(e) => setNewStageName(e.target.value)}
                    placeholder="e.g., Concept Design"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="new-stage-code" className="text-xs">Code (optional)</Label>
                  <Input
                    id="new-stage-code"
                    value={newStageCode}
                    onChange={(e) => setNewStageCode(e.target.value)}
                    placeholder="e.g., CD"
                    className="mt-1"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={handleCreateNewStage}
                  disabled={!newStageName.trim() || isCreatingStage}
                >
                  {isCreatingStage && <Loader2 className="h-3 w-3 mr-1 animate-spin" />}
                  Create Stage
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    setIsCreatingNew(false);
                    setNewStageName('');
                    setNewStageCode('');
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <Button
              variant="outline"
              size="sm"
              className="w-full gap-2"
              onClick={() => setIsCreatingNew(true)}
            >
              <Plus className="h-4 w-4" />
              Create New Stage
            </Button>
          )}

          {/* Selected Summary */}
          {selectedStages.length > 0 && (
            <div className="flex flex-wrap gap-1.5 p-2 bg-primary/5 rounded-lg">
              {selectedStages.map(stage => (
                <Badge key={stage} variant="secondary" className="text-xs">
                  {stage}
                </Badge>
              ))}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            Save Stages
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
