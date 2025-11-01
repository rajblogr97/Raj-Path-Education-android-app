

import React from 'react';
import { TwitterIcon, LinkedInIcon, FacebookIcon, ShieldCheckIcon } from './IconComponents';

const Footer: React.FC = () => {
  return (
    <footer className="bg-royal-blue text-white">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-gold-accent to-yellow-300 text-transparent bg-clip-text">Saumya Path</h2>
            <p className="mt-2 text-gray-300 text-sm">Empowering the next generation of leaders with the skills for tomorrow.</p>
          </div>
          <div>
            <h3 className="text-sm font-semibold tracking-wider uppercase">Quick Links</h3>
            <ul className="mt-4 space-y-2">
              <li><a href="#/my-courses" className="text-base text-gray-300 hover:text-white">My Courses</a></li>
              <li><a href="#/instructors" className="text-base text-gray-300 hover:text-white">Our Instructors</a></li>
              <li><a href="#/ats-checker" className="text-base text-gray-300 hover:text-white">ATS Checker</a></li>
              <li><a href="#/certificates" className="text-base text-gray-300 hover:text-white">Certificates</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold tracking-wider uppercase">Resources</h3>
            <ul className="mt-4 space-y-2">
              <li><a href="#/community" className="text-base text-gray-300 hover:text-white">Community</a></li>
              <li><a href="#/" className="text-base text-gray-300 hover:text-white">Success Stories</a></li>
              <li><a href="#" className="text-base text-gray-300 hover:text-white">Help Center</a></li>
              <li><a href="#" className="text-base text-gray-300 hover:text-white">Privacy Policy</a></li>
              <li><a href="#/app-size" className="text-base text-gray-300 hover:text-white">App Size</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold tracking-wider uppercase">Contact</h3>
            <ul className="mt-4 space-y-2 text-gray-300 text-sm">
              <li><p>123 Skill Avenue, Tech Park, Bengaluru, Karnataka, 560103</p></li>
              <li><p>contact@saumyapath.com</p></li>
              <li><p>+91 98765 43210</p></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-white/20 pt-8 flex flex-col md:flex-row items-center justify-between">
          <div className="flex flex-col md:flex-row items-center gap-x-6 gap-y-4">
            <p className="text-base text-gray-400">&copy; {new Date().getFullYear()} Saumya Path. All rights reserved.</p>
            <div className="flex items-center gap-2 text-sm text-green-300">
              <ShieldCheckIcon className="h-5 w-5" />
              <span>Android Secure System Verified</span>
            </div>
          </div>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-gray-400 hover:text-white"><TwitterIcon className="h-6 w-6" /></a>
            <a href="https://www.linkedin.com/company/saumyapath" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white"><LinkedInIcon className="h-6 w-6" /></a>
            <a href="#" className="text-gray-400 hover:text-white"><FacebookIcon className="h-6 w-6" /></a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;