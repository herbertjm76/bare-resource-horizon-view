
import { useState } from 'react';
import type { ProjectArea } from "../projectAreaTypes";

export function useProjectAreasState() {
  const [areas, setAreas] = useState<ProjectArea[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  return {
    areas,
    setAreas,
    loading,
    setLoading,
    error,
    setError
  };
}
