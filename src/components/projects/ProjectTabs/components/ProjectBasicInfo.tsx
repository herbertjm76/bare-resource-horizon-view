
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Code, FileText } from 'lucide-react';

interface ProjectBasicInfoProps {
  code: string;
  name: string;
  codeError: string | null;
  isCheckingCode: boolean;
  onCodeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const ProjectBasicInfo: React.FC<ProjectBasicInfoProps> = ({
  code,
  name,
  codeError,
  isCheckingCode,
  onCodeChange,
  onNameChange,
}) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <Label htmlFor="code" className="flex items-center gap-1">
          <Code className="w-4 h-4" />Project Code
        </Label>
        <Input
          id="code"
          placeholder="P001"
          value={code}
          onChange={onCodeChange}
          required
          className={codeError ? "border-red-500" : ""}
        />
        {isCheckingCode && (
          <p className="text-xs text-muted-foreground mt-1">Checking code availability...</p>
        )}
        {codeError && (
          <p className="text-xs text-red-500 mt-1">{codeError}</p>
        )}
      </div>
      <div>
        <Label htmlFor="name" className="flex items-center gap-1">
          <FileText className="w-4 h-4" />Project Name
        </Label>
        <Input
          id="name"
          placeholder="New Project"
          value={name}
          onChange={onNameChange}
          required
        />
      </div>
    </div>
  );
};
