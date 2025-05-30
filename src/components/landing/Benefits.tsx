
import { CheckCircle, Target, Zap, AlertTriangle, Brain, TrendingUp, Users, Calendar, ArrowRight, Lightbulb, Shield } from 'lucide-react';

const Benefits = () => {
  const benefits = [
    {
      icon: <Brain className="w-8 h-8 text-purple-600" />,
      title: "AI Hiring Alerts",
      description: "Get specific recommendations on when to expand your team",
      example: "Hire 1 senior designer by March",
      color: "from-purple-500 to-blue-500",
      premium: true
    },
    {
      icon: <TrendingUp className="w-8 h-8 text-blue-600" />,
      title: "Pipeline Intelligence", 
      description: "Early warnings when you need more projects",
      example: "Prospect 3 new clients now",
      color: "from-blue-500 to-cyan-500",
      premium: true
    },
    {
      icon: <Shield className="w-8 h-8 text-green-600" />,
      title: "Burnout Prevention",
      description: "Prevent team overload before it happens",
      example: "Team at 95% capacity risk",
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: <Target className="w-8 h-8 text-orange-600" />,
      title: "Smart Capacity Planning",
      description: "Know exactly how much work you can take on",
      example: "32 hours available this week",
      color: "from-orange-500 to-red-500"
    }
  ];

  return (
    <div id="benefits" className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-red-100 rounded-full text-red-600 font-semibold text-sm mb-6">
            <Lightbulb className="w-4 h-4 mr-2" />
            Stop Flying Blind
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            Get AI-Powered Insights
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Excel tells you what happened. BareResource's AI tells you what to do next.
          </p>
        </div>
        
        {/* Benefits Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {benefits.map((benefit, index) => (
            <div key={index} className="group relative">
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 h-full">
                {benefit.premium && (
                  <div className="absolute -top-3 -right-3">
                    <div className="bg-gradient-to-r from-yellow-400 to-orange-400 text-gray-900 px-3 py-1 rounded-full font-bold text-xs flex items-center gap-1 shadow-lg">
                      <Brain className="w-3 h-3" />
                      AI
                    </div>
                  </div>
                )}
                
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${benefit.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <div className="text-white">
                    {benefit.icon}
                  </div>
                </div>
                
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {benefit.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  {benefit.description}
                </p>
                
                <div className="bg-gray-50 rounded-lg p-3 border-l-4 border-purple-500">
                  <p className="text-xs font-medium text-gray-700 italic">
                    "{benefit.example}"
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Visual Comparison */}
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-3xl p-8 lg:p-12 relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-purple-200/30 to-blue-200/30 rounded-full blur-3xl"></div>
          
          <div className="relative">
            <div className="text-center mb-8">
              <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">
                From Reactive to Proactive
              </h3>
            </div>
            
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              {/* Before */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-red-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center">
                    <AlertTriangle className="w-5 h-5 text-white" />
                  </div>
                  <h4 className="font-bold text-gray-900">With Excel</h4>
                </div>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• "We're overwhelmed, need help now!"</li>
                  <li>• "Why did we lose that client?"</li>
                  <li>• "Is Sarah about to burn out?"</li>
                </ul>
              </div>

              {/* Arrow */}
              <div className="flex justify-center lg:justify-start">
                <ArrowRight className="w-8 h-8 text-purple-600" />
              </div>

              {/* After */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-green-200 lg:col-start-2 lg:row-start-1">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                    <Brain className="w-5 h-5 text-white" />
                  </div>
                  <h4 className="font-bold text-gray-900">With BareResource AI</h4>
                </div>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• "Hire 1 designer by March 15th"</li>
                  <li>• "Prospect 2 clients this week"</li>
                  <li>• "Sarah at 95% - assign backup"</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Benefits;
