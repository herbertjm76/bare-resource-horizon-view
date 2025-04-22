
import React from "react";
import { Button } from "@/components/ui/button";
import { NewProjectDialog } from "./NewProjectDialog";
import { RefreshCw } from "lucide-react";

interface ProjectsToolbarProps {
  onRefresh?: () => void;
  onProjectCreated?: () => void;
}

const ProjectsToolbar: React.FC<ProjectsToolbarProps> = ({ onRefresh, onProjectCreated }) => {
  return (
    <div className="flex items-center gap-2">
      {onRefresh && (
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onRefresh}
          className="mr-2"
        >
          <RefreshCw className="h-4 w-4 mr-1" />
          Refresh
        </Button>
      )}
      {/* Pass the callback for refreshing after project creation */}
      <NewProjectDialog onProjectCreated={onProjectCreated} />
    </div>
  );
};

export default ProjectsToolbar;
