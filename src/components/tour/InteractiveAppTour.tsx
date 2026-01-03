import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, Play, X, Maximize2, Check, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useDemoAuth } from '@/hooks/useDemoAuth';
import { motion, AnimatePresence } from 'framer-motion';

// Import tour screenshots
import dashboardScreenshot from '@/assets/tour/dashboard.png';
import weeklyOverviewScreenshot from '@/assets/tour/weekly-overview.png';
import resourceSchedulingScreenshot from '@/assets/tour/resource-scheduling.png';
import projectPipelineScreenshot from '@/assets/tour/project-pipeline.png';
import capacityHeatmapScreenshot from '@/assets/tour/capacity-heatmap.png';
import teamLeaveScreenshot from '@/assets/tour/team-leave.png';
import officeSettingsScreenshot from '@/assets/tour/office-settings.png';

// Preload all screenshots for instant switching
const allScreenshots = [
  dashboardScreenshot,
  weeklyOverviewScreenshot,
  resourceSchedulingScreenshot,
  projectPipelineScreenshot,
  capacityHeatmapScreenshot,
  teamLeaveScreenshot,
  officeSettingsScreenshot,
];

interface TourStep {
  id: number;
  title: string;
  description: string;
  category: string;
  screenshot: string;
  features: string[];
  icon: string;
  route: string;
}

const tourSteps: TourStep[] = [
  {
    id: 1,
    title: "Dashboard",
    description: "A single place to understand utilization, project health, and what needs attention this week.",
    category: "Overview",
    screenshot: dashboardScreenshot,
    features: ["Utilization snapshot", "Upcoming work", "At-a-glance KPIs"],
    icon: "📊",
    route: "/dashboard"
  },
  {
    id: 2,
    title: "Weekly Overview",
    description: "Plan capacity week-by-week and spot conflicts early with fast scanning views.",
    category: "Planning",
    screenshot: weeklyOverviewScreenshot,
    features: ["Table / grid views", "Availability & leave context", "Quick scanning"],
    icon: "📅",
    route: "/weekly-overview"
  },
  {
    id: 3,
    title: "Resource Scheduling",
    description: "Allocate people to projects and keep schedules aligned with reality.",
    category: "Scheduling",
    screenshot: resourceSchedulingScreenshot,
    features: ["By project / by person", "Update allocations", "Plan ahead"],
    icon: "📈",
    route: "/resource-scheduling"
  },
  {
    id: 4,
    title: "Project Pipeline",
    description: "Understand your project pipeline and resourcing needs across stages.",
    category: "Projects",
    screenshot: projectPipelineScreenshot,
    features: ["Pipeline view", "Stage planning", "Capacity vs demand"],
    icon: "📁",
    route: "/resource-planning"
  },
  {
    id: 5,
    title: "Capacity Heatmap",
    description: "See overload and underutilization instantly across your team.",
    category: "Insights",
    screenshot: capacityHeatmapScreenshot,
    features: ["Color-coded capacity", "Filter by team / role", "Overload detection"],
    icon: "🔥",
    route: "/capacity-heatmap"
  },
  {
    id: 6,
    title: "Team Leave",
    description: "Track time off so plans stay realistic.",
    category: "Availability",
    screenshot: teamLeaveScreenshot,
    features: ["Leave overview", "Requests & approvals", "Coverage awareness"],
    icon: "🏖️",
    route: "/team-leave"
  },
  {
    id: 7,
    title: "Office Settings",
    description: "Configure workspace settings and keep your org data tidy.",
    category: "Settings",
    screenshot: officeSettingsScreenshot,
    features: ["Company settings", "Teams & roles", "Configuration"],
    icon: "⚙️",
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
  const [direction, setDirection] = useState(0);

  // Preload all images on mount for instant switching
  useEffect(() => {
    allScreenshots.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  const currentTourStep = tourSteps[currentStep];
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === tourSteps.length - 1;

  const progressPercent = useMemo(
    () => ((currentStep + 1) / tourSteps.length) * 100,
    [currentStep]
  );

  const handleNext = () => {
    if (!isLastStep) {
      setDirection(1);
      setCurrentStep((s) => s + 1);
    }
  };

  const handlePrevious = () => {
    if (!isFirstStep) {
      setDirection(-1);
      setCurrentStep((s) => s - 1);
    }
  };

  const handleStepClick = (stepIndex: number) => {
    setDirection(stepIndex > currentStep ? 1 : -1);
    setCurrentStep(stepIndex);
  };

  const toggleFullscreen = () => setIsFullscreen((v) => !v);

  const handleOpenInDemo = () => {
    startDemoMode();
    navigate(`/demo${currentTourStep.route}`);
  };

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 100 : -100,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 100 : -100,
      opacity: 0,
    }),
  };

  return (
    <div className={cn("w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", className)}>
      {/* Header Section */}
      <div className="text-center mb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Badge variant="outline" className="mb-4 px-4 py-1.5 text-sm font-medium border-primary/30 bg-primary/5">
            <Sparkles className="w-3.5 h-3.5 mr-2 text-primary" />
            Product Tour
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 tracking-tight">
            Explore BareResource
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover how our platform helps you manage resources, plan capacity, and deliver projects on time.
          </p>
        </motion.div>
      </div>

      {/* Step Navigation Pills */}
      <div className="mb-10">
        <div className="flex flex-wrap justify-center gap-2 md:gap-3">
          {tourSteps.map((step, index) => (
            <motion.button
              key={step.id}
              onClick={() => handleStepClick(index)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={cn(
                "relative flex items-center gap-2.5 px-4 py-2.5 rounded-full transition-all duration-300",
                "text-sm font-medium",
                index === currentStep
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                  : index < currentStep
                    ? "bg-primary/10 text-primary hover:bg-primary/20"
                    : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <span className="text-base">{step.icon}</span>
              <span className="hidden sm:inline">{step.title}</span>
              {index < currentStep && (
                <Check className="w-3.5 h-3.5 text-primary" />
              )}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-10">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-foreground">Your Progress</span>
          <span className="text-sm text-muted-foreground">{currentStep + 1} of {tourSteps.length}</span>
        </div>
        <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-primary via-primary to-primary/80 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </div>
      </div>

      {/* Main Content Area */}
      <div className="grid lg:grid-cols-5 gap-8 lg:gap-12 items-start">
        {/* Screenshot Section - Takes 3 columns */}
        <div className="lg:col-span-3">
          <div className="relative group">
            {/* Decorative background blur */}
            <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 via-primary/10 to-primary/20 rounded-3xl blur-2xl opacity-50 group-hover:opacity-70 transition-opacity" />
            
            {/* Screenshot container */}
            <div className="relative">
              {/* Subtle border glow */}
              <div className="absolute -inset-px bg-gradient-to-br from-primary/40 via-transparent to-primary/40 rounded-2xl opacity-60" />
              
              <div className="relative bg-background rounded-2xl overflow-hidden shadow-2xl border border-border/50">
                {/* Browser-like header */}
                <div className="flex items-center gap-2 px-4 py-3 bg-muted/50 border-b border-border/50">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-400/80" />
                    <div className="w-3 h-3 rounded-full bg-yellow-400/80" />
                    <div className="w-3 h-3 rounded-full bg-green-400/80" />
                  </div>
                  <div className="flex-1 flex justify-center">
                    <div className="px-4 py-1 bg-background/80 rounded-md text-xs text-muted-foreground font-mono">
                      bareresource.app{currentTourStep.route}
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={toggleFullscreen}
                    className="h-7 w-7 p-0 hover:bg-background/80"
                  >
                    <Maximize2 className="h-3.5 w-3.5" />
                  </Button>
                </div>

                {/* Screenshot with animation */}
                <div className="relative aspect-[16/10] overflow-hidden">
                  <AnimatePresence mode="wait" custom={direction}>
                    <motion.img
                      key={currentStep}
                      custom={direction}
                      variants={slideVariants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      src={currentTourStep.screenshot}
                      alt={`${currentTourStep.title} screenshot`}
                      className="absolute inset-0 w-full h-full object-cover object-top"
                    />
                  </AnimatePresence>
                  
                  {/* Overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-background/10 via-transparent to-transparent pointer-events-none" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content Section - Takes 2 columns */}
        <div className="lg:col-span-2 space-y-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              {/* Category & Title */}
              <div>
                <Badge variant="secondary" className="mb-3 text-xs font-medium">
                  {currentTourStep.category}
                </Badge>
                <h2 className="text-3xl font-bold text-foreground mb-3 flex items-center gap-3">
                  <span className="text-2xl">{currentTourStep.icon}</span>
                  {currentTourStep.title}
                </h2>
                <p className="text-muted-foreground text-base leading-relaxed">
                  {currentTourStep.description}
                </p>
              </div>

              {/* Features */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">
                  Key Features
                </h3>
                <div className="space-y-2.5">
                  {currentTourStep.features.map((feature, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center gap-3 p-3 rounded-xl bg-muted/30 border border-border/30 hover:bg-muted/50 transition-colors"
                    >
                      <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />
                      <span className="text-sm text-foreground">{feature}</span>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 space-y-3">
                <Button 
                  onClick={handleOpenInDemo} 
                  size="lg"
                  className="w-full bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20"
                >
                  <Play className="h-4 w-4 mr-2" />
                  Try in Demo Mode
                </Button>
                
                {/* Navigation */}
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={handlePrevious}
                    disabled={isFirstStep}
                    className="flex-1"
                  >
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Previous
                  </Button>
                  <Button
                    variant={isLastStep ? "secondary" : "default"}
                    onClick={handleNext}
                    disabled={isLastStep}
                    className="flex-1"
                  >
                    {isLastStep ? 'Complete' : 'Next'}
                    {!isLastStep && <ChevronRight className="h-4 w-4 ml-1" />}
                  </Button>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Fullscreen modal */}
      <AnimatePresence>
        {isFullscreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={toggleFullscreen}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-7xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <Button
                variant="secondary"
                size="sm"
                onClick={toggleFullscreen}
                className="absolute -top-12 right-0 bg-white/10 hover:bg-white/20 text-white border-0"
              >
                <X className="h-4 w-4 mr-2" />
                Close
              </Button>
              <img
                src={currentTourStep.screenshot}
                alt={`${currentTourStep.title} screenshot (fullscreen)`}
                className="w-full h-auto max-h-[85vh] object-contain rounded-xl shadow-2xl"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
