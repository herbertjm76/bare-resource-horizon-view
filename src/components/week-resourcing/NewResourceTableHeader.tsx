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
  
  const headerPadding = isExpanded ? 'py-4 px-4' : 'py-3 px-2';
  const headerTextSize = isExpanded ? 'text-sm' : 'text-xs';
  const headerHeight = isExpanded ? 'h-16' : 'h-14';

  return (
    <TableHeader>
      <TableRow className={`bg-[#6465F0] hover:bg-[#6465F0] ${headerHeight}`}>
        {/* TEAM MEMBER */}
        <TableHead className={`text-white font-bold text-left border-r border-white/20 sticky left-0 z-20 bg-[#6465F0] min-w-[140px] max-w-[180px] ${headerPadding} ${headerTextSize}`}>
          {isExpanded ? 'TEAM MEMBER' : 'NAME'}
        </TableHead>

        {/* Project Count - Only in compact, moved to second position */}
        {!isExpanded && (
          <TableHead className={`text-white font-bold text-center border-r border-white/20 min-w-[50px] max-w-[60px] ${headerPadding} ${headerTextSize}`}>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="cursor-pointer"># PROJ</span>
                </TooltipTrigger>
                <TooltipContent>
                  <div className="text-sm font-medium">
                    Number of projects assigned
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </TableHead>
        )}

        {/* Total Hours - Third position in compact */}
        {!isExpanded && (
          <TableHead className={`text-white font-bold text-center border-r border-white/20 min-w-[60px] max-w-[70px] ${headerPadding} ${headerTextSize}`}>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="cursor-pointer">TOTAL</span>
                </TooltipTrigger>
                <TooltipContent>
                  <div className="text-sm font-medium">
                    Total project hours allocated
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </TableHead>
        )}

        {/* Utilization */}
        <TableHead className={`text-white font-bold text-center border-r border-white/20 ${isExpanded ? 'min-w-[80px]' : 'min-w-[90px]'} ${headerPadding} ${headerTextSize}`}>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="cursor-pointer">{isExpanded ? 'UTILIZATION' : 'CAPACITY'}</span>
              </TooltipTrigger>
              <TooltipContent>
                <div className="text-sm font-medium">
                  {isExpanded 
                    ? '% of weekly capacity used\nColor: Good (Green), Caution (Yellow), High (Red)'
                    : 'Weekly capacity utilization bar\nShows allocated vs available hours'
                  }
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </TableHead>

        {/* Total - Only in expanded */}
        {isExpanded && (
          <TableHead className={`text-white font-bold text-center border-r border-white/20 min-w-[60px] ${headerPadding} ${headerTextSize}`}>
            TOTAL
          </TableHead>
        )}

        {/* Vertical project block separator (expanded only) */}
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
              text-white font-bold text-center border-r border-white/20 
              ${isExpanded ? 'min-w-[40px] max-w-[40px] p-2 project-col-header-expanded bg-gradient-to-b from-[#6465F0] via-[#7879f8]/60 to-[#f3f4fd]' : 'min-w-[32px] max-w-[36px] p-1'}
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
                      height: isExpanded ? '100px' : '70px',
                      transform: 'rotate(180deg)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: isExpanded ? '0.875rem' : '0.7rem',
                      fontWeight: '600',
                      padding: isExpanded ? '0.5rem' : '0.2rem',
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

        {/* Project Count - Only in expanded */}
        {isExpanded && (
          <TableHead className={`text-white font-bold text-center border-r border-white/20 min-w-[60px] ${headerPadding} ${headerTextSize}`}>
            COUNT
          </TableHead>
        )}
        
        {/* Annual Leave */}
        <TableHead className={`text-white font-bold text-center border-r border-white/20 ${isExpanded ? 'min-w-[60px]' : 'min-w-[45px]'} ${headerPadding} ${headerTextSize}`}>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="cursor-pointer">{isExpanded ? 'ANNUAL LEAVE' : 'AL'}</span>
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
        <TableHead className={`text-white font-bold text-center border-r border-white/20 ${isExpanded ? 'min-w-[60px]' : 'min-w-[45px]'} ${headerPadding} ${headerTextSize}`}>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="cursor-pointer">{isExpanded ? 'HOLIDAY' : 'HOL'}</span>
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
        <TableHead className={`text-white font-bold text-center border-r border-white/20 ${isExpanded ? 'min-w-[60px]' : 'min-w-[45px]'} ${headerPadding} ${headerTextSize}`}>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="cursor-pointer">{isExpanded ? 'OTHER LEAVE' : 'OTH'}</span>
              </TooltipTrigger>
              <TooltipContent>
                <div className="text-sm font-medium">
                  Other leave types for this week
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </TableHead>

        {/* Remarks */}
        <TableHead className={`text-white font-bold text-center border-r border-white/20 ${isExpanded ? 'min-w-[60px]' : 'min-w-[50px]'} ${headerPadding} ${headerTextSize}`}>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="cursor-pointer">{isExpanded ? 'REMARKS' : 'REM'}</span>
              </TooltipTrigger>
              <TooltipContent>
                <div className="text-sm font-medium">
                  Additional notes and remarks
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </TableHead>
      </TableRow>
    </TableHeader>
  );
};
