
import React from 'react';
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface ResourceTableErrorStateProps {
  error: string | Error | unknown;
}

export const ResourceTableErrorState: React.FC<ResourceTableErrorStateProps> = ({ error }) => {
  return (
    <Alert variant="destructive" className="mb-6">
      <AlertCircle className="h-4 w-4" />
      <AlertDescription>
        {typeof error === 'string' ? error : 'An error occurred while loading data. Please try again later.'}
      </AlertDescription>
    </Alert>
  );
};
