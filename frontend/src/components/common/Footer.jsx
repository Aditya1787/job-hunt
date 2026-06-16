import React from 'react';
import { Link } from 'react-router-dom';
import { FiGithub, FiLinkedin, FiTwitter, FiHeart } from 'react-icons/fi';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 dark:bg-slate-950 border-t border-slate-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Logo & Slogan Column */}
          <div className="flex flex-col gap-4">
            <Link to="/" className="flex items-center gap-2">
              <span className="h-8 w-8 rounded-lg bg-gradient-to-tr from-primary to-accent flex items-center justify-center text-white font-extrabold text-lg">
                C
              </span>
              <span className="font-sans font-extrabold text-lg tracking-tight text-white">
                Career<span className="text-primary-light">Connect</span>
              </span>
            </Link>
            <p className="text-sm text-slate-400">
              AI-powered hiring matches. Find the right talent or secure your next role with smart recommendations.
            </p>
            <div className="flex items-center gap-4 mt-2">
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-primary-light transition">
                <FiLinkedin className="w-5 h-5" />
              </a>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition">
                <FiGithub className="w-5 h-5" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-primary-light transition">
                <FiTwitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick links Column */}
          <div>
            <h3 className="text-white font-semibold text-sm tracking-wider uppercase mb-4">Quick Links</h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/" className="hover:text-white transition">Search Jobs</Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-white transition">About Us</Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white transition">Contact Support</Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-white transition">FAQs</Link>
              </li>
            </ul>
          </div>

          {/* Resources Column */}
          <div>
            <h3 className="text-white font-semibold text-sm tracking-wider uppercase mb-4">For Users</h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/candidate/profile" className="hover:text-white transition">Candidate Portal</Link>
              </li>
              <li>
                <Link to="/company/post-job" className="hover:text-white transition">Recruiter Portal</Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-white transition">Sign In</Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-white transition">Register Account</Link>
              </li>
            </ul>
          </div>

          {/* Legal / Contact Info */}
          <div>
            <h3 className="text-white font-semibold text-sm tracking-wider uppercase mb-4">Legal</h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/privacy-policy" className="hover:text-white transition">Privacy Policy</Link>
              </li>
              <li>
                <Link to="/terms-conditions" className="hover:text-white transition">Terms & Conditions</Link>
              </li>
              <li className="text-xs text-slate-500 pt-2">
                Address: 100 Tech Plaza, San Francisco, CA
              </li>
              <li className="text-xs text-slate-500">
                Email: support@careerconnect.dev
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-800 mt-12 pt-6 flex flex-col md:flex-row justify-between items-center text-xs text-slate-500 gap-4">
          <div>
            &copy; {new Date().getFullYear()} CareerConnect. All rights reserved.
          </div>
          <div className="flex items-center gap-1">
            Made with <FiHeart className="w-3 h-3 text-rose-500 fill-current" /> for modern builders.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
