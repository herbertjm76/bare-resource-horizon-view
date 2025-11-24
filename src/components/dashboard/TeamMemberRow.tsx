
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Eye, Trash2, Edit, Mail, Check, X } from 'lucide-react';
import { TeamMember } from './types';
import { TeamMemberAvatar } from './TeamMemberAvatar';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface TeamMemberRowProps {
  member: TeamMember;
  editMode: boolean;
  userRole: string;
  isSelected: boolean;
  onSelectMember: (memberId: string, checked: boolean) => void;
  onViewMember: (memberId: string) => void;
  onEditMember: (member: TeamMember) => void;
  onDeleteMember: (memberId: string) => void;
}

export const TeamMemberRow: React.FC<TeamMemberRowProps> = ({
  member,
  editMode,
  userRole,
  isSelected,
  onSelectMember,
  onViewMember,
  onEditMember,
  onDeleteMember
}) => {
  const [isInlineEditing, setIsInlineEditing] = useState(false);
  const [editedData, setEditedData] = useState({
    first_name: member.first_name || '',
    last_name: member.last_name || '',
    email: member.email || '',
    department: member.department || '',
    location: member.location || '',
    job_title: member.job_title || ''
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          first_name: editedData.first_name,
          last_name: editedData.last_name,
          email: editedData.email,
          department: editedData.department,
          location: editedData.location,
          job_title: editedData.job_title
        })
        .eq('id', member.id);

      if (error) throw error;

      toast.success('Member updated successfully');
      setIsInlineEditing(false);
      
      // Trigger a refresh if onEditMember exists
      if (onEditMember) {
        onEditMember({ ...member, ...editedData });
      }
    } catch (error) {
      toast.error('Failed to update member');
      console.error('Update error:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setEditedData({
      first_name: member.first_name || '',
      last_name: member.last_name || '',
      email: member.email || '',
      department: member.department || '',
      location: member.location || '',
      job_title: member.job_title || ''
    });
    setIsInlineEditing(false);
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role?.toLowerCase()) {
      case 'owner':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'admin':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'manager':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <tr key={member.id} className="hover:bg-gray-50">
      {editMode && ['owner', 'admin'].includes(userRole) && (
        <td className="px-4 py-3">
          <Checkbox
            checked={isSelected}
            onCheckedChange={(checked) => onSelectMember(member.id, checked as boolean)}
          />
        </td>
      )}
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <TeamMemberAvatar member={member} />
          <div className="flex-1">
            {isInlineEditing && editMode ? (
              <div className="space-y-1">
                <div className="flex gap-1">
                  <Input
                    value={editedData.first_name}
                    onChange={(e) => setEditedData({ ...editedData, first_name: e.target.value })}
                    placeholder="First name"
                    className="h-7 text-sm"
                  />
                  <Input
                    value={editedData.last_name}
                    onChange={(e) => setEditedData({ ...editedData, last_name: e.target.value })}
                    placeholder="Last name"
                    className="h-7 text-sm"
                  />
                </div>
                <Input
                  value={editedData.email}
                  onChange={(e) => setEditedData({ ...editedData, email: e.target.value })}
                  placeholder="Email"
                  className="h-7 text-sm"
                  type="email"
                />
              </div>
            ) : (
              <>
                <div className="font-medium text-gray-900">
                  {`${member.first_name || ''} ${member.last_name || ''}`.trim() || 'Unnamed'}
                </div>
                <div className="text-sm text-gray-500 flex items-center gap-1">
                  <Mail className="h-3 w-3" />
                  {member.email}
                </div>
              </>
            )}
          </div>
        </div>
      </td>
      <td className="px-4 py-3">
        <Badge className="bg-gray-100 text-gray-800 border-gray-200 border">
          Member
        </Badge>
      </td>
      <td className="px-4 py-3">
        {isInlineEditing && editMode ? (
          <Input
            value={editedData.department}
            onChange={(e) => setEditedData({ ...editedData, department: e.target.value })}
            placeholder="Department"
            className="h-8 text-sm"
          />
        ) : (
          <span className="text-sm text-gray-900">
            {member.department || '-'}
          </span>
        )}
      </td>
      <td className="px-4 py-3">
        {isInlineEditing && editMode ? (
          <Input
            value={editedData.location}
            onChange={(e) => setEditedData({ ...editedData, location: e.target.value })}
            placeholder="Location"
            className="h-8 text-sm"
          />
        ) : (
          <span className="text-sm text-gray-900">
            {member.location || '-'}
          </span>
        )}
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          {isInlineEditing ? (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSave}
                disabled={isSaving}
                className="text-green-600 hover:text-green-700 hover:bg-green-50"
              >
                <Check className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCancel}
                disabled={isSaving}
                className="text-gray-600 hover:text-gray-700 hover:bg-gray-50"
              >
                <X className="h-4 w-4" />
              </Button>
            </>
          ) : (
            <>
              {/* Everyone can view insights now - this is the MVP feature */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onViewMember(member.id)}
                className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
              >
                <Eye className="h-4 w-4" />
              </Button>
              {editMode && ['owner', 'admin'].includes(userRole) && (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsInlineEditing(true)}
                    className="text-gray-600 hover:text-gray-700 hover:bg-gray-50"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDeleteMember(member.id)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </>
              )}
            </>
          )}
        </div>
      </td>
    </tr>
  );
};
