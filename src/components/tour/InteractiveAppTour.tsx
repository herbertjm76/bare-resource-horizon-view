import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, Play, X, Maximize2, Check, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useDemoAuth } from '@/hooks/useDemoAuth';
import { motion, AnimatePresence } from 'framer-motion';

interface TourStep {
  id: number;
  title: string;
  description: string;
  category: string;
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
    features: ["Utilization snapshot", "Upcoming work", "At-a-glance KPIs"],
    icon: "📊",
    route: "/dashboard"
  },
  {
    id: 2,
    title: "Weekly Overview",
    description: "Plan capacity week-by-week and spot conflicts early with fast scanning views.",
    category: "Planning",
    features: ["Table / grid views", "Availability & leave context", "Quick scanning"],
    icon: "📅",
    route: "/weekly-overview"
  },
  {
    id: 3,
    title: "Resource Scheduling",
    description: "Allocate people to projects and keep schedules aligned with reality.",
    category: "Scheduling",
    features: ["By project / by person", "Update allocations", "Plan ahead"],
    icon: "📈",
    route: "/resource-scheduling"
  },
  {
    id: 4,
    title: "Project Pipeline",
    description: "Understand your project pipeline and resourcing needs across stages.",
    category: "Projects",
    features: ["Pipeline view", "Stage planning", "Capacity vs demand"],
    icon: "📁",
    route: "/resource-planning"
  },
  {
    id: 5,
    title: "Capacity Heatmap",
    description: "See overload and underutilization instantly across your team.",
    category: "Insights",
    features: ["Color-coded capacity", "Filter by team / role", "Overload detection"],
    icon: "🔥",
    route: "/capacity-heatmap"
  },
  {
    id: 6,
    title: "Team Leave",
    description: "Track time off so plans stay realistic.",
    category: "Availability",
    features: ["Leave overview", "Requests & approvals", "Coverage awareness"],
    icon: "🏖️",
    route: "/team-leave"
  },
  {
    id: 7,
    title: "Office Settings",
    description: "Configure workspace settings and keep your org data tidy.",
    category: "Settings",
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
  const [loadedIframes, setLoadedIframes] = useState<Set<number>>(new Set([0]));

  const currentTourStep = tourSteps[currentStep];
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === tourSteps.length - 1;

  const progressPercent = useMemo(
    () => ((currentStep + 1) / tourSteps.length) * 100,
    [currentStep]
  );

  // Preload adjacent iframes for smoother navigation
  useEffect(() => {
    const preloadIndexes = new Set<number>();
    // Always load current
    preloadIndexes.add(currentStep);
    // Preload next 2 and previous 1
    if (currentStep > 0) preloadIndexes.add(currentStep - 1);
    if (currentStep < tourSteps.length - 1) preloadIndexes.add(currentStep + 1);
    if (currentStep < tourSteps.length - 2) preloadIndexes.add(currentStep + 2);
    
    setLoadedIframes(prev => {
      const newSet = new Set(prev);
      preloadIndexes.forEach(i => newSet.add(i));
      return newSet;
    });
  }, [currentStep]);

  // Preload all iframes after initial mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoadedIframes(new Set(tourSteps.map((_, i) => i)));
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

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

  // Get the demo route URL for iframe
  const getIframeUrl = (route: string) => {
    return `/demo${route}?embed=true`;
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

      {/* Step Navigation Pills - Single Line */}
      <div className="mb-8 overflow-x-auto scrollbar-hide">
        <div className="flex justify-center gap-1.5 min-w-max px-4">
          {tourSteps.map((step, index) => (
            <motion.button
              key={step.id}
              onClick={() => handleStepClick(index)}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className={cn(
                "relative flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all duration-300",
                "text-xs font-medium whitespace-nowrap",
                index === currentStep
                  ? "text-white shadow-lg"
                  : index < currentStep
                    ? "bg-primary/15 text-primary hover:bg-primary/25"
                    : "bg-muted/40 text-muted-foreground hover:bg-muted/60 hover:text-foreground"
              )}
              style={index === currentStep ? {
                background: 'linear-gradient(135deg, hsl(var(--gradient-start)), hsl(var(--gradient-end)))'
              } : undefined}
            >
              <span className="text-sm">{step.icon}</span>
              <span>{step.title}</span>
              {index < currentStep && (
                <Check className="w-3 h-3" />
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
        {/* Live Preview Section - Takes 3 columns */}
        <div className="lg:col-span-3">
          <div className="relative group">
            {/* Decorative background blur */}
            <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 via-primary/10 to-primary/20 rounded-3xl blur-2xl opacity-50 group-hover:opacity-70 transition-opacity" />
            
            {/* Preview container */}
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

                {/* Live iframe preview - All preloaded */}
                <div className="relative aspect-[16/10] overflow-hidden bg-muted/20">
                  {tourSteps.map((step, index) => (
                    loadedIframes.has(index) && (
                      <div
                        key={step.id}
                        className={cn(
                          "absolute inset-0 transition-opacity duration-200",
                          index === currentStep ? "opacity-100 z-10" : "opacity-0 z-0"
                        )}
                      >
                        <iframe
                          src={getIframeUrl(step.route)}
                          title={`${step.title} preview`}
                          className="w-full h-full border-0 pointer-events-none"
                          style={{
                            transform: 'scale(0.5)',
                            transformOrigin: 'top left',
                            width: '200%',
                            height: '200%',
                          }}
                          sandbox="allow-same-origin allow-scripts"
                        />
                      </div>
                    )
                  ))}
                  
                  {/* Overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-background/10 via-transparent to-transparent pointer-events-none z-20" />
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

      {/* Fullscreen modal with live iframe */}
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
              className="relative max-w-7xl w-full h-[85vh]"
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
              <div className="w-full h-full bg-background rounded-xl shadow-2xl overflow-hidden">
                <iframe
                  src={getIframeUrl(currentTourStep.route)}
                  title={`${currentTourStep.title} fullscreen preview`}
                  className="w-full h-full border-0"
                  sandbox="allow-same-origin allow-scripts"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
