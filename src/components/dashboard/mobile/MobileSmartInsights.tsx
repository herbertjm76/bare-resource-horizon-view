
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
          <Sparkles className="h-5 w-5 text-brand-violet" strokeWidth={1.5} />
          <span className="text-brand-violet font-semibold">
            Smart Insights
          </span>
          <Badge className="bg-gray-100 text-gray-500 border-gray-200 ml-auto text-xs px-2 py-0.5 rounded-md">
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
