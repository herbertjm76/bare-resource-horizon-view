
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Edit, Trash2 } from "lucide-react";
import { useOfficeSettings } from "@/context/OfficeSettingsContext";
import { useCompany } from "@/context/CompanyContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ColorPicker } from "./ColorPicker";

export const StagesTab = () => {
  const { office_stages, setOfficeStages, loading } = useOfficeSettings();
  const { company } = useCompany();
  const [editingStage, setEditingStage] = useState<any>(null);
  const [newStageName, setNewStageName] = useState("");
  const [newStageColor, setNewStageColor] = useState("#E5DEFF");
  const [editMode, setEditMode] = useState(false);
  const [selectedStages, setSelectedStages] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!newStageName.trim() || !company) return;

    setIsSubmitting(true);
    try {
      if (editingStage) {
        const { data, error } = await supabase
          .from('office_stages')
          .update({ 
            name: newStageName.trim(),
            color: newStageColor
          })
          .eq('id', editingStage.id)
          .select()
          .single();

        if (error) throw error;

        setOfficeStages(office_stages.map(stage => 
          stage.id === editingStage.id ? data : stage
        ));
        toast.success('Stage updated successfully');
      } else {
        const { data, error } = await supabase
          .from('office_stages')
          .insert([{
            name: newStageName.trim(),
            color: newStageColor,
            company_id: company.id
          }])
          .select()
          .single();

        if (error) throw error;

        setOfficeStages([...office_stages, data]);
        toast.success('Stage added successfully');
      }

      setNewStageName("");
      setNewStageColor("#E5DEFF");
      setEditingStage(null);
    } catch (error) {
      console.error('Error saving stage:', error);
      toast.error('Failed to save stage');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (stage: any) => {
    setEditingStage(stage);
    setNewStageName(stage.name);
    setNewStageColor(stage.color || "#E5DEFF");
  };

  const handleDelete = async (stage: any) => {
    if (!confirm('Are you sure you want to delete this stage?')) return;

    try {
      const { error } = await supabase
        .from('office_stages')
        .delete()
        .eq('id', stage.id);

      if (error) throw error;

      setOfficeStages(office_stages.filter(s => s.id !== stage.id));
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

      setOfficeStages(office_stages.filter(stage => !selectedStages.includes(stage.id)));
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

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="text-muted-foreground">Loading stages...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle>Project Stages</CardTitle>
        <div className="flex gap-2">
          <Button 
            size="sm" 
            variant={editMode ? "secondary" : "outline"}
            onClick={() => {
              setEditMode(!editMode);
              setSelectedStages([]);
            }}
          >
            <Edit className="h-4 w-4 mr-2" />
            {editMode ? "Done" : "Edit"}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="text-sm text-muted-foreground">
            Define project stages that represent different phases of your project workflow.
          </div>
          
          {editMode && selectedStages.length > 0 && (
            <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
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

          <div className="flex gap-2">
            <Input
              placeholder="Enter stage name..."
              value={newStageName}
              onChange={(e) => setNewStageName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
            />
            <ColorPicker
              color={newStageColor}
              onChange={setNewStageColor}
            />
            <Button onClick={handleSubmit} disabled={isSubmitting || !newStageName.trim()}>
              <Plus className="h-4 w-4 mr-2" />
              {editingStage ? 'Update' : 'Add'} Stage
            </Button>
            {editingStage && (
              <Button variant="outline" onClick={() => {
                setEditingStage(null);
                setNewStageName("");
                setNewStageColor("#E5DEFF");
              }}>
                Cancel
              </Button>
            )}
          </div>

          {office_stages.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No stages defined yet. Add your first stage above.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
              {office_stages.map((stage) => (
                <Card key={stage.id} className="p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {editMode && (
                        <input
                          type="checkbox"
                          checked={selectedStages.includes(stage.id)}
                          onChange={() => handleSelectStage(stage.id)}
                          className="rounded"
                        />
                      )}
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: stage.color || "#E5DEFF" }}
                      />
                      <span className="font-medium text-sm">{stage.name}</span>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(stage)}
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(stage)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default StagesTab;
