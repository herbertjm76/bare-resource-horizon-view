import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Upload, Loader2, CheckCircle2, UserPlus } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useCompany } from '@/context/CompanyContext';

interface ExtractedPerson {
  first_name: string;
  last_name: string;
  email?: string | null;
  job_title?: string | null;
  department?: string | null;
  location?: string | null;
  status: 'new' | 'exists';
  existingEmail?: string;
}

interface ImportFromScreenshotDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onImportComplete: () => void;
}

export const ImportFromScreenshotDialog: React.FC<ImportFromScreenshotDialogProps> = ({
  isOpen,
  onClose,
  onImportComplete
}) => {
  const { company } = useCompany();
  const [isProcessing, setIsProcessing] = useState(false);
  const [extractedPeople, setExtractedPeople] = useState<ExtractedPerson[]>([]);
  const [isImporting, setIsImporting] = useState(false);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    setIsProcessing(true);
    setExtractedPeople([]);

    try {
      // Convert to base64
      const reader = new FileReader();
      reader.onload = async () => {
        const base64 = reader.result as string;

        const { data, error } = await supabase.functions.invoke('extract-team-from-image', {
          body: { imageData: base64 }
        });

        if (error) throw error;

        if (data.error) {
          toast.error(data.error);
          return;
        }

        setExtractedPeople(data.people || []);
        toast.success(`Extracted ${data.total} people (${data.new} new, ${data.existing} existing)`);
      };
      reader.readAsDataURL(file);
    } catch (error: any) {
      console.error('Error extracting from image:', error);
      toast.error('Failed to extract names from image');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleImport = async () => {
    if (!company?.id) return;

    const newPeople = extractedPeople.filter(p => p.status === 'new');
    if (newPeople.length === 0) {
      toast.info('No new members to import');
      return;
    }

    setIsImporting(true);

    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Create invites for new people
      const invites = newPeople.map(person => ({
        company_id: company.id,
        first_name: person.first_name,
        last_name: person.last_name,
        email: person.email,
        job_title: person.job_title,
        department: person.department,
        location: person.location,
        code: Math.random().toString(36).substring(2, 15),
        created_by: user.id,
        invitation_type: 'pre_registered',
        status: 'pending'
      }));

      const { error } = await supabase.from('invites').insert(invites);

      if (error) throw error;

      toast.success(`Successfully imported ${newPeople.length} new team members!`);
      onImportComplete();
      onClose();
      setExtractedPeople([]);
    } catch (error: any) {
      console.error('Error importing members:', error);
      toast.error('Failed to import members');
    } finally {
      setIsImporting(false);
    }
  };

  const handleClose = () => {
    setExtractedPeople([]);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Import Team from Screenshot</DialogTitle>
          <DialogDescription>
            Upload a screenshot with team member names. AI will extract and match them with existing members.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Upload Area */}
          <div className="border-2 border-dashed rounded-lg p-8 text-center">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              id="screenshot-upload"
              disabled={isProcessing}
            />
            <label htmlFor="screenshot-upload" className="cursor-pointer">
              {isProcessing ? (
                <div className="flex flex-col items-center gap-2">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <p className="text-sm text-muted-foreground">Extracting names from image...</p>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <Upload className="h-8 w-8 text-muted-foreground" />
                  <p className="text-sm font-medium">Click to upload screenshot</p>
                  <p className="text-xs text-muted-foreground">PNG, JPG up to 10MB</p>
                </div>
              )}
            </label>
          </div>

          {/* Results */}
          {extractedPeople.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium">Extracted People ({extractedPeople.length})</h3>
                <Button
                  onClick={handleImport}
                  disabled={isImporting || extractedPeople.filter(p => p.status === 'new').length === 0}
                  size="sm"
                >
                  {isImporting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Importing...
                    </>
                  ) : (
                    <>
                      <UserPlus className="h-4 w-4 mr-2" />
                      Import {extractedPeople.filter(p => p.status === 'new').length} New
                    </>
                  )}
                </Button>
              </div>

              <div className="border rounded-lg divide-y max-h-96 overflow-y-auto">
                {extractedPeople.map((person, index) => (
                  <div key={index} className="p-3 flex items-start justify-between hover:bg-muted/50">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium">
                          {person.first_name} {person.last_name}
                        </p>
                        {person.status === 'exists' && (
                          <CheckCircle2 className="h-4 w-4 text-green-600" />
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground space-y-0.5 mt-1">
                        {person.email && <p>Email: {person.email}</p>}
                        {person.job_title && <p>Title: {person.job_title}</p>}
                        {person.department && <p>Department: {person.department}</p>}
                        {person.location && <p>Location: {person.location}</p>}
                      </div>
                    </div>
                    <div className="text-xs">
                      {person.status === 'exists' ? (
                        <span className="text-green-600 font-medium">Already in team</span>
                      ) : (
                        <span className="text-primary font-medium">Will be added</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
