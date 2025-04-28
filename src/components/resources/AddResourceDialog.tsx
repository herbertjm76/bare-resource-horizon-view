
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
import type { Database } from '@/integrations/supabase/types';
import { toast } from 'sonner';

type Profile = Database['public']['Tables']['profiles']['Row'];
type Invite = Database['public']['Tables']['invites']['Row'];

interface AddResourceDialogProps {
  projectId: string;
  onClose: () => void;
  onAdd: (resource: { staffId: string, name: string, role?: string }) => void;
}

type ResourceOption = {
  id: string;
  name: string;
  email: string;
  type: 'active' | 'pre-registered';
  role?: string;
};

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
  React.useEffect(() => {
    const fetchResources = async () => {
      if (!company?.id) return;
      
      try {
        setLoading(true);
        
        // Fetch active team members from profiles
        const { data: activeMembers, error: activeError } = await supabase
          .from('profiles')
          .select('*')
          .eq('company_id', company.id);
          
        if (activeError) throw activeError;
        
        // Fetch pre-registered team members from invites
        const { data: preregisteredMembers, error: inviteError } = await supabase
          .from('invites')
          .select('*')
          .eq('company_id', company.id)
          .eq('invitation_type', 'pre_registered')
          .eq('status', 'pending');
          
        if (inviteError) throw inviteError;
        
        // Combine and format the resources
        const formattedResources: ResourceOption[] = [
          // Active members
          ...(activeMembers || []).map((member: Profile) => ({
            id: member.id,
            name: `${member.first_name || ''} ${member.last_name || ''}`.trim() || member.email,
            email: member.email,
            type: 'active' as const,
            role: member.job_title
          })),
          
          // Pre-registered members
          ...(preregisteredMembers || []).map((invite: Invite) => ({
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
    if (!selectedResource) return;
    
    setLoading(true);
    
    try {
      const resource = resourceOptions.find(r => r.id === selectedResource);
      if (!resource) throw new Error('Resource not found');
      
      if (resource.type === 'pre-registered') {
        // Handle pre-registered resource (store in pending_resources)
        if (!company?.id) throw new Error('Company ID is required');
        
        await supabase
          .from('pending_resources')
          .insert({
            invite_id: resource.id,
            project_id: projectId,
            company_id: company.id,
            hours: 0 // Default hours
          });
      }
      
      // Call the onAdd callback with the resource details
      onAdd({ 
        staffId: resource.id, 
        name: resource.name,
        role: resource.role
      });
    } catch (err: any) {
      console.error('Error adding resource:', err);
      toast.error('Failed to add resource');
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
                
                {resourceOptions.length > 0 && resourceOptions.some(r => r.type === 'active') && (
                  <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
                    Active Members
                  </div>
                )}
                
                {resourceOptions
                  .filter(member => member.type === 'active')
                  .map(member => (
                    <SelectItem key={member.id} value={member.id}>
                      <div className="flex items-center justify-between w-full">
                        <span>{member.name}</span>
                      </div>
                    </SelectItem>
                  ))
                }
                
                {resourceOptions.length > 0 && resourceOptions.some(r => r.type === 'pre-registered') && (
                  <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground mt-2">
                    Pre-registered Members
                  </div>
                )}
                
                {resourceOptions
                  .filter(member => member.type === 'pre-registered')
                  .map(member => (
                    <SelectItem key={member.id} value={member.id}>
                      <div className="flex items-center justify-between w-full">
                        <span>{member.name}</span>
                        <Badge variant="outline" className="ml-2 text-xs">Pending</Badge>
                      </div>
                    </SelectItem>
                  ))
                }
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button isLoading={loading} onClick={handleAdd} disabled={!selectedResource || loading}>
            Add Resource
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
