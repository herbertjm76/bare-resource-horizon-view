
import { CheckCircle, Target, Zap, Brain } from 'lucide-react';

const Benefits = () => {
  const benefits = [
    {
      icon: <Brain className="w-6 h-6 text-purple-600" />,
      title: "Actionable Insights, Not Just Data",
      description: "Get intelligent recommendations that tell you exactly what to do next, not just what happened."
    },
    {
      icon: <Target className="w-6 h-6 text-purple-600" />,
      title: "Predictive Resource Planning",
      description: "Anticipate capacity issues and project conflicts weeks before they happen with AI-powered forecasting."
    },
    {
      icon: <Zap className="w-6 h-6 text-purple-600" />,
      title: "Automated Workload Balancing",
      description: "Eliminate manual scheduling chaos with intelligent allocation that prevents burnout and maximizes efficiency."
    },
    {
      icon: <CheckCircle className="w-6 h-6 text-purple-600" />,
      title: "Real-Time Impact Analysis",
      description: "See instant financial and operational impact of every resource decision before you make it."
    }
  ];

  return (
    <div id="benefits" className="py-24 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-purple-100 rounded-full text-purple-600 font-semibold text-sm mb-6">
            💡 What Sets Us Apart
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            More Than Records and To-Do Lists
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            While others just track what you've done, BareResource tells you what to do next. 
            Transform raw data into strategic decisions with intelligent insights that drive results.
          </p>
        </div>
        
        {/* Benefits Grid */}
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          {benefits.map((benefit, index) => (
            <div key={index} className="flex gap-6 group">
              <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-purple-100 to-blue-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                {benefit.icon}
              </div>
              <div className="space-y-3">
                <h3 className="text-xl font-bold text-gray-900">
                  {benefit.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            </div>
          ))}
        </div>
        
        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <div className="inline-flex items-center gap-2 text-purple-600 font-semibold">
            <Zap className="w-5 h-5" />
            <span>Ready to move beyond spreadsheets and manual planning?</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Benefits;
