
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Edit, Trash2 } from "lucide-react";
import { useOfficeSettings } from "@/context/OfficeSettingsContext";
import { useCompany } from "@/context/CompanyContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const DepartmentsTab = () => {
  const { departments, setDepartments, loading } = useOfficeSettings();
  const { company } = useCompany();
  const [editingDepartment, setEditingDepartment] = useState<any>(null);
  const [newDepartmentName, setNewDepartmentName] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [selectedDepartments, setSelectedDepartments] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!newDepartmentName.trim() || !company) return;

    setIsSubmitting(true);
    try {
      if (editingDepartment) {
        const { data, error } = await supabase
          .from('office_departments')
          .update({ name: newDepartmentName.trim() })
          .eq('id', editingDepartment.id)
          .select()
          .single();

        if (error) throw error;

        setDepartments(departments.map(dept => 
          dept.id === editingDepartment.id ? data : dept
        ));
        toast.success('Department updated successfully');
      } else {
        const { data, error } = await supabase
          .from('office_departments')
          .insert([{
            name: newDepartmentName.trim(),
            company_id: company.id
          }])
          .select()
          .single();

        if (error) throw error;

        setDepartments([...departments, data]);
        toast.success('Department added successfully');
      }

      setNewDepartmentName("");
      setEditingDepartment(null);
    } catch (error) {
      console.error('Error saving department:', error);
      toast.error('Failed to save department');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (department: any) => {
    setEditingDepartment(department);
    setNewDepartmentName(department.name);
  };

  const handleDelete = async (department: any) => {
    if (!confirm('Are you sure you want to delete this department?')) return;

    try {
      const { error } = await supabase
        .from('office_departments')
        .delete()
        .eq('id', department.id);

      if (error) throw error;

      setDepartments(departments.filter(d => d.id !== department.id));
      toast.success('Department deleted successfully');
    } catch (error) {
      console.error('Error deleting department:', error);
      toast.error('Failed to delete department');
    }
  };

  const handleBulkDelete = async () => {
    if (selectedDepartments.length === 0) return;
    
    if (!confirm(`Are you sure you want to delete ${selectedDepartments.length} department(s)?`)) return;

    try {
      const { error } = await supabase
        .from('office_departments')
        .delete()
        .in('id', selectedDepartments);

      if (error) throw error;

      setDepartments(departments.filter(dept => !selectedDepartments.includes(dept.id)));
      setSelectedDepartments([]);
      setEditMode(false);
      toast.success('Departments deleted successfully');
    } catch (error) {
      console.error('Error deleting departments:', error);
      toast.error('Failed to delete departments');
    }
  };

  const handleSelectDepartment = (deptId: string) => {
    setSelectedDepartments(prev => 
      prev.includes(deptId) 
        ? prev.filter(id => id !== deptId)
        : [...prev, deptId]
    );
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="text-muted-foreground">Loading departments...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle>Departments</CardTitle>
        <div className="flex gap-2">
          <Button 
            size="sm" 
            variant={editMode ? "secondary" : "outline"}
            onClick={() => {
              setEditMode(!editMode);
              setSelectedDepartments([]);
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
            Define organizational departments to categorize team members and projects.
          </div>
          
          {editMode && selectedDepartments.length > 0 && (
            <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
              <span className="text-sm text-muted-foreground">
                {selectedDepartments.length} department(s) selected
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
              placeholder="Enter department name..."
              value={newDepartmentName}
              onChange={(e) => setNewDepartmentName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
            />
            <Button onClick={handleSubmit} disabled={isSubmitting || !newDepartmentName.trim()}>
              <Plus className="h-4 w-4 mr-2" />
              {editingDepartment ? 'Update' : 'Add'} Department
            </Button>
            {editingDepartment && (
              <Button variant="outline" onClick={() => {
                setEditingDepartment(null);
                setNewDepartmentName("");
              }}>
                Cancel
              </Button>
            )}
          </div>

          {departments.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No departments defined yet. Add your first department above.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
              {departments.map((department) => (
                <Card key={department.id} className="p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {editMode && (
                        <input
                          type="checkbox"
                          checked={selectedDepartments.includes(department.id)}
                          onChange={() => handleSelectDepartment(department.id)}
                          className="rounded"
                        />
                      )}
                      <span className="font-medium text-sm">{department.name}</span>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(department)}
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(department)}
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

export default DepartmentsTab;
