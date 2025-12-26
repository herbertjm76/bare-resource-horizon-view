import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { 
  History, 
  CalendarDays, 
  Users, 
  Plus, 
  Minus, 
  Edit, 
  Clock,
  Search,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { usePlanningAuditLog, PlanningAuditEntry } from '@/hooks/usePlanningAuditLog';
import { formatDistanceToNow, format } from 'date-fns';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface PlanningAuditLogViewerProps {
  projectId?: string;
  compact?: boolean;
}

export const PlanningAuditLogViewer: React.FC<PlanningAuditLogViewerProps> = ({
  projectId,
  compact = false
}) => {
  const { auditLog } = usePlanningAuditLog(projectId);
  const [searchTerm, setSearchTerm] = useState('');
  const [isExpanded, setIsExpanded] = useState(!compact);

  const filteredLog = useMemo(() => {
    if (!searchTerm) return auditLog;
    const term = searchTerm.toLowerCase();
    return auditLog.filter(entry =>
      entry.description.toLowerCase().includes(term) ||
      entry.project_name?.toLowerCase().includes(term) ||
      entry.stage_name?.toLowerCase().includes(term) ||
      entry.created_by_name?.toLowerCase().includes(term)
    );
  }, [auditLog, searchTerm]);

  const getActionIcon = (actionType: PlanningAuditEntry['action_type']) => {
    switch (actionType) {
      case 'contracted_weeks_updated':
        return <CalendarDays className="h-4 w-4 text-blue-500" />;
      case 'team_composition_added':
        return <Plus className="h-4 w-4 text-green-500" />;
      case 'team_composition_removed':
        return <Minus className="h-4 w-4 text-red-500" />;
      case 'team_composition_updated':
        return <Edit className="h-4 w-4 text-yellow-500" />;
      case 'stage_added':
        return <Plus className="h-4 w-4 text-green-500" />;
      case 'stage_removed':
        return <Minus className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getActionBadge = (actionType: PlanningAuditEntry['action_type']) => {
    switch (actionType) {
      case 'contracted_weeks_updated':
        return <Badge variant="outline" className="text-xs bg-blue-500/10 text-blue-600 border-blue-500/30">Weeks</Badge>;
      case 'team_composition_added':
        return <Badge variant="outline" className="text-xs bg-green-500/10 text-green-600 border-green-500/30">Added</Badge>;
      case 'team_composition_removed':
        return <Badge variant="outline" className="text-xs bg-red-500/10 text-red-600 border-red-500/30">Removed</Badge>;
      case 'team_composition_updated':
        return <Badge variant="outline" className="text-xs bg-yellow-500/10 text-yellow-600 border-yellow-500/30">Updated</Badge>;
      case 'stage_added':
        return <Badge variant="outline" className="text-xs bg-green-500/10 text-green-600 border-green-500/30">Stage Added</Badge>;
      case 'stage_removed':
        return <Badge variant="outline" className="text-xs bg-red-500/10 text-red-600 border-red-500/30">Stage Removed</Badge>;
      default:
        return <Badge variant="outline" className="text-xs">Change</Badge>;
    }
  };

  if (compact) {
    return (
      <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="sm" className="w-full justify-between gap-2">
            <span className="flex items-center gap-2">
              <History className="h-4 w-4" />
              Recent Changes
              <Badge variant="secondary" className="text-xs">{auditLog.length}</Badge>
            </span>
            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <ScrollArea className="h-48 mt-2">
            <div className="space-y-2 pr-4">
              {filteredLog.slice(0, 10).map((entry) => (
                <div key={entry.id} className="flex items-start gap-2 text-xs p-2 bg-muted/30 rounded-md">
                  {getActionIcon(entry.action_type)}
                  <div className="flex-1 min-w-0">
                    <p className="truncate">{entry.description}</p>
                    <p className="text-muted-foreground">
                      {formatDistanceToNow(new Date(entry.created_at), { addSuffix: true })}
                    </p>
                  </div>
                </div>
              ))}
              {filteredLog.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No changes recorded yet
                </p>
              )}
            </div>
          </ScrollArea>
        </CollapsibleContent>
      </Collapsible>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <History className="h-5 w-5" />
            Planning Activity Log
          </CardTitle>
          <Badge variant="secondary">{auditLog.length} changes</Badge>
        </div>
        <div className="relative mt-2">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search changes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8 h-9"
          />
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-72">
          <div className="space-y-3 pr-4">
            {filteredLog.map((entry) => (
              <div key={entry.id} className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
                <div className="mt-0.5">{getActionIcon(entry.action_type)}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    {getActionBadge(entry.action_type)}
                    {entry.project_name && (
                      <span className="text-xs font-medium text-muted-foreground">
                        {entry.project_name}
                      </span>
                    )}
                    {entry.stage_name && (
                      <span className="text-xs text-muted-foreground">
                        • {entry.stage_name}
                      </span>
                    )}
                  </div>
                  <p className="text-sm">{entry.description}</p>
                  <div className="flex items-center gap-2 mt-1.5 text-xs text-muted-foreground">
                    <span>
                      {formatDistanceToNow(new Date(entry.created_at), { addSuffix: true })}
                    </span>
                    {entry.created_by_name && (
                      <>
                        <span>•</span>
                        <span>{entry.created_by_name}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {filteredLog.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <History className="h-10 w-10 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No changes recorded yet</p>
                <p className="text-xs">Changes to project planning will appear here</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
