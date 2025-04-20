import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2 } from "lucide-react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter,
  DialogDescription
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// Simulated DB
const mockRoles = [
  { id: "1", name: "Project Manager", code: "PM" },
  { id: "2", name: "Senior Architect", code: "SA" },
  { id: "3", name: "Junior Architect", code: "JA" },
  { id: "4", name: "BIM Coordinator", code: "BIM" }
];

const formSchema = z.object({
  name: z.string().min(1, "Role name is required"),
  code: z.string().min(1, "Role code is required"),
});

type RoleFormValues = z.infer<typeof formSchema>;
type Role = typeof mockRoles[0];

export const RolesTab = () => {
  const [roles, setRoles] = useState<Role[]>(mockRoles);
  const [open, setOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);

  const form = useForm<RoleFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      code: ""
    }
  });

  const onOpenChange = (open: boolean) => {
    setOpen(open);
    if (!open) {
      form.reset();
      setEditingRole(null);
    }
  };

  const handleEdit = (role: Role) => {
    setEditingRole(role);
    form.reset({
      name: role.name,
      code: role.code
    });
    setOpen(true);
  };

  const handleSelect = (id: string) => {
    setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  }

  const handleBulkDelete = () => {
    setRoles(roles.filter(role => !selected.includes(role.id)));
    setSelected([]);
    setEditMode(false);
  }

  const onSubmit = (values: RoleFormValues) => {
    if (editingRole) {
      setRoles(
        roles.map(role => 
          role.id === editingRole.id ? { ...role, ...values } : role
        )
      );
    } else {
      const newRole: Role = {
        id: Date.now().toString(),
        name: values.name,
        code: values.code
      };
      setRoles([...roles, newRole]);
    }
    setOpen(false);
    form.reset();
    setEditingRole(null);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 gap-2">
        <CardTitle>Roles</CardTitle>
        <div className="flex gap-2">
          <Button size="sm" variant={editMode ? "secondary" : "outline"} onClick={() => setEditMode(em => !em)}>
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
              >
                <Trash2 className="h-4 w-4 mr-1" /> Delete Selected
              </Button>
              <span className="text-xs text-muted-foreground">{selected.length} selected</span>
            </div>
          )}
          {roles.length > 0 ? (
            <div className="grid gap-4">
              {roles.map((role) => (
                <div 
                  key={role.id}
                  className={`flex items-center justify-between p-3 border rounded-md ${editMode && "ring-2"} `}
                  style={editMode && selected.includes(role.id) ? { borderColor: "#dc2626", background: "#fee2e2" } : {}}
                >
                  <div className="flex items-center gap-3">
                    <div>
                      <div className="font-medium">{role.name}</div>
                      <div className="text-xs text-muted-foreground">Code: {role.code}</div>
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
                    <Button variant="ghost" size="sm" onClick={() => handleEdit(role)}>
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
            <DialogTitle>{editingRole ? 'Edit' : 'Add'} Role</DialogTitle>
            <DialogDescription>
              Enter the details for this staff role.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                <Button type="submit">{editingRole ? 'Update' : 'Add'} Role</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </Card>
  );
};
