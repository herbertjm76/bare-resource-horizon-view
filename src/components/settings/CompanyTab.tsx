import React, { useState } from 'react';
import { useCompany } from '@/context/CompanyContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Pencil, Save, X, AlertCircle, ExternalLink, Network } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

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
      // Check if subdomain is changing
      const subdomainChanged = formData.subdomain !== company.subdomain;

      // If subdomain is changing, check if it's available
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

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold">Company Information</h3>
            <p className="text-sm text-muted-foreground">
              Manage your company details and URL identifier
            </p>
          </div>
          {!editing ? (
            <Button onClick={handleEdit} variant="outline" size="sm">
              <Pencil className="h-4 w-4 mr-2" />
              Edit
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button onClick={handleCancel} variant="outline" size="sm" disabled={saving}>
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              <Button onClick={handleSave} size="sm" disabled={saving}>
                <Save className="h-4 w-4 mr-2" />
                {saving ? 'Saving...' : 'Save'}
              </Button>
            </div>
          )}
        </div>

        {editing && (
          <Alert className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Changing the company identifier will affect your company's URL. Make sure to update any bookmarks or shared links.
            </AlertDescription>
          </Alert>
        )}

        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="name">Company Name *</Label>
            {editing ? (
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter company name"
              />
            ) : (
              <p className="text-sm font-medium py-2">{company.name}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="subdomain">Company Identifier (URL Slug) *</Label>
            {editing ? (
              <div className="space-y-2">
                <Input
                  id="subdomain"
                  value={formData.subdomain}
                  onChange={(e) => setFormData({ ...formData, subdomain: e.target.value.toLowerCase() })}
                  placeholder="yourcompany"
                  className="flex-1"
                />
                <p className="text-xs text-muted-foreground">
                  Used in your company URL: bareresource.com/<span className="font-medium">{formData.subdomain || 'yourcompany'}</span>
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium py-2">
                    bareresource.com/{company.subdomain}
                  </p>
                  <a
                    href={`https://bareresource.com/${company.subdomain}/dashboard`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </div>
                <p className="text-xs text-muted-foreground">
                  Team members join at: bareresource.com/join/{company.subdomain}
                </p>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="industry">Industry</Label>
            {editing ? (
              <Input
                id="industry"
                value={formData.industry}
                onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                placeholder="e.g., Architecture, Engineering"
              />
            ) : (
              <p className="text-sm py-2">{company.industry || 'Not set'}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="size">Company Size</Label>
            {editing ? (
              <Input
                id="size"
                value={formData.size}
                onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                placeholder="e.g., 10-50, 50-100"
              />
            ) : (
              <p className="text-sm py-2">{company.size || 'Not set'}</p>
            )}
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="address">Address</Label>
            {editing ? (
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="Enter company address"
              />
            ) : (
              <p className="text-sm py-2">{company.address || 'Not set'}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="city">City</Label>
            {editing ? (
              <Input
                id="city"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                placeholder="Enter city"
              />
            ) : (
              <p className="text-sm py-2">{company.city || 'Not set'}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="country">Country</Label>
            {editing ? (
              <Input
                id="country"
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                placeholder="Enter country"
              />
            ) : (
              <p className="text-sm py-2">{company.country || 'Not set'}</p>
            )}
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="website">Website</Label>
            {editing ? (
              <Input
                id="website"
                value={formData.website}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                placeholder="https://example.com"
                type="url"
              />
            ) : (
              <p className="text-sm py-2">
                {company.website ? (
                  <a
                    href={company.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline inline-flex items-center gap-1"
                  >
                    {company.website}
                    <ExternalLink className="h-3 w-3" />
                  </a>
                ) : (
                  'Not set'
                )}
              </p>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};
