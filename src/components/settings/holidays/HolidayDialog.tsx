
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Holiday, HolidayFormValues } from "./types";
import { HolidayForm } from "./HolidayForm";

interface HolidayDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: HolidayFormValues) => void;
  editingHoliday?: Holiday | null;
  loading?: boolean;
}

export const HolidayDialog: React.FC<HolidayDialogProps> = ({
  open,
  onOpenChange,
  onSubmit,
  editingHoliday,
  loading = false,
}) => {
  const handleCancel = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {editingHoliday ? "Edit Holiday" : "Add Holiday"}
          </DialogTitle>
        </DialogHeader>
        <HolidayForm
          onSubmit={onSubmit}
          onCancel={handleCancel}
          editingHoliday={editingHoliday}
          loading={loading}
        />
      </DialogContent>
    </Dialog>
  );
};
