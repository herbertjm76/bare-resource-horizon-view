
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Edit, Plus } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useCompany } from '@/context/CompanyContext';
import { toast } from 'sonner';
import { ColorPicker } from './ColorPicker';
import { defaultStageColor } from './utils/stageColorUtils';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ItemActions } from './common/ItemActions';

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
  const [newColor, setNewColor] = useState(defaultStageColor);
  const [editId, setEditId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editColor, setEditColor] = useState(defaultStageColor);
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
        
        if (error) {
          console.error('Error fetching stages:', error);
          throw error;
        }
        
        console.log('Fetched stages:', data);
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
      console.log('Adding stage with data:', {
        name: newStage.trim(),
        color: newColor,
        company_id: company.id
      });

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
      
      if (error) {
        console.error('Database error:', error);
        throw error;
      }
      
      console.log('Stage added successfully:', data);
      
      if (data && data.length > 0) {
        setStages([...stages, data[0]]);
        setNewStage('');
        setNewColor(defaultStageColor);
        setDialogOpen(false);
        toast.success('Stage added successfully');
      }
    } catch (error) {
      console.error('Error adding stage:', error);
      toast.error(`Failed to add stage: ${error.message || 'Unknown error'}`);
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
          ? { 
              ...stage, 
              name: editName.trim(), 
              color: editColor
            }
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
    setEditColor(stage.color || defaultStageColor);
    setEditDialogOpen(true);
  };

  return (
    <Card className="border shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6">
        <div>
          <CardTitle className="text-2xl font-semibold mb-1.5">Project Stages</CardTitle>
          <p className="text-sm text-muted-foreground">
            Define and manage the stages of your projects to track progress effectively
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setDialogOpen(true)} size="sm" className="gap-2">
            <Plus className="h-4 w-4" />
            Add Stage
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-2">
        <div className="border rounded-lg p-4 bg-white">
          {loading ? (
            <div className="text-center py-10">Loading stages...</div>
          ) : stages.length === 0 ? (
            <div className="text-center py-10 border-dashed border rounded">
              No project stages defined yet. Click 'Add Stage' to create your first project stage.
            </div>
          ) : (
            <div className="space-y-2">
              {stages.map((stage) => (
                <div
                  key={stage.id}
                  className="group flex items-center justify-between p-3 border rounded-md hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="font-medium px-3 py-1 rounded"
                      style={{ backgroundColor: stage.color || defaultStageColor }}
                    >
                      {stage.name}
                    </div>
                  </div>
                  <ItemActions 
                    onEdit={() => openEditDialog(stage)}
                    onDelete={() => deleteStage(stage.id)}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
      
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Project Stage</DialogTitle>
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
                placeholder="Enter stage name"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Color</label>
              <ColorPicker
                selectedColor={newColor}
                onColorChange={setNewColor}
                className="mt-2"
              />
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
              <label className="text-sm font-medium">Color</label>
              <ColorPicker
                selectedColor={editColor}
                onColorChange={setEditColor}
                className="mt-2"
              />
            </div>
            <div className="pt-4">
              <Button onClick={updateStage}>Update Stage</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default StagesTab;
