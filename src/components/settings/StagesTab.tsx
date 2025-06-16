
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Edit, Plus, Trash2, GripVertical } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useCompany } from '@/context/CompanyContext';
import { toast } from 'sonner';
import { ColorPicker } from './ColorPicker';
import { defaultStageColor } from './utils/stageColorUtils';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ItemActions } from './common/ItemActions';
import { Checkbox } from "@/components/ui/checkbox";

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
  const [editMode, setEditMode] = useState(false);
  const [selectedStages, setSelectedStages] = useState<string[]>([]);
  const [draggedItem, setDraggedItem] = useState<Stage | null>(null);
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

  const handleBulkDelete = async () => {
    if (selectedStages.length === 0) return;
    
    if (!confirm(`Are you sure you want to delete ${selectedStages.length} stage(s)?`)) return;
    
    try {
      const { error } = await supabase
        .from('office_stages')
        .delete()
        .in('id', selectedStages);
      
      if (error) throw error;
      
      setStages(stages.filter(stage => !selectedStages.includes(stage.id)));
      setSelectedStages([]);
      setEditMode(false);
      toast.success('Stages deleted successfully');
    } catch (error) {
      console.error('Error deleting stages:', error);
      toast.error('Failed to delete stages');
    }
  };

  const handleSelectStage = (stageId: string) => {
    setSelectedStages(prev => 
      prev.includes(stageId) 
        ? prev.filter(id => id !== stageId)
        : [...prev, stageId]
    );
  };

  const openEditDialog = (stage: Stage) => {
    setEditId(stage.id);
    setEditName(stage.name);
    setEditColor(stage.color || defaultStageColor);
    setEditDialogOpen(true);
  };

  const handleDragStart = (e: React.DragEvent, stage: Stage) => {
    setDraggedItem(stage);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = async (e: React.DragEvent, targetStage: Stage) => {
    e.preventDefault();
    
    if (!draggedItem || draggedItem.id === targetStage.id) return;

    const draggedIndex = stages.findIndex(s => s.id === draggedItem.id);
    const targetIndex = stages.findIndex(s => s.id === targetStage.id);

    if (draggedIndex === -1 || targetIndex === -1) return;

    // Create new array with reordered items
    const newStages = [...stages];
    const [removed] = newStages.splice(draggedIndex, 1);
    newStages.splice(targetIndex, 0, removed);

    // Update order_index for all affected stages
    const updates = newStages.map((stage, index) => ({
      id: stage.id,
      order_index: index
    }));

    try {
      // Update in database
      for (const update of updates) {
        const { error } = await supabase
          .from('office_stages')
          .update({ order_index: update.order_index })
          .eq('id', update.id);
        
        if (error) throw error;
      }

      // Update local state
      setStages(newStages.map((stage, index) => ({
        ...stage,
        order_index: index
      })));

      toast.success('Stage order updated successfully');
    } catch (error) {
      console.error('Error updating stage order:', error);
      toast.error('Failed to update stage order');
    }

    setDraggedItem(null);
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
          <Button 
            size="sm" 
            variant={editMode ? "secondary" : "outline"}
            onClick={() => {
              setEditMode(!editMode);
              setSelectedStages([]);
            }}
            disabled={dialogOpen || editDialogOpen}
          >
            <Edit className="h-4 w-4 mr-2" />
            {editMode ? "Done" : "Edit"}
          </Button>
          <Button onClick={() => setDialogOpen(true)} size="sm" className="gap-2">
            <Plus className="h-4 w-4" />
            Add Stage
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-2">
        <div className="border rounded-lg p-4 bg-white">
          {editMode && selectedStages.length > 0 && (
            <div className="flex items-center gap-2 p-3 bg-muted rounded-lg mb-4">
              <span className="text-sm text-muted-foreground">
                {selectedStages.length} stage(s) selected
              </span>
              <Button 
                size="sm" 
                variant="destructive"
                onClick={handleBulkDelete}
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Delete Selected
              </Button>
            </div>
          )}

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
                  className={`group flex items-center justify-between p-3 border rounded-md transition-colors ${
                    editMode ? 'hover:bg-accent/30' : 'hover:bg-accent/50'
                  }`}
                  draggable={editMode}
                  onDragStart={(e) => handleDragStart(e, stage)}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, stage)}
                >
                  <div className="flex items-center gap-3">
                    {editMode && (
                      <>
                        <Checkbox
                          checked={selectedStages.includes(stage.id)}
                          onCheckedChange={() => handleSelectStage(stage.id)}
                        />
                        <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab" />
                      </>
                    )}
                    <div
                      className="font-medium px-3 py-1 rounded"
                      style={{ backgroundColor: stage.color || defaultStageColor }}
                    >
                      {stage.name}
                    </div>
                  </div>
                  {!editMode && (
                    <ItemActions 
                      onEdit={() => openEditDialog(stage)}
                      onDelete={() => deleteStage(stage.id)}
                    />
                  )}
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
