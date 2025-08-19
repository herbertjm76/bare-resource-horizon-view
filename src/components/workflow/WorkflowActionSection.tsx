import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Plus, Settings, TrendingUp } from 'lucide-react';

interface WorkflowAction {
  title: string;
  description: string;
  action: () => void;
  icon: React.ComponentType<{ className?: string }>;
  variant?: 'default' | 'outline' | 'secondary';
  badge?: {
    text: string;
    variant?: 'default' | 'secondary' | 'destructive' | 'outline';
  };
}

interface WorkflowActionSectionProps {
  title: string;
  subtitle?: string;
  actions: WorkflowAction[];
}

export const WorkflowActionSection: React.FC<WorkflowActionSectionProps> = ({
  title,
  subtitle,
  actions
}) => {
  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">{title}</CardTitle>
            {subtitle && (
              <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {actions.map((action, index) => (
            <Card key={index} className="p-4 hover:shadow-md transition-shadow cursor-pointer" onClick={action.action}>
              <div className="flex items-start justify-between mb-3">
                <action.icon className="w-5 h-5 text-primary" />
                {action.badge && (
                  <Badge variant={action.badge.variant || 'default'} className="text-xs">
                    {action.badge.text}
                  </Badge>
                )}
              </div>
              <h3 className="font-medium text-sm mb-1">{action.title}</h3>
              <p className="text-xs text-muted-foreground mb-3">{action.description}</p>
              <Button 
                variant={action.variant || 'default'} 
                size="sm" 
                className="w-full"
                onClick={(e) => {
                  e.stopPropagation();
                  action.action();
                }}
              >
                {action.title.includes('New') ? 'Create' : 'Open'}
                <ArrowRight className="w-3 h-3 ml-2" />
              </Button>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};