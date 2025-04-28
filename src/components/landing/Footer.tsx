
import { Link } from 'react-router-dom';
import { Facebook, Linkedin, Twitter, Instagram } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-[#1A1F2C] text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand Column */}
          <div className="space-y-4">
            <h3 className="text-2xl font-semibold mb-4">BareResource</h3>
            <p className="text-gray-400">
              Intuitive resource management for modern companies
            </p>
            <div className="flex space-x-4 pt-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Product Column */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Product</h4>
            <ul className="space-y-2">
              <li><Link to="#" className="text-gray-400 hover:text-white transition-colors">Features</Link></li>
              <li><Link to="#" className="text-gray-400 hover:text-white transition-colors">Pricing</Link></li>
              <li><Link to="#" className="text-gray-400 hover:text-white transition-colors">Security</Link></li>
              <li><Link to="#" className="text-gray-400 hover:text-white transition-colors">Roadmap</Link></li>
            </ul>
          </div>

          {/* Company Column */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Company</h4>
            <ul className="space-y-2">
              <li><Link to="#" className="text-gray-400 hover:text-white transition-colors">About Us</Link></li>
              <li><Link to="#" className="text-gray-400 hover:text-white transition-colors">Careers</Link></li>
              <li><Link to="#" className="text-gray-400 hover:text-white transition-colors">Blog</Link></li>
              <li><Link to="#" className="text-gray-400 hover:text-white transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Resources Column */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Resources</h4>
            <ul className="space-y-2">
              <li><Link to="#" className="text-gray-400 hover:text-white transition-colors">Documentation</Link></li>
              <li><Link to="#" className="text-gray-400 hover:text-white transition-colors">Support</Link></li>
              <li><Link to="#" className="text-gray-400 hover:text-white transition-colors">FAQ</Link></li>
              <li><Link to="#" className="text-gray-400 hover:text-white transition-colors">Community</Link></li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © 2023 BareResource. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link to="#" className="text-gray-400 hover:text-white text-sm transition-colors">
              Privacy Policy
            </Link>
            <Link to="#" className="text-gray-400 hover:text-white text-sm transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

