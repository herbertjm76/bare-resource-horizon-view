
import React from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

interface ResourceTableErrorStateProps {
  error: string | null;
}

export const ResourceTableErrorState: React.FC<ResourceTableErrorStateProps> = ({ 
  error 
}) => (
  <div className="border border-red-200 rounded-lg overflow-hidden p-8 bg-red-50">
    <div className="flex flex-col items-center justify-center text-center">
      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-100 mb-4">
        <AlertTriangle className="h-6 w-6 text-red-600" />
      </div>
      <h3 className="text-lg font-medium text-red-800 mb-1">Error Loading Resources</h3>
      <p className="text-red-600 mb-4">{error || 'An unexpected error occurred'}</p>
      <Button 
        variant="outline"
        onClick={() => window.location.reload()}
      >
        Reload Page
      </Button>
    </div>
  </div>
);
