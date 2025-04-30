import React from "react";
import { Link } from "react-router-dom";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaCcVisa, FaCcMastercard, FaCcPaypal } from "react-icons/fa";

export default function ModernFooter() {
  return (
    <footer className="bg-gray-900 text-white pt-12 pb-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start gap-8">
          {/* Left section - Logo and description */}
          <div className="flex-1 max-w-md">
            <div className="flex items-center mb-4">
              <img 
                src="../src/assets/bplogo.png" 
                alt="BluePulse Logo" 
                className="h-10 mr-3"
              />
              <span className="text-2xl font-bold text-blue-400">BluePulse</span>
            </div>
            <p className="text-gray-400 mb-6">
              Providing clean water solutions for healthier lives. Our products are designed to deliver purity you can trust.
            </p>
          </div>

          {/* Right section - Links in columns */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 w-full md:w-auto">
            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-blue-400">Quick Links</h3>
              <ul className="space-y-2">
                <li><Link to={"/"} className="text-gray-400 hover:text-white transition-colors">Home</Link></li>
                
                <li><li><Link to={"/onlineStoreHome"} className="text-gray-400 hover:text-white transition-colors">Products</Link></li></li>
                <li><Link to={"/WaterTesting"} className="text-gray-400 hover:text-white transition-colors">Water Testing</Link></li>
                <li><Link to={"/#feedback-form"} className="text-gray-400 hover:text-white transition-colors">Contact</Link></li>
              </ul>
            </div>

            {/* Products */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-blue-400">Products</h3>
              <ul className="space-y-2">
                <li><Link to={"/onlineStoreHome_spareparts"} className="text-gray-400 hover:text-white transition-colors">Spare Parts</Link></li>
                <li><Link to={"/onlineStoreHome_purificationitems"} className="text-gray-400 hover:text-white transition-colors">Purification Systems</Link></li>
                <li><Link to={"/onlineStoreHome_testkits"} className="text-gray-400 hover:text-white transition-colors">Test Kits</Link></li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-blue-400">Support</h3>
              <ul className="space-y-2">
                <li><Link to={"/faqs"} className="text-gray-400 hover:text-white transition-colors">FAQs</Link></li>
                
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-blue-400">Contact</h3>
              <ul className="space-y-2">
                <li className="text-gray-400">Minuwangoda Road,Gampaha</li>
                <li className="text-gray-400">+94 37 695 4879</li>
                <li className="text-gray-400">support@bluepulse.com</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 my-8"></div>

        {/* Bottom section */}
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="text-gray-500 text-sm mb-4 md:mb-0">
            © {new Date().getFullYear()} BluePulse. All rights reserved.
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex space-x-2">
              <FaCcVisa size={24} className="text-gray-400" />
              <FaCcMastercard size={24} className="text-gray-400" />
              <FaCcPaypal size={24} className="text-gray-400" />
            </div>
            <div className="flex space-x-4 text-sm">
              <a href="#" className="text-gray-500 hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="text-gray-500 hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="text-gray-500 hover:text-white transition-colors">Cookies</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}