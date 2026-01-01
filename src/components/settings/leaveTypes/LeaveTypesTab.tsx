import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit, Plus, Calendar } from 'lucide-react';
import { useCompany } from '@/context/CompanyContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { LeaveType } from '@/types/leave';
import { AddLeaveTypeDialog } from './AddLeaveTypeDialog';
import { LeaveTypeList } from './LeaveTypeList';
import { useLeaveTypeOperations } from './useLeaveTypeOperations';
import { useDemoAuth } from '@/hooks/useDemoAuth';
import { DEMO_LEAVE_TYPES } from '@/data/demoData';

export const LeaveTypesTab: React.FC = () => {
  const { company } = useCompany();
  const { isDemoMode } = useDemoAuth();
  const [leaveTypes, setLeaveTypes] = useState<LeaveType[]>([]);
  const [loading, setLoading] = useState(true);

  const {
    editingType,
    isSubmitting,
    showDialog,
    setShowDialog,
    editMode,
    selectedTypes,
    handleAddNew,
    handleEdit,
    handleCancel,
    toggleEditMode,
    handleSelectType,
    handleSubmit,
    handleDelete,
    handleBulkDelete,
    handleReorder
  } = useLeaveTypeOperations(leaveTypes, setLeaveTypes, company?.id);

  // Demo mode handlers that show toast notifications
  const handleDemoAddNew = () => {
    toast.info('Adding leave types is disabled in demo mode');
  };

  const handleDemoEdit = () => {
    toast.info('Editing leave types is disabled in demo mode');
  };

  const handleDemoDelete = () => {
    toast.info('Deleting leave types is disabled in demo mode');
  };

  useEffect(() => {
    // In demo mode, use demo data directly
    if (isDemoMode) {
      setLeaveTypes(DEMO_LEAVE_TYPES as LeaveType[]);
      setLoading(false);
      return;
    }

    const fetchLeaveTypes = async () => {
      if (!company?.id) return;

      try {
        const { data, error } = await supabase
          .from('leave_types')
          .select('*')
          .eq('company_id', company.id)
          .eq('is_active', true)
          .order('order_index', { ascending: true });

        if (error) throw error;

        if (data && data.length === 0) {
          // Seed default leave types
          const { error: seedError } = await supabase.rpc('seed_default_leave_types', {
            p_company_id: company.id
          });

          if (seedError) {
            console.error('Error seeding leave types:', seedError);
          } else {
            // Fetch again after seeding
            const { data: seededData, error: refetchError } = await supabase
              .from('leave_types')
              .select('*')
              .eq('company_id', company.id)
              .eq('is_active', true)
              .order('order_index', { ascending: true });

            if (!refetchError && seededData) {
              setLeaveTypes(seededData);
            }
          }
        } else {
          setLeaveTypes(data || []);
        }
      } catch (error) {
        console.error('Error fetching leave types:', error);
        toast.error('Failed to load leave types');
      } finally {
        setLoading(false);
      }
    };

    fetchLeaveTypes();
  }, [company?.id, isDemoMode]);

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="text-muted-foreground">Loading leave types...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="flex items-center gap-2" style={{ color: 'hsl(var(--theme-primary))' }}>
          <Calendar className="w-5 h-5" />
          Leave Types
        </CardTitle>
        <div className="flex gap-2">
          {!isDemoMode && (
            <>
              <Button
                size="sm"
                variant={editMode ? 'secondary' : 'outline'}
                onClick={toggleEditMode}
              >
                <Edit className="h-4 w-4 md:mr-2" />
                <span className="hidden md:inline">{editMode ? 'Done' : 'Edit'}</span>
              </Button>
              <Button size="sm" onClick={handleAddNew}>
                <Plus className="h-4 w-4 md:mr-2" />
                <span className="hidden md:inline">Add Type</span>
              </Button>
            </>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="text-sm text-muted-foreground">
            Configure the types of leave that employees can request. These will appear in the leave application form.
            {isDemoMode && <span className="text-muted-foreground/70 ml-1">(View only in demo mode)</span>}
          </div>

          {editMode && selectedTypes.length > 0 && !isDemoMode && (
            <div className="flex items-center gap-2 p-2 bg-accent/50 rounded-lg">
              <span className="text-sm">{selectedTypes.length} selected</span>
              <Button
                size="sm"
                variant="destructive"
                onClick={handleBulkDelete}
              >
                Delete Selected
              </Button>
            </div>
          )}

          {!isDemoMode && (
            <AddLeaveTypeDialog
              open={showDialog}
              onOpenChange={setShowDialog}
              onSubmit={handleSubmit}
              editingType={editingType}
              isSubmitting={isSubmitting}
              onCancel={handleCancel}
            />
          )}

          <LeaveTypeList
            leaveTypes={leaveTypes}
            editMode={isDemoMode ? false : editMode}
            selectedTypes={isDemoMode ? [] : selectedTypes}
            onSelectType={isDemoMode ? handleDemoEdit : handleSelectType}
            onEdit={isDemoMode ? handleDemoEdit : handleEdit}
            onDelete={isDemoMode ? handleDemoDelete : handleDelete}
            onReorder={isDemoMode ? () => {} : handleReorder}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default LeaveTypesTab;
