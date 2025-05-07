
import React, { useState, useEffect } from 'react';
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
import { Badge } from "@/components/ui/badge";
import { useCompany } from '@/context/CompanyContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

type ResourceOption = {
  id: string;
  name: string;
  email: string;
  type: 'active' | 'pre-registered';
  role?: string;
};

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
  const [selectedResource, setSelectedResource] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [resourceOptions, setResourceOptions] = useState<ResourceOption[]>([]);
  const { company } = useCompany();
  
  // Fetch team members and pre-registered invites when dialog opens
  useEffect(() => {
    const fetchResources = async () => {
      if (!company?.id) {
        console.error('No company ID available');
        toast.error('Company information not available');
        return;
      }
      
      try {
        setLoading(true);
        console.log('Fetching resources for company:', company.id);
        
        // Fetch active team members from profiles
        const { data: activeMembers, error: activeError } = await supabase
          .from('profiles')
          .select('*')
          .eq('company_id', company.id);
          
        if (activeError) {
          console.error('Error fetching active members:', activeError);
          throw activeError;
        }
        
        // Fetch pre-registered team members from invites
        const { data: preregisteredMembers, error: inviteError } = await supabase
          .from('invites')
          .select('*')
          .eq('company_id', company.id)
          .eq('invitation_type', 'pre_registered')
          .eq('status', 'pending');
          
        if (inviteError) {
          console.error('Error fetching pre-registered members:', inviteError);
          throw inviteError;
        }
        
        console.log('Fetched active members:', activeMembers?.length || 0);
        console.log('Fetched pre-registered members:', preregisteredMembers?.length || 0);
        
        // Combine and format the resources
        const formattedResources: ResourceOption[] = [
          // Active members
          ...(activeMembers || []).map((member) => ({
            id: member.id,
            name: `${member.first_name || ''} ${member.last_name || ''}`.trim() || member.email,
            email: member.email,
            type: 'active' as const,
            role: member.job_title
          })),
          
          // Pre-registered members
          ...(preregisteredMembers || []).map((invite) => ({
            id: invite.id,
            name: `${invite.first_name || ''} ${invite.last_name || ''}`.trim() || invite.email,
            email: invite.email || '',
            type: 'pre-registered' as const,
            role: invite.job_title
          }))
        ];
        
        setResourceOptions(formattedResources);
      } catch (err: any) {
        console.error('Error fetching resources:', err);
        toast.error('Failed to load team members');
      } finally {
        setLoading(false);
      }
    };
    
    fetchResources();
  }, [company]);
  
  const handleAdd = async () => {
    if (!selectedResource) {
      toast.error('Please select a team member');
      return;
    }
    
    if (!company?.id) {
      toast.error('Company information not available');
      return;
    }
    
    if (!projectId) {
      toast.error('Project ID is required');
      return;
    }
    
    setLoading(true);
    
    try {
      console.log('Adding resource to project:', projectId);
      const resource = resourceOptions.find(r => r.id === selectedResource);
      
      if (!resource) {
        throw new Error('Selected resource not found');
      }
      
      console.log('Resource details:', resource);
      console.log('Company ID:', company.id);
      
      if (resource.type === 'pre-registered') {
        // Handle pre-registered resource (store in pending_resources)
        const { data, error } = await supabase
          .from('pending_resources')
          .insert({
            invite_id: resource.id,
            project_id: projectId,
            company_id: company.id,
            hours: 0 // Default hours
          })
          .select();
          
        if (error) {
          console.error('Error adding pending resource:', error);
          throw error;
        }
        
        console.log('Added pending resource:', data);
      } else {
        // Add active resource
        const { data, error } = await supabase
          .from('project_resources')
          .insert({
            staff_id: resource.id,
            project_id: projectId,
            company_id: company.id,
            hours: 0 // Default hours
          })
          .select();
          
        if (error) {
          console.error('Error adding active resource:', error);
          throw error;
        }
        
        console.log('Added active resource:', data);
      }
      
      // Call the onAdd callback with the resource details
      onAdd({ 
        staffId: resource.id, 
        name: resource.name,
        role: resource.role,
        isPending: resource.type === 'pre-registered'
      });
      
      toast.success(`${resource.name} added to project`);
      onClose();
    } catch (err: any) {
      console.error('Error adding resource:', err);
      toast.error('Failed to add resource: ' + (err.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };
  
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
                    {loading ? 'Loading...' : 'No team members found'}
                  </div>
                )}
                
                {resourceOptions.map(member => (
                  <SelectItem key={member.id} value={member.id}>
                    <div className="flex items-center justify-between w-full">
                      <span>{member.name}</span>
                      {member.type === 'pre-registered' && (
                        <Badge variant="outline" className="ml-2 text-xs">Pending</Badge>
                      )}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button variant="default" disabled={!selectedResource || loading} onClick={handleAdd}>
            {loading ? (
              <>
                <span className="mr-2">Adding...</span>
                <span className="animate-spin">⏳</span>
              </>
            ) : (
              'Add Resource'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
