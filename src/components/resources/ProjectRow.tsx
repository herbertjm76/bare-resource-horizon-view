
import React, { useState } from 'react';
import { ChevronRight, ChevronDown, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ResourceRow } from '@/components/resources/ResourceRow';
import { AddResourceDialog } from '@/components/resources/AddResourceDialog';

interface ProjectRowProps {
  project: any; // Using any for now, we'll type this properly later
  weeks: {
    startDate: Date;
    label: string;
    days: Date[];
  }[];
  isExpanded: boolean;
  onToggleExpand: () => void;
}

export const ProjectRow: React.FC<ProjectRowProps> = ({ 
  project, 
  weeks, 
  isExpanded, 
  onToggleExpand 
}) => {
  const [showAddResource, setShowAddResource] = useState(false);
  
  // Mock data for resources - this would come from your database in a real app
  const mockResources = [
    { id: '1', name: 'John Smith', role: 'Designer', allocations: {} },
    { id: '2', name: 'Sarah Jones', role: 'Developer', allocations: {} },
  ];
  
  // Calculate the total hours across all resources (placeholder for now)
  const totalHours = 24;
  
  return (
    <>
      <tr className="hover:bg-muted/30">
        {/* Project name cell */}
        <td 
          className="sticky left-0 bg-background z-10 p-2 border-b cursor-pointer"
          onClick={onToggleExpand}
        >
          <div className="flex items-center">
            <Button variant="ghost" size="icon" className="h-6 w-6 p-0 mr-2">
              {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </Button>
            <div>
              <div className="font-medium">{project.name}</div>
              <div className="text-xs text-muted-foreground">{project.code}</div>
            </div>
          </div>
        </td>
        
        {/* Empty cell for the "WEEK OF" column */}
        <td className="p-1 border-b"></td>
        
        {/* Week allocation cells */}
        {weeks.map((week, i) => (
          <td key={i} className="p-0 border-b text-center text-muted-foreground w-10">
            {/* This would show total hours for this project in this week */}
            {isExpanded ? '' : '8h'}
          </td>
        ))}
        
        {/* Total hours cell */}
        <td className="p-2 border-b text-center font-medium">
          {totalHours}h
        </td>
      </tr>
      
      {/* Resource rows when project is expanded */}
      {isExpanded && mockResources.map(resource => (
        <ResourceRow 
          key={resource.id} 
          resource={resource} 
          weeks={weeks} 
          projectId={project.id}
        />
      ))}
      
      {/* Add resource row when project is expanded */}
      {isExpanded && (
        <tr className="bg-muted/10">
          <td className="sticky left-0 bg-muted/10 z-10 p-2 border-b">
            <Button 
              variant="ghost" 
              size="sm" 
              className="ml-8 text-muted-foreground"
              onClick={() => setShowAddResource(true)}
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Add Resource
            </Button>
          </td>
          
          {/* Empty cell for the "WEEK OF" column */}
          <td className="p-1 border-b"></td>
          
          {weeks.map((_, i) => (
            <td key={i} className="p-0 border-b w-10"></td>
          ))}
          <td className="p-2 border-b"></td>
        </tr>
      )}
      
      {showAddResource && (
        <AddResourceDialog 
          projectId={project.id}
          onClose={() => setShowAddResource(false)}
          onAdd={(resource) => {
            console.log('Add resource:', resource);
            setShowAddResource(false);
            // Here you would update your resources data
          }}
        />
      )}
    </>
  );
};
