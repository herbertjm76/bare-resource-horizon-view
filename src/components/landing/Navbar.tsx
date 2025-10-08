
import { Link, useLocation, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const handleSectionClick = (sectionId: string) => {
    if (location.pathname === '/') {
      // If on main page, scroll to section
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
      }
    } else {
      // If on different page, navigate to main page with hash
      navigate(`/#${sectionId}`);
    }
  };

  return (
    <nav className="fixed w-full bg-white shadow-md z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center hover:opacity-90 transition-opacity">
            <img src="/lovable-uploads/ed04e6a3-39d3-470c-8f3f-7b02984281bc.png" alt="BareResource Logo" className="w-[50px] h-[36px] mr-2" />
            <span className="text-2xl font-semibold">
              <span className="text-black">Bare</span>
              <span className="bg-gradient-to-r from-[#895CF7] via-[#5669F7] to-[#E64FC4] bg-clip-text text-transparent">Resource</span>
            </span>
          </Link>
          
          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8 text-gray-700">
            <button 
              onClick={() => handleSectionClick('features')} 
              className="hover:text-purple-600 transition-colors cursor-pointer"
            >
              Features
            </button>
            <Link 
              to="/solutions"
              className="hover:text-purple-600 transition-colors cursor-pointer"
            >
              Solutions
            </Link>
            <Link 
              to="/app-tour"
              className="hover:text-purple-600 transition-colors cursor-pointer"
            >
              App Tour
            </Link>
            <Link 
              to="/pricing"
              className="hover:text-purple-600 transition-colors cursor-pointer"
            >
              Pricing
            </Link>
          </div>
          
          {/* CTA Button */}
          <button 
            onClick={() => navigate('/auth')}
            className="bg-gradient-to-r from-[#895CF7] via-[#5669F7] to-[#E64FC4] text-white px-4 sm:px-6 py-2 rounded-lg font-medium hover:opacity-90 transition-opacity shadow-lg text-sm sm:text-base"
          >
            Start Free Trial
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
