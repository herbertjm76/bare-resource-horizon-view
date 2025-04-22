
import React from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calculator } from "lucide-react";

interface Role {
  id: string;
  name: string;
}

interface Props {
  roles: Role[];
  roleNumbers: { [roleId: string]: number };
  setRoleNumbers: (fn: (prev: { [key: string]: number }) => { [key: string]: number }) => void;
  calculateAvgRate: () => string;
  onCancel: () => void;
  onApply: (newRate: string) => void;
}

const NewProjectRateCalculator: React.FC<Props> = ({
  roles, roleNumbers, setRoleNumbers, calculateAvgRate, onCancel, onApply
}) => (
  <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
    <Card className="p-6 max-w-lg mx-auto relative z-50 shadow-xl">
      <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-[#6E59A5]">
        <Calculator className="w-5 h-5" />Average Rate Calculator
      </h2>
      <p className="text-sm text-muted-foreground mb-4">
        Specify how many people per role will work on this project to calculate the average rate.
      </p>
      <div className="bg-muted/30 p-4 rounded-md space-y-3 mb-6">
        {roles.map(role => (
          <div className="flex items-center gap-3" key={role.id}>
            <span className="w-36 font-medium">{role.name}</span>
            <Input
              type="number"
              value={roleNumbers[role.id] || ''}
              min={0}
              onChange={e => setRoleNumbers(rns => ({
                ...rns,
                [role.id]: Number(e.target.value)
              }))}
              placeholder="# People"
              className="w-28"
            />
          </div>
        ))}
      </div>
      <div className="mb-6 p-3 border rounded-md bg-[#F8F4FF]">
        <div className="flex justify-between">
          <span className="font-medium">Calculated Average Rate:</span>
          <span className="text-[#6E59A5] font-bold text-lg">${calculateAvgRate() || '--'}</span>
        </div>
        <p className="text-xs text-muted-foreground mt-1">(Using dummy rates for demonstration)</p>
      </div>
      <div className="flex justify-end gap-2">
        <Button variant="secondary" type="button" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          onClick={() => onApply(calculateAvgRate())}
          type="button"
          variant="default"
          disabled={!calculateAvgRate()}
        >
          Apply Rate
        </Button>
      </div>
    </Card>
  </div>
);

export default NewProjectRateCalculator;
