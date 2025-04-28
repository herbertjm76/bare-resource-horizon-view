
import React, { useState } from 'react';
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
import { useCompany } from '@/context/CompanyContext';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';
import { toast } from 'sonner';

type Profile = Database['public']['Tables']['profiles']['Row'];

interface AddResourceDialogProps {
  projectId: string;
  onClose: () => void;
  onAdd: (resource: { staffId: string, name: string }) => void;
}

export const AddResourceDialog: React.FC<AddResourceDialogProps> = ({ 
  projectId, 
  onClose, 
  onAdd
}) => {
  const [selectedStaff, setSelectedStaff] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [teamMembers, setTeamMembers] = useState<Profile[]>([]);
  const { company } = useCompany();
  
  // Fetch team members when dialog opens
  React.useEffect(() => {
    const fetchTeamMembers = async () => {
      if (!company?.id) return;
      
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('company_id', company.id);
          
        if (error) throw error;
        setTeamMembers(data || []);
      } catch (err: any) {
        console.error('Error fetching team members:', err);
        toast.error('Failed to load team members');
      }
    };
    
    fetchTeamMembers();
  }, [company]);
  
  const handleAdd = async () => {
    if (!selectedStaff) return;
    
    setLoading(true);
    
    try {
      // Here you would add the resource to the project in your database
      // For now, we'll just call onAdd
      const staff = teamMembers.find(m => m.id === selectedStaff);
      if (!staff) throw new Error('Staff member not found');
      
      onAdd({ 
        staffId: staff.id, 
        name: `${staff.first_name || ''} ${staff.last_name || ''}`.trim() 
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
            <Label htmlFor="staff">Team Member</Label>
            <Select value={selectedStaff} onValueChange={setSelectedStaff}>
              <SelectTrigger>
                <SelectValue placeholder="Select team member" />
              </SelectTrigger>
              <SelectContent>
                {teamMembers.map(member => (
                  <SelectItem key={member.id} value={member.id}>
                    {`${member.first_name || ''} ${member.last_name || ''}`.trim() || member.email}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button isLoading={loading} onClick={handleAdd} disabled={!selectedStaff || loading}>
            Add Resource
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
