import React from 'react';
import { Eye, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { usePermissions, useViewAs, AppRole } from '@/hooks/usePermissions';

const ROLE_LABELS: Record<AppRole, string> = {
  owner: 'Super Admin',
  admin: 'Admin',
  project_manager: 'Project Manager',
  member: 'Member',
};

export const ViewAsRoleSwitcher: React.FC = () => {
  const { canUseViewAs, isSimulating, role, actualRole } = usePermissions();
  const { setSimulatedRole } = useViewAs();

  if (!canUseViewAs) return null;

  const handleRoleSelect = (selectedRole: AppRole | null) => {
    setSimulatedRole(selectedRole);
  };

  if (isSimulating) {
    return (
      <div className="flex items-center gap-2">
        <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-300">
          <Eye className="w-3 h-3 mr-1" />
          Viewing as {ROLE_LABELS[role]}
        </Badge>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleRoleSelect(null)}
          className="h-7 px-2 text-amber-700 hover:text-amber-900 hover:bg-amber-100"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="text-gray-700 hover:bg-gray-100">
          <Eye className="w-4 h-4 mr-2" />
          <span className="hidden sm:inline">View As</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuLabel className="text-xs text-muted-foreground">
          Test permissions as different role
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {(Object.keys(ROLE_LABELS) as AppRole[]).map((roleKey) => (
          <DropdownMenuItem
            key={roleKey}
            onClick={() => handleRoleSelect(roleKey)}
            disabled={roleKey === actualRole}
            className={roleKey === actualRole ? 'opacity-50' : ''}
          >
            {ROLE_LABELS[roleKey]}
            {roleKey === actualRole && (
              <span className="ml-auto text-xs text-muted-foreground">(current)</span>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
