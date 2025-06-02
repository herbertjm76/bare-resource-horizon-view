
import { useState } from 'react';

export const useProjectResourcesState = () => {
  const [showAddResource, setShowAddResource] = useState(false);

  return {
    showAddResource,
    setShowAddResource
  };
};
