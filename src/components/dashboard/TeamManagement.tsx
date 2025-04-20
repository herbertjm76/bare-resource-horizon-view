
import React from 'react';
import { ClipboardCopy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import type { Profile } from '@/integrations/supabase/types';

interface TeamManagementProps {
  teamMembers: Profile[];
  inviteUrl: string;
  userRole: string;
}

export const TeamManagement = ({ teamMembers, inviteUrl, userRole }: TeamManagementProps) => {
  const copyInviteUrl = () => {
    navigator.clipboard.writeText(inviteUrl);
    toast.success('Invite URL copied to clipboard!');
  };

  return (
    <div className="bg-white/10 backdrop-blur-md p-6 rounded-xl mb-8">
      <h2 className="text-2xl font-semibold text-white mb-4">Team Management</h2>
      
      <div className="mb-6">
        <h3 className="text-lg font-medium text-white mb-2">Invite Team Members</h3>
        <div className="flex items-center space-x-4">
          <input
            type="text"
            value={inviteUrl}
            readOnly
            className="flex-1 px-4 py-2 rounded-lg bg-white/5 text-white border border-white/20 focus:outline-none"
          />
          <Button onClick={copyInviteUrl} variant="secondary">
            <ClipboardCopy className="mr-2 h-4 w-4" /> Copy
          </Button>
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-medium text-white mb-4">
          Team Members ({teamMembers.length})
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-white/10">
                <th className="py-2 px-4 text-left text-white/80">Name</th>
                <th className="py-2 px-4 text-left text-white/80">Email</th>
                <th className="py-2 px-4 text-left text-white/80">Role</th>
                <th className="py-2 px-4 text-left text-white/80">Actions</th>
              </tr>
            </thead>
            <tbody>
              {teamMembers.map((member) => (
                <tr key={member.id} className="border-b border-white/10 hover:bg-white/5">
                  <td className="py-3 px-4 text-white">
                    {member.first_name && member.last_name 
                      ? `${member.first_name} ${member.last_name}`
                      : 'No name provided'}
                  </td>
                  <td className="py-3 px-4 text-white">{member.email}</td>
                  <td className="py-3 px-4 text-white capitalize">{member.role}</td>
                  <td className="py-3 px-4">
                    {userRole === 'owner' && (
                      <Button variant="ghost" size="sm" className="text-white">
                        Manage
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
