
import React from 'react';
import { Table, TableBody } from '@/components/ui/table';
import { TooltipProvider } from '@/components/ui/tooltip';
import { NewResourceTableHeader } from './NewResourceTableHeader';
import { NewResourceTableRow } from './NewResourceTableRow';

interface NewResourceTableProps {
  projects: any[];
  members: any[];
  allocations: any[];
  weekStartDate: string;
}

export const NewResourceTable: React.FC<NewResourceTableProps> = ({
  projects,
  members,
  allocations,
  weekStartDate
}) => {
  // Create allocation map for quick lookups
  const allocationMap = new Map();
  allocations.forEach(allocation => {
    const key = `${allocation.resource_id}:${allocation.project_id}`;
    allocationMap.set(key, allocation.hours);
  });

  const getMemberTotal = (memberId: string) => {
    return allocations
      .filter(a => a.resource_id === memberId)
      .reduce((sum, a) => sum + a.hours, 0);
  };

  const getProjectCount = (memberId: string) => {
    return allocations
      .filter(a => a.resource_id === memberId && a.hours > 0)
      .length;
  };

  // Calculate minimum table width based on columns - mobile optimized
  const fixedColumnsWidth = 150 + 16 + 32 + 12 + 12 + 12 + 16; // Name + non-project columns
  const projectColumnsWidth = Math.max(15, projects.length) * 40; // Project columns
  const minTableWidth = fixedColumnsWidth + projectColumnsWidth;

  return (
    <TooltipProvider>
      <div className="w-full border rounded-2xl shadow-lg mt-8 week-resource-table-wrapper mobile-optimized-table bg-gradient-to-br from-white to-gray-50">
        {/* Mobile-first responsive container */}
        <div className="mobile-table-scroll-container">
          <div 
            className="mobile-enhanced-scroll"
            style={{
              minWidth: `${minTableWidth}px`
            }}
          >
            <Table className="w-full mobile-resource-table" style={{ minWidth: `${minTableWidth}px`, tableLayout: 'fixed' }}>
              <NewResourceTableHeader projects={projects} />
              
              <TableBody>
                {members.map((member, memberIndex) => (
                  <NewResourceTableRow
                    key={member.id}
                    member={member}
                    memberIndex={memberIndex}
                    projects={projects}
                    allocationMap={allocationMap}
                    getMemberTotal={getMemberTotal}
                    getProjectCount={getProjectCount}
                  />
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
        
        {/* Enhanced mobile-optimized scrollbar styling */}
        <style>
          {`
          .mobile-optimized-table {
            max-width: 100%;
            overflow: hidden;
            background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
            border: 1px solid #e2e8f0;
          }
          
          .mobile-table-scroll-container {
            width: 100%;
            overflow-x: auto;
            overflow-y: visible;
            -webkit-overflow-scrolling: touch;
            position: relative;
          }
          
          .mobile-enhanced-scroll {
            width: 100%;
            overflow-x: auto;
            overflow-y: visible;
            -webkit-overflow-scrolling: touch;
            padding-bottom: 1px;
          }
          
          .mobile-enhanced-scroll::-webkit-scrollbar {
            height: 10px;
          }
          
          .mobile-enhanced-scroll::-webkit-scrollbar-track {
            background: linear-gradient(90deg, #f1f5f9 0%, #e2e8f0 100%);
            border-radius: 5px;
          }
          
          .mobile-enhanced-scroll::-webkit-scrollbar-thumb {
            background: linear-gradient(90deg, #94a3b8 0%, #64748b 100%);
            border-radius: 5px;
            border: 1px solid #f1f5f9;
          }
          
          .mobile-enhanced-scroll::-webkit-scrollbar-thumb:hover {
            background: linear-gradient(90deg, #64748b 0%, #475569 100%);
          }
          
          /* Firefox scrollbar styling */
          .mobile-enhanced-scroll {
            scrollbar-width: thin;
            scrollbar-color: #94a3b8 #f1f5f9;
          }
          
          /* Mobile-specific optimizations */
          @media (max-width: 768px) {
            .mobile-table-scroll-container {
              width: calc(100vw - 2rem);
              max-width: calc(100vw - 2rem);
              margin-left: -1rem;
              margin-right: -1rem;
              padding-left: 1rem;
              padding-right: 1rem;
            }
            
            .mobile-resource-table {
              font-size: 12px;
            }
            
            .mobile-resource-table th,
            .mobile-resource-table td {
              padding: 4px 2px;
            }
            
            .mobile-enhanced-scroll::-webkit-scrollbar {
              height: 8px;
            }
            
            .mobile-enhanced-scroll::-webkit-scrollbar-thumb {
              background: linear-gradient(90deg, #cbd5e1 0%, #94a3b8 100%);
              border-radius: 4px;
            }
          }
          
          /* Extra small mobile devices */
          @media (max-width: 480px) {
            .mobile-table-scroll-container {
              width: calc(100vw - 1rem);
              max-width: calc(100vw - 1rem);
              margin-left: -0.5rem;
              margin-right: -0.5rem;
              padding-left: 0.5rem;
              padding-right: 0.5rem;
            }
            
            .mobile-resource-table {
              font-size: 11px;
            }
            
            .mobile-resource-table th,
            .mobile-resource-table td {
              padding: 3px 1px;
            }
          }
          `}
        </style>
      </div>
    </TooltipProvider>
  );
};
