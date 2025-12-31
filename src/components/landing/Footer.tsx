
import { Link } from 'react-router-dom';
import { Facebook, Linkedin, Twitter, Instagram } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-landing-footer text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Footer Content */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand Column */}
          <div className="col-span-2 md:col-span-1 space-y-4">
            <h3 className="text-xl font-semibold mb-3">BareResource</h3>
            <p className="text-white/60 text-sm">
              The Excel replacement for design teams who want to focus on great work, not spreadsheets.
            </p>
            <div className="flex space-x-3 pt-2">
              <a href="#" className="text-white/60 hover:text-white transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="text-white/60 hover:text-white transition-colors">
                <Linkedin className="w-4 h-4" />
              </a>
              <a href="#" className="text-white/60 hover:text-white transition-colors">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="text-white/60 hover:text-white transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Product Column */}
          <div>
            <h4 className="font-semibold mb-3">Product</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="#" className="text-white/60 hover:text-white transition-colors">Excel vs BareResource</Link></li>
              <li><Link to="#" className="text-white/60 hover:text-white transition-colors">Pricing</Link></li>
              <li><Link to="#" className="text-white/60 hover:text-white transition-colors">Import from Excel</Link></li>
              <li><Link to="#" className="text-white/60 hover:text-white transition-colors">Case Studies</Link></li>
            </ul>
          </div>

          {/* Support Column */}
          <div>
            <h4 className="font-semibold mb-3">Support</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="#" className="text-white/60 hover:text-white transition-colors">Getting Started</Link></li>
              <li><Link to="#" className="text-white/60 hover:text-white transition-colors">Help Center</Link></li>
              <li><Link to="#" className="text-white/60 hover:text-white transition-colors">Video Tutorials</Link></li>
              <li><Link to="#" className="text-white/60 hover:text-white transition-colors">Contact Support</Link></li>
            </ul>
          </div>

          {/* Company Column */}
          <div>
            <h4 className="font-semibold mb-3">Company</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="#" className="text-white/60 hover:text-white transition-colors">About</Link></li>
              <li><Link to="#" className="text-white/60 hover:text-white transition-colors">Blog</Link></li>
              <li><Link to="#" className="text-white/60 hover:text-white transition-colors">Careers</Link></li>
              <li><Link to="#" className="text-white/60 hover:text-white transition-colors">Contact</Link></li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="border-t border-white/20 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-white/60 text-sm">
            © 2023 BareResource. Built by designers, for designers.
          </p>
          <div className="flex space-x-4 mt-3 md:mt-0">
            <Link to="/privacy-policy" className="text-white/60 hover:text-white text-sm transition-colors">
              Privacy Policy
            </Link>
            <Link to="#" className="text-white/60 hover:text-white text-sm transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
