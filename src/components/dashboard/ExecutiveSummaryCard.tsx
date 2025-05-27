
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DollarSign, TrendingUp, Clock, Briefcase, Users } from 'lucide-react';

interface ExecutiveSummaryCardProps {
  activeProjects: number;
  activeResources: number;
  utilizationTrends: {
    days7: number;
    days30: number;
    days90: number;
  };
}

export const ExecutiveSummaryCard: React.FC<ExecutiveSummaryCardProps> = ({
  activeProjects,
  activeResources,
  utilizationTrends
}) => {
  const getUtilizationStatus = (rate: number) => {
    if (rate > 90) return { color: 'destructive', label: 'At Capacity' };
    if (rate > 65) return { color: 'default', label: 'Optimally Allocated' };
    return { color: 'outline', label: 'Ready for Projects' };
  };

  const utilizationStatus = getUtilizationStatus(utilizationTrends.days7);

  return (
    <div 
      className="rounded-2xl p-6 border border-white/20 backdrop-blur-xl relative overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, rgba(111, 75, 246, 0.9) 0%, rgba(86, 105, 247, 0.8) 55%, rgba(230, 79, 196, 0.9) 100%)'
      }}
    >
      {/* Glass morphism overlay */}
      <div className="absolute inset-0 bg-white/10 backdrop-blur-md" />
      
      {/* Top highlight gradient */}
      <div className="absolute inset-x-0 top-0 h-20 bg-[radial-gradient(120%_30%_at_50%_0%,rgba(255,255,255,0.2)_0%,rgba(255,255,255,0)_70%)]" />
      
      <div className="relative z-10">
        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <DollarSign className="h-5 w-5" />
          Executive Summary
        </h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          <Card className="bg-white/15 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-300">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-xs font-medium text-white/80 mb-1">Team Utilization</p>
                  <p className="text-2xl font-bold text-white mb-2">{utilizationTrends.days7}%</p>
                  <Badge variant={utilizationStatus.color as any} className="text-xs bg-white/20 text-white border-white/30">
                    {utilizationStatus.label}
                  </Badge>
                </div>
                <div className="h-10 w-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="h-5 w-5 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/15 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-300">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-xs font-medium text-white/80 mb-1">Available Capacity</p>
                  <p className="text-2xl font-bold text-white mb-1">2,340h</p>
                  <p className="text-xs font-medium text-white/70">Next 12 weeks</p>
                </div>
                <div className="h-10 w-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
                  <Clock className="h-5 w-5 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/15 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-300">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-xs font-medium text-white/80 mb-1">Active Projects</p>
                  <p className="text-2xl font-bold text-white mb-1">{activeProjects}</p>
                  <p className="text-xs font-medium text-white/70">{(activeProjects / activeResources).toFixed(1)} per person</p>
                </div>
                <div className="h-10 w-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
                  <Briefcase className="h-5 w-5 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/15 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-300">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-xs font-medium text-white/80 mb-1">Team Size</p>
                  <p className="text-2xl font-bold text-white mb-2">{activeResources}</p>
                  <Badge variant="outline" className="text-xs bg-white/20 text-white border-white/30">
                    {utilizationTrends.days7 > 85 ? 'Consider Hiring' : 'Stable'}
                  </Badge>
                </div>
                <div className="h-10 w-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
                  <Users className="h-5 w-5 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
