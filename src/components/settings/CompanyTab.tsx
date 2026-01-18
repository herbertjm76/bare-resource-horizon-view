import React, { useState } from 'react';
import { useCompany } from '@/context/CompanyContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Pencil, Save, AlertCircle, ExternalLink, Copy, Check } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';

export const CompanyTab: React.FC = () => {
  const { company, refreshCompany } = useCompany();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState(false);
  const [formData, setFormData] = useState({
    name: company?.name || '',
    subdomain: company?.subdomain || '',
    website: company?.website || '',
    industry: company?.industry || '',
    size: company?.size || '',
  });

  const handleEdit = () => {
    setFormData({
      name: company?.name || '',
      subdomain: company?.subdomain || '',
      website: company?.website || '',
      industry: company?.industry || '',
      size: company?.size || '',
    });
    setEditing(true);
  };

  const handleCancel = () => {
    setEditing(false);
  };

  const handleCopyUrl = async () => {
    const url = `${window.location.origin}/join/${company?.subdomain}`;
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
      <Card className="overflow-hidden">
        <div className="border-b bg-muted/30 px-6 py-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Edit Company Information</h3>
            <div className="flex gap-2">
              <Button onClick={handleCancel} variant="ghost" size="sm" disabled={saving}>
                Cancel
              </Button>
              <Button onClick={handleSave} size="sm" disabled={saving}>
                <Save className="h-4 w-4 mr-1.5" />
                {saving ? 'Saving...' : 'Save'}
              </Button>
            </div>
          </div>
        </div>
        <div className="p-6 space-y-5">
          <Alert variant="default" className="bg-amber-500/10 border-amber-500/20 text-amber-700 dark:text-amber-400">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Changing the URL identifier will affect your company's invite links.
            </AlertDescription>
          </Alert>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Company Name <span className="text-destructive">*</span></Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Acme Inc."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="subdomain">URL Identifier <span className="text-destructive">*</span></Label>
              <Input
                id="subdomain"
                value={formData.subdomain}
                onChange={(e) => setFormData({ ...formData, subdomain: e.target.value.toLowerCase() })}
                placeholder="acme-inc"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="industry">Industry</Label>
              <Input
                id="industry"
                value={formData.industry}
                onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                placeholder="Architecture & Design"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="size">Team Size</Label>
              <Input
                id="size"
                value={formData.size}
                onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                placeholder="50-100 employees"
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                value={formData.website}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                placeholder="https://acme.com"
                type="url"
              />
            </div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-5">
          <div>
            <h2 className="text-xl font-bold text-foreground">{company.name}</h2>
            <div className="flex items-center gap-2 mt-1.5">
              {company.industry && (
                <Badge variant="secondary" className="text-xs font-normal">
                  {company.industry}
                </Badge>
              )}
              {company.size && (
                <Badge variant="outline" className="text-xs font-normal">
                  {company.size}
                </Badge>
              )}
              {!company.industry && !company.size && (
                <span className="text-sm text-muted-foreground">No industry or size set</span>
              )}
            </div>
          </div>
          <Button onClick={handleEdit} variant="outline" size="sm">
            <Pencil className="h-3.5 w-3.5 mr-1.5" />
            Edit
          </Button>
        </div>

        {/* Info Cards */}
        <div className="grid gap-3 sm:grid-cols-2">
          {/* URL Card */}
          <div className="rounded-lg border bg-muted/30 p-4">
            <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Company URL</span>
            <a
              href={`https://bareresource.com/${company.subdomain}/dashboard`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 text-sm font-semibold text-primary hover:underline flex items-center gap-1"
            >
              bareresource.com/{company.subdomain}
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>

          {/* Invite Link Card */}
          <div className="rounded-lg border bg-muted/30 p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Team Invite Link</span>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-6 px-2 text-xs -mr-2 -mt-1"
                onClick={handleCopyUrl}
              >
                {copied ? (
                  <><Check className="h-3 w-3 mr-1 text-green-600" /> Copied</>
                ) : (
                  <><Copy className="h-3 w-3 mr-1" /> Copy</>
                )}
              </Button>
            </div>
            <p className="mt-1 text-sm font-medium text-foreground font-mono">
              /join/{company.subdomain}
            </p>
          </div>
        </div>

        {/* Website */}
        {company.website && (
          <div className="mt-4 pt-4 border-t flex items-center gap-2">
            <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Website</span>
            <a
              href={company.website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-primary hover:underline inline-flex items-center gap-1"
            >
              {company.website.replace(/^https?:\/\//, '')}
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        )}
      </div>
    </Card>
  );
};
