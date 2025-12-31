import React from 'react';
import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { logger } from '@/utils/logger';

interface AllocationData {
  resourceId: string;
  resourceName: string;
  weekStartDate: string;
  hours: number;
  source: 'Project Resources' | 'Team Workload';
  projectName?: string;
}

interface AllocationDataComparisonProps {
  projectResourcesData: AllocationData[];
  teamWorkloadData: AllocationData[];
  resourceId: string;
  resourceName: string;
}

export const AllocationDataComparison: React.FC<AllocationDataComparisonProps> = ({
  projectResourcesData,
  teamWorkloadData,
  resourceId,
  resourceName
}) => {
  // Filter data for the specific resource
  const projectData = projectResourcesData.filter(d => d.resourceId === resourceId);
  const workloadData = teamWorkloadData.filter(d => d.resourceId === resourceId);
  
  // Calculate totals
  const projectTotal = projectData.reduce((sum, d) => sum + d.hours, 0);
  const workloadTotal = workloadData.reduce((sum, d) => sum + d.hours, 0);
  
  // Find discrepancies
  const allWeeks = [...new Set([...projectData.map(d => d.weekStartDate), ...workloadData.map(d => d.weekStartDate)])];
  const discrepancies = allWeeks.map(week => {
    const projectHours = projectData.find(d => d.weekStartDate === week)?.hours || 0;
    const workloadHours = workloadData.find(d => d.weekStartDate === week)?.hours || 0;
    const difference = Math.abs(projectHours - workloadHours);
    
    return {
      week,
      projectHours,
      workloadHours,
      difference,
      hasDiscrepancy: difference > 0.01 // Account for floating point precision
    };
  });

  const hasAnyDiscrepancies = discrepancies.some(d => d.hasDiscrepancy);

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Allocation Data Comparison: {resourceName}</span>
          <div className="flex gap-4 text-sm">
            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded">
              Project Resources: {projectTotal.toFixed(1)}h
            </span>
            <span className="px-2 py-1 bg-green-100 text-green-800 rounded">
              Team Workload: {workloadTotal.toFixed(1)}h
            </span>
            {hasAnyDiscrepancies && (
              <span className="px-2 py-1 bg-red-100 text-red-800 rounded">
                ⚠️ Discrepancies Found
              </span>
            )}
          </div>
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border border-gray-300 px-3 py-2 text-left">Week Start (Monday)</th>
                  <th className="border border-gray-300 px-3 py-2 text-center">Project Resources</th>
                  <th className="border border-gray-300 px-3 py-2 text-center">Team Workload</th>
                  <th className="border border-gray-300 px-3 py-2 text-center">Difference</th>
                  <th className="border border-gray-300 px-3 py-2 text-center">Status</th>
                </tr>
              </thead>
              <tbody>
                {discrepancies.map(({ week, projectHours, workloadHours, difference, hasDiscrepancy }) => (
                  <tr key={week} className={hasDiscrepancy ? 'bg-red-50' : ''}>
                    <td className="border border-gray-300 px-3 py-2 font-mono text-sm">
                      {format(new Date(week), 'yyyy-MM-dd (EEE)')}
                    </td>
                    <td className="border border-gray-300 px-3 py-2 text-center">
                      {projectHours > 0 ? `${projectHours.toFixed(1)}h` : '—'}
                    </td>
                    <td className="border border-gray-300 px-3 py-2 text-center">
                      {workloadHours > 0 ? `${workloadHours.toFixed(1)}h` : '—'}
                    </td>
                    <td className="border border-gray-300 px-3 py-2 text-center">
                      {difference > 0.01 ? `${difference.toFixed(1)}h` : '—'}
                    </td>
                    <td className="border border-gray-300 px-3 py-2 text-center">
                      {hasDiscrepancy ? (
                        <span className="text-red-600 font-medium">❌ Mismatch</span>
                      ) : (
                        <span className="text-green-600">✅ Match</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {hasAnyDiscrepancies && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h4 className="font-medium text-yellow-800 mb-2">⚠️ Data Discrepancies Detected</h4>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>• Check if both views are using the same date range calculation</li>
                <li>• Verify that week_start_date values are consistently Monday-based</li>
                <li>• Ensure allocation aggregation logic is identical</li>
                <li>• Check for caching or stale data issues</li>
              </ul>
            </div>
          )}
          
          <div className="grid grid-cols-2 gap-4 text-xs text-gray-600">
            <div>
              <h5 className="font-medium mb-1">Project Resources Data Sources:</h5>
              <ul className="space-y-1">
                <li>• useAllocationInput hook</li>
                <li>• fetchResourceAllocations API</li>
                <li>• project_resource_allocations table</li>
              </ul>
            </div>
            <div>
              <h5 className="font-medium mb-1">Team Workload Data Sources:</h5>
              <ul className="space-y-1">
                <li>• useProjectAllocations hook</li>
                <li>• useComprehensiveAllocations hook</li>
                <li>• Same table, different aggregation</li>
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Helper function to debug allocation data in browser console
export function debugAllocationData(
  projectResourcesData: AllocationData[],
  teamWorkloadData: AllocationData[]
) {
  console.group('🔍 ALLOCATION DEBUG: Data Comparison');
  
  logger.log('Project Resources Data:', projectResourcesData);
  logger.log('Team Workload Data:', teamWorkloadData);
  
  const allResourceIds = [...new Set([
    ...projectResourcesData.map(d => d.resourceId),
    ...teamWorkloadData.map(d => d.resourceId)
  ])];
  
  allResourceIds.forEach(resourceId => {
    const projectData = projectResourcesData.filter(d => d.resourceId === resourceId);
    const workloadData = teamWorkloadData.filter(d => d.resourceId === resourceId);
    
    const projectTotal = projectData.reduce((sum, d) => sum + d.hours, 0);
    const workloadTotal = workloadData.reduce((sum, d) => sum + d.hours, 0);
    
    logger.log(`Resource ${resourceId}:`, {
      projectTotal,
      workloadTotal,
      difference: Math.abs(projectTotal - workloadTotal),
      projectData,
      workloadData
    });
  });
  
  console.groupEnd();
}