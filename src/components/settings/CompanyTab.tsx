import React, { useState } from 'react';
import { useCompany } from '@/context/CompanyContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Pencil, Save, X, AlertCircle, ExternalLink } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface InfoFieldProps {
  label: string;
  value: string | null | undefined;
  isLink?: boolean;
  linkHref?: string;
}

const InfoField: React.FC<InfoFieldProps> = ({ label, value, isLink, linkHref }) => (
  <div>
    <p className="text-xs text-muted-foreground mb-0.5">{label}</p>
    {value ? (
      isLink && linkHref ? (
        <a
          href={linkHref}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-medium text-primary hover:underline inline-flex items-center gap-1"
        >
          {value}
          <ExternalLink className="h-3 w-3" />
        </a>
      ) : (
        <p className="text-sm font-medium text-foreground">{value}</p>
      )
    ) : (
      <p className="text-sm text-muted-foreground/50">—</p>
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
      <Card className="p-4">
        <p className="text-muted-foreground">No company information available</p>
      </Card>
    );
  }

  if (editing) {
    return (
      <Card>
        <CardHeader className="pb-3 pt-4 px-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Edit Company Information</CardTitle>
            <div className="flex gap-2">
              <Button onClick={handleCancel} variant="ghost" size="sm" disabled={saving}>
                <X className="h-4 w-4" />
              </Button>
              <Button onClick={handleSave} size="sm" disabled={saving}>
                <Save className="h-4 w-4 mr-1.5" />
                {saving ? 'Saving...' : 'Save'}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="px-4 pb-4 pt-0 space-y-4">
          <Alert className="py-2">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-xs">
              Changing the URL identifier will affect your company's URL.
            </AlertDescription>
          </Alert>

          <div className="grid gap-3 md:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="name" className="text-xs">Company Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter company name"
                className="h-9"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="subdomain" className="text-xs">URL Identifier *</Label>
              <Input
                id="subdomain"
                value={formData.subdomain}
                onChange={(e) => setFormData({ ...formData, subdomain: e.target.value.toLowerCase() })}
                placeholder="yourcompany"
                className="h-9"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="industry" className="text-xs">Industry</Label>
              <Input
                id="industry"
                value={formData.industry}
                onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                placeholder="e.g., Architecture"
                className="h-9"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="size" className="text-xs">Company Size</Label>
              <Input
                id="size"
                value={formData.size}
                onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                placeholder="e.g., 10-50"
                className="h-9"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="address" className="text-xs">Address</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="Street address"
                className="h-9"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="city" className="text-xs">City</Label>
              <Input
                id="city"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                placeholder="City"
                className="h-9"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="country" className="text-xs">Country</Label>
              <Input
                id="country"
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                placeholder="Country"
                className="h-9"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="website" className="text-xs">Website</Label>
              <Input
                id="website"
                value={formData.website}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                placeholder="https://example.com"
                type="url"
                className="h-9"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3 pt-4 px-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base">Company Information</CardTitle>
            <CardDescription className="text-xs">Manage your company details</CardDescription>
          </div>
          <Button onClick={handleEdit} variant="outline" size="sm" className="h-8">
            <Pencil className="h-3.5 w-3.5 mr-1.5" />
            Edit
          </Button>
        </div>
      </CardHeader>
      <CardContent className="px-4 pb-4 pt-0">
        <div className="grid gap-x-6 gap-y-3 grid-cols-2 md:grid-cols-4">
          <div>
            <p className="text-xs text-muted-foreground mb-0.5">Company Name</p>
            <p className="text-sm font-semibold text-foreground">{company.name}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-0.5">URL</p>
            <a
              href={`https://bareresource.com/${company.subdomain}/dashboard`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-primary hover:underline inline-flex items-center gap-1"
            >
              /{company.subdomain}
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
          <InfoField label="Industry" value={company.industry} />
          <InfoField label="Size" value={company.size} />
          <InfoField label="Address" value={company.address} />
          <InfoField label="City" value={company.city} />
          <InfoField label="Country" value={company.country} />
          <InfoField 
            label="Website" 
            value={company.website} 
            isLink={!!company.website}
            linkHref={company.website || undefined}
          />
        </div>
      </CardContent>
    </Card>
  );
};
