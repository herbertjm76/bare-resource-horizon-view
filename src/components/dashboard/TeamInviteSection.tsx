
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, AlertCircle, RefreshCw } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface TeamInviteSectionProps {
  inviteEmail: string;
  setInviteEmail: (email: string) => void;
  invLoading: boolean;
  handleSendInvite: (e: React.FormEvent) => void;
  companyExists?: boolean;
}

const TeamInviteSection: React.FC<TeamInviteSectionProps> = ({
  inviteEmail,
  setInviteEmail,
  invLoading,
  handleSendInvite,
  companyExists = true
}) => {
  const navigate = useNavigate();
  
  // If no company exists, show a helpful error message
  if (!companyExists) {
    return (
      <div className="mb-6">
        <h3 className="text-lg text-white font-medium mb-2">Send Invite</h3>
        <div className="p-4 rounded-md bg-red-500/10 border border-red-500/50 mb-4 flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
            <p className="text-white">No company context found. Please ensure you're logged in with a company account.</p>
          </div>
          <div className="flex gap-2 mt-1">
            <Button 
              variant="outline" 
              size="sm" 
              className="border-red-500/30 text-white hover:bg-red-500/20"
              onClick={() => navigate('/auth')}
            >
              Go to Login
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="border-yellow-500/30 text-white hover:bg-yellow-500/20"
              onClick={() => window.location.reload()}
            >
              <RefreshCw className="w-4 h-4 mr-1" /> Refresh Page
            </Button>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="mb-6">
      <h3 className="text-lg text-white font-medium mb-2">Send Invite</h3>
      <form className="flex gap-2" onSubmit={handleSendInvite}>
        <Input
          type="email"
          placeholder="Invite email"
          value={inviteEmail}
          onChange={e => setInviteEmail(e.target.value)}
          className="w-64"
          required
          disabled={invLoading}
        />
        <Button type="submit" variant="default" disabled={invLoading}>
          {invLoading ? 'Sending...' : (
            <>
              <Plus className="w-4 h-4 mr-1" /> Send Invite
            </>
          )}
        </Button>
      </form>
    </div>
  );
};

export default TeamInviteSection;
