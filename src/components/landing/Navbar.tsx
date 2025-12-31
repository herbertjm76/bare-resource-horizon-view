
import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const handleSectionClick = (sectionId: string) => {
    setMobileMenuOpen(false);
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

  const handleNavigation = (path: string) => {
    setMobileMenuOpen(false);
    navigate(path);
  };

  return (
    <nav className="fixed w-full bg-white shadow-md z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center hover:opacity-90 transition-opacity">
            <img src="/lovable-uploads/ed04e6a3-39d3-470c-8f3f-7b02984281bc.png" alt="BareResource Logo" className="w-[40px] h-[28px] sm:w-[50px] sm:h-[36px] mr-2" />
            <span className="text-xl sm:text-2xl font-semibold">
              <span className="text-black">Bare</span>
              <span className="bg-gradient-to-r from-landing-gradient-1 via-landing-gradient-2 to-landing-gradient-3 bg-clip-text text-transparent">Resource</span>
            </span>
          </Link>
          
          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-8 text-gray-700">
            <button 
              onClick={() => handleSectionClick('features')} 
              className="hover:text-brand-primary transition-colors cursor-pointer"
            >
              Features
            </button>
            <Link 
              to="/solutions"
              className="hover:text-brand-primary transition-colors cursor-pointer"
            >
              Solutions
            </Link>
            <Link 
              to="/app-tour"
              className="hover:text-brand-primary transition-colors cursor-pointer"
            >
              App Tour
            </Link>
            <Link 
              to="/pricing"
              className="hover:text-brand-primary transition-colors cursor-pointer"
            >
              Pricing
            </Link>
          </div>
          
          {/* CTA Buttons - Desktop */}
          <div className="hidden md:flex items-center gap-4">
            <button
              onClick={() => navigate('/auth')}
              className="text-gray-700 hover:text-brand-primary transition-colors text-sm font-medium"
            >
              Sign In
            </button>
            <button 
              onClick={() => navigate('/auth')}
              className="bg-gradient-to-r from-landing-gradient-1 via-landing-gradient-2 to-landing-gradient-3 text-white px-4 sm:px-6 py-2 rounded-lg font-medium hover:opacity-90 transition-opacity shadow-lg text-sm sm:text-base"
            >
              Get Started
            </button>
          </div>

          {/* Mobile Menu Button + CTA */}
          <div className="flex md:hidden items-center gap-2">
            <button 
              onClick={() => navigate('/auth')}
              className="bg-gradient-to-r from-landing-gradient-1 via-landing-gradient-2 to-landing-gradient-3 text-white px-3 py-1.5 rounded-lg font-medium text-xs"
            >
              Get Started
            </button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="h-9 w-9"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-100 py-4 space-y-4 animate-fade-in">
            <button 
              onClick={() => handleSectionClick('features')} 
              className="block w-full text-left px-2 py-2 text-gray-700 hover:text-brand-primary hover:bg-gray-50 rounded-lg transition-colors"
            >
              Features
            </button>
            <button 
              onClick={() => handleNavigation('/solutions')}
              className="block w-full text-left px-2 py-2 text-gray-700 hover:text-brand-primary hover:bg-gray-50 rounded-lg transition-colors"
            >
              Solutions
            </button>
            <button 
              onClick={() => handleNavigation('/app-tour')}
              className="block w-full text-left px-2 py-2 text-gray-700 hover:text-brand-primary hover:bg-gray-50 rounded-lg transition-colors"
            >
              App Tour
            </button>
            <button 
              onClick={() => handleNavigation('/pricing')}
              className="block w-full text-left px-2 py-2 text-gray-700 hover:text-brand-primary hover:bg-gray-50 rounded-lg transition-colors"
            >
              Pricing
            </button>
            <div className="border-t border-gray-100 pt-4">
              <button
                onClick={() => handleNavigation('/auth')}
                className="block w-full text-left px-2 py-2 text-gray-700 hover:text-brand-primary hover:bg-gray-50 rounded-lg transition-colors"
              >
                Sign In
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
