
import React, { useState, useEffect } from 'react';
import { StandardizedExecutiveSummary } from './StandardizedExecutiveSummary';
import { getUtilizationStatus, getTimeRangeText } from './executiveSummary/utils/utilizationUtils';
import { calculateCapacityHours } from './executiveSummary/utils/capacityUtils';
import { ExecutiveSummaryProps } from './executiveSummary/types';
import { TrendingUp, Clock, Briefcase, Users } from 'lucide-react';
import { AIInsightsService, AIInsight } from '@/services/aiInsightsService';
import { AISummaryService, AISummaryData } from '@/services/aiSummaryService';
import { useCompany } from '@/context/CompanyContext';
import { Gauge } from './Gauge';

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
  const [aiSummary, setAiSummary] = useState<AISummaryData | null>(null);
  const [isLoadingAI, setIsLoadingAI] = useState(true);
  const { company } = useCompany();

  // Load AI insights for summary enhancement
  useEffect(() => {
    const loadAISummary = async () => {
      if (!company?.id) {
        setIsLoadingAI(false);
        return;
      }

      try {
        setIsLoadingAI(true);
        const response = await AIInsightsService.generateInsights(company.id, '30d');
        
        if (response.success && response.insights.length > 0) {
          const summary = AISummaryService.generateSummaryFromInsights(response.insights);
          setAiSummary(summary);
        }
      } catch (error) {
        console.error('Error loading AI summary:', error);
      } finally {
        setIsLoadingAI(false);
      }
    };

    loadAISummary();
  }, [company?.id]);
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

  // Enhanced metrics with AI insights
  const metrics = [
    {
      title: "Team Utilization",
      value: (
        <div className="flex flex-col items-center space-y-1">
          <Gauge
            value={utilizationRate}
            max={100}
            title=""
            size="sm"
            showPercentage={false}
            thresholds={{ good: 70, warning: 85, critical: 95 }}
          />
          <span className="text-lg font-bold">{Math.round(utilizationRate)}%</span>
        </div>
      ),
      subtitle: aiSummary ? `Trend: ${AISummaryService.getUtilizationTrendText(aiSummary.utilizationTrend)}` : timeRangeText,
      badgeText: aiSummary ? AISummaryService.getUtilizationTrendText(aiSummary.utilizationTrend) : utilizationStatus.label,
      badgeColor: aiSummary ? 
        (aiSummary.utilizationTrend === 'improving' ? 'green' : 
         aiSummary.utilizationTrend === 'declining' ? 'red' : 'blue') :
        (utilizationStatus.color === 'destructive' ? 'red' : 
         utilizationStatus.color === 'default' ? 'green' : 'blue')
    },
    {
      title: isOverCapacity ? "Over Capacity" : "Available Capacity",
      value: `${Math.abs(capacityHours).toLocaleString()}h`,
      subtitle: aiSummary ? `Status: ${AISummaryService.getCapacityStatusText(aiSummary.capacityStatus)}` : timeRangeText,
      badgeText: aiSummary ? AISummaryService.getCapacityStatusText(aiSummary.capacityStatus) : (isOverCapacity ? "Over Capacity" : undefined),
      badgeColor: aiSummary ? AISummaryService.getCapacityStatusColor(aiSummary.capacityStatus) : (isOverCapacity ? "red" : undefined)
    },
    {
      title: "Active Projects",
      value: activeProjects,
      subtitle: activeResources > 0 
        ? `${(activeProjects / activeResources).toFixed(1)} per person` 
        : 'No team members',
      badgeText: aiSummary && aiSummary.criticalInsights > 0 ? `${aiSummary.criticalInsights} Critical Issues` : undefined,
      badgeColor: aiSummary && aiSummary.criticalInsights > 0 ? 'red' : undefined
    },
    {
      title: "Team Size",
      value: activeResources,
      subtitle: aiSummary ? `Risk Level: ${aiSummary.riskLevel.charAt(0).toUpperCase() + aiSummary.riskLevel.slice(1)}` : "Active resources",
      badgeText: aiSummary ? `${aiSummary.riskLevel.charAt(0).toUpperCase() + aiSummary.riskLevel.slice(1)} Risk` : (utilizationRate > 85 ? 'Consider Hiring' : 'Stable'),
      badgeColor: aiSummary ? AISummaryService.getRiskLevelColor(aiSummary.riskLevel) : (utilizationRate > 85 ? 'orange' : 'green')
    }
  ];

  console.log('Executive Summary Card - Final State:', {
    selectedTimeRange,
    activeProjects,
    activeResources,
    utilizationRate,
    standardizedUtilizationRate,
    capacityHours,
    isOverCapacity,
    staffDataCount: staffData.length
  });

  return (
    <StandardizedExecutiveSummary
      title="Executive Summary"
      timeRangeText={timeRangeText}
      metrics={metrics}
      badgePosition="title"
    />
  );
};
