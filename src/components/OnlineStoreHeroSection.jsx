import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function WaterSolutionsHero() {
  return (
    <div className="relative w-full h-[50vh] bg-gradient-to-br from-blue-900 to-cyan-700 flex items-center">
      {/* Content Container */}
      <div className="container mx-auto px-6 z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-2xl"
        >
          {/* Tagline */}
          <p className="text-cyan-300 font-medium mb-4">Premium Water Solutions</p>
          
          {/* Main Heading */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            Pure Water. <span className="text-cyan-200">Healthy Life.</span>
          </h1>
          
          {/* Description */}
          <p className="text-lg text-blue-100 mb-8 max-w-lg">
            Discover our advanced purification systems and professional water testing services for your home or business.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className="bg-cyan-500 hover:bg-cyan-600 text-white font-semibold py-3 px-8 rounded-lg transition-colors"
            >
              <a href="#explore-section" className="text-white">Shop Now</a>
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className="bg-transparent border-2 border-white text-white hover:bg-white/10 font-semibold py-3 px-8 rounded-lg transition-colors"
            >
              <Link to="/WaterTesting" className="text-white">Free Water Test</Link> 
            </motion.button>
          </div>
        </motion.div>
      </div>

      {/* Water Drop Image */}
      <motion.div 
        className="absolute right-10 bottom-10 opacity-80"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.8, scale: 1 }}
        transition={{ delay: 0.5, duration: 1 }}
      >
        <img 
          src="../src/assets/shop_hero.png" 
          alt="Water drop" 
          className="w-220 h-90 object-contain"
        />
      </motion.div>

      {/* Optional: Add a subtle reflection effect */}
      <div className="absolute inset-0 bg-gradient-to-t from-blue-900/30 to-transparent pointer-events-none"></div>
    </div>
  );
}