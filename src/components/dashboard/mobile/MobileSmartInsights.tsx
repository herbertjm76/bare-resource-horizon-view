
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles } from 'lucide-react';
import { IntelligentInsights } from '../IntelligentInsights';

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
    <Card className="rounded-2xl border-0 shadow-sm w-full max-w-full overflow-hidden">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <div className="p-1.5 bg-brand-violet/10 rounded-lg flex-shrink-0">
            <Sparkles className="h-4 w-4 text-brand-violet" />
          </div>
          <span className="truncate">Smart Insights</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0 w-full max-w-full overflow-hidden">
        <IntelligentInsights 
          teamMembers={transformedStaffData}
          activeProjects={activeProjects}
          utilizationRate={currentUtilizationRate}
        />
      </CardContent>
    </Card>
  );
};
