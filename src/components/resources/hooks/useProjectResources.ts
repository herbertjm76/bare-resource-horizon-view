
import { useState } from 'react';
import { toast } from 'sonner';

export interface Resource {
  id: string;
  name: string;
  role: string;
  allocations?: Record<string, number>;
  isPending?: boolean;
}

export const useProjectResources = () => {
  const [showAddResource, setShowAddResource] = useState(false);
  const [resources, setResources] = useState<Resource[]>([
    {
      id: '1',
      name: 'John Smith',
      role: 'Designer',
      allocations: {}
    }, 
    {
      id: '2',
      name: 'Sarah Jones',
      role: 'Developer',
      allocations: {}
    }
  ]);

  // Track all allocations by resource and week
  const [projectAllocations, setProjectAllocations] = useState<Record<string, Record<string, number>>>({});

  // Handle resource allocation changes
  const handleAllocationChange = (resourceId: string, weekKey: string, hours: number) => {
    setProjectAllocations(prev => ({
      ...prev,
      [resourceId]: {
        ...(prev[resourceId] || {}),
        [weekKey]: hours
      }
    }));
  };

  // Handle resource deletion
  const handleDeleteResource = (resourceId: string) => {
    setResources(prev => prev.filter(r => r.id !== resourceId));
    setProjectAllocations(prev => {
      const newAllocations = {
        ...prev
      };
      delete newAllocations[resourceId];
      return newAllocations;
    });
  };

  // Handle adding a new resource
  const handleAddResource = (resource: { staffId: string; name: string; role?: string; isPending?: boolean }) => {
    const newResource = {
      id: resource.staffId,
      name: resource.name,
      role: resource.role || 'Team Member',
      allocations: {},
      isPending: resource.isPending
    };
    setResources(prev => [...prev, newResource]);
    setShowAddResource(false);
    toast.success(`${resource.name} added to project`);
  };

  return {
    resources,
    projectAllocations,
    showAddResource,
    setShowAddResource,
    handleAllocationChange,
    handleDeleteResource,
    handleAddResource
  };
};
