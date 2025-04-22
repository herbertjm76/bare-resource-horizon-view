
import React from 'react';
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const ProjectsToolbar = () => {
  return (
    <Button size="sm">
      <Plus className="h-4 w-4 mr-2" />
      New Project
    </Button>
  );
};

export default ProjectsToolbar;
