
import React, { useState, useEffect } from 'react';
import { TeamManagement } from "@/components/dashboard/TeamManagement";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Profile } from "@/components/dashboard/TeamManagement";
import { toast } from "sonner";

const TeamMembersPage = () => {
  const [userId, setUserId] = useState<string | null>(null);

  // Get session on component mount
  useEffect(() => {
    const getSession = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        if (data.session?.user) {
          setUserId(data.session.user.id);
        }
      } catch (error) {
        console.error("Error getting session:", error);
        toast.error("Failed to authenticate user");
      }
    };

    getSession();
  }, []);

  // Fetch company ID and user role from the profile
  const { data: userProfile } = useQuery({
    queryKey: ['userProfile', userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!userId
  });

  // Fetch team members for the company
  const { data: teamMembers = [], isLoading } = useQuery({
    queryKey: ['teamMembers', userProfile?.company_id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('company_id', userProfile?.company_id)
        .order('created_at', { ascending: false });

      if (error) {
        toast.error('Failed to load team members');
        throw error;
      }
      return data as Profile[];
    },
    enabled: !!userProfile?.company_id
  });

  // Generate invite URL for the company
  const inviteUrl = userProfile?.company_id 
    ? `${window.location.origin}/join/${userProfile.company_id}`
    : '';

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-white">Team Members</h1>
      {userId ? (
        <TeamManagement
          teamMembers={teamMembers}
          inviteUrl={inviteUrl}
          userRole={userProfile?.role || 'member'}
        />
      ) : (
        <div className="bg-white/10 backdrop-blur-md p-6 rounded-xl">
          <p className="text-white">Loading authentication details...</p>
        </div>
      )}
    </div>
  );
};

export default TeamMembersPage;
