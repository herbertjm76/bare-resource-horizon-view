
import React from 'react';
import { CompactInsightCard } from './CompactInsightCard';
import { AlertTriangle, Users, Target, TrendingUp, Calendar, Briefcase, Clock, UserCheck, Zap, BarChart3, DollarSign, TrendingDown, PiggyBank, Banknote } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight } from 'lucide-react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { useFinancialInsights } from './hooks/useFinancialInsights';

interface TeamMember {
  id: string;
  first_name: string;
  last_name: string;
  weekly_capacity?: number;
  job_title?: string;
}

interface EnhancedInsightsProps {
  teamMembers: TeamMember[];
  activeProjects: number;
  utilizationRate: number;
  utilizationTrends: {
    days7: number;
    days30: number;
    days90: number;
  };
  staffMembers: any[];
}

export const EnhancedInsights: React.FC<EnhancedInsightsProps> = ({
  teamMembers,
  activeProjects,
  utilizationRate,
  utilizationTrends,
  staffMembers
}) => {
  const navigate = useNavigate();
  const { financialData, isLoading } = useFinancialInsights();
  
  const generateFinancialInsights = () => {
    const insights = [];
    const teamSize = teamMembers.length;
    
    if (isLoading || !financialData) {
      return [{
        title: "Analyzing Financials",
        description: "Calculating revenue, costs, and profit margins...",
        severity: 'low' as const,
        metric: "Loading...",
        icon: <BarChart3 className="h-4 w-4 text-gray-500" />
      }];
    }

    const {
      totalProjectRevenue,
      averageProjectValue,
      totalMonthlyCosts,
      profitMargin,
      revenuePerEmployee,
      unpaidInvoices,
      overdueAmount,
      highestRateEmployee,
      lowestRateEmployee,
      projectsWithoutFees,
      averageHourlyRate
    } = financialData;

    // 1. CASH FLOW ISSUES - Critical Priority
    if (unpaidInvoices > 0) {
      insights.push({
        title: "Outstanding Invoices",
        description: `${unpaidInvoices} unpaid invoices worth $${overdueAmount.toLocaleString()}. This affects cash flow.`,
        severity: 'critical' as const,
        actionLabel: "Review Invoicing",
        onAction: () => navigate('/projects'),
        metric: `$${overdueAmount.toLocaleString()}`,
        icon: <AlertTriangle className="h-4 w-4 text-red-500" />
      });
    }

    // 2. LOW PROFIT MARGINS - Critical
    if (profitMargin < 20) {
      insights.push({
        title: "Low Profit Margins",
        description: `Only ${profitMargin}% profit margin. Industry standard is 25-35%. Review costs and pricing.`,
        severity: 'critical' as const,
        actionLabel: "Review Pricing",
        onAction: () => navigate('/projects'),
        metric: `${profitMargin}%`,
        icon: <TrendingDown className="h-4 w-4 text-red-500" />
      });
    }

    // 3. MISSING PROJECT FEES - High Priority
    if (projectsWithoutFees > 0) {
      insights.push({
        title: "Projects Missing Fees",
        description: `${projectsWithoutFees} projects have no fee structure. This creates revenue risk.`,
        severity: 'high' as const,
        actionLabel: "Set Project Fees",
        onAction: () => navigate('/projects'),
        metric: `${projectsWithoutFees} projects`,
        icon: <DollarSign className="h-4 w-4 text-orange-500" />
      });
    }

    // 4. REVENUE PER EMPLOYEE ANALYSIS
    const industryBenchmark = 150000; // $150k annual revenue per employee benchmark
    if (revenuePerEmployee < industryBenchmark) {
      insights.push({
        title: "Low Revenue Per Employee",
        description: `$${Math.round(revenuePerEmployee/1000)}k per employee. Industry benchmark is $150k+. Consider higher-value projects.`,
        severity: 'high' as const,
        actionLabel: "Strategy Review",
        onAction: () => navigate('/projects'),
        metric: `$${Math.round(revenuePerEmployee/1000)}k/person`,
        icon: <BarChart3 className="h-4 w-4 text-orange-600" />
      });
    }

    // 5. RATE OPTIMIZATION OPPORTUNITY
    const rateDifference = highestRateEmployee - lowestRateEmployee;
    if (rateDifference > 50 && teamSize > 1) {
      insights.push({
        title: "Rate Gap Opportunity",
        description: `$${rateDifference}/hr difference between highest and lowest rates. Consider upskilling lower-rate team members.`,
        severity: 'medium' as const,
        actionLabel: "Review Rates",
        onAction: () => navigate('/team-members'),
        metric: `$${rateDifference}/hr gap`,
        icon: <TrendingUp className="h-4 w-4 text-blue-500" />
      });
    }

    // 6. SMALL PROJECT SIZE WARNING
    if (averageProjectValue < 50000 && activeProjects > 2) {
      insights.push({
        title: "Small Project Focus",
        description: `Average project value is $${Math.round(averageProjectValue/1000)}k. Consider targeting larger projects for better margins.`,
        severity: 'medium' as const,
        actionLabel: "Growth Strategy",
        onAction: () => navigate('/projects'),
        metric: `$${Math.round(averageProjectValue/1000)}k avg`,
        icon: <Target className="h-4 w-4 text-purple-500" />
      });
    }

    // 7. COST MANAGEMENT
    const costPerEmployee = totalMonthlyCosts / teamSize;
    if (costPerEmployee > 8000) { // $8k monthly cost per employee is high for small teams
      insights.push({
        title: "High Operating Costs",
        description: `$${Math.round(costPerEmployee)}k monthly cost per employee. Review expenses and overhead.`,
        severity: 'medium' as const,
        actionLabel: "Cost Analysis",
        onAction: () => navigate('/settings'),
        metric: `$${Math.round(costPerEmployee)}k/person`,
        icon: <PiggyBank className="h-4 w-4 text-red-400" />
      });
    }

    // 8. CAPACITY VS REVENUE MISMATCH
    const revenueEfficiency = totalProjectRevenue / (teamSize * 40 * 4 * averageHourlyRate);
    if (revenueEfficiency < 0.7) {
      insights.push({
        title: "Underpriced Services",
        description: `Team could generate ${Math.round((1-revenueEfficiency)*100)}% more revenue with better pricing or utilization.`,
        severity: 'high' as const,
        actionLabel: "Pricing Review",
        onAction: () => navigate('/projects'),
        metric: `${Math.round(revenueEfficiency*100)}% efficiency`,
        icon: <Zap className="h-4 w-4 text-orange-500" />
      });
    }

    // 9. EXCELLENT FINANCIAL PERFORMANCE
    if (profitMargin > 30 && unpaidInvoices === 0 && revenuePerEmployee > industryBenchmark) {
      insights.push({
        title: "Strong Financial Performance",
        description: `${profitMargin}% profit margin, no outstanding invoices, and strong revenue per employee. Excellent work!`,
        severity: 'low' as const,
        metric: `${profitMargin}% margin`,
        icon: <Banknote className="h-4 w-4 text-green-500" />
      });
    }

    // 10. GROWTH OPPORTUNITY
    if (utilizationRate > 85 && profitMargin > 25) {
      insights.push({
        title: "Ready for Growth",
        description: `High utilization (${utilizationRate}%) and good margins (${profitMargin}%). Perfect time to expand the team.`,
        severity: 'low' as const,
        actionLabel: "Hiring Plan",
        onAction: () => navigate('/team-members'),
        metric: `${utilizationRate}% utilized`,
        icon: <Users className="h-4 w-4 text-green-600" />
      });
    }

    return insights;
  };

  const insights = generateFinancialInsights();

  // Show most important insights first (financial issues are highest priority)
  const prioritizedInsights = insights.sort((a, b) => {
    const severityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
    return severityOrder[a.severity] - severityOrder[b.severity];
  });

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'border-red-200 bg-red-50';
      case 'high': return 'border-orange-200 bg-orange-50';
      case 'medium': return 'border-yellow-200 bg-yellow-50';
      case 'low': return 'border-green-200 bg-green-50';
      default: return 'border-gray-200 bg-gray-50';
    }
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'critical': return <Badge variant="destructive" className="text-xs">Urgent</Badge>;
      case 'high': return <Badge className="bg-orange-500 text-white text-xs">Important</Badge>;
      case 'medium': return <Badge className="bg-yellow-500 text-white text-xs">Review</Badge>;
      case 'low': return <Badge variant="secondary" className="text-xs">Good</Badge>;
      default: return null;
    }
  };

  if (prioritizedInsights.length === 0) {
    return (
      <div className="h-full flex flex-col">
        <div className="flex justify-end mb-4">
          <Badge variant="outline" className="text-xs">All systems optimal</Badge>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Target className="h-8 w-8 text-green-600 mx-auto mb-3" />
            <h3 className="text-sm font-semibold text-green-900 mb-2">Business Running Smoothly!</h3>
            <p className="text-xs text-green-700">Strong financials and optimal operations.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <ScrollArea className="flex-1">
        <div className="space-y-4 p-1">
          {/* Show top 3 most important insights */}
          {prioritizedInsights.slice(0, 3).map((insight, index) => (
            <div key={index} className={`${getSeverityColor(insight.severity)} border-l-4 rounded-lg p-4 transition-all hover:shadow-sm`}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  {insight.icon && (
                    <div className="mt-1 flex-shrink-0">
                      {insight.icon}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-gray-900 truncate">{insight.title}</h3>
                      {getSeverityBadge(insight.severity)}
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{insight.description}</p>
                    {insight.metric && (
                      <div className="text-2xl font-bold text-brand-violet mb-3">{insight.metric}</div>
                    )}
                    {insight.actionLabel && insight.onAction && (
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={insight.onAction}
                        className="text-sm h-8 px-3 flex items-center gap-2"
                      >
                        {insight.actionLabel}
                        <ArrowRight className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Show count if there are more insights */}
          {prioritizedInsights.length > 3 && (
            <div className="text-center py-2">
              <Badge variant="outline" className="text-xs">
                +{prioritizedInsights.length - 3} more financial insights
              </Badge>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};
