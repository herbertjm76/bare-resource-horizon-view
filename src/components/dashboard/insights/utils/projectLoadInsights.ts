
import { Briefcase, Target } from 'lucide-react';
import { InsightData } from '../types';

export const getProjectLoadInsights = (
  activeProjects: number, 
  teamSize: number
): InsightData[] => {
  const insights: InsightData[] = [];
  const projectsPerPerson = teamSize > 0 ? activeProjects / teamSize : 0;
  
  if (projectsPerPerson > 3.5) {
    insights.push({
      title: "Excessive Project Load",
      description: `With ${projectsPerPerson.toFixed(1)} projects per team member, context switching may severely impact productivity and quality.`,
      type: "critical",
      icon: Briefcase,
      priority: 1,
      category: "Project Management"
    });
  } else if (projectsPerPerson > 2.5) {
    insights.push({
      title: "High Project Complexity",
      description: `${projectsPerPerson.toFixed(1)} projects per person requires excellent project management to maintain focus and delivery quality.`,
      type: "warning",
      icon: Briefcase,
      priority: 2,
      category: "Project Management"
    });
  } else if (projectsPerPerson < 1.5 && teamSize > 2) {
    insights.push({
      title: "Project Consolidation Opportunity",
      description: `With ${projectsPerPerson.toFixed(1)} projects per person, consider consolidating efforts or taking on additional strategic projects.`,
      type: "info",
      icon: Target,
      priority: 3,
      category: "Strategic Planning"
    });
  }
  
  return insights;
};
