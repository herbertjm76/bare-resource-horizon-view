import { useState } from 'react';
import { Bookmark, Check, Star, Trash2, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ViewPreset, ViewType, useViewPresets } from '@/hooks/useViewPresets';
import { SavePresetDialog } from './SavePresetDialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { cn } from '@/lib/utils';

interface SavedPresetsDropdownProps {
  viewType: ViewType;
  currentFilters: Record<string, any>;
  onApplyPreset: (filters: Record<string, any>) => void;
  onFiltersChange?: () => void; // Called when filters are manually changed
}

export const SavedPresetsDropdown = ({
  viewType,
  currentFilters,
  onApplyPreset,
}: SavedPresetsDropdownProps) => {
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [presetToDelete, setPresetToDelete] = useState<ViewPreset | null>(null);

  const {
    presets,
    currentPresetId,
    defaultPreset,
    savePreset,
    setDefault,
    deletePreset,
    applyPreset,
    isSaving,
    isDeleting,
  } = useViewPresets({
    viewType,
    onApplyPreset,
  });

  const currentPreset = presets.find(p => p.id === currentPresetId);

  const handleSavePreset = (name: string, setAsDefault: boolean) => {
    savePreset({ name, filters: currentFilters, setAsDefault });
    setSaveDialogOpen(false);
  };

  const handleDeleteClick = (e: React.MouseEvent, preset: ViewPreset) => {
    e.stopPropagation();
    setPresetToDelete(preset);
    setDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    if (presetToDelete) {
      deletePreset(presetToDelete.id);
      setPresetToDelete(null);
    }
    setDeleteConfirmOpen(false);
  };

  const handleToggleDefault = (e: React.MouseEvent, preset: ViewPreset) => {
    e.stopPropagation();
    setDefault(preset.isDefault ? null : preset.id);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2">
            <Bookmark className="h-4 w-4" />
            <span className="hidden sm:inline">
              {currentPreset ? currentPreset.name : 'Presets'}
            </span>
            {presets.length > 0 && (
              <span className="ml-1 rounded-full bg-primary/10 px-1.5 py-0.5 text-xs text-primary">
                {presets.length}
              </span>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-64">
          {presets.length === 0 ? (
            <div className="px-2 py-3 text-center text-sm text-muted-foreground">
              No saved presets yet
            </div>
          ) : (
            presets.map((preset) => (
              <DropdownMenuItem
                key={preset.id}
                onClick={() => applyPreset(preset)}
                className="flex items-center justify-between group cursor-pointer"
              >
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  {currentPresetId === preset.id && (
                    <Check className="h-4 w-4 text-primary shrink-0" />
                  )}
                  <span className={cn(
                    "truncate",
                    currentPresetId !== preset.id && "ml-6"
                  )}>
                    {preset.name}
                  </span>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={(e) => handleToggleDefault(e, preset)}
                    className={cn(
                      "p-1 rounded hover:bg-accent",
                      preset.isDefault ? "text-amber-500" : "text-muted-foreground opacity-0 group-hover:opacity-100"
                    )}
                    title={preset.isDefault ? "Remove as default" : "Set as default"}
                  >
                    <Star className={cn("h-3.5 w-3.5", preset.isDefault && "fill-current")} />
                  </button>
                  <button
                    onClick={(e) => handleDeleteClick(e, preset)}
                    className="p-1 rounded hover:bg-destructive/10 text-muted-foreground opacity-0 group-hover:opacity-100 hover:text-destructive"
                    title="Delete preset"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </DropdownMenuItem>
            ))
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setSaveDialogOpen(true)} className="cursor-pointer">
            <Save className="h-4 w-4 mr-2" />
            Save current filters...
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <SavePresetDialog
        isOpen={saveDialogOpen}
        onClose={() => setSaveDialogOpen(false)}
        onSave={handleSavePreset}
        isSaving={isSaving}
      />

      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Preset</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{presetToDelete?.name}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={isDeleting}
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
