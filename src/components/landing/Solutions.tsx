import React from 'react';
import { AnimatedSection } from '@/components/common/AnimatedSection';
import { VisualCard } from '@/components/common/VisualElements';
import { Building2, Target, Users, TrendingUp } from 'lucide-react';

const Solutions = () => {
  const solutions = [
    {
      icon: <Building2 className="w-8 h-8 text-blue-600" />,
      title: "Enterprise Resource Planning",
      description: "Scale your resource management across multiple departments and projects with enterprise-grade planning tools."
    },
    {
      icon: <Target className="w-8 h-8 text-green-600" />,
      title: "Project Portfolio Management", 
      description: "Optimize resource allocation across your entire project portfolio for maximum efficiency and ROI."
    },
    {
      icon: <Users className="w-8 h-8 text-purple-600" />,
      title: "Team Capacity Planning",
      description: "Ensure optimal team utilization while preventing burnout with intelligent capacity planning."
    },
    {
      icon: <TrendingUp className="w-8 h-8 text-orange-600" />,
      title: "Performance Analytics",
      description: "Make data-driven decisions with comprehensive analytics on team performance and resource utilization."
    }
  ];

  const quotes = [
    {
      text: "Resource allocation has completely transformed how we approach project planning. We can see exactly where our team's time is going.",
      author: "Sarah Chen",
      role: "Operations Director"
    },
    {
      text: "The visual capacity planning gives us confidence that we're not overcommitting our team while maximizing our project delivery.",
      author: "Marcus Rodriguez", 
      role: "Project Manager"
    },
    {
      text: "Real-time resource insights help us make better decisions about taking on new projects and scaling our team effectively.",
      author: "Emily Watson",
      role: "CEO"
    }
  ];

  return (
    <div id="solutions" className="py-20 bg-muted/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection animation="cascadeUp" delay={0}>
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Solutions for Every Team
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              From small teams to enterprise organizations, our resource management solutions 
              adapt to your unique needs and scale with your growth.
            </p>
          </div>
        </AnimatedSection>

        <div className="grid md:grid-cols-2 gap-8 mb-20">
          {solutions.map((solution, index) => (
            <AnimatedSection key={index} animation="cascadeScale" delay={200 + index * 200}>
              <VisualCard className="h-full p-8 hover:shadow-lg transition-shadow">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 p-3 bg-muted rounded-lg">
                    {solution.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-foreground mb-3">
                      {solution.title}
                    </h3>
                    <p className="text-muted-foreground">
                      {solution.description}
                    </p>
                  </div>
                </div>
              </VisualCard>
            </AnimatedSection>
          ))}
        </div>

        <AnimatedSection animation="cascadeUp" delay={1000}>
          <div className="text-center mb-12">
            <h3 className="text-2xl font-bold text-foreground mb-12">
              The New Way of Resource Allocation
            </h3>
          </div>
        </AnimatedSection>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {quotes.map((quote, index) => (
            <AnimatedSection key={index} animation="cascadeUp" delay={1200 + index * 200}>
              <div className="bg-card p-6 rounded-lg shadow-sm border-l-4 border-purple-600">
                <p className="text-foreground italic mb-4">"{quote.text}"</p>
                <div className="text-sm">
                  <p className="font-medium text-foreground">{quote.author}</p>
                  <p className="text-muted-foreground">{quote.role}</p>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Solutions;