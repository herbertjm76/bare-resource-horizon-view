import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useCompany } from "@/context/CompanyContext";
import { toast } from "sonner";
import { SidebarProvider } from '@/components/ui/sidebar';
import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar';
import { AppHeader } from '@/components/AppHeader';

const HEADER_HEIGHT = 56;

type Profile = {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
};

export default function Profile() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);

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
        setProfile(data);
      }
      setLoading(false);
    };
    fetchProfile();
  }, [navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!profile) return;
    setProfile({
      ...profile,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    setSaving(true);
    const { error } = await supabase
      .from("profiles")
      .update({
        first_name: profile.first_name,
        last_name: profile.last_name,
      })
      .eq("id", profile.id);
    setSaving(false);
    if (error) {
      setError("Update failed. Please try again.");
    } else {
      setError(null);
      toast.success("Profile updated successfully");
      navigate("/dashboard");
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);
    setPasswordSuccess(null);
    setPasswordLoading(true);
    if (!newPassword) {
      setPasswordError("Please enter a new password.");
      setPasswordLoading(false);
      return;
    }
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) {
      setPasswordError(error.message || "Failed to update password.");
    } else {
      setPasswordSuccess("Password updated successfully!");
      setShowPassword(false);
      setNewPassword("");
    }
    setPasswordLoading(false);
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
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold tracking-tight text-brand-primary">My Profile</h1>
              </div>
              <Card className="w-full">
                <CardHeader className="pb-2">
                  <CardTitle>Edit Profile</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSave} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1" htmlFor="email">
                        Email
                      </label>
                      <Input
                        id="email"
                        name="email"
                        disabled
                        value={profile.email}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1" htmlFor="first_name">
                        First Name
                      </label>
                      <Input
                        id="first_name"
                        name="first_name"
                        value={profile.first_name ?? ""}
                        onChange={handleChange}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1" htmlFor="last_name">
                        Last Name
                      </label>
                      <Input
                        id="last_name"
                        name="last_name"
                        value={profile.last_name ?? ""}
                        onChange={handleChange}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1" htmlFor="company">
                        Company Name
                      </label>
                      <Input
                        id="company"
                        name="company"
                        disabled
                        value={company?.name ?? "Not Assigned"}
                      />
                    </div>
                    {error && <div className="text-red-600 text-sm">{error}</div>}
                    <Button
                      type="submit"
                      className="w-full bg-brand-primary hover:bg-brand-primary/90"
                      isLoading={saving}
                      disabled={saving}
                    >
                      Save Changes
                    </Button>
                  </form>

                  {/* Password Change Section */}
                  <div className="mt-8 border-t pt-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-base">Change Password</span>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setShowPassword(v => !v)}
                        type="button"
                      >
                        {showPassword ? "Cancel" : "Change"}
                      </Button>
                    </div>
                    {showPassword && (
                      <form onSubmit={handleChangePassword} className="space-y-3">
                        <Input
                          id="new_password"
                          name="new_password"
                          type="password"
                          placeholder="Enter new password"
                          value={newPassword}
                          onChange={e => setNewPassword(e.target.value)}
                          autoComplete="new-password"
                        />
                        {passwordError && <div className="text-red-600 text-sm">{passwordError}</div>}
                        {passwordSuccess && <div className="text-green-600 text-sm">{passwordSuccess}</div>}
                        <Button
                          type="submit"
                          className="w-full"
                          isLoading={passwordLoading}
                          disabled={passwordLoading}
                        >
                          Update Password
                        </Button>
                      </form>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}
