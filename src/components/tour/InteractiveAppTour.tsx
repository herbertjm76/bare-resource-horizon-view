import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, Play, X, Eye, Users, BarChart3, Calendar, DollarSign, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TourStep {
  id: number;
  title: string;
  description: string;
  category: string;
  screenshot: string;
  features: string[];
  icon: React.ReactNode;
}

const tourSteps: TourStep[] = [
  {
    id: 1,
    title: "Dashboard Overview",
    description: "Get a comprehensive view of your team's performance, project status, and key metrics all in one place.",
    category: "Analytics",
    screenshot: "/api/placeholder/800/500", // Replace with your actual screenshot URL
    features: ["Real-time team utilization", "Project progress tracking", "Smart insights & recommendations"],
    icon: <BarChart3 className="h-5 w-5" />
  },
  {
    id: 2,
    title: "Team Management",
    description: "Efficiently manage your team members, track their capacity, and optimize resource allocation.",
    category: "Team",
    screenshot: "/api/placeholder/800/500", // Replace with your actual screenshot URL
    features: ["Team member profiles", "Capacity planning", "Workload balancing"],
    icon: <Users className="h-5 w-5" />
  },
  {
    id: 3,
    title: "Project Tracking",
    description: "Monitor project progress, deadlines, and resource allocation with powerful project management tools.",
    category: "Projects",
    screenshot: "/api/placeholder/800/500", // Replace with your actual screenshot URL
    features: ["Project timelines", "Resource allocation", "Budget tracking"],
    icon: <Calendar className="h-5 w-5" />
  },
  {
    id: 4,
    title: "Financial Overview",
    description: "Track budgets, expenses, and profitability across all your projects with detailed financial analytics.",
    category: "Finance",
    screenshot: "/api/placeholder/800/500", // Replace with your actual screenshot URL
    features: ["Budget vs actual", "Profitability analysis", "Cost tracking"],
    icon: <DollarSign className="h-5 w-5" />
  },
  {
    id: 5,
    title: "Settings & Configuration",
    description: "Customize your workspace, manage company settings, and configure the platform to match your workflow.",
    category: "Configuration",
    screenshot: "/api/placeholder/800/500", // Replace with your actual screenshot URL
    features: ["Company settings", "User permissions", "Integration setup"],
    icon: <Settings className="h-5 w-5" />
  }
];

interface InteractiveAppTourProps {
  onClose?: () => void;
  className?: string;
}

export const InteractiveAppTour: React.FC<InteractiveAppTourProps> = ({ onClose, className }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const currentTourStep = tourSteps[currentStep];
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === tourSteps.length - 1;

  const handleNext = () => {
    if (!isLastStep) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (!isFirstStep) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleStepClick = (stepIndex: number) => {
    setCurrentStep(stepIndex);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  return (
    <div className={cn("w-full max-w-6xl mx-auto p-4", className)}>
      {/* Progress indicators */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900">Interactive App Tour</h2>
          <div className="text-sm text-gray-500">
            Step {currentStep + 1} of {tourSteps.length}
          </div>
        </div>
        
        {/* Step indicators */}
        <div className="flex items-center space-x-2 mb-4">
          {tourSteps.map((step, index) => (
            <button
              key={step.id}
              onClick={() => handleStepClick(index)}
              className={cn(
                "flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all",
                index === currentStep
                  ? "bg-blue-100 text-blue-800 border-2 border-blue-200"
                  : index < currentStep
                  ? "bg-green-100 text-green-800 border border-green-200"
                  : "bg-gray-100 text-gray-600 border border-gray-200 hover:bg-gray-200"
              )}
            >
              {step.icon}
              <span className="hidden sm:inline">{step.title}</span>
            </button>
          ))}
        </div>

        {/* Progress bar */}
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentStep + 1) / tourSteps.length) * 100}%` }}
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
                  alt={`${currentTourStep.title} Screenshot`}
                  className="w-full h-64 sm:h-80 lg:h-96 object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                
                {/* Screenshot overlay controls */}
                <div className="absolute top-4 right-4 flex space-x-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={toggleFullscreen}
                    className="bg-white/90 backdrop-blur-sm hover:bg-white"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>

                {/* Category badge */}
                <div className="absolute top-4 left-4">
                  <Badge variant="secondary" className="bg-white/90 backdrop-blur-sm text-gray-900">
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
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              {currentTourStep.title}
            </h3>
            <p className="text-gray-600 text-lg leading-relaxed">
              {currentTourStep.description}
            </p>
          </div>

          {/* Features list */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-3">Key Features:</h4>
            <ul className="space-y-2">
              {currentTourStep.features.map((feature, index) => (
                <li key={index} className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full" />
                  <span className="text-gray-700">{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Navigation buttons */}
          <div className="flex items-center justify-between pt-6">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={isFirstStep}
              className="flex items-center space-x-2"
            >
              <ChevronLeft className="h-4 w-4" />
              <span>Previous</span>
            </Button>

            <div className="flex items-center space-x-3">
              <Button
                variant="default"
                onClick={handleNext}
                disabled={isLastStep}
                className="flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
              >
                <span>{isLastStep ? 'Completed' : 'Next'}</span>
                {!isLastStep && <ChevronRight className="h-4 w-4" />}
              </Button>

              {isLastStep && (
                <Button
                  variant="default"
                  className="flex items-center space-x-2 bg-green-600 hover:bg-green-700"
                >
                  <Play className="h-4 w-4" />
                  <span>Try Demo</span>
                </Button>
              )}
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
              alt={`${currentTourStep.title} Screenshot`}
              className="w-full h-auto max-h-[90vh] object-contain rounded-lg"
            />
          </div>
        </div>
      )}
    </div>
  );
};