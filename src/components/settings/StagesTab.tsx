
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { PlusCircle, Edit, Trash2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useCompany } from '@/context/CompanyContext';
import { toast } from 'sonner';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Stage {
  id: string;
  name: string;
  order_index: number;
  color?: string;
  company_id: string;
  created_at: string;
  updated_at: string;
}

export const StagesTab: React.FC = () => {
  const [stages, setStages] = useState<Stage[]>([]);
  const [loading, setLoading] = useState(true);
  const [newStage, setNewStage] = useState('');
  const [newColor, setNewColor] = useState('#E5DEFF');
  const [editId, setEditId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editColor, setEditColor] = useState('#E5DEFF');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const { company } = useCompany();

  React.useEffect(() => {
    if (!company?.id) return;
    
    const fetchStages = async () => {
      setLoading(true);
      
      try {
        const { data, error } = await supabase
          .from('office_stages')
          .select('*')
          .eq('company_id', company.id)
          .order('order_index', { ascending: true });
        
        if (error) throw error;
        setStages(data || []);
      } catch (error) {
        console.error('Error fetching stages:', error);
        toast.error('Failed to load project stages');
      } finally {
        setLoading(false);
      }
    };
    
    fetchStages();
  }, [company?.id]);

  const addStage = async () => {
    if (!company?.id) {
      toast.error('Company information not available');
      return;
    }
    
    if (!newStage.trim()) {
      toast.error('Stage name cannot be empty');
      return;
    }
    
    try {
      // Get the next order index
      const nextOrderIndex = stages.length > 0 
        ? Math.max(...stages.map(stage => stage.order_index)) + 1 
        : 0;
      
      const { data, error } = await supabase
        .from('office_stages')
        .insert({
          name: newStage.trim(),
          color: newColor,
          order_index: nextOrderIndex,
          company_id: company.id
        })
        .select();
      
      if (error) throw error;
      
      if (data && data.length > 0) {
        setStages([...stages, data[0]]);
        setNewStage('');
        setNewColor('#E5DEFF');
        setDialogOpen(false);
        toast.success('Stage added successfully');
      }
    } catch (error) {
      console.error('Error adding stage:', error);
      toast.error('Failed to add stage');
    }
  };

  const updateStage = async () => {
    if (!editId || !company?.id) return;
    
    try {
      const { error } = await supabase
        .from('office_stages')
        .update({
          name: editName.trim(),
          color: editColor
        })
        .eq('id', editId);
      
      if (error) throw error;
      
      setStages(stages.map(stage => 
        stage.id === editId 
          ? { ...stage, name: editName.trim(), color: editColor }
          : stage
      ));
      
      setEditDialogOpen(false);
      toast.success('Stage updated successfully');
    } catch (error) {
      console.error('Error updating stage:', error);
      toast.error('Failed to update stage');
    }
  };

  const deleteStage = async (id: string) => {
    if (!company?.id) return;
    
    if (!confirm('Are you sure you want to delete this stage?')) return;
    
    try {
      const { error } = await supabase
        .from('office_stages')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      setStages(stages.filter(stage => stage.id !== id));
      toast.success('Stage deleted successfully');
    } catch (error) {
      console.error('Error deleting stage:', error);
      toast.error('Failed to delete stage');
    }
  };

  const openEditDialog = (stage: Stage) => {
    setEditId(stage.id);
    setEditName(stage.name);
    setEditColor(stage.color || '#E5DEFF');
    setEditDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Project Stages</h2>
        
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="default">
              <PlusCircle className="w-4 h-4 mr-2" />
              Add Stage
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Project Stage</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <label htmlFor="stageName" className="text-sm font-medium">
                  Stage Name
                </label>
                <Input
                  id="stageName"
                  value={newStage}
                  onChange={(e) => setNewStage(e.target.value)}
                  placeholder="e.g., Schematic Design"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="stageColor" className="text-sm font-medium">
                  Color
                </label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    id="stageColor"
                    value={newColor}
                    onChange={(e) => setNewColor(e.target.value)}
                    className="h-10 min-w-[3rem] cursor-pointer rounded border"
                  />
                  <Input 
                    value={newColor} 
                    onChange={(e) => setNewColor(e.target.value)}
                    placeholder="#E5DEFF" 
                  />
                </div>
              </div>
              <div className="pt-4">
                <Button onClick={addStage}>Add Stage</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
        
        <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Project Stage</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <label htmlFor="editStageName" className="text-sm font-medium">
                  Stage Name
                </label>
                <Input
                  id="editStageName"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="editStageColor" className="text-sm font-medium">
                  Color
                </label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    id="editStageColor"
                    value={editColor}
                    onChange={(e) => setEditColor(e.target.value)}
                    className="h-10 min-w-[3rem] cursor-pointer rounded border"
                  />
                  <Input 
                    value={editColor} 
                    onChange={(e) => setEditColor(e.target.value)}
                    placeholder="#E5DEFF" 
                  />
                </div>
              </div>
              <div className="pt-4">
                <Button onClick={updateStage}>Update Stage</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      
      {loading ? (
        <div className="text-center py-10">Loading stages...</div>
      ) : stages.length === 0 ? (
        <div className="text-center py-10 border rounded-md border-dashed">
          No project stages defined yet. Click 'Add Stage' to create your first project stage.
        </div>
      ) : (
        <div className="border rounded-md overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Color</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {stages.map((stage) => (
                <TableRow key={stage.id}>
                  <TableCell className="font-medium">{stage.name}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-6 h-6 rounded" 
                        style={{ backgroundColor: stage.color || '#E5DEFF' }} 
                      />
                      <span>{stage.color || '#E5DEFF'}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => openEditDialog(stage)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => deleteStage(stage.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default StagesTab;
