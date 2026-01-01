import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, Play, X, Eye, LayoutDashboard, Calendar, TrendingUp, FolderKanban, Flame, CalendarDays, Flag } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useDemoAuth } from '@/hooks/useDemoAuth';

interface TourStep {
  id: number;
  title: string;
  description: string;
  category: string;
  screenshot: string;
  features: string[];
  icon: React.ReactNode;
  bgColor: string;
  /** Route inside the product (company-scoped) */
  route: string;
}

// NOTE: Screenshots are placeholders until we capture them from the live demo.
// Once you upload new screenshots, replace `screenshot` fields below.
const tourSteps: TourStep[] = [
  {
    id: 1,
    title: "Dashboard",
    description: "A single place to understand utilization, project health, and what needs attention this week.",
    category: "Overview",
    screenshot: "/lovable-uploads/1ec9c1fb-a2b7-46f5-8584-89c4034146af.png",
    features: ["Utilization snapshot", "Upcoming work", "At-a-glance KPIs"],
    icon: <LayoutDashboard className="w-16 h-16" />,
    bgColor: "from-[#A855F7] to-[#EC4899]",
    route: "/dashboard"
  },
  {
    id: 2,
    title: "Weekly Overview",
    description: "Plan capacity week-by-week and spot conflicts early with fast scanning views.",
    category: "Planning",
    screenshot: "/lovable-uploads/cd9c399d-b5d1-471f-88c9-e013119b3552.png",
    features: ["Table / grid views", "Availability & leave context", "Quick scanning"],
    icon: <Calendar className="w-16 h-16" />,
    bgColor: "from-[#A855F7] to-[#EC4899]",
    route: "/weekly-overview"
  },
  {
    id: 3,
    title: "Resource Scheduling",
    description: "Allocate people to projects and keep schedules aligned with reality.",
    category: "Scheduling",
    screenshot: "/lovable-uploads/cd9c399d-b5d1-471f-88c9-e013119b3552.png",
    features: ["By project / by person", "Update allocations", "Plan ahead"],
    icon: <TrendingUp className="w-16 h-16" />,
    bgColor: "from-[#A855F7] to-[#EC4899]",
    route: "/resource-scheduling"
  },
  {
    id: 4,
    title: "Project Pipeline",
    description: "Understand your project pipeline and resourcing needs across stages.",
    category: "Projects",
    screenshot: "/lovable-uploads/d6950251-26bd-43bc-8594-4b191fe6c1a7.png",
    features: ["Pipeline view", "Stage planning", "Capacity vs demand"],
    icon: <FolderKanban className="w-16 h-16" />,
    bgColor: "from-[#A855F7] to-[#EC4899]",
    route: "/resource-planning"
  },
  {
    id: 5,
    title: "Capacity Heatmap",
    description: "See overload and underutilization instantly across your team.",
    category: "Insights",
    screenshot: "/lovable-uploads/69179c95-91ed-42d6-a38b-94114edcf69f.png",
    features: ["Color-coded capacity", "Filter by team / role", "Overload detection"],
    icon: <Flame className="w-16 h-16" />,
    bgColor: "from-[#A855F7] to-[#EC4899]",
    route: "/capacity-heatmap"
  },
  {
    id: 6,
    title: "Team Leave",
    description: "Track time off so plans stay realistic.",
    category: "Availability",
    screenshot: "/lovable-uploads/5233d4c9-0afd-4df2-b96b-e71ad0acbabc.png",
    features: ["Leave overview", "Requests & approvals", "Coverage awareness"],
    icon: <CalendarDays className="w-16 h-16" />,
    bgColor: "from-[#A855F7] to-[#EC4899]",
    route: "/team-leave"
  },
  {
    id: 7,
    title: "Office Settings",
    description: "Configure workspace settings and keep your org data tidy.",
    category: "Settings",
    screenshot: "/lovable-uploads/2b26c5c4-10bc-4fcf-b864-ae226aef1708.png",
    features: ["Company settings", "Teams & roles", "Configuration"],
    icon: <Flag className="w-16 h-16" />,
    bgColor: "from-[#A855F7] to-[#EC4899]",
    route: "/office-settings"
  }
];

interface InteractiveAppTourProps {
  onClose?: () => void;
  className?: string;
}

export const InteractiveAppTour: React.FC<InteractiveAppTourProps> = ({ onClose, className }) => {
  const navigate = useNavigate();
  const { startDemoMode } = useDemoAuth();

  const [currentStep, setCurrentStep] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const currentTourStep = tourSteps[currentStep];
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === tourSteps.length - 1;

  const progressPercent = useMemo(
    () => ((currentStep + 1) / tourSteps.length) * 100,
    [currentStep]
  );

  const handleNext = () => {
    if (!isLastStep) setCurrentStep((s) => s + 1);
  };

  const handlePrevious = () => {
    if (!isFirstStep) setCurrentStep((s) => s - 1);
  };

  const handleStepClick = (stepIndex: number) => setCurrentStep(stepIndex);

  const toggleFullscreen = () => setIsFullscreen((v) => !v);

  const handleOpenInDemo = () => {
    startDemoMode();
    navigate(`/demo${currentTourStep.route}`);
  };

  return (
    <div className={cn("w-full max-w-6xl mx-auto p-4", className)}>
      {/* Progress indicators */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-foreground">Interactive App Tour</h2>
          <div className="text-sm text-muted-foreground">
            Step {currentStep + 1} of {tourSteps.length}
          </div>
        </div>

        {/* Colored tiles for step indicators */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-8">
          {tourSteps.map((step, index) => (
            <button
              key={step.id}
              onClick={() => handleStepClick(index)}
              className={cn(
                "group text-center transition-all duration-300",
                index === currentStep ? "scale-105" : "hover:scale-102"
              )}
            >
              <div
                className={cn(
                  "relative mb-3 mx-auto w-16 h-16 md:w-20 md:h-20 rounded-2xl flex items-center justify-center shadow-lg backdrop-blur-sm transition-all duration-300",
                  `bg-gradient-to-br ${step.bgColor}`,
                  index === currentStep
                    ? "shadow-xl ring-4 ring-primary/30 scale-110"
                    : index < currentStep
                      ? "opacity-90 shadow-lg"
                      : "opacity-75 group-hover:opacity-90 group-hover:shadow-xl"
                )}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary-foreground/10 to-transparent rounded-2xl" />
                <div className="relative text-white transition-all duration-300 group-hover:scale-110">
                  {React.cloneElement(step.icon as React.ReactElement, {
                    className: "w-8 h-8 md:w-10 md:h-10",
                  })}
                </div>

                {/* Completed steps */}
                {index < currentStep && (
                  <div className="absolute -top-1 -right-1 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                    <div className="w-3 h-3 bg-primary-foreground rounded-full" />
                  </div>
                )}

                {/* Current step indicator */}
                {index === currentStep && (
                  <div className="absolute -top-1 -right-1 w-6 h-6 bg-accent rounded-full animate-pulse" />
                )}
              </div>

              <h3
                className={cn(
                  "text-xs md:text-sm font-semibold transition-colors",
                  index === currentStep
                    ? "text-primary"
                    : "text-foreground group-hover:text-primary"
                )}
              >
                {step.title}
              </h3>
            </button>
          ))}
        </div>

        {/* Progress bar */}
        <div className="w-full bg-muted rounded-full h-3 mb-8 overflow-hidden">
          <div
            className="bg-primary h-3 rounded-full transition-all duration-500 relative"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Screenshot section */}
        <div className="relative">
          <Card className="overflow-hidden shadow-lg">
            <CardContent className="p-0">
              <div className="relative group">
                <img
                  src={currentTourStep.screenshot}
                  alt={`${currentTourStep.title} screenshot`}
                  loading="lazy"
                  className="w-full h-64 sm:h-80 lg:h-96 object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                {/* Screenshot overlay controls */}
                <div className="absolute top-4 right-4 flex space-x-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={toggleFullscreen}
                    className="bg-background/90 backdrop-blur-sm hover:bg-background"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>

                {/* Category badge */}
                <div className="absolute top-4 left-4">
                  <Badge variant="secondary" className="bg-background/95 backdrop-blur-sm border-0 shadow-md">
                    {currentTourStep.category}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Content section */}
        <div className="space-y-6">
          <div>
            <h3 className="text-2xl font-bold text-foreground mb-3">{currentTourStep.title}</h3>
            <p className="text-muted-foreground text-lg leading-relaxed">{currentTourStep.description}</p>
          </div>

          {/* Features list */}
          <div>
            <h4 className="text-lg font-semibold text-foreground mb-3">Key Features:</h4>
            <ul className="space-y-2">
              {currentTourStep.features.map((feature, index) => (
                <li key={index} className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full" />
                  <span className="text-foreground">{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Navigation buttons */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-6">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={isFirstStep}
              className="flex items-center space-x-2"
            >
              <ChevronLeft className="h-4 w-4" />
              <span>Previous</span>
            </Button>

            <div className="flex items-center justify-end gap-3">
              <Button variant="secondary" onClick={handleOpenInDemo} className="flex items-center space-x-2">
                <Play className="h-4 w-4" />
                <span>Open in Demo</span>
              </Button>

              <Button
                variant="default"
                onClick={handleNext}
                disabled={isLastStep}
                className={cn("flex items-center space-x-2 border-0 shadow-lg")}
              >
                <span>{isLastStep ? 'Completed' : 'Next'}</span>
                {!isLastStep && <ChevronRight className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Fullscreen modal */}
      {isFullscreen && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
          <div className="relative max-w-6xl w-full">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleFullscreen}
              className="absolute top-4 right-4 z-10 bg-white/10 backdrop-blur-sm text-white hover:bg-white/20"
            >
              <X className="h-4 w-4" />
            </Button>
            <img
              src={currentTourStep.screenshot}
              alt={`${currentTourStep.title} screenshot (fullscreen)`}
              className="w-full h-auto max-h-[90vh] object-contain rounded-lg"
            />
          </div>
        </div>
      )}
    </div>
  );
};