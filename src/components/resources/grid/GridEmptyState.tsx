
import React from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

export const GridEmptyState: React.FC = () => {
  return (
    <div className="text-center py-12 border rounded-lg">
      <p className="text-muted-foreground mb-2">No projects found matching your filters.</p>
      <Button variant="outline" onClick={() => window.location.href = '/projects'}>
        <PlusCircle className="h-4 w-4 mr-2" />
        Create a New Project
      </Button>
    </div>
  );
};
