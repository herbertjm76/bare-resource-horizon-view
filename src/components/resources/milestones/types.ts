
export type MilestoneType = 'none' | 'milestone' | 'kickoff' | 'workshop' | 'deadline';
export type MilestoneInfo = {
  type: MilestoneType;
  stage?: string; // Optional stage name
  icon?: 'circle' | 'square' | 'diamond';
};

// Define a type for continuity to ensure we handle both cases properly
export type Continuity = { left: boolean; right: boolean } | false;

export interface MilestoneBaseProps {
  weekKey: string;
  weekLabel: string;
  milestone: MilestoneInfo | undefined;
  milestoneColor: string | undefined;
  continuity: Continuity;
  stageColorMap: Record<string, string>;
}

export interface MilestoneVisualizerProps extends MilestoneBaseProps {
  onSetMilestone: (weekKey: string, milestoneInfo: MilestoneInfo) => void;
}
