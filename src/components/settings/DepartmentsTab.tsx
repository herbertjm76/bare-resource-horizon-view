
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash, Check, X } from "lucide-react";
import { useCompany } from "@/context/CompanyContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useOfficeSettings } from "@/context/OfficeSettingsContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const DepartmentsTab = () => {
  const { company } = useCompany();
  const { departments, setDepartments, loading } = useOfficeSettings();
  const [newDepartmentName, setNewDepartmentName] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddDepartment = async () => {
    if (!company || !newDepartmentName.trim()) return;

    setIsSubmitting(true);
    try {
      const { data, error } = await supabase
        .from("office_departments")
        .insert([
          {
            name: newDepartmentName.trim(),
            company_id: company.id,
          },
        ])
        .select();

      if (error) throw error;

      setDepartments([...departments, data[0]]);
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
      const { error } = await supabase
        .from("office_departments")
        .delete()
        .eq("id", id);

      if (error) throw error;

      setDepartments(departments.filter((dept) => dept.id !== id));
      toast.success("Department deleted successfully");
    } catch (error: any) {
      toast.error(`Error deleting department: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateDepartment = async (id: string) => {
    if (!editingName.trim()) return;

    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from("office_departments")
        .update({ name: editingName.trim() })
        .eq("id", id);

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

        {departments.length === 0 && !isAdding && (
          <p className="text-muted-foreground py-4 text-center">
            No departments have been created yet.
          </p>
        )}

        <div className="space-y-2">
          {departments.map((department) => (
            <div
              key={department.id}
              className="flex items-center justify-between p-3 bg-muted/40 rounded-md"
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
                  <span>{department.name}</span>
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
                </>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
