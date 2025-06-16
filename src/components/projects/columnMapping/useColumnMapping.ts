
import { useState } from 'react';
import { PROJECT_FIELDS } from './types';

export const useColumnMapping = () => {
  const [mapping, setMapping] = useState<Record<string, string>>({});

  const handleMappingChange = (columnIndex: string, projectField: string) => {
    setMapping(prev => {
      const newMapping = { ...prev };
      
      // If selecting "skip", remove this column from mapping
      if (projectField === 'skip') {
        delete newMapping[columnIndex];
        return newMapping;
      }
      
      // Remove any existing mapping for this field (prevent duplicates)
      Object.keys(newMapping).forEach(key => {
        if (newMapping[key] === projectField) {
          delete newMapping[key];
        }
      });
      
      // Add new mapping
      newMapping[columnIndex] = projectField;
      return newMapping;
    });
  };

  const validateMapping = () => {
    const requiredFields = PROJECT_FIELDS.filter(field => field.required);
    const mappedFields = Object.values(mapping);
    
    const missingRequired = requiredFields.filter(field => 
      !mappedFields.includes(field.value)
    );

    if (missingRequired.length > 0) {
      alert(`Please map the following required fields: ${missingRequired.map(f => f.label).join(', ')}`);
      return false;
    }

    return true;
  };

  const downloadTemplate = () => {
    const templateHeaders = PROJECT_FIELDS.map(field => 
      field.required ? `${field.label} *` : field.label
    ).join(',');
    
    const sampleRow = [
      'PROJ-001',
      'Sample Project Name',
      'Planning',
      'United States',
      '15',
      'USD',
      'John Doe',
      'New York Office'
    ].join(',');
    
    const csvContent = `${templateHeaders}\n${sampleRow}`;
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'project_import_template.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return {
    mapping,
    handleMappingChange,
    validateMapping,
    downloadTemplate
  };
};
