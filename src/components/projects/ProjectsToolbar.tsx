
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus, Search } from 'lucide-react';

export const ProjectsToolbar = () => {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex items-center gap-4 flex-1">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search projects..."
            className="pl-9"
          />
        </div>
      </div>
      <Button>
        <Plus className="h-4 w-4 mr-2" />
        Add Project
      </Button>
    </div>
  );
};
