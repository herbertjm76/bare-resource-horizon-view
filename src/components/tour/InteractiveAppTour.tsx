import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, Play, X, Eye, LayoutDashboard, Calendar, GanttChartSquare, UserSquare2, Flag, TrendingUp, FolderKanban, User, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TourStep {
  id: number;
  title: string;
  description: string;
  category: string;
  screenshot: string;
  features: string[];
  icon: React.ReactNode;
  bgColor: string;
}

const tourSteps: TourStep[] = [
  {
    id: 1,
    title: "Dashboard",
    description: "Get a comprehensive view of your team's performance, project status, and key metrics all in one place with real-time analytics and smart insights.",
    category: "Analytics",
    screenshot: "/lovable-uploads/1ec9c1fb-a2b7-46f5-8584-89c4034146af.png",
    features: ["Real-time team utilization", "Project progress tracking", "Smart insights & recommendations"],
    icon: <LayoutDashboard className="w-16 h-16" />,
    bgColor: "from-purple-600 to-purple-700"
  },
  {
    id: 2,
    title: "Weekly Resources",
    description: "Visual capacity planning with multiple views. Switch between detailed table, quick-scan grid, and presentation-ready carousel to optimize resource allocation.",
    category: "Planning",
    screenshot: "/lovable-uploads/cd9c399d-b5d1-471f-88c9-e013119b3552.png",
    features: ["Table view for detailed data", "Grid view for quick scanning", "Carousel for presentations", "Team coordination tools"],
    icon: <Calendar className="w-16 h-16" />,
    bgColor: "from-blue-600 to-blue-700"
  },
  {
    id: 3,
    title: "Team Workload",
    description: "Monitor and balance team workloads with comprehensive tracking tools that ensure optimal productivity and prevent burnout.",
    category: "Team",
    screenshot: "/lovable-uploads/69179c95-91ed-42d6-a38b-94114edcf69f.png",
    features: ["Workload balancing", "Productivity tracking", "Team performance metrics"],
    icon: <TrendingUp className="w-16 h-16" />,
    bgColor: "from-purple-500 to-purple-600"
  },
  {
    id: 4,
    title: "Project Resourcing", 
    description: "Strategic resource allocation across all your projects with advanced planning tools and timeline management.",
    category: "Projects",
    screenshot: "/lovable-uploads/cd9c399d-b5d1-471f-88c9-e013119b3552.png",
    features: ["Strategic resource allocation", "Timeline management", "Project planning tools"],
    icon: <GanttChartSquare className="w-16 h-16" />,
    bgColor: "from-violet-600 to-violet-700"
  },
  {
    id: 5,
    title: "Annual Leave",
    description: "Smart vacation planning and leave management that keeps your team balanced while maintaining project continuity.",
    category: "Leave",
    screenshot: "/lovable-uploads/5233d4c9-0afd-4df2-b96b-e71ad0acbabc.png",
    features: ["Smart vacation planning", "Leave request management", "Team coverage planning"],
    icon: <Calendar className="w-16 h-16" />,
    bgColor: "from-blue-500 to-blue-600"
  },
  {
    id: 6,
    title: "All Projects",
    description: "Complete project overview with status tracking, budget monitoring, and comprehensive project portfolio management.",
    category: "Portfolio",
    screenshot: "/lovable-uploads/d6950251-26bd-43bc-8594-4b191fe6c1a7.png",
    features: ["Project portfolio view", "Status tracking", "Budget monitoring"],
    icon: <FolderKanban className="w-16 h-16" />,
    bgColor: "from-indigo-600 to-indigo-700"
  },
  {
    id: 7,
    title: "Member Profile",
    description: "Detailed team member profiles with skills, capacity, and performance tracking for better team management.",
    category: "Team",
    screenshot: "/lovable-uploads/8f557546-80a9-4628-8a21-7114e11f23dc.png",
    features: ["Team member profiles", "Skills tracking", "Performance metrics"],
    icon: <User className="w-16 h-16" />,
    bgColor: "from-fuchsia-600 to-fuchsia-700"
  },
  {
    id: 8,
    title: "Office Settings",
    description: "Complete workspace control with company settings, user management, and platform configuration options.",
    category: "Configuration",
    screenshot: "/lovable-uploads/2b26c5c4-10bc-4fcf-b864-ae226aef1708.png",
    features: ["Company settings", "User management", "Platform configuration"],
    icon: <Flag className="w-16 h-16" />,
    bgColor: "from-purple-700 to-purple-800"
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
        
      {/* Beautiful colored tiles for step indicators */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 mb-8">
        {tourSteps.map((step, index) => (
          <button
            key={step.id}
            onClick={() => handleStepClick(index)}
            className={cn(
              "group text-center transition-all duration-300",
              index === currentStep ? "scale-105" : "hover:scale-102"
            )}
          >
            <div className={cn(
              "relative mb-3 mx-auto w-16 h-16 md:w-20 md:h-20 rounded-2xl flex items-center justify-center shadow-lg backdrop-blur-sm transition-all duration-300",
              `bg-gradient-to-br ${step.bgColor}`,
              index === currentStep 
                ? "shadow-xl ring-4 ring-purple-300/50 scale-110" 
                : index < currentStep
                ? "opacity-90 shadow-lg"
                : "opacity-75 group-hover:opacity-90 group-hover:shadow-xl"
            )}>
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-2xl"></div>
              <div className="relative text-white transition-all duration-300 group-hover:scale-110">
                {React.cloneElement(step.icon as React.ReactElement, { 
                  className: "w-8 h-8 md:w-10 md:h-10" 
                })}
              </div>
              
              {/* Progress indicator for completed steps */}
              {index < currentStep && (
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <div className="w-3 h-3 bg-white rounded-full"></div>
                </div>
              )}
              
              {/* Current step indicator */}
              {index === currentStep && (
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-400 rounded-full animate-pulse"></div>
              )}
            </div>
            
            <h3 className={cn(
              "text-xs md:text-sm font-semibold transition-colors",
              index === currentStep 
                ? "text-purple-600" 
                : "text-gray-700 group-hover:text-purple-600"
            )}>
              {step.title}
            </h3>
          </button>
        ))}
      </div>

      {/* Enhanced progress bar with gradient */}
      <div className="w-full bg-gray-200 rounded-full h-3 mb-8 overflow-hidden">
        <div 
          className="bg-gradient-to-r from-purple-500 via-blue-500 to-purple-600 h-3 rounded-full transition-all duration-500 relative"
          style={{ width: `${((currentStep + 1) / tourSteps.length) * 100}%` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent"></div>
        </div>
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

                {/* Category badge with matching colors */}
                <div className="absolute top-4 left-4">
                  <Badge 
                    variant="secondary" 
                    className={cn(
                      "bg-white/95 backdrop-blur-sm text-gray-900 border-0 shadow-md",
                      "bg-gradient-to-r from-white/95 to-white/90"
                    )}
                  >
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
                className={cn(
                  "flex items-center space-x-2 text-white border-0 shadow-lg",
                  `bg-gradient-to-r ${currentTourStep.bgColor} hover:opacity-90`
                )}
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