
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash, Check, X, Edit, Trash2 } from "lucide-react";
import { useCompany } from "@/context/CompanyContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useOfficeSettings } from "@/context/OfficeSettingsContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";

export const DepartmentsTab = () => {
  const { company } = useCompany();
  const { departments, setDepartments, loading } = useOfficeSettings();
  const [newDepartmentName, setNewDepartmentName] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedDepartments, setSelectedDepartments] = useState<string[]>([]);

  const handleAddDepartment = async () => {
    if (!company || !newDepartmentName.trim()) return;

    setIsSubmitting(true);
    try {
      const { data, error } = await (supabase
        .from('office_departments' as any)
        .insert([
          {
            name: newDepartmentName.trim(),
            company_id: company.id,
          },
        ])
        .select() as any);

      if (error) throw error;

      if (data && data[0]) {
        setDepartments([...departments, {
          id: data[0].id,
          name: data[0].name,
          company_id: data[0].company_id,
        }]);
      }
      
      setNewDepartmentName("");
      setIsAdding(false);
      toast.success("Department added successfully");
    } catch (error: any) {
      toast.error(`Error adding department: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteDepartment = async (id: string) => {
    if (!confirm("Are you sure you want to delete this department?")) return;

    setIsSubmitting(true);
    try {
      const { error } = await (supabase
        .from('office_departments' as any)
        .delete()
        .eq("id", id) as any);

      if (error) throw error;

      setDepartments(departments.filter((dept) => dept.id !== id));
      toast.success("Department deleted successfully");
    } catch (error: any) {
      toast.error(`Error deleting department: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedDepartments.length === 0) return;
    
    if (!confirm(`Are you sure you want to delete ${selectedDepartments.length} department(s)?`)) return;

    setIsSubmitting(true);
    try {
      const { error } = await (supabase
        .from('office_departments' as any)
        .delete()
        .in("id", selectedDepartments) as any);

      if (error) throw error;

      setDepartments(departments.filter((dept) => !selectedDepartments.includes(dept.id)));
      setSelectedDepartments([]);
      setEditMode(false);
      toast.success("Departments deleted successfully");
    } catch (error: any) {
      toast.error(`Error deleting departments: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateDepartment = async (id: string) => {
    if (!editingName.trim()) return;

    setIsSubmitting(true);
    try {
      const { error } = await (supabase
        .from('office_departments' as any)
        .update({ name: editingName.trim() })
        .eq("id", id) as any);

      if (error) throw error;

      setDepartments(
        departments.map((dept) =>
          dept.id === id ? { ...dept, name: editingName.trim() } : dept
        )
      );
      setEditingId(null);
      toast.success("Department updated successfully");
    } catch (error: any) {
      toast.error(`Error updating department: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSelectDepartment = (departmentId: string) => {
    setSelectedDepartments(prev => 
      prev.includes(departmentId) 
        ? prev.filter(id => id !== departmentId)
        : [...prev, departmentId]
    );
  };

  const startEditing = (id: string, name: string) => {
    setEditingId(id);
    setEditingName(name);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <p className="text-muted-foreground">Loading departments...</p>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl font-semibold">Departments</CardTitle>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant={editMode ? "secondary" : "outline"}
            onClick={() => {
              setEditMode(!editMode);
              setSelectedDepartments([]);
            }}
            disabled={isAdding || editingId !== null}
          >
            <Edit className="h-4 w-4 mr-2" />
            {editMode ? "Done" : "Edit"}
          </Button>
          {!isAdding && (
            <Button
              onClick={() => setIsAdding(true)}
              size="sm"
              className="h-8"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Department
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {isAdding && (
          <div className="flex items-center gap-2 mb-4">
            <Input
              placeholder="Enter department name"
              value={newDepartmentName}
              onChange={(e) => setNewDepartmentName(e.target.value)}
              className="flex-1"
              disabled={isSubmitting}
            />
            <Button
              onClick={handleAddDepartment}
              size="sm"
              disabled={!newDepartmentName.trim() || isSubmitting}
            >
              <Check className="h-4 w-4" />
            </Button>
            <Button
              onClick={() => {
                setIsAdding(false);
                setNewDepartmentName("");
              }}
              variant="outline"
              size="sm"
              disabled={isSubmitting}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}

        {editMode && selectedDepartments.length > 0 && (
          <div className="flex items-center gap-2 p-3 bg-muted rounded-lg mb-4">
            <span className="text-sm text-muted-foreground">
              {selectedDepartments.length} department(s) selected
            </span>
            <Button 
              size="sm" 
              variant="destructive"
              onClick={handleBulkDelete}
              disabled={isSubmitting}
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Delete Selected
            </Button>
          </div>
        )}

        {departments.length === 0 && !isAdding && (
          <p className="text-muted-foreground py-4 text-center">
            No departments have been created yet.
          </p>
        )}

        <div className="space-y-2">
          {departments.map((department) => (
            <div
              key={department.id}
              className={`flex items-center justify-between p-3 rounded-md transition-all duration-200 ${
                editMode ? 'bg-muted/40 hover:bg-accent/30' : 'bg-muted/40'
              }`}
            >
              {editingId === department.id ? (
                <div className="flex items-center gap-2 flex-1">
                  <Input
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                    className="flex-1"
                    disabled={isSubmitting}
                  />
                  <Button
                    onClick={() => handleUpdateDepartment(department.id)}
                    size="sm"
                    disabled={!editingName.trim() || isSubmitting}
                  >
                    <Check className="h-4 w-4" />
                  </Button>
                  <Button
                    onClick={() => setEditingId(null)}
                    variant="outline"
                    size="sm"
                    disabled={isSubmitting}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-3">
                    {editMode && (
                      <Checkbox
                        checked={selectedDepartments.includes(department.id)}
                        onCheckedChange={() => handleSelectDepartment(department.id)}
                      />
                    )}
                    <span>{department.name}</span>
                  </div>
                  {!editMode && (
                    <div className="flex items-center gap-2">
                      <Button
                        onClick={() => startEditing(department.id, department.name)}
                        variant="ghost"
                        size="sm"
                        disabled={isSubmitting}
                      >
                        Edit
                      </Button>
                      <Button
                        onClick={() => handleDeleteDepartment(department.id)}
                        variant="ghost"
                        size="sm"
                        disabled={isSubmitting}
                      >
                        <Trash className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  )}
                </>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
