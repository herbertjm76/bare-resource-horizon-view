
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles } from 'lucide-react';
import { IntelligentInsights } from '../IntelligentInsights';
import { StandardizedHeaderBadge } from './components/StandardizedHeaderBadge';

interface MobileSmartInsightsProps {
  transformedStaffData: any[];
  activeProjects: number;
  currentUtilizationRate: number;
}

export const MobileSmartInsights: React.FC<MobileSmartInsightsProps> = ({
  transformedStaffData,
  activeProjects,
  currentUtilizationRate
}) => {
  return (
    <Card className="rounded-2xl border-0 shadow-sm bg-white">
      <CardHeader className="pb-3 px-4">
        <CardTitle className="text-lg flex items-center gap-3">
          <Sparkles className="h-5 w-5 text-brand-violet" strokeWidth={1.5} />
          <span className="text-brand-violet font-semibold">
            Smart Insights
          </span>
          <StandardizedHeaderBadge>
            2 Active
          </StandardizedHeaderBadge>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0 px-4 pb-4">
        {/* Hide the header of IntelligentInsights to prevent duplication */}
        <div className="[&_.card]:border-0 [&_.card]:shadow-none [&_.card]:bg-transparent [&_h3]:hidden [&_.flex.items-center.gap-3]:hidden">
          <IntelligentInsights 
            teamMembers={transformedStaffData}
            activeProjects={activeProjects}
            utilizationRate={currentUtilizationRate}
          />
        </div>
      </CardContent>
    </Card>
  );
};
