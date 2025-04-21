
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useCompany } from "@/context/CompanyContext";
import { toast } from "sonner";

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
  const navigate = useNavigate();
  const { company, loading: companyLoading } = useCompany();

  useEffect(() => {
    // Fetch the current user profile
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

  if (loading || companyLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-purple-600 via-blue-500 to-pink-500">
        <span className="text-white">Loading profile...</span>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-purple-600 via-blue-500 to-pink-500">
        <span className="text-white">Profile not found.</span>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-purple-600 via-blue-500 to-pink-500 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="pb-4">
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
            {error && <div className="text-red-600 text-sm">{error}</div>}
            <Button
              type="submit"
              className="w-full bg-blue-900 hover:bg-blue-800 dark:bg-blue-700 dark:hover:bg-blue-600"
              isLoading={saving}
              disabled={saving}
            >
              Save Changes
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
