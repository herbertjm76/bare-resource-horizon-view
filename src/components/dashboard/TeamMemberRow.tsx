
import React from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Eye, Trash2, Mail, AlertTriangle, Send } from 'lucide-react';
import { TeamMember } from './types';
import { TeamMemberAvatar } from './TeamMemberAvatar';
import { useOfficeSettings } from '@/context/officeSettings';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';

interface TeamMemberRowProps {
  member: TeamMember;
  editMode: boolean;
  userRole: string;
  isSelected: boolean;
  onSelectMember: (memberId: string, checked: boolean) => void;
  onViewMember: (memberId: string) => void;
  onEditMember: (member: TeamMember) => void;
  onDeleteMember: (memberId: string) => void;
  onSendInvite?: (member: TeamMember) => void;
  onRefresh?: () => void;
  pendingChanges: Partial<TeamMember>;
  onFieldChange: (memberId: string, field: string, value: string) => void;
  currentUserId?: string | null;
  isAdmin: boolean;
}

export const TeamMemberRow: React.FC<TeamMemberRowProps> = ({
  member,
  editMode,
  userRole,
  isSelected,
  onSelectMember,
  onViewMember,
  onEditMember,
  onDeleteMember,
  onSendInvite,
  onRefresh,
  pendingChanges,
  onFieldChange,
  currentUserId,
  isAdmin
}) => {
  const { locations, departments, practice_areas, loading } = useOfficeSettings();
  
  const getValue = (field: keyof TeamMember): string => {
    if (pendingChanges[field] !== undefined) {
      return String(pendingChanges[field]);
    }
    return String(member[field] || '');
  };

  const handleChange = (field: string, value: string) => {
    onFieldChange(member.id, field, value);
  };

  const isPending = 'isPending' in member && member.isPending;
  const missingEmail = !getValue('email') || getValue('email').trim() === '';
  const showWarning = isPending && missingEmail;

  const roleConfig: Record<string, { bg: string; text: string; label: string }> = {
    owner: { bg: 'bg-purple-100', text: 'text-purple-800', label: 'Super Admin' },
    admin: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Admin' },
    project_manager: { bg: 'bg-indigo-100', text: 'text-indigo-800', label: 'PM' },
    member: { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Member' },
    contractor: { bg: 'bg-orange-100', text: 'text-orange-800', label: 'Contractor' },
  };

  // Only admins can edit in edit mode
  const canEdit = editMode && isAdmin;
  
  // Determine if user can edit THIS specific member (admin or own profile)
  const isOwnProfile = currentUserId === member.id;
  const canEditThisMember = isAdmin || isOwnProfile;

  // Handle avatar/name click - edit for admin or own profile, view-only for others
  const handleMemberClick = () => {
    if (canEditThisMember) {
      onEditMember(member);
    } else {
      onViewMember(member.id);
    }
  };

  return (
    <tr key={member.id} className={`hover:bg-muted ${canEdit ? 'bg-blue-50/30' : ''}`}>
      {canEdit && (
        <td className="px-4 py-3">
          <Checkbox
            checked={isSelected}
            onCheckedChange={(checked) => onSelectMember(member.id, checked as boolean)}
          />
        </td>
      )}
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleMemberClick}
            className={`focus:outline-none rounded-full flex-shrink-0 ${canEditThisMember ? 'cursor-pointer' : 'cursor-pointer'}`}
          >
            <TeamMemberAvatar member={member} />
          </button>
          <div className="flex-1 min-w-0">
            {canEdit ? (
              <div className="space-y-2">
                <div className="flex gap-2">
                  <Input
                    value={getValue('first_name')}
                    onChange={(e) => handleChange('first_name', e.target.value)}
                    placeholder="First name"
                    className="h-9 text-sm font-medium min-w-[120px]"
                  />
                  <Input
                    value={getValue('last_name')}
                    onChange={(e) => handleChange('last_name', e.target.value)}
                    placeholder="Last name"
                    className="h-9 text-sm font-medium min-w-[120px]"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Input
                    value={getValue('email')}
                    onChange={(e) => handleChange('email', e.target.value)}
                    placeholder="Email address"
                    className={`h-9 text-sm min-w-[200px] ${showWarning ? 'border-amber-500 focus-visible:ring-amber-500' : ''}`}
                    type="email"
                  />
                  {showWarning && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <AlertTriangle className="h-4 w-4 text-amber-500 flex-shrink-0" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Email required to send invite</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                </div>
              </div>
            ) : (
              <>
                <div className="font-medium text-foreground flex items-center gap-2">
                  {`${member.first_name || ''} ${member.last_name || ''}`.trim() || member.email?.split('@')[0] || 'Unknown'}
                  {showWarning && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <AlertTriangle className="h-4 w-4 text-amber-500" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Email required to send invite</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                </div>
                <div className="text-sm text-muted-foreground flex items-center gap-1">
                  <Mail className="h-3 w-3" />
                  {member.email || <span className="text-amber-600">No email</span>}
                </div>
              </>
            )}
          </div>
        </div>
      </td>
      <td className="px-4 py-3">
        {isPending ? (
          <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200 border">
            Pending
          </Badge>
        ) : (
          <Badge className="bg-green-100 text-green-800 border-green-200 border">
            Active
          </Badge>
        )}
      </td>
      {isAdmin && (
        <td className="px-4 py-3">
          {canEdit ? (
            <Select
              value={getValue('role') || 'member'}
              onValueChange={(value) => handleChange('role', value)}
            >
              <SelectTrigger className="h-9 text-sm min-w-[140px]">
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="member">Member</SelectItem>
                <SelectItem value="project_manager">PM (Project Manager)</SelectItem>
                <SelectItem value="contractor">Contractor</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="owner">Super Admin</SelectItem>
              </SelectContent>
            </Select>
          ) : (
            (() => {
              const role = member.role || 'member';
              const config = roleConfig[role] || { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Other' };
              return (
                <Badge className={`${config.bg} ${config.text} border border-current/20`}>
                  {config.label}
                </Badge>
              );
            })()
          )}
        </td>
      )}
      <td className="px-4 py-3">
        {canEdit ? (
          <Select
            disabled={loading}
            value={getValue('department')}
            onValueChange={(value) => handleChange('department', value)}
          >
            <SelectTrigger className="h-9 text-sm min-w-[140px]">
              <SelectValue placeholder="Select department" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="not_assigned">Not Assigned</SelectItem>
              {departments.map((department) => (
                <SelectItem key={department.id} value={department.name}>
                  {department.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : (
          <span className="text-sm text-gray-900">
            {member.department || '-'}
          </span>
        )}
      </td>
      <td className="px-4 py-3">
        {canEdit ? (
          <Select
            disabled={loading}
            value={getValue('practice_area')}
            onValueChange={(value) => handleChange('practice_area', value)}
          >
            <SelectTrigger className="h-9 text-sm min-w-[140px]">
              <SelectValue placeholder="Select practice area" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="not_assigned">Not Assigned</SelectItem>
              {practice_areas.map((pa) => (
                <SelectItem key={pa.id} value={pa.name}>
                  {pa.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : (
          <span className="text-sm text-gray-900">
            {member.practice_area || '-'}
          </span>
        )}
      </td>
      <td className="px-4 py-3">
        {canEdit ? (
          <Select
            disabled={loading}
            value={getValue('location')}
            onValueChange={(value) => handleChange('location', value)}
          >
            <SelectTrigger className="h-9 text-sm min-w-[140px]">
              <SelectValue placeholder="Select location" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Unassigned">Unassigned</SelectItem>
              {locations.map((location) => (
                <SelectItem key={location.id} value={location.code}>
                  {location.emoji} {location.city}, {location.country}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : (
          <span className="text-sm text-gray-900">
            {member.location || '-'}
          </span>
        )}
      </td>
      {isAdmin && (
        <td className="px-4 py-3">
          <div className="flex items-center gap-2">
            {canEdit ? (
              <>
                {isPending && onSendInvite && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onSendInvite(member)}
                          disabled={missingEmail}
                          className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Send className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{missingEmail ? 'Email required' : 'Send invitation'}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDeleteMember(member.id)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onViewMember(member.id)}
                className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
              >
                <Eye className="h-4 w-4" />
              </Button>
            )}
          </div>
        </td>
      )}
    </tr>
  );
};
