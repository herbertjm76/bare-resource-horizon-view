
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Pencil } from "lucide-react";
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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

// Sample data - in a real app this would come from the database
const mockRoles = [
  { id: "1", name: "Project Manager", code: "PM", color: "#4f46e5" },
  { id: "2", name: "Senior Architect", code: "SA", color: "#0ea5e9" },
  { id: "3", name: "Junior Architect", code: "JA", color: "#10b981" },
  { id: "4", name: "BIM Coordinator", code: "BIM", color: "#f97316" }
];

const formSchema = z.object({
  name: z.string().min(1, "Role name is required"),
  code: z.string().min(1, "Role code is required"),
  color: z.string().min(1, "Color is required"),
});

type RoleFormValues = z.infer<typeof formSchema>;

export const RolesTab = () => {
  const [roles, setRoles] = useState(mockRoles);
  const [open, setOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<(typeof mockRoles)[0] | null>(null);

  const form = useForm<RoleFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      code: "",
      color: "#4f46e5"
    }
  });

  const onOpenChange = (open: boolean) => {
    setOpen(open);
    if (!open) {
      form.reset();
      setEditingRole(null);
    }
  };

  const handleEdit = (role: typeof mockRoles[0]) => {
    setEditingRole(role);
    form.reset({
      name: role.name,
      code: role.code,
      color: role.color
    });
    setOpen(true);
  };

  const onSubmit = (values: RoleFormValues) => {
    if (editingRole) {
      // Update existing role
      setRoles(roles.map(role => 
        role.id === editingRole.id ? { ...role, ...values } : role
      ));
    } else {
      // Add new role
      setRoles([...roles, { id: Date.now().toString(), ...values }]);
    }
    setOpen(false);
    form.reset();
    setEditingRole(null);
  };

  const colors = [
    "#4f46e5", "#0ea5e9", "#10b981", "#f97316", "#ec4899", 
    "#8b5cf6", "#d946ef", "#6366f1", "#0891b2", "#0d9488"
  ];

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle>Roles and Titles</CardTitle>
        <Button size="sm" onClick={() => setOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Role
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="text-sm text-muted-foreground mb-4">
            Configure staff roles and titles for your office.
          </div>
          
          {roles.length > 0 ? (
            <div className="grid gap-4">
              {roles.map((role) => (
                <div 
                  key={role.id}
                  className="flex items-center justify-between p-3 border rounded-md"
                >
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-4 h-4 rounded-full" 
                      style={{ backgroundColor: role.color }}
                    />
                    <div>
                      <div className="font-medium">{role.name}</div>
                      <div className="text-sm text-muted-foreground">Code: {role.code}</div>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => handleEdit(role)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
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
              
              <FormField
                control={form.control}
                name="color"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Color</FormLabel>
                    <FormControl>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button 
                            variant="outline" 
                            className="w-full justify-start text-left font-normal"
                          >
                            <div className="flex items-center gap-2">
                              <div 
                                className="w-4 h-4 rounded-full" 
                                style={{ backgroundColor: field.value }}
                              />
                              <span>{field.value}</span>
                            </div>
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-64">
                          <div className="grid grid-cols-5 gap-2">
                            {colors.map((color) => (
                              <button
                                key={color}
                                type="button"
                                className="w-8 h-8 rounded-full focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                                style={{ backgroundColor: color }}
                                onClick={() => form.setValue('color', color)}
                              />
                            ))}
                          </div>
                        </PopoverContent>
                      </Popover>
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
