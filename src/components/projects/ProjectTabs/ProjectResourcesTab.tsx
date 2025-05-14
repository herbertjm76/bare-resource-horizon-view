
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { PlusCircle, Trash2 } from "lucide-react";
import type { FormState } from "../hooks/types/projectTypes";

interface ProjectResourcesTabProps {
  form: FormState;
  roles: Array<{ id: string; name: string; code: string }>;
}

type ResourceAllocation = {
  roleId: string;
  quantity: number;
};

export const ProjectResourcesTab: React.FC<ProjectResourcesTabProps> = ({
  form,
  roles
}) => {
  const [resources, setResources] = useState<ResourceAllocation[]>([]);
  const [selectedRole, setSelectedRole] = useState("");
  const [quantity, setQuantity] = useState<number>(1);
  
  const addResource = () => {
    if (!selectedRole) return;
    
    // Check if this role is already in resources
    const existingIndex = resources.findIndex(r => r.roleId === selectedRole);
    
    if (existingIndex >= 0) {
      // Update existing allocation
      const newResources = [...resources];
      newResources[existingIndex].quantity += quantity;
      setResources(newResources);
    } else {
      // Add new allocation
      setResources([...resources, { roleId: selectedRole, quantity }]);
    }
    
    // Reset form
    setSelectedRole("");
    setQuantity(1);
  };
  
  const removeResource = (index: number) => {
    const newResources = [...resources];
    newResources.splice(index, 1);
    setResources(newResources);
  };
  
  const getRoleName = (roleId: string) => {
    return roles.find(role => role.id === roleId)?.name || "Unknown Role";
  };
  
  const calculateTotalFTE = () => {
    return resources.reduce((sum, resource) => sum + resource.quantity, 0);
  };

  if (form.stages.length === 0) {
    return (
      <div className="py-6 text-center">
        <p className="text-muted-foreground">Please select project stages in the Info tab first.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 py-4">
      <div className="mb-4">
        <h3 className="text-lg font-medium">Project Resources</h3>
        <p className="text-sm text-muted-foreground">
          Allocate resources to the project
        </p>
      </div>
      
      <div className="grid grid-cols-12 gap-4 items-end">
        <div className="col-span-6">
          <Label htmlFor="role">Role</Label>
          <select
            id="role"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
          >
            <option value="">Select a role</option>
            {roles.map((role) => (
              <option key={role.id} value={role.id}>
                {role.name} ({role.code})
              </option>
            ))}
          </select>
        </div>
        
        <div className="col-span-4">
          <Label htmlFor="quantity">Quantity</Label>
          <Input
            id="quantity"
            type="number"
            min="0.25"
            step="0.25"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
          />
        </div>
        
        <div className="col-span-2">
          <Button 
            type="button" 
            variant="outline" 
            className="w-full"
            onClick={addResource}
            disabled={!selectedRole}
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            Add
          </Button>
        </div>
      </div>
      
      {resources.length > 0 ? (
        <div className="border rounded-md overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted">
              <tr>
                <th className="py-2 px-4 text-left font-medium">Role</th>
                <th className="py-2 px-4 text-right font-medium">FTE</th>
                <th className="py-2 px-4 text-center font-medium w-16">Actions</th>
              </tr>
            </thead>
            <tbody>
              {resources.map((resource, index) => (
                <tr key={index} className="border-t">
                  <td className="py-2 px-4">{getRoleName(resource.roleId)}</td>
                  <td className="py-2 px-4 text-right">{resource.quantity}</td>
                  <td className="py-2 px-4 text-center">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeResource(index)}
                      className="h-8 w-8 p-0"
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </td>
                </tr>
              ))}
              <tr className="border-t bg-muted/50">
                <td className="py-2 px-4 font-medium">Total</td>
                <td className="py-2 px-4 text-right font-medium">{calculateTotalFTE()}</td>
                <td className="py-2 px-4"></td>
              </tr>
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-8 border rounded-md bg-muted/10">
          <p className="text-muted-foreground">No resources allocated</p>
          <p className="text-xs text-muted-foreground mt-1">Add resources using the form above</p>
        </div>
      )}
    </div>
  );
};
