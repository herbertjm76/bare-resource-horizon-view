
import React from 'react';
import { SummaryHeader } from './executiveSummary/components/SummaryHeader';
import { Gauge } from './Gauge';
import { getUtilizationStatus, getTimeRangeText } from './executiveSummary/utils/utilizationUtils';
import { calculateCapacityHours } from './executiveSummary/utils/capacityUtils';
import { ExecutiveSummaryProps } from './executiveSummary/types';

export const ExecutiveSummaryCard: React.FC<ExecutiveSummaryProps> = ({
  activeProjects,
  activeResources,
  utilizationTrends,
  selectedTimeRange,
  totalRevenue = 0,
  avgProjectValue = 0,
  staffData = [],
  standardizedUtilizationRate
}) => {
  // Use standardized utilization rate if provided, otherwise fall back to legacy calculation
  const utilizationRate = standardizedUtilizationRate !== undefined 
    ? standardizedUtilizationRate 
    : (() => {
        // Legacy fallback calculation
        switch (selectedTimeRange) {
          case 'week': return utilizationTrends.days7;
          case 'month': return utilizationTrends.days30;
          case '3months': 
          case '4months':
          case '6months':
          case 'year':
            return utilizationTrends.days90;
          default: return utilizationTrends.days30;
        }
      })();

  const utilizationStatus = getUtilizationStatus(utilizationRate);
  const timeRangeText = getTimeRangeText(selectedTimeRange);
  const capacityHours = calculateCapacityHours(selectedTimeRange, activeResources, utilizationRate, staffData);
  const isOverCapacity = capacityHours < 0;

  console.log('Executive Summary Card Data (Standardized):', {
    selectedTimeRange,
    activeProjects,
    activeResources,
    utilizationRate,
    standardizedUtilizationRate,
    totalRevenue,
    avgProjectValue,
    capacityHours,
    isOverCapacity,
    staffDataCount: staffData.length
  });

  return (
    <div 
      className="rounded-2xl p-4 border border-brand-violet/10"
      style={{
        background: 'linear-gradient(45deg, #6F4BF6 0%, #5669F7 55%, #E64FC4 100%)'
      }}
    >
      <SummaryHeader timeRangeText={timeRangeText} />
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div className="bg-white/90 backdrop-blur-sm rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-600 mb-2">Team Utilization</h3>
          <div className="flex items-center justify-center">
            <Gauge 
              value={Math.round(utilizationRate)} 
              max={100} 
              title="Utilization Rate"
              size="lg"
            />
          </div>
          <div className="text-center mt-2">
            <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
              utilizationStatus.color === 'destructive' ? 'bg-red-100 text-red-800' :
              utilizationStatus.color === 'default' ? 'bg-green-100 text-green-800' :
              'bg-blue-100 text-blue-800'
            }`}>
              {utilizationStatus.label}
            </span>
          </div>
        </div>

        <div className="bg-white/90 backdrop-blur-sm rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-600 mb-2">Available Capacity</h3>
          <div className="flex items-center justify-center">
            <Gauge 
              value={isOverCapacity ? 0 : Math.min((capacityHours / (activeResources * 40)) * 100, 100)} 
              max={100} 
              title={isOverCapacity ? "Over Capacity" : "Available Hours"}
              size="lg"
            />
          </div>
          <div className="text-center mt-2">
            <p className={`text-lg font-bold ${isOverCapacity ? 'text-red-600' : 'text-gray-900'}`}>
              {Math.abs(capacityHours).toLocaleString()}h
            </p>
            <p className="text-xs text-gray-500">{timeRangeText}</p>
          </div>
        </div>

        <div className="bg-white/90 backdrop-blur-sm rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-600 mb-2">Active Projects</h3>
          <div className="flex items-center justify-center">
            <Gauge 
              value={activeProjects} 
              max={Math.max(activeProjects * 1.5, 10)} 
              title="Projects Count"
              size="lg"
            />
          </div>
          <div className="text-center mt-2">
            <p className="text-lg font-bold text-gray-900">{activeProjects}</p>
            <p className="text-xs text-gray-500">
              {activeResources > 0 
                ? `${(activeProjects / activeResources).toFixed(1)} per person` 
                : 'No team members'}
            </p>
          </div>
        </div>

        <div className="bg-white/90 backdrop-blur-sm rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-600 mb-2">Team Size</h3>
          <div className="flex items-center justify-center">
            <Gauge 
              value={activeResources} 
              max={Math.max(activeResources * 1.5, 10)} 
              title="Team Members"
              size="lg"
            />
          </div>
          <div className="text-center mt-2">
            <p className="text-lg font-bold text-gray-900">{activeResources}</p>
            <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
              utilizationRate > 85 ? 'bg-orange-100 text-orange-800' : 'bg-green-100 text-green-800'
            }`}>
              {utilizationRate > 85 ? 'Consider Hiring' : 'Stable'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
