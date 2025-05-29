
import { Link } from 'react-router-dom';
import { Facebook, Linkedin, Twitter, Instagram } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-[#1A1F2C] text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Footer Content */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand Column */}
          <div className="col-span-2 md:col-span-1 space-y-4">
            <h3 className="text-xl font-semibold mb-3">BareResource</h3>
            <p className="text-gray-400 text-sm">
              Intuitive resource management for modern companies
            </p>
            <div className="flex space-x-3 pt-2">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Linkedin className="w-4 h-4" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Product Column */}
          <div>
            <h4 className="font-semibold mb-3">Product</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="#" className="text-gray-400 hover:text-white transition-colors">Features</Link></li>
              <li><Link to="#" className="text-gray-400 hover:text-white transition-colors">Pricing</Link></li>
              <li><Link to="#" className="text-gray-400 hover:text-white transition-colors">Security</Link></li>
              <li><Link to="#" className="text-gray-400 hover:text-white transition-colors">Roadmap</Link></li>
            </ul>
          </div>

          {/* Company Column */}
          <div>
            <h4 className="font-semibold mb-3">Company</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="#" className="text-gray-400 hover:text-white transition-colors">About</Link></li>
              <li><Link to="#" className="text-gray-400 hover:text-white transition-colors">Careers</Link></li>
              <li><Link to="#" className="text-gray-400 hover:text-white transition-colors">Blog</Link></li>
              <li><Link to="#" className="text-gray-400 hover:text-white transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Resources Column */}
          <div>
            <h4 className="font-semibold mb-3">Resources</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="#" className="text-gray-400 hover:text-white transition-colors">Documentation</Link></li>
              <li><Link to="#" className="text-gray-400 hover:text-white transition-colors">Support</Link></li>
              <li><Link to="#" className="text-gray-400 hover:text-white transition-colors">FAQ</Link></li>
              <li><Link to="#" className="text-gray-400 hover:text-white transition-colors">Community</Link></li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="border-t border-gray-800 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © 2023 BareResource. All rights reserved.
          </p>
          <div className="flex space-x-4 mt-3 md:mt-0">
            <Link to="/privacy-policy" className="text-gray-400 hover:text-white text-sm transition-colors">
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
