import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Users, MapPin } from 'lucide-react';
import { ProjectWizardData } from '../ProjectSetupWizard';

interface RateBasisStepProps {
  data: ProjectWizardData;
  onUpdate: (updates: Partial<ProjectWizardData>) => void;
}

export const RateBasisStep: React.FC<RateBasisStepProps> = ({ data, onUpdate }) => {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold">Choose Rate Calculation Strategy</h3>
        <p className="text-muted-foreground">
          Select how you want to calculate costs for this project. This will determine how team planning and budget calculations work.
        </p>
      </div>

      <RadioGroup
        value={data.rateBasisStrategy}
        onValueChange={(value: 'role_based' | 'location_based') =>
          onUpdate({ rateBasisStrategy: value })
        }
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        <Card className={`cursor-pointer transition-all ${
          data.rateBasisStrategy === 'role_based' 
            ? 'ring-2 ring-primary border-primary' 
            : 'hover:shadow-md'
        }`}>
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <RadioGroupItem value="role_based" id="role_based" />
              <Users className="w-6 h-6 text-primary" />
              <div>
                <CardTitle className="text-lg">Role-Based Rates</CardTitle>
                <CardDescription>Calculate costs based on job roles</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Label htmlFor="role_based" className="cursor-pointer">
              <div className="space-y-2">
                <p className="text-sm">
                  Team composition will be planned using job roles (Senior Developer, Project Manager, Designer, etc.).
                </p>
                <div className="text-xs text-muted-foreground space-y-1">
                  <div>✓ Best for skill-based project planning</div>
                  <div>✓ Standardized role rates across locations</div>
                  <div>✓ Easy to scale team composition</div>
                </div>
              </div>
            </Label>
          </CardContent>
        </Card>

        <Card className={`cursor-pointer transition-all ${
          data.rateBasisStrategy === 'location_based' 
            ? 'ring-2 ring-primary border-primary' 
            : 'hover:shadow-md'
        }`}>
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <RadioGroupItem value="location_based" id="location_based" />
              <MapPin className="w-6 h-6 text-primary" />
              <div>
                <CardTitle className="text-lg">Location-Based Rates</CardTitle>
                <CardDescription>Calculate costs based on office locations</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Label htmlFor="location_based" className="cursor-pointer">
              <div className="space-y-2">
                <p className="text-sm">
                  Team composition will be planned using office locations (New York, London, Mumbai, etc.).
                </p>
                <div className="text-xs text-muted-foreground space-y-1">
                  <div>✓ Accounts for regional cost differences</div>
                  <div>✓ Better for geo-distributed teams</div>
                  <div>✓ Reflects local market rates</div>
                </div>
              </div>
            </Label>
          </CardContent>
        </Card>
      </RadioGroup>

      <div className="p-4 bg-muted rounded-lg">
        <h4 className="font-medium mb-2">💡 Pro Tip</h4>
        <p className="text-sm text-muted-foreground">
          You can always change this strategy later, but it will reset your team composition planning. 
          Choose the approach that best matches how your organization structures project costs.
        </p>
      </div>
    </div>
  );
};