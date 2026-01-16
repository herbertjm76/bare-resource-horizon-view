import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useProjectForm } from '../../hooks/useProjectForm';
import { useOfficeSettings } from '@/context/officeSettings/useOfficeSettings';
import { ProjectWizardData } from '../ProjectSetupWizard';

interface ProjectBasicInfoStepProps {
  data: ProjectWizardData;
  onUpdate: (updates: Partial<ProjectWizardData>) => void;
}

export const ProjectBasicInfoStep: React.FC<ProjectBasicInfoStepProps> = ({ data, onUpdate }) => {
  const { managers, countries, offices } = useProjectForm(null, true, null);
  const { project_statuses } = useOfficeSettings();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Project Information</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="code">Project Code *</Label>
            <Input
              id="code"
              value={data.code}
              onChange={(e) => onUpdate({ code: e.target.value })}
              placeholder="e.g., PROJ-2024-001"
            />
          </div>
          
          <div>
            <Label htmlFor="name">Project Name *</Label>
            <Input
              id="name"
              value={data.name}
              onChange={(e) => onUpdate({ name: e.target.value })}
              placeholder="Enter project name"
            />
          </div>
          
          <div>
            <Label htmlFor="manager">Project Manager</Label>
            <Select value={data.managerId} onValueChange={(value) => onUpdate({ managerId: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select manager" />
              </SelectTrigger>
              <SelectContent>
                {managers.map(manager => (
                  <SelectItem key={manager.id} value={manager.id}>
                    {manager.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="country">Country</Label>
            <Select value={data.country} onValueChange={(value) => onUpdate({ country: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select country" />
              </SelectTrigger>
              <SelectContent>
                {countries.map(country => (
                  <SelectItem key={country} value={country}>
                    {country}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="office">Office</Label>
            <Select value={data.officeId} onValueChange={(value) => onUpdate({ officeId: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select office" />
              </SelectTrigger>
              <SelectContent>
                {offices.map(office => (
                  <SelectItem key={office.id} value={office.id}>
                    {office.city}, {office.country}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="status">Status</Label>
            <Select 
              value={data.status} 
              onValueChange={(value) => onUpdate({ status: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {project_statuses.length > 0 ? (
                  project_statuses.map(status => (
                    <SelectItem key={status.id} value={status.name}>
                      {status.name}
                    </SelectItem>
                  ))
                ) : (
                  <>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="On Hold">On Hold</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                  </>
                )}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Financial Information card hidden for MVP */}
      {/* <Card>
        <CardHeader>
          <CardTitle>Financial Information</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="totalFee">Total Project Fee *</Label>
            <Input
              id="totalFee"
              type="number"
              min="0"
              step="0.01"
              value={data.totalFee}
              onChange={(e) => onUpdate({ totalFee: parseFloat(e.target.value) || 0 })}
              placeholder="Enter total fee"
            />
          </div>
          
          <div>
            <Label htmlFor="currency">Currency</Label>
            <Select value={data.currency} onValueChange={(value) => onUpdate({ currency: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select currency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="USD">USD</SelectItem>
                <SelectItem value="EUR">EUR</SelectItem>
                <SelectItem value="GBP">GBP</SelectItem>
                <SelectItem value="CAD">CAD</SelectItem>
                <SelectItem value="AUD">AUD</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card> */}
    </div>
  );
};