
import React from 'react';
import { TableHeader, TableRow, TableHead } from '@/components/ui/table';

interface NewResourceTableHeaderProps {
  projects: any[];
}

export const NewResourceTableHeader: React.FC<NewResourceTableHeaderProps> = ({ projects }) => {
  // Calculate the number of project columns to show (minimum 15)
  const projectColumnsCount = Math.max(15, projects.length);
  
  return (
    <TableHeader className="sticky top-0 z-10">
      <TableRow className="h-12 mobile-header-row" style={{ background: '#6465F0' }}>
        <TableHead className="w-[150px] border-r sticky left-0 z-20 text-white font-semibold mobile-name-header" style={{ background: '#6465F0' }}>
          <div className="px-2 sm:px-6 text-xs sm:text-sm">Name</div>
        </TableHead>
        <TableHead className="w-8 sm:w-16 text-center border-r text-white font-semibold text-xs sm:text-sm">#</TableHead>
        <TableHead className="w-20 sm:w-32 text-center border-r text-white font-semibold text-xs sm:text-sm">Capacity</TableHead>
        <TableHead className="w-8 sm:w-12 text-center border-r text-white font-semibold text-xs">AL</TableHead>
        <TableHead className="w-8 sm:w-12 text-center border-r text-white font-semibold text-xs">HO</TableHead>
        <TableHead className="w-8 sm:w-12 text-center border-r text-white font-semibold text-xs">OL</TableHead>
        <TableHead className="w-10 sm:w-16 text-center border-r text-white font-semibold text-xs">Off</TableHead>
        
        {/* Project headers - mobile optimized */}
        {Array.from({ length: projectColumnsCount }).map((_, idx) => {
          const project = projects[idx];
          return (
            <TableHead key={project?.id || `empty-${idx}`} className="w-8 sm:w-10 text-center border-r mobile-project-header">
              <div className="flex items-center justify-center h-full">
                <div 
                  className="text-xs font-bold whitespace-nowrap text-white mobile-project-code"
                  style={{
                    transform: 'rotate(-90deg)',
                    transformOrigin: 'center',
                    width: '30px',
                    height: '30px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '10px'
                  }}
                >
                  {project?.code || (project ? `P${idx + 1}` : '')}
                </div>
              </div>
            </TableHead>
          );
        })}
      </TableRow>
      
      {/* Mobile-specific header styling */}
      <style>
        {`
        .mobile-header-row {
          height: 60px;
        }
        
        .mobile-name-header {
          min-width: 120px;
        }
        
        .mobile-project-header {
          min-width: 32px;
          max-width: 40px;
        }
        
        .mobile-project-code {
          font-size: 9px !important;
          line-height: 1;
        }
        
        @media (max-width: 768px) {
          .mobile-header-row {
            height: 50px;
          }
          
          .mobile-name-header {
            min-width: 100px;
            font-size: 11px;
          }
          
          .mobile-project-header {
            min-width: 28px;
            max-width: 32px;
          }
          
          .mobile-project-code {
            font-size: 8px !important;
            width: 25px;
            height: 25px;
          }
        }
        
        @media (max-width: 480px) {
          .mobile-header-row {
            height: 45px;
          }
          
          .mobile-name-header {
            min-width: 90px;
            font-size: 10px;
          }
          
          .mobile-project-header {
            min-width: 24px;
            max-width: 28px;
          }
          
          .mobile-project-code {
            font-size: 7px !important;
            width: 20px;
            height: 20px;
          }
        }
        `}
      </style>
    </TableHeader>
  );
};
