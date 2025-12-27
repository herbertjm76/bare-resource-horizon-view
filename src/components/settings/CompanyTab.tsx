import React, { useState } from 'react';
import { useCompany } from '@/context/CompanyContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Pencil, Save, X, AlertCircle, ExternalLink, Building2, MapPin, Globe, Users } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';

interface InfoFieldProps {
  label: string;
  value: string | null | undefined;
  isLink?: boolean;
  linkHref?: string;
  icon?: React.ReactNode;
}

const InfoField: React.FC<InfoFieldProps> = ({ label, value, isLink, linkHref, icon }) => (
  <div className="space-y-1.5">
    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{label}</p>
    {value ? (
      isLink && linkHref ? (
        <a
          href={linkHref}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-medium text-primary hover:underline inline-flex items-center gap-1.5"
        >
          {icon}
          {value}
          <ExternalLink className="h-3 w-3" />
        </a>
      ) : (
        <p className="text-sm font-medium text-foreground flex items-center gap-1.5">
          {icon}
          {value}
        </p>
      )
    ) : (
      <p className="text-sm text-muted-foreground/60 italic">Not set</p>
    )}
  </div>
);

export const CompanyTab: React.FC = () => {
  const { company, refreshCompany } = useCompany();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: company?.name || '',
    subdomain: company?.subdomain || '',
    address: company?.address || '',
    city: company?.city || '',
    country: company?.country || '',
    website: company?.website || '',
    industry: company?.industry || '',
    size: company?.size || '',
  });

  const handleEdit = () => {
    setFormData({
      name: company?.name || '',
      subdomain: company?.subdomain || '',
      address: company?.address || '',
      city: company?.city || '',
      country: company?.country || '',
      website: company?.website || '',
      industry: company?.industry || '',
      size: company?.size || '',
    });
    setEditing(true);
  };

  const handleCancel = () => {
    setEditing(false);
  };

  const validateSubdomain = (subdomain: string): boolean => {
    const subdomainRegex = /^[a-zA-Z0-9-]+$/;
    if (!subdomain || subdomain.length < 3 || subdomain.length > 63) {
      toast.error('Subdomain must be between 3 and 63 characters');
      return false;
    }
    if (!subdomainRegex.test(subdomain)) {
      toast.error('Subdomain can only contain letters, numbers, and hyphens');
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    if (!company?.id) return;

    if (!formData.name.trim()) {
      toast.error('Company name is required');
      return;
    }

    if (!formData.subdomain.trim()) {
      toast.error('Subdomain is required');
      return;
    }

    if (!validateSubdomain(formData.subdomain)) {
      return;
    }

    setSaving(true);

    try {
      const subdomainChanged = formData.subdomain !== company.subdomain;

      if (subdomainChanged) {
        const { data: existingCompany } = await supabase
          .from('companies')
          .select('id')
          .eq('subdomain', formData.subdomain)
          .neq('id', company.id)
          .single();

        if (existingCompany) {
          toast.error('This subdomain is already taken');
          setSaving(false);
          return;
        }
      }

      const { error } = await supabase
        .from('companies')
        .update({
          name: formData.name.trim(),
          subdomain: formData.subdomain.trim().toLowerCase(),
          address: formData.address.trim() || null,
          city: formData.city.trim() || null,
          country: formData.country.trim() || null,
          website: formData.website.trim() || null,
          industry: formData.industry.trim() || null,
          size: formData.size.trim() || null,
        })
        .eq('id', company.id);

      if (error) {
        console.error('Update error:', error);
        toast.error('Failed to update company information');
        return;
      }

      toast.success('Company information updated successfully');
      await refreshCompany();
      setEditing(false);
    } catch (error) {
      console.error('Save error:', error);
      toast.error('Failed to update company information');
    } finally {
      setSaving(false);
    }
  };

  if (!company) {
    return (
      <Card className="p-6">
        <p className="text-muted-foreground">No company information available</p>
      </Card>
    );
  }

  if (editing) {
    return (
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">Edit Company Information</CardTitle>
              <CardDescription>Update your company details and URL identifier</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleCancel} variant="outline" size="sm" disabled={saving}>
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              <Button onClick={handleSave} size="sm" disabled={saving}>
                <Save className="h-4 w-4 mr-2" />
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Changing the company identifier will affect your company's URL. Make sure to update any bookmarks or shared links.
            </AlertDescription>
          </Alert>

          {/* Identity Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <Building2 className="h-4 w-4" />
              Identity
            </div>
            <div className="grid gap-4 md:grid-cols-2 pl-6">
              <div className="space-y-2">
                <Label htmlFor="name">Company Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter company name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="subdomain">URL Identifier *</Label>
                <Input
                  id="subdomain"
                  value={formData.subdomain}
                  onChange={(e) => setFormData({ ...formData, subdomain: e.target.value.toLowerCase() })}
                  placeholder="yourcompany"
                />
                <p className="text-xs text-muted-foreground">
                  bareresource.com/<span className="font-medium">{formData.subdomain || 'yourcompany'}</span>
                </p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Business Details Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <Users className="h-4 w-4" />
              Business Details
            </div>
            <div className="grid gap-4 md:grid-cols-2 pl-6">
              <div className="space-y-2">
                <Label htmlFor="industry">Industry</Label>
                <Input
                  id="industry"
                  value={formData.industry}
                  onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                  placeholder="e.g., Architecture, Engineering"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="size">Company Size</Label>
                <Input
                  id="size"
                  value={formData.size}
                  onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                  placeholder="e.g., 10-50, 50-100"
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Location Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <MapPin className="h-4 w-4" />
              Location
            </div>
            <div className="grid gap-4 md:grid-cols-2 pl-6">
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Enter company address"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  placeholder="Enter city"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <Input
                  id="country"
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  placeholder="Enter country"
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Online Presence Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <Globe className="h-4 w-4" />
              Online Presence
            </div>
            <div className="pl-6">
              <div className="space-y-2 max-w-md">
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  placeholder="https://example.com"
                  type="url"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">Company Information</CardTitle>
            <CardDescription>Your organization's profile and settings</CardDescription>
          </div>
          <Button onClick={handleEdit} variant="outline" size="sm">
            <Pencil className="h-4 w-4 mr-2" />
            Edit
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Identity Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm font-medium text-foreground">
            <Building2 className="h-4 w-4 text-primary" />
            Identity
          </div>
          <div className="grid gap-6 md:grid-cols-2 pl-6 py-3 bg-muted/30 rounded-lg">
            <div className="space-y-1.5">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Company Name</p>
              <p className="text-base font-semibold text-foreground">{company.name}</p>
            </div>
            <div className="space-y-1.5">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Company URL</p>
              <div className="flex items-center gap-2">
                <a
                  href={`https://bareresource.com/${company.subdomain}/dashboard`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium text-primary hover:underline inline-flex items-center gap-1"
                >
                  bareresource.com/{company.subdomain}
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>
              <p className="text-xs text-muted-foreground">
                Team invite: bareresource.com/join/{company.subdomain}
              </p>
            </div>
          </div>
        </div>

        <Separator />

        {/* Business Details Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm font-medium text-foreground">
            <Users className="h-4 w-4 text-primary" />
            Business Details
          </div>
          <div className="grid gap-6 md:grid-cols-2 pl-6">
            <InfoField label="Industry" value={company.industry} />
            <InfoField label="Company Size" value={company.size} />
          </div>
        </div>

        <Separator />

        {/* Location Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm font-medium text-foreground">
            <MapPin className="h-4 w-4 text-primary" />
            Location
          </div>
          <div className="grid gap-6 md:grid-cols-2 pl-6">
            <div className="md:col-span-2">
              <InfoField label="Address" value={company.address} />
            </div>
            <InfoField label="City" value={company.city} />
            <InfoField label="Country" value={company.country} />
          </div>
        </div>

        <Separator />

        {/* Online Presence Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm font-medium text-foreground">
            <Globe className="h-4 w-4 text-primary" />
            Online Presence
          </div>
          <div className="pl-6">
            <InfoField 
              label="Website" 
              value={company.website} 
              isLink={!!company.website}
              linkHref={company.website || undefined}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
