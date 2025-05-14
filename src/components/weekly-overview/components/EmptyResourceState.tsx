
import React from 'react';

export const EmptyResourceState: React.FC = () => {
  return (
    <div className="text-center py-12 border rounded-lg">
      <p className="text-muted-foreground mb-2">
        No team members found. Add team members to see the weekly overview.
      </p>
    </div>
  );
};
