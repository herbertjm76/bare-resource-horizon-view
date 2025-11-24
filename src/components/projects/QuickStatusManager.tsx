import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Pencil, Trash2, X, Settings } from "lucide-react";
import { useOfficeSettings } from "@/context/OfficeSettingsContext";
import { useCompany } from "@/context/CompanyContext";
import { useStatusOperations } from '@/components/settings/statuses/useStatusOperations';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Link } from 'react-router-dom';

interface QuickStatusManagerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const QuickStatusManager: React.FC<QuickStatusManagerProps> = ({
  open,
  onOpenChange,
}) => {
  const { project_statuses, setProjectStatuses } = useOfficeSettings();
  const { company } = useCompany();

  const {
    editingStatus,
    newStatusName,
    setNewStatusName,
    newStatusColor,
    setNewStatusColor,
    isSubmitting,
    showAddForm,
    handleSubmit,
    handleEdit,
    handleDelete,
    handleCancel,
    handleAddNew,
  } = useStatusOperations(project_statuses, setProjectStatuses, company?.id);

  const handleSaveAndClose = async () => {
    await handleSubmit();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>Project Statuses</DialogTitle>
            <Link to="/office-settings">
              <Button variant="ghost" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Full Settings
              </Button>
            </Link>
          </div>
        </DialogHeader>
        
        <ScrollArea className="max-h-[400px] pr-4">
          <div className="space-y-3">
            {project_statuses.map((status) => (
              <div
                key={status.id}
                className="flex items-center gap-3 p-3 rounded-lg border bg-card"
              >
                {editingStatus?.id === status.id ? (
                  <>
                    <Input
                      type="color"
                      value={newStatusColor}
                      onChange={(e) => setNewStatusColor(e.target.value)}
                      className="w-12 h-10 p-1"
                    />
                    <Input
                      value={newStatusName}
                      onChange={(e) => setNewStatusName(e.target.value)}
                      className="flex-1"
                      autoFocus
                    />
                    <Button
                      size="sm"
                      onClick={handleSaveAndClose}
                      disabled={isSubmitting || !newStatusName.trim()}
                    >
                      Save
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={handleCancel}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </>
                ) : (
                  <>
                    <div
                      className="w-4 h-4 rounded-full flex-shrink-0"
                      style={{ backgroundColor: status.color || '#6366f1' }}
                    />
                    <span className="flex-1 font-medium">{status.name}</span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleEdit(status)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDelete(status)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </>
                )}
              </div>
            ))}

            {showAddForm && !editingStatus && (
              <div className="flex items-center gap-3 p-3 rounded-lg border bg-card">
                <Input
                  type="color"
                  value={newStatusColor}
                  onChange={(e) => setNewStatusColor(e.target.value)}
                  className="w-12 h-10 p-1"
                />
                <Input
                  value={newStatusName}
                  onChange={(e) => setNewStatusName(e.target.value)}
                  placeholder="Status name"
                  className="flex-1"
                  autoFocus
                />
                <Button
                  size="sm"
                  onClick={handleSaveAndClose}
                  disabled={isSubmitting || !newStatusName.trim()}
                >
                  Add
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleCancel}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </ScrollArea>

        {!showAddForm && !editingStatus && (
          <Button
            onClick={handleAddNew}
            className="w-full"
            variant="outline"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add New Status
          </Button>
        )}

        <div className="text-xs text-muted-foreground text-center">
          Quick edit statuses here or visit settings for advanced options
        </div>
      </DialogContent>
    </Dialog>
  );
};
