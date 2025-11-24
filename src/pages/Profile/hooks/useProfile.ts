
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Profile } from '../types';

export const useProfile = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        navigate("/auth");
        return;
      }
      
      // Fetch basic profile
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session.user.id)
        .single();
      
      if (profileError) {
        setError("Profile not found.");
        setLoading(false);
        return;
      }
      
      // Fetch personal information
      const { data: personalInfo } = await supabase
        .from("personal_information")
        .select("*")
        .eq("profile_id", session.user.id)
        .maybeSingle();
      
      // Fetch user role using secure RPC to avoid RLS recursion
      let highestRole: string | null = null;
      try {
        const { data: roleData, error: roleError } = await supabase
          .rpc('get_user_role_safe');

        if (roleError) {
          console.error("Failed to load user role for profile:", roleError);
        } else if (roleData) {
          highestRole = roleData as string;
        }
      } catch (roleException) {
        console.error("Unexpected error while loading user role:", roleException);
      }
      
      // Combine profile and personal info
      const completeProfile: Profile = {
        id: profileData.id,
        email: profileData.email,
        first_name: profileData.first_name,
        last_name: profileData.last_name,
        avatar_url: profileData.avatar_url,
        phone: personalInfo?.phone || null,
        bio: profileData.bio,
        date_of_birth: personalInfo?.date_of_birth || null,
        start_date: profileData.start_date,
        manager_id: profileData.manager_id,
        emergency_contact_name: personalInfo?.emergency_contact_name || null,
        emergency_contact_phone: personalInfo?.emergency_contact_phone || null,
        social_linkedin: personalInfo?.social_linkedin || null,
        social_twitter: personalInfo?.social_twitter || null,
        address: personalInfo?.address || null,
        city: personalInfo?.city || null,
        state: personalInfo?.state || null,
        postal_code: personalInfo?.postal_code || null,
        country: personalInfo?.country || null,
        job_title: profileData.job_title,
        department: profileData.department,
        location: profileData.location,
        weekly_capacity: profileData.weekly_capacity || 40,
        role: highestRole || "member",
      };
      setProfile(completeProfile);
      setLoading(false);
    };
    fetchProfile();
  }, [navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (!profile) return;
    const { name, value, type } = e.target;
    
    // Handle number inputs
    if (type === 'number') {
      setProfile({
        ...profile,
        [name]: value ? parseFloat(value) : null,
      });
    } else {
      setProfile({
        ...profile,
        [name]: value,
      });
    }
  };

  const handleDateChange = (field: string, value: string) => {
    if (!profile) return;
    setProfile({
      ...profile,
      [field]: value || null,
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    setSaving(true);
    
    try {
      // Get company_id for personal_information
      const { data: { session } } = await supabase.auth.getSession();
      const { data: profileData } = await supabase
        .from("profiles")
        .select("company_id")
        .eq("id", profile.id)
        .single();
      
      // Update basic profile data
      const profileUpdateData = {
        first_name: profile.first_name,
        last_name: profile.last_name,
        bio: profile.bio,
        start_date: profile.start_date,
        job_title: profile.job_title,
        department: profile.department,
        location: profile.location,
        weekly_capacity: profile.weekly_capacity,
      };

      const { error: profileError } = await supabase
        .from("profiles")
        .update(profileUpdateData)
        .eq("id", profile.id);
      
      if (profileError) throw profileError;
      
      // Update or insert personal information
      const personalInfoData = {
        profile_id: profile.id,
        company_id: profileData?.company_id,
        phone: profile.phone,
        date_of_birth: profile.date_of_birth,
        emergency_contact_name: profile.emergency_contact_name,
        emergency_contact_phone: profile.emergency_contact_phone,
        social_linkedin: profile.social_linkedin,
        social_twitter: profile.social_twitter,
        address: profile.address,
        city: profile.city,
        state: profile.state,
        postal_code: profile.postal_code,
        country: profile.country,
      };

      const { error: personalInfoError } = await supabase
        .from("personal_information")
        .upsert(personalInfoData, { onConflict: 'profile_id' });
      
      if (personalInfoError) throw personalInfoError;
      
      setError(null);
      toast.success("Profile updated successfully");
    } catch (error: any) {
      setError("Update failed. Please try again.");
      toast.error("Failed to update profile");
      console.error("Profile update error:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarUpdate = (newAvatarUrl: string | null) => {
    if (profile) {
      setProfile({
        ...profile,
        avatar_url: newAvatarUrl
      });
    }
  };

  const getUserInitials = () => {
    if (!profile) return '??';
    const firstInitial = profile.first_name?.charAt(0) || '?';
    const lastInitial = profile.last_name?.charAt(0) || '?';
    return `${firstInitial}${lastInitial}`;
  };

  return {
    profile,
    loading,
    saving,
    error,
    handleChange,
    handleDateChange,
    handleSave,
    handleAvatarUpdate,
    getUserInitials
  };
};
