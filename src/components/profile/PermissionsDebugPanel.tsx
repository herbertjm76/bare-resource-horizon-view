import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { RefreshCw, ShieldCheck, ShieldAlert, Eye } from 'lucide-react';
import { usePermissions, ROLE_HIERARCHY } from '@/hooks/usePermissions';
import { useViewAs } from '@/hooks/usePermissions';

const ROLE_COLORS: Record<string, string> = {
  owner: 'bg-purple-100 text-purple-800 border-purple-300',
  admin: 'bg-blue-100 text-blue-800 border-blue-300',
  project_manager: 'bg-green-100 text-green-800 border-green-300',
  member: 'bg-gray-100 text-gray-800 border-gray-300',
};

export const PermissionsDebugPanel: React.FC = () => {
  const {
    role,
    actualRole,
    isSimulating,
    permissions,
    debugInfo,
    roleError,
    refreshPermissions,
    isLoading,
    canViewSection,
  } = usePermissions();
  const { setSimulatedRole } = useViewAs();

  const canSeeAllocate = canViewSection('ALLOCATE');

  return (
    <Card className="border-amber-200 bg-amber-50/50">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-amber-600" />
            Permissions Debug
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={refreshPermissions}
            disabled={isLoading}
            className="h-8"
          >
            <RefreshCw className={`h-4 w-4 mr-1 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Role Status */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Actual Role</p>
            <Badge variant="outline" className={ROLE_COLORS[actualRole] || ROLE_COLORS.member}>
              {actualRole.toUpperCase()}
            </Badge>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Effective Role</p>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className={ROLE_COLORS[role] || ROLE_COLORS.member}>
                {role.toUpperCase()}
              </Badge>
              {isSimulating && (
                <Badge variant="secondary" className="text-xs">
                  <Eye className="h-3 w-3 mr-1" />
                  Simulated
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* ALLOCATE Section Access */}
        <div className="p-3 rounded-lg border bg-white">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">ALLOCATE Section Access</span>
            {canSeeAllocate ? (
              <Badge className="bg-green-100 text-green-800 border-green-300">
                ✓ Visible
              </Badge>
            ) : (
              <Badge className="bg-red-100 text-red-800 border-red-300">
                ✗ Hidden
              </Badge>
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Requires: view:scheduling (roles: owner, admin, project_manager)
          </p>
        </div>

        {/* Debug Info */}
        {debugInfo && (
          <div className="space-y-2 text-xs font-mono bg-gray-900 text-gray-100 p-3 rounded-lg overflow-x-auto">
            <div><span className="text-gray-400">userId:</span> {debugInfo.userId || 'null'}</div>
            <div><span className="text-gray-400">companyId:</span> {debugInfo.companyId || 'null'}</div>
            <div>
              <span className="text-gray-400">rawRoles:</span>{' '}
              {debugInfo.rawRoles.length > 0 
                ? debugInfo.rawRoles.map(r => r.role).join(', ')
                : '(none)'}
            </div>
            <div><span className="text-gray-400">lastFetchedAt:</span> {debugInfo.lastFetchedAt}</div>
            {debugInfo.fetchError && (
              <div className="text-red-400">
                <span className="text-gray-400">error:</span> {debugInfo.fetchError}
              </div>
            )}
          </div>
        )}

        {/* Role Error */}
        {roleError && (
          <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
            <ShieldAlert className="h-4 w-4 text-red-600 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-red-800">Permission Error</p>
              <p className="text-xs text-red-600">{roleError}</p>
            </div>
          </div>
        )}

        {/* Clear Simulation */}
        {isSimulating && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSimulatedRole(null)}
            className="w-full border-amber-300 text-amber-700 hover:bg-amber-100"
          >
            Stop Role Simulation
          </Button>
        )}

        {/* Permissions List */}
        <div>
          <p className="text-xs text-muted-foreground mb-2">Current Permissions</p>
          <div className="flex flex-wrap gap-1">
            {permissions.map((perm) => (
              <Badge key={perm} variant="secondary" className="text-xs">
                {perm}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
