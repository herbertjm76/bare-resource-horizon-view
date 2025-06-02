
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useCompany } from "@/context/CompanyContext";
import { toast } from "sonner";
import { SidebarProvider } from '@/components/ui/sidebar';
import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar';
import { AppHeader } from '@/components/AppHeader';
import { User } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PersonalInfoTab } from '@/components/profile/PersonalInfoTab';
import { ProfessionalInfoTab } from '@/components/profile/ProfessionalInfoTab';
import { EmergencyContactTab } from '@/components/profile/EmergencyContactTab';
import { SecurityTab } from '@/components/profile/SecurityTab';
import { ProfileOverviewCard } from '@/components/profile/ProfileOverviewCard';

const HEADER_HEIGHT = 56;

type Profile = {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  avatar_url: string | null;
  phone: string | null;
  bio: string | null;
  date_of_birth: string | null;
  start_date: string | null;
  manager_id: string | null;
  emergency_contact_name: string | null;
  emergency_contact_phone: string | null;
  social_linkedin: string | null;
  social_twitter: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  postal_code: string | null;
  country: string | null;
  job_title: string | null;
  department: string | null;
  location: string | null;
  weekly_capacity: number;
};

export default function Profile() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();
  const { company, loading: companyLoading } = useCompany();

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

  if (loading || companyLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <span>Loading profile...</span>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <span>Profile not found.</span>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="w-full min-h-screen flex flex-row">
        <div className="flex-shrink-0">
          <DashboardSidebar />
        </div>
        <div className="flex-1 flex flex-col">
          <AppHeader />
          <div style={{ height: HEADER_HEIGHT }} />
          <div className="flex-1 p-4 sm:p-8 bg-background">
            <div className="max-w-6xl mx-auto space-y-8">
              {/* Header Section */}
              <div className="space-y-2">
                <h1 className="text-3xl lg:text-4xl font-bold tracking-tight text-brand-primary flex items-center gap-3">
                  <User className="h-8 w-8 text-brand-violet" />
                  My Profile
                </h1>
                <p className="text-lg text-gray-600">Manage your personal and professional information</p>
              </div>

              {/* Profile Overview Card */}
              <ProfileOverviewCard
                profile={profile}
                getUserInitials={getUserInitials}
                handleAvatarUpdate={handleAvatarUpdate}
              />

              {/* Tab System */}
              <Tabs defaultValue="personal" className="w-full">
                <TabsList className="w-full mb-6 overflow-x-auto scrollbar-hide sm:grid sm:grid-cols-4 gap-2 flex-nowrap rounded-none bg-transparent p-0">
                  <TabsTrigger value="personal" className="flex items-center gap-2 min-w-max px-4 h-10">
                    <User className="h-4 w-4" />
                    <span className="hidden xs:inline">Personal</span>
                  </TabsTrigger>
                  <TabsTrigger value="professional" className="flex items-center gap-2 min-w-max px-4 h-10">
                    <User className="h-4 w-4" />
                    <span className="hidden xs:inline">Professional</span>
                  </TabsTrigger>
                  <TabsTrigger value="emergency" className="flex items-center gap-2 min-w-max px-4 h-10">
                    <User className="h-4 w-4" />
                    <span className="hidden xs:inline">Emergency</span>
                  </TabsTrigger>
                  <TabsTrigger value="security" className="flex items-center gap-2 min-w-max px-4 h-10">
                    <User className="h-4 w-4" />
                    <span className="hidden xs:inline">Security</span>
                  </TabsTrigger>
                </TabsList>

                <div className="mt-6">
                  <TabsContent value="personal">
                    <PersonalInfoTab
                      profile={profile}
                      handleChange={handleChange}
                      handleDateChange={handleDateChange}
                      handleAvatarUpdate={handleAvatarUpdate}
                      getUserInitials={getUserInitials}
                      saving={saving}
                      onSave={handleSave}
                      error={error}
                    />
                  </TabsContent>
                  <TabsContent value="professional">
                    <ProfessionalInfoTab
                      profile={profile}
                      company={company}
                      handleChange={handleChange}
                      saving={saving}
                      onSave={handleSave}
                      error={error}
                    />
                  </TabsContent>
                  <TabsContent value="emergency">
                    <EmergencyContactTab
                      profile={profile}
                      handleChange={handleChange}
                      saving={saving}
                      onSave={handleSave}
                      error={error}
                    />
                  </TabsContent>
                  <TabsContent value="security">
                    <SecurityTab />
                  </TabsContent>
                </div>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}
