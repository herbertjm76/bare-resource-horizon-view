
const SignUpSection = () => {
  return (
    <div className="bg-gradient-to-r from-[#895CF7] via-[#5669F7] to-[#E64FC4] py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="text-center md:text-left">
            <h2 className="text-4xl font-bold text-white mb-4">
              Ready to transform your resource management?
            </h2>
            <p className="text-white/80 text-lg">
              Sign up for a free 14-day trial. No credit card required.
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm p-8 rounded-2xl shadow-lg">
            <form className="space-y-4">
              <input
                type="text"
                placeholder="Your Name"
                className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50"
              />
              <input
                type="email"
                placeholder="Your Email"
                className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50"
              />
              <input
                type="text"
                placeholder="Company Name"
                className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50"
              />
              <select
                className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white/70 focus:outline-none focus:ring-2 focus:ring-white/50"
              >
                <option value="">Company Size</option>
                <option value="1-10">1-10 employees</option>
                <option value="11-50">11-50 employees</option>
                <option value="51-200">51-200 employees</option>
                <option value="201+">201+ employees</option>
              </select>
              <button
                type="submit"
                className="w-full py-3 px-4 bg-white text-purple-600 rounded-lg font-medium hover:bg-purple-50 transition-colors"
              >
                Start Free Trial
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpSection;

