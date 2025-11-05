
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { TeamColumnMappingCard } from './TeamColumnMappingCard';
import { TEAM_MEMBER_FIELDS } from './types';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface TeamColumnMappingInterfaceProps {
  headers: string[];
  sampleData: any[][];
  onMappingComplete: (mapping: Record<string, string>) => void;
  onCancel: () => void;
  initialMapping?: Record<string, string>;
}

export const TeamColumnMappingInterface: React.FC<TeamColumnMappingInterfaceProps> = ({
  headers,
  onMappingComplete,
  onCancel,
  initialMapping = {}
}) => {
  const [mapping, setMapping] = useState<Record<string, string>>(initialMapping);

  const handleMappingChange = (columnIndex: string, projectField: string) => {
    setMapping(prev => {
      const newMapping = { ...prev };
      
      if (projectField === 'skip') {
        delete newMapping[columnIndex];
      } else {
        // Remove any previous mapping to this field
        Object.keys(newMapping).forEach(key => {
          if (newMapping[key] === projectField) {
            delete newMapping[key];
          }
        });
        newMapping[columnIndex] = projectField;
      }
      
      return newMapping;
    });
  };

  const validateMapping = (): boolean => {
    const requiredFields = TEAM_MEMBER_FIELDS.filter(f => f.required).map(f => f.value);
    const mappedFields = Object.values(mapping);
    return requiredFields.every(field => mappedFields.includes(field));
  };

  const isValid = validateMapping();

  return (
    <div className="space-y-4">
      <Alert>
        <AlertDescription>
          Map your Excel columns to team member fields. Fields marked with * are required.
        </AlertDescription>
      </Alert>
      
      <TeamColumnMappingCard
        headers={headers}
        mapping={mapping}
        onMappingChange={handleMappingChange}
      />
      
      <div className="flex gap-2">
        <Button onClick={onCancel} variant="outline" className="flex-1">
          Cancel
        </Button>
        <Button 
          onClick={() => onMappingComplete(mapping)} 
          disabled={!isValid}
          className="flex-1"
        >
          Import Team Members
        </Button>
      </div>
      
      {!isValid && (
        <Alert variant="destructive">
          <AlertDescription>
            Please map all required fields: First Name, Last Name
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};
