
import { CheckCircle, Target, Zap, AlertTriangle, Brain, TrendingUp, Users, Calendar } from 'lucide-react';

const Benefits = () => {
  const benefits = [
    {
      icon: <Brain className="w-6 h-6 text-purple-600" />,
      title: "AI Tells You When to Hire",
      description: "Stop guessing if you need more people. Get specific recommendations: 'Based on your pipeline, hire 1 senior designer by March to avoid bottlenecks.'",
      premium: true
    },
    {
      icon: <TrendingUp className="w-6 h-6 text-purple-600" />,
      title: "Early Pipeline Warnings",
      description: "AI spots when you're running low on work before it hits your bank account. 'Utilization dropping to 60% - time to prospect 3 new clients.'",
      premium: true
    },
    {
      icon: <AlertTriangle className="w-6 h-6 text-purple-600" />,
      title: "No More Burnout Surprises",
      description: "AI flags when team members hit dangerous utilization levels. Prevent quality issues and turnover before they happen."
    },
    {
      icon: <Target className="w-6 h-6 text-purple-600" />,
      title: "Smart Capacity Planning",
      description: "Know exactly how much new work you can take on. AI calculates your true available capacity, accounting for holidays and leave."
    }
  ];

  return (
    <div id="benefits" className="py-16 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center px-3 py-1 bg-red-100 rounded-full text-red-600 font-semibold text-sm mb-4">
            🎯 Business Intelligence You Can Act On
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold mb-4 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            Stop Flying Blind. Get AI-Powered Insights.
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Excel tells you what happened. BareResource's AI tells you what to do next. 
            Get specific, actionable recommendations based on your actual team data.
          </p>
        </div>
        
        {/* Benefits Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {benefits.map((benefit, index) => (
            <div key={index} className="flex gap-4 group">
              <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-purple-100 to-blue-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 relative">
                {benefit.premium && (
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center">
                    <Brain className="w-2 h-2 text-gray-900" />
                  </div>
                )}
                {benefit.icon}
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-gray-900">
                    {benefit.title}
                  </h3>
                  {benefit.premium && (
                    <span className="bg-gradient-to-r from-yellow-400 to-orange-400 text-gray-900 px-2 py-1 rounded-full font-bold text-xs">
                      AI
                    </span>
                  )}
                </div>
                <p className="text-gray-600 leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            </div>
          ))}
        </div>
        
        {/* AI Examples Section */}
        <div className="mt-16 grid lg:grid-cols-2 gap-8">
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-bold text-green-900">Hiring Intelligence</h3>
              <span className="bg-green-500 text-white px-2 py-1 rounded-full font-bold text-xs">AI</span>
            </div>
            <div className="bg-white/70 p-4 rounded-lg border border-green-200">
              <p className="text-sm text-green-800 italic">
                "Your team has been at 85%+ utilization for 3 weeks. Based on your current pipeline, 
                I recommend hiring 1 mid-level designer within 30 days to prevent bottlenecks on the Johnson rebranding project."
              </p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-sky-50 rounded-2xl p-6 border border-blue-200">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                <Calendar className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-bold text-blue-900">Pipeline Alerts</h3>
              <span className="bg-blue-500 text-white px-2 py-1 rounded-full font-bold text-xs">AI</span>
            </div>
            <div className="bg-white/70 p-4 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-800 italic">
                "Team utilization will drop to 45% in 6 weeks when current projects wrap up. 
                Consider prospecting 2-3 new clients now to maintain 70-80% target utilization."
              </p>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-12">
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl p-8 max-w-3xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Stop Making Business Decisions in the Dark
            </h3>
            <p className="text-gray-600 mb-6">
              "I wish I'd known we needed to hire someone two months ago. Now we're scrambling, 
              turning down work, and burning out our best people. Our Excel sheet never warned us this was coming."
            </p>
            <p className="text-sm text-gray-500 italic mb-4">
              - Every studio owner we've talked to
            </p>
            <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-yellow-400 to-orange-400 text-gray-900 rounded-full font-bold text-sm">
              <Brain className="w-4 h-4 mr-2" />
              BareResource's AI prevents this scenario
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Benefits;
