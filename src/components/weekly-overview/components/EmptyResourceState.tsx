
import React from 'react';
import { Button } from '@/components/ui/button';
import { Users } from 'lucide-react';

export const EmptyResourceState = () => (
  <div className="border rounded-lg overflow-hidden p-8">
    <div className="flex flex-col items-center justify-center text-center">
      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-muted mb-4">
        <Users className="h-6 w-6 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-medium mb-1">No Team Members Found</h3>
      <p className="text-muted-foreground mb-4">There are no team members in your organization yet.</p>
      <Button 
        variant="outline"
        onClick={() => window.location.href = '/team'}
      >
        Manage Team
      </Button>
    </div>
  </div>
);
