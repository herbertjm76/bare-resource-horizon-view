
import { Link } from 'react-router-dom';

const SignUpSection = () => {
  return (
    <div className="bg-gradient-to-r from-[#895CF7] via-[#5669F7] to-[#E64FC4] py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="text-center md:text-left">
            <h2 className="text-4xl font-bold text-white mb-4">
              Ready to transform your resource management?
            </h2>
            <p className="text-white/80 text-lg mb-6">
              Sign up for a free 14-day trial. No credit card required.
            </p>
            <Link 
              to="/auth?signup=true"
              className="inline-block bg-white text-purple-600 px-8 py-3 rounded-lg font-medium hover:bg-purple-50 transition-colors"
            >
              Start Free Trial
            </Link>
          </div>
          <div className="hidden md:block bg-white/10 backdrop-blur-sm p-8 rounded-2xl shadow-lg">
            <img 
              src="/lovable-uploads/3865e409-9078-4560-94f4-6eb9e546d8c1.png" 
              alt="Dashboard preview" 
              className="rounded-lg w-full shadow-lg"
            />
            <div className="mt-6 text-center">
              <h3 className="text-white text-xl font-semibold mb-2">Powerful Resource Intelligence</h3>
              <p className="text-white/80">
                Optimize team workload and improve project profitability with data-driven insights
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpSection;
