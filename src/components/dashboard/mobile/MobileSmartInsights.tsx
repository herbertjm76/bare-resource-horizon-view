
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
    <Card className="rounded-2xl border-0 shadow-sm bg-white">
      <CardHeader className="pb-3 px-4">
        <CardTitle className="text-lg flex items-center gap-3">
          <div className="p-1.5 rounded-lg bg-gradient-to-br from-brand-violet to-purple-600">
            <Sparkles className="h-4 w-4 text-white" />
          </div>
          <span className="text-brand-violet font-semibold">
            Smart Insights
          </span>
          <Badge variant="brand" className="bg-brand-violet/20 text-brand-violet border-brand-violet/20 ml-auto">
            2 Active
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0 px-4 pb-4">
        <IntelligentInsights 
          teamMembers={transformedStaffData}
          activeProjects={activeProjects}
          utilizationRate={currentUtilizationRate}
        />
      </CardContent>
    </Card>
  );
};
