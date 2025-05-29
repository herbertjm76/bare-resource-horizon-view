
import { CheckCircle, Target, Zap, AlertTriangle } from 'lucide-react';

const Benefits = () => {
  const benefits = [
    {
      icon: <AlertTriangle className="w-6 h-6 text-purple-600" />,
      title: "No More Version Chaos",
      description: "Stop playing 'find the latest spreadsheet'. Everyone works from the same live data, always."
    },
    {
      icon: <Target className="w-6 h-6 text-purple-600" />,
      title: "See Overallocations Instantly",
      description: "Spot when someone's booked 60 hours in a 40-hour week before it becomes a crisis."
    },
    {
      icon: <Zap className="w-6 h-6 text-purple-600" />,
      title: "Update Once, See Everywhere",
      description: "Change a project deadline and watch everything else automatically adjust. No broken formulas."
    },
    {
      icon: <CheckCircle className="w-6 h-6 text-purple-600" />,
      title: "Actually Know Your Capacity",
      description: "Get real answers to 'can we take on this project?' instead of spreadsheet guesswork."
    }
  ];

  return (
    <div id="benefits" className="py-16 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center px-3 py-1 bg-red-100 rounded-full text-red-600 font-semibold text-sm mb-4">
            😤 Spreadsheet Problems, Solved
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold mb-4 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            Fix What's Broken With Excel
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            We know exactly what's driving you crazy about spreadsheet-based resource planning. 
            Here's how we fix it.
          </p>
        </div>
        
        {/* Benefits Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {benefits.map((benefit, index) => (
            <div key={index} className="flex gap-4 group">
              <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-purple-100 to-blue-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                {benefit.icon}
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-gray-900">
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
        <div className="text-center mt-12">
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl p-8 max-w-3xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Sound Familiar?
            </h3>
            <p className="text-gray-600 mb-6">
              "We spend more time updating our resource spreadsheet than actually planning projects. 
              Half the team doesn't trust the numbers, and I'm always worried we're double-booking people."
            </p>
            <p className="text-sm text-gray-500 italic">
              - Every studio manager we've ever talked to
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Benefits;
