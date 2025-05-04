
import React from 'react';
import { TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger 
} from "@/components/ui/tooltip";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useCompany } from "@/context/CompanyContext";
import { format, addDays } from 'date-fns';

interface WeeklyResourceHeaderProps {
  selectedWeek: Date;
}

export const WeeklyResourceHeader: React.FC<WeeklyResourceHeaderProps> = ({ selectedWeek }) => {
  const { company } = useCompany();
  
  // Fetch all projects for the company
  const { data: projects = [] } = useQuery({
    queryKey: ['company-projects', company?.id],
    queryFn: async () => {
      if (!company?.id) return [];
      
      const { data, error } = await supabase
        .from('projects')
        .select('id, code, name')
        .eq('company_id', company.id)
        .order('code');
      
      if (error) {
        console.error("Error fetching projects:", error);
        return [];
      }
      
      return data || [];
    },
    enabled: !!company?.id
  });

  return (
    <TableHeader className="bg-muted/50 sticky top-0 z-10">
      <TableRow>
        <TableHead className="py-2 px-4 name-column">
          <div className="font-medium">Name</div>
        </TableHead>
        
        <TableHead className="py-2 px-4 office-column">
          <div className="font-medium text-center">Office</div>
        </TableHead>
        
        {/* Project columns - each project in the company gets its own column */}
        {projects.map(project => (
          <TableHead 
            key={project.id} 
            className="project-code-column relative week-highlighted"
          >
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger className="w-full h-full">
                  <div className="project-code-header">
                    {project.code}
                  </div>
                </TooltipTrigger>
                <TooltipContent side="top">
                  <p>{project.name}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </TableHead>
        ))}
        
        {/* Weekly total and utilization columns */}
        <TooltipProvider>
          <TableHead className="header-cell number-column week-highlighted">
            <Tooltip>
              <TooltipTrigger className="w-full">
                <div className="font-medium">Total</div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Weekly Total Hours</p>
              </TooltipContent>
            </Tooltip>
          </TableHead>
          
          <TableHead className="header-cell number-column week-highlighted">
            <Tooltip>
              <TooltipTrigger className="w-full">
                <div className="font-medium">UTL</div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Utilisation</p>
              </TooltipContent>
            </Tooltip>
          </TableHead>
        </TooltipProvider>
      </TableRow>
    </TableHeader>
  );
};
