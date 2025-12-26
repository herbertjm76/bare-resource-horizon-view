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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useCompany } from '@/context/CompanyContext';
import { toast } from 'sonner';
import { useQuery, useQueryClient } from '@tanstack/react-query';

interface QuickCreateProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export const QuickCreateProjectDialog: React.FC<QuickCreateProjectDialogProps> = ({
  open,
  onOpenChange,
  onSuccess
}) => {
  const { company } = useCompany();
  const queryClient = useQueryClient();
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [status, setStatus] = useState('Planning');
  const [isSaving, setIsSaving] = useState(false);

  // Fetch offices for required office_id
  const { data: offices = [] } = useQuery({
    queryKey: ['offices'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('offices')
        .select('id, name')
        .limit(10);
      if (error) throw error;
      return data || [];
    }
  });

  const handleCreate = async () => {
    if (!company?.id || !name.trim() || !code.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (offices.length === 0) {
      toast.error('No office available. Please create an office first.');
      return;
    }

    setIsSaving(true);
    try {
      const { data: newProject, error } = await supabase
        .from('projects')
        .insert({
          company_id: company.id,
          name: name.trim(),
          code: code.trim().toUpperCase(),
          status,
          current_stage: 'Planning',
          country: 'US',
          office_id: offices[0].id,
          target_profit_percentage: 0,
          stages: []
        })
        .select()
        .single();

      if (error) throw error;

      // Invalidate queries
      queryClient.invalidateQueries({ queryKey: ['planning-projects'] });

      toast.success(`Project "${newProject.name}" created`);
      
      // Reset form
      setName('');
      setCode('');
      setStatus('Planning');
      
      onSuccess?.();
      onOpenChange(false);
    } catch (error: any) {
      console.error('Error creating project:', error);
      toast.error(error.message || 'Failed to create project');
    } finally {
      setIsSaving(false);
    }
  };

  // Auto-generate code from name
  const handleNameChange = (value: string) => {
    setName(value);
    if (!code || code === name.substring(0, 4).toUpperCase().replace(/\s/g, '')) {
      setCode(value.substring(0, 4).toUpperCase().replace(/\s/g, ''));
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Quick Create Project</DialogTitle>
          <DialogDescription>
            Create a new project for resource planning
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="project-name">Project Name *</Label>
            <Input
              id="project-name"
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="e.g., Office Building Renovation"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="project-code">Project Code *</Label>
              <Input
                id="project-code"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="e.g., OBR"
                maxLength={10}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="project-status">Status</Label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger id="project-status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Planning">Planning</SelectItem>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="On Hold">On Hold</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleCreate} disabled={isSaving || !name.trim() || !code.trim()}>
            {isSaving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            Create Project
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
