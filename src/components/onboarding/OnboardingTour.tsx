import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  Calendar, 
  CalendarClock, 
  FolderKanban, 
  Users,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  X,
  Rocket,
  CheckCircle2,
  Building2,
  Shield
} from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { useOnboardingTour } from '@/hooks/useOnboardingTour';
import { useCompany } from '@/context/CompanyContext';
import { useDemoAuth } from '@/hooks/useDemoAuth';
import { cn } from '@/lib/utils';

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  LayoutDashboard,
  Calendar,
  CalendarClock,
  FolderKanban,
  Users
};

interface OnboardingTourProps {
  userName?: string;
}

export const OnboardingTour: React.FC<OnboardingTourProps> = ({ userName }) => {
  const navigate = useNavigate();
  const { company, companySlug } = useCompany();
  const { profile } = useDemoAuth();
  const [dontShowAgain, setDontShowAgain] = useState(false);
  const {
    showOnboarding,
    currentStep,
    isWelcomeStep,
    totalSteps,
    currentStepData,
    steps,
    role,
    roleInfo,
    startTour,
    nextStep,
    prevStep,
    goToStep,
    completeTour,
    skipTour
  } = useOnboardingTour();

  const displayName = userName || profile?.first_name || 'there';
  const companyName = company?.name || 'Your Company';
  const baseUrl = companySlug ? `/${companySlug}` : '';

  const handleStartResourcing = () => {
    skipTour(dontShowAgain);
    navigate(`${baseUrl}/resource-scheduling`);
  };

  const handleClose = () => {
    skipTour(dontShowAgain);
  };

  const handleGoToStep = (stepRoute: string) => {
    skipTour(dontShowAgain); // Only persist if user checked "Don't show again"
    navigate(`${baseUrl}${stepRoute}`);
  };

  const progressPercent = ((currentStep + 1) / totalSteps) * 100;

  if (!showOnboarding) return null;

  return (
    <Dialog open={showOnboarding} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="max-w-2xl p-0 gap-0 overflow-hidden border-0 bg-gradient-to-br from-background via-background to-muted/30">
        <AnimatePresence mode="wait">
          {isWelcomeStep ? (
            <motion.div
              key="welcome"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="p-8"
            >
              {/* Welcome Header */}
              <div className="text-center mb-8">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 mb-6"
                >
                  <Sparkles className="w-10 h-10 text-primary" />
                </motion.div>
                
                <motion.h1
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-3xl font-bold text-foreground mb-2"
                >
                  Welcome, {displayName}! 🎉
                </motion.h1>
                
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="flex items-center justify-center gap-2 text-muted-foreground mb-6"
                >
                  <Building2 className="w-4 h-4" />
                  <span className="font-medium">{companyName}</span>
                  <span>has been onboarded</span>
                </motion.div>
              </div>

              {/* Role Badge */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45 }}
                className="flex justify-center mb-4"
              >
                <Badge variant="secondary" className="px-3 py-1 flex items-center gap-2">
                  <Shield className="w-3.5 h-3.5" />
                  <span>Your role: {roleInfo.title}</span>
                </Badge>
              </motion.div>

              {/* Role Description */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-center text-sm text-muted-foreground mb-6 max-w-md mx-auto"
              >
                {roleInfo.description}
              </motion.p>

              {/* Success Badges */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.55 }}
                className="flex flex-wrap justify-center gap-3 mb-8"
              >
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  <span className="text-sm font-medium text-green-600 dark:text-green-400">Projects Added</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20">
                  <CheckCircle2 className="w-4 h-4 text-blue-500" />
                  <span className="text-sm font-medium text-blue-600 dark:text-blue-400">Resources Ready</span>
                </div>
              </motion.div>

              {/* Description */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="text-center text-muted-foreground mb-8"
              >
                Let's take a quick tour of the {totalSteps} pages you have access to.
              </motion.p>

              {/* Action Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="flex flex-col gap-4"
              >
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button
                    onClick={startTour}
                    size="lg"
                    className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
                  >
                    <Rocket className="w-4 h-4 mr-2" />
                    Take the Tour
                  </Button>
                  <Button
                    onClick={handleStartResourcing}
                    variant="outline"
                    size="lg"
                  >
                    Skip & Start Resourcing
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
                
                {/* Don't show again checkbox */}
                <div className="flex items-center justify-center gap-2">
                  <Checkbox
                    id="dont-show-again"
                    checked={dontShowAgain}
                    onCheckedChange={(checked) => setDontShowAgain(checked === true)}
                  />
                  <label
                    htmlFor="dont-show-again"
                    className="text-sm text-muted-foreground cursor-pointer"
                  >
                    Don't show this again
                  </label>
                </div>
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              key="tour"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col"
            >
              {/* Progress Header */}
              <div className="px-6 pt-6 pb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-muted-foreground">
                    Step {currentStep + 1} of {totalSteps}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleClose}
                    className="h-8 w-8"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                <Progress value={progressPercent} className="h-1.5" />
              </div>

              {/* Step Navigation Pills */}
              <div className="px-6 pb-4">
                <div className="flex gap-1.5 justify-center flex-wrap">
                  {steps.map((step, index) => {
                    const Icon = ICON_MAP[step.icon];
                    const isActive = index === currentStep;
                    const isCompleted = index < currentStep;
                    
                    return (
                      <button
                        key={step.id}
                        onClick={() => goToStep(index)}
                        className={cn(
                          "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all",
                          isActive
                            ? "bg-primary text-primary-foreground"
                            : isCompleted
                            ? "bg-primary/20 text-primary"
                            : "bg-muted text-muted-foreground hover:bg-muted/80"
                        )}
                      >
                        {Icon && <Icon className="w-3 h-3" />}
                        <span className="hidden sm:inline">{step.title}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Step Content */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="px-6 py-8 bg-gradient-to-br from-muted/50 to-muted/20"
                >
                  <div className="flex flex-col items-center text-center">
                    {currentStepData && (
                      <>
                        {(() => {
                          const Icon = ICON_MAP[currentStepData.icon];
                          return Icon ? (
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 mb-4">
                              <Icon className="w-8 h-8 text-primary" />
                            </div>
                          ) : null;
                        })()}
                        <h2 className="text-2xl font-bold text-foreground mb-3">
                          {currentStepData.title}
                        </h2>
                        <p className="text-muted-foreground max-w-md leading-relaxed">
                          {currentStepData.description}
                        </p>
                        
                        <Button
                          variant="link"
                          onClick={() => handleGoToStep(currentStepData.route)}
                          className="mt-4 text-primary"
                        >
                          Go to {currentStepData.title}
                          <ChevronRight className="w-4 h-4 ml-1" />
                        </Button>
                      </>
                    )}
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Navigation Footer */}
              <div className="px-6 py-4 flex flex-col gap-3 border-t">
                <div className="flex items-center justify-between">
                  <Button
                    variant="ghost"
                    onClick={prevStep}
                    disabled={currentStep === 0}
                    className="gap-1"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Previous
                  </Button>
                  
                  {currentStep === totalSteps - 1 ? (
                    <Button
                      onClick={handleStartResourcing}
                      className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
                    >
                      <Rocket className="w-4 h-4 mr-2" />
                      Start Resourcing
                    </Button>
                  ) : (
                    <Button onClick={nextStep} className="gap-1">
                      Next
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  )}
                </div>
                
                {/* Don't show again checkbox */}
                <div className="flex items-center justify-center gap-2">
                  <Checkbox
                    id="dont-show-again-tour"
                    checked={dontShowAgain}
                    onCheckedChange={(checked) => setDontShowAgain(checked === true)}
                  />
                  <label
                    htmlFor="dont-show-again-tour"
                    className="text-sm text-muted-foreground cursor-pointer"
                  >
                    Don't show this again
                  </label>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
};
