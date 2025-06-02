
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

  // Calculate member totals
  const getMemberTotal = (memberId: string) => {
    return allocations
      .filter(a => a.resource_id === memberId)
      .reduce((sum, a) => sum + a.hours, 0);
  };

  // Calculate project count for member
  const getProjectCount = (memberId: string) => {
    return allocations
      .filter(a => a.resource_id === memberId && a.hours > 0)
      .length;
  };

  return (
    <TooltipProvider>
      <div className="w-full max-w-full overflow-hidden border rounded-md shadow-sm mt-8">
        <div 
          className="overflow-x-auto overflow-y-visible -webkit-overflow-scrolling-touch"
          style={{
            width: 'calc(100vw - 22rem)',
            maxWidth: 'calc(100vw - 22rem)'
          }}
        >
          <div 
            className="enhanced-grid-scroll"
            style={{
              width: '100%',
              overflowX: 'auto',
              overflowY: 'visible',
              WebkitOverflowScrolling: 'touch',
              paddingBottom: '1px'
            }}
          >
            <Table className="w-full min-w-max">
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
        
        {/* Custom scrollbar styling */}
        <style>
          {`
          .enhanced-grid-scroll::-webkit-scrollbar {
            height: 12px;
          }
          
          .enhanced-grid-scroll::-webkit-scrollbar-track {
            background: #f1f5f9;
            border-radius: 6px;
          }
          
          .enhanced-grid-scroll::-webkit-scrollbar-thumb {
            background: #94a3b8;
            border-radius: 6px;
            border: 2px solid #f1f5f9;
          }
          
          .enhanced-grid-scroll::-webkit-scrollbar-thumb:hover {
            background: #64748b;
          }
          
          /* Firefox scrollbar styling */
          .enhanced-grid-scroll {
            scrollbar-width: thin;
            scrollbar-color: #94a3b8 #f1f5f9;
          }
          
          /* Mobile-specific scrollbar improvements */
          @media (max-width: 640px) {
            .enhanced-grid-scroll {
              width: 100vw !important;
              max-width: 100vw !important;
              margin-left: calc(-1rem);
              padding-left: 1rem;
              padding-right: 1rem;
            }
            
            .enhanced-grid-scroll::-webkit-scrollbar {
              height: 8px;
            }
            
            .enhanced-grid-scroll::-webkit-scrollbar-thumb {
              background: #cbd5e1;
              border-radius: 4px;
              border: 1px solid #f1f5f9;
            }
            
            .enhanced-grid-scroll::-webkit-scrollbar-thumb:hover {
              background: #94a3b8;
            }
          }
          `}
        </style>
      </div>
    </TooltipProvider>
  );
};
