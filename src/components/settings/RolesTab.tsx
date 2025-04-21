
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus, Pencil, Trash } from "lucide-react";
import { Role, useOfficeSettings } from "@/context/OfficeSettingsContext";
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useCompany } from '@/context/CompanyContext';

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  code: z.string().min(1, "Code is required"),
});

export const RolesTab = () => {
  const { roles, setRoles, loading } = useOfficeSettings();
  const { company } = useCompany();
  const [open, setOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      code: "",
    },
  });

  useEffect(() => {
    if (company) {
      console.log("RolesTab - Company ID:", company.id);
      console.log("RolesTab - Roles:", roles);
    }
  }, [company, roles]);

  const handleEditRole = (role: Role) => {
    setEditingRole(role);
    form.reset({
      name: role.name,
      code: role.code,
    });
    setOpen(true);
  };

  const handleDeleteRole = async (id: string) => {
    if (!company) {
      toast.error('No company selected');
      return;
    }
    
    try {
      const { error } = await supabase
        .from('office_roles')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      setRoles(roles.filter(role => role.id !== id));
      toast.success('Role deleted successfully');
    } catch (error: any) {
      console.error('Error deleting role:', error);
      toast.error('Failed to delete role');
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!company) {
      toast.error('No company selected');
      return;
    }

    try {
      if (editingRole) {
        // Update existing role
        const { error } = await supabase
          .from('office_roles')
          .update({
            name: values.name,
            code: values.code,
          })
          .eq('id', editingRole.id);
        
        if (error) throw error;
        
        setRoles(roles.map(role => 
          role.id === editingRole.id 
            ? { ...role, name: values.name, code: values.code }
            : role
        ));
        toast.success('Role updated successfully');
      } else {
        // Create new role - add company_id
        const { data, error } = await supabase
          .from('office_roles')
          .insert([
            {
              name: values.name,
              code: values.code,
              company_id: company.id
            }
          ])
          .select();
        
        if (error) throw error;
        if (data && data.length > 0) {
          setRoles([...roles, data[0]]);
        }
        toast.success('Role created successfully');
      }
      
      setOpen(false);
      form.reset();
      setEditingRole(null);
    } catch (error: any) {
      console.error('Error saving role:', error);
      toast.error('Failed to save role');
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle>Roles</CardTitle>
        <Button onClick={() => {
          form.reset({ name: "", code: "" });
          setEditingRole(null);
          setOpen(true);
        }} size="sm">
          <Plus className="mr-2 h-4 w-4" />
          Add Role
        </Button>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-4">Loading roles...</div>
        ) : roles.length === 0 ? (
          <div className="text-center py-4 text-muted-foreground">
            No roles defined yet. Click "Add Role" to create your first role.
          </div>
        ) : (
          <div className="grid gap-4">
            {roles.map((role) => (
              <div
                key={role.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div>
                  <div className="font-medium">{role.name}</div>
                  <div className="text-sm text-muted-foreground">Code: {role.code}</div>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon" onClick={() => handleEditRole(role)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDeleteRole(role.id)}>
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingRole ? "Edit Role" : "Add Role"}</DialogTitle>
              <DialogDescription>
                {editingRole
                  ? "Update the role details below."
                  : "Fill in the details for the new role."}
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
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
                      <FormLabel>Code</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., PM" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <Button type="submit">
                    {editingRole ? "Save Changes" : "Add Role"}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default RolesTab;
