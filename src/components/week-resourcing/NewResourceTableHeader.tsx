import React from 'react';
import { TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';
import { Project } from './types';

interface NewResourceTableHeaderProps {
  projects: Project[];
  viewMode?: 'compact' | 'expanded';
}

export const NewResourceTableHeader: React.FC<NewResourceTableHeaderProps> = ({
  projects,
  viewMode = 'compact'
}) => {
  const isExpanded = viewMode === 'expanded';
  
  const headerPadding = isExpanded ? 'py-4 px-4' : 'py-2 px-2';
  const headerTextSize = isExpanded ? 'text-sm' : 'text-xs';
  const headerHeight = isExpanded ? 'h-16' : 'h-12';

  return (
    <TableHeader>
      <TableRow className={`bg-[#6465F0] hover:bg-[#6465F0] ${headerHeight}`}>
        {/* TEAM MEMBER */}
        <TableHead className={`text-white font-bold text-center border-r border-white/20 sticky left-0 z-20 bg-[#6465F0] min-w-[120px] max-w-[150px] ${headerPadding} ${headerTextSize}`}>
          TEAM MEMBER
        </TableHead>

        {/* Utilization */}
        <TableHead className={`text-white font-bold text-center border-r border-white/20 min-w-[80px] ${headerPadding} ${headerTextSize}`}>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="cursor-pointer">UTILIZATION</span>
              </TooltipTrigger>
              <TooltipContent>
                <div className="text-sm font-medium">
                  % of weekly capacity used<br />Color: <span className="text-green-600">Good</span>, <span className="text-yellow-600">Caution</span>, <span className="text-red-600">High</span>
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </TableHead>

        {/* Total */}
        <TableHead className={`text-white font-bold text-center border-r border-white/20 min-w-[60px] ${headerPadding} ${headerTextSize}`}>
          TOTAL
        </TableHead>

        {/* Vertical project block separator (expanded only, for design) */}
        {isExpanded && (
          <TableHead
            className="project-block-sep-header"
            style={{
              borderRight: '4px solid #a5b4fc',
              padding: 0,
              background: '#6465F0',
              minWidth: '0.5rem',
              width: '0.5rem',
            }}
            aria-hidden
          />
        )}
        
        {/* Project columns */}
        {projects.map((project, idx) => (
          <TableHead
            key={project.id}
            className={`
              text-white font-bold text-center border-r border-white/20 min-w-[40px] max-w-[40px]
              ${isExpanded ? 'p-2 project-col-header-expanded' : 'p-1'}
              ${isExpanded ? 'bg-gradient-to-b from-[#6465F0] via-[#7879f8]/60 to-[#f3f4fd]' : ''}
            `}
            style={isExpanded && idx === 0 ? { borderLeft: 'none' } : undefined}
          >
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div
                    className="project-code-header cursor-pointer"
                    style={{
                      writingMode: 'vertical-lr',
                      textOrientation: 'mixed',
                      height: isExpanded ? '100px' : '80px',
                      transform: 'rotate(180deg)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: isExpanded ? '0.875rem' : '0.75rem',
                      fontWeight: '600',
                      padding: isExpanded ? '0.5rem' : '0.25rem',
                      color: 'white'
                    }}
                  >
                    {project.code}
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <div className="text-sm font-medium">
                    {project.name}
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </TableHead>
        ))}

        {/* Project Count */}
        <TableHead className={`text-white font-bold text-center border-r border-white/20 min-w-[60px] ${headerPadding} ${headerTextSize}`}>
          COUNT
        </TableHead>
        
        {/* Annual Leave */}
        <TableHead className={`text-white font-bold text-center border-r border-white/20 min-w-[60px] ${headerPadding} ${headerTextSize}`}>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="cursor-pointer">ANNUAL LEAVE</span>
              </TooltipTrigger>
              <TooltipContent>
                <div className="text-sm font-medium">
                  Annual Leave hours for this week
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </TableHead>

        {/* Holiday */}
        <TableHead className={`text-white font-bold text-center border-r border-white/20 min-w-[60px] ${headerPadding} ${headerTextSize}`}>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="cursor-pointer">HOLIDAY</span>
              </TooltipTrigger>
              <TooltipContent>
                <div className="text-sm font-medium">
                  Public Holiday hours for this week
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </TableHead>
        
        {/* Other Leave */}
        <TableHead className={`text-white font-bold text-center border-r border-white/20 min-w-[60px] ${headerPadding} ${headerTextSize}`}>
          OTHER LEAVE
        </TableHead>

        {/* Remarks */}
        <TableHead className={`text-white font-bold text-center border-r border-white/20 min-w-[60px] ${headerPadding} ${headerTextSize}`}>
          REMARKS
        </TableHead>
      </TableRow>
    </TableHeader>
  );
};
