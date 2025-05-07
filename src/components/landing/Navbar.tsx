
import { Link } from 'react-router-dom';
const Navbar = () => {
  return <nav className="fixed w-full bg-white shadow-md z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <div className="flex items-center">
            <img src="/lovable-uploads/ed04e6a3-39d3-470c-8f3f-7b02984281bc.png" alt="BareResource Logo" className="w-[50px] h-[36px] mr-2" />
            <span className="text-2xl font-semibold">
              <span className="text-black">Bare</span>
              <span className="bg-gradient-to-r from-[#895CF7] via-[#5669F7] to-[#E64FC4] bg-clip-text text-transparent">Resource</span>
            </span>
          </div>
          
          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8 text-gray-700">
            <Link to="#features" className="hover:text-purple-600 transition-colors">Features</Link>
            <Link to="#benefits" className="hover:text-purple-600 transition-colors">Benefits</Link>
            <Link to="#testimonials" className="hover:text-purple-600 transition-colors">Testimonials</Link>
            <Link to="#pricing" className="hover:text-purple-600 transition-colors">Pricing</Link>
          </div>
          
          {/* Auth Buttons */}
          <div className="flex items-center gap-3">
            <Link to="/auth" className="text-gray-700 hover:text-purple-600 transition-colors font-medium">
              Sign In
            </Link>
            <Link to="/auth?signup=true" className="bg-gradient-to-r from-[#895CF7] via-[#5669F7] to-[#E64FC4] text-white px-4 sm:px-6 py-2 rounded-lg font-medium hover:opacity-90 transition-opacity shadow-lg text-sm sm:text-base">
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </nav>;
};
export default Navbar;
