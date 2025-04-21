
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2, UserCog } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  name: z.string().min(1, "Role name is required"),
  code: z.string().min(1, "Role code is required"),
});

type RoleFormValues = z.infer<typeof formSchema>;

type OfficeRole = {
  id: string;
  name: string;
  code: string;
  created_at: string;
  updated_at: string;
};

async function fetchRoles(): Promise<OfficeRole[]> {
  const { data, error } = await supabase
    .from("office_roles")
    .select("*")
    .order("created_at", { ascending: true });
  if (error) throw error;
  return data || [];
}

async function addRole(values: RoleFormValues): Promise<OfficeRole> {
  const { data, error } = await supabase
    .from("office_roles")
    .insert([values])
    .select()
    .single();
  if (error) throw error;
  return data;
}

async function editRole(id: string, values: RoleFormValues): Promise<OfficeRole> {
  const { data, error } = await supabase
    .from("office_roles")
    .update({ ...values })
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

async function deleteRoles(ids: string[]): Promise<void> {
  const { error } = await supabase.from("office_roles").delete().in("id", ids);
  if (error) throw error;
}

export const RolesTab = () => {
  const [open, setOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<OfficeRole | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch data
  const { data: roles = [], isLoading, isError } = useQuery({
    queryKey: ["office_roles"],
    queryFn: fetchRoles,
  });

  // Add role
  const addMutation = useMutation({
    mutationFn: addRole,
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ["office_roles"] });
      toast({
        title: "Role added",
        description: "A new role was added successfully!",
      });
      setOpen(false);
      setEditingRole(null);
      setSelected([]);
    },
    onError(e: any) {
      toast({
        title: "Error adding role",
        description: e.message || "Could not add the role.",
        variant: "destructive",
      });
    },
  });

  // Edit role
  const editMutation = useMutation({
    mutationFn: ({ id, values }: { id: string; values: RoleFormValues }) =>
      editRole(id, values),
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ["office_roles"] });
      toast({
        title: "Role updated",
        description: "The role was updated successfully!",
      });
      setOpen(false);
      setEditingRole(null);
      setSelected([]);
    },
    onError(e: any) {
      toast({
        title: "Error updating role",
        description: e.message || "Could not update the role.",
        variant: "destructive",
      });
    },
  });

  // Delete roles
  const deleteMutation = useMutation({
    mutationFn: (ids: string[]) => deleteRoles(ids),
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ["office_roles"] });
      toast({
        title: "Roles deleted",
        description: "Selected roles have been deleted.",
      });
      setSelected([]);
      setEditMode(false);
    },
    onError(e: any) {
      toast({
        title: "Error deleting roles",
        description: e.message || "Could not delete the selected roles.",
        variant: "destructive",
      });
    },
  });

  const form = useForm<RoleFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "", code: "" },
  });

  const onOpenChange = (openDialog: boolean) => {
    setOpen(openDialog);
    if (!openDialog) {
      form.reset();
      setEditingRole(null);
    }
  };

  const handleEdit = (role: OfficeRole) => {
    setEditingRole(role);
    form.reset({
      name: role.name,
      code: role.code,
    });
    setOpen(true);
  };

  const handleSelect = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleBulkDelete = () => {
    deleteMutation.mutate(selected);
  };

  const onSubmit = (values: RoleFormValues) => {
    if (editingRole) {
      editMutation.mutate({ id: editingRole.id, values });
    } else {
      addMutation.mutate(values);
    }
    form.reset();
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 gap-2">
        <CardTitle className="flex items-center gap-2">
          <UserCog className="h-5 w-5 text-violet-600" />
          Roles
        </CardTitle>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant={editMode ? "secondary" : "outline"}
            onClick={() => setEditMode((em) => !em)}
          >
            <Edit className="h-4 w-4 mr-2" /> Edit
          </Button>
          <Button size="sm" onClick={() => setOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Role
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="text-sm text-muted-foreground mb-4">
            Configure staff roles for your office. These roles will be used to assign rates to staff.
          </div>
          {editMode && (
            <div className="flex items-center gap-2 mb-2">
              <Button
                variant="destructive"
                size="sm"
                disabled={selected.length === 0}
                onClick={handleBulkDelete}
                isLoading={deleteMutation.isPending}
              >
                <Trash2 className="h-4 w-4 mr-1" /> Delete Selected
              </Button>
              <span className="text-xs text-muted-foreground">
                {selected.length} selected
              </span>
            </div>
          )}

          {isLoading ? (
            <div className="text-center p-4">Loading roles...</div>
          ) : isError ? (
            <div className="text-center p-4 text-destructive">
              Error loading roles.
            </div>
          ) : roles.length > 0 ? (
            <div className="grid gap-4">
              {roles.map((role) => (
                <div
                  key={role.id}
                  className={`flex items-center justify-between p-3 border rounded-md ${
                    editMode && "ring-2"
                  } `}
                  style={
                    editMode && selected.includes(role.id)
                      ? { borderColor: "#dc2626", background: "#fee2e2" }
                      : {}
                  }
                >
                  <div className="flex items-center gap-3">
                    <div>
                      <div className="font-medium">{role.name}</div>
                      <div className="text-xs text-muted-foreground">
                        Code: {role.code}
                      </div>
                    </div>
                  </div>
                  {editMode ? (
                    <input
                      type="checkbox"
                      className="w-4 h-4 accent-purple-600"
                      checked={selected.includes(role.id)}
                      onChange={() => handleSelect(role.id)}
                    />
                  ) : (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(role)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center p-4 border rounded-md border-dashed">
              No roles added yet. Click "Add Role" to get started.
            </div>
          )}
        </div>
      </CardContent>

      {/* Add/Edit Dialog */}
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{editingRole ? "Edit" : "Add"} Role</DialogTitle>
            <DialogDescription>
              Enter the details for this staff role.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4"
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Project Manager" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role Code</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., PM" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button
                  type="submit"
                  isLoading={addMutation.isPending || editMutation.isPending}
                >
                  {editingRole ? "Update" : "Add"} Role
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </Card>
  );
};
