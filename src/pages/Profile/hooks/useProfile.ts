
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
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session.user.id)
        .single();
      if (error) {
        setError("Profile not found.");
      } else {
        // Ensure all required fields are present with defaults
        const profileData: Profile = {
          id: data.id,
          email: data.email,
          first_name: data.first_name,
          last_name: data.last_name,
          avatar_url: data.avatar_url,
          phone: data.phone,
          bio: data.bio,
          date_of_birth: data.date_of_birth,
          start_date: data.start_date,
          manager_id: data.manager_id,
          emergency_contact_name: data.emergency_contact_name,
          emergency_contact_phone: data.emergency_contact_phone,
          social_linkedin: data.social_linkedin,
          social_twitter: data.social_twitter,
          address: data.address,
          city: data.city,
          state: data.state,
          postal_code: data.postal_code,
          country: data.country,
          job_title: data.job_title,
          department: data.department,
          location: data.location,
          weekly_capacity: data.weekly_capacity || 40,
        };
        setProfile(profileData);
      }
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
    
    const updateData = {
      first_name: profile.first_name,
      last_name: profile.last_name,
      phone: profile.phone,
      bio: profile.bio,
      date_of_birth: profile.date_of_birth,
      start_date: profile.start_date,
      emergency_contact_name: profile.emergency_contact_name,
      emergency_contact_phone: profile.emergency_contact_phone,
      social_linkedin: profile.social_linkedin,
      social_twitter: profile.social_twitter,
      address: profile.address,
      city: profile.city,
      state: profile.state,
      postal_code: profile.postal_code,
      country: profile.country,
      job_title: profile.job_title,
      department: profile.department,
      location: profile.location,
      weekly_capacity: profile.weekly_capacity,
    };

    const { error } = await supabase
      .from("profiles")
      .update(updateData)
      .eq("id", profile.id);
    
    setSaving(false);
    if (error) {
      setError("Update failed. Please try again.");
      toast.error("Failed to update profile");
    } else {
      setError(null);
      toast.success("Profile updated successfully");
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
