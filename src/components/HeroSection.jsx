import React from 'react';
import { motion } from 'framer-motion';
import { FaArrowDown } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const HeroSection = () => {
  return (
    <div className="relative bg-gray-950 text-white h-screen flex items-center justify-center overflow-hidden">
      {/* Background with gradient overlay */}
      <div className="absolute inset-0">
        <div 
          className="absolute inset-0 bg-[url('./assets/landing.jpg')] bg-cover bg-center opacity-100"
          style={{
            backgroundPosition: 'center',
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat'
          }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-t from-blue-950/10 to-blue-800/30"></div>
      </div>

      {/* Content Container */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 md:px-12 lg:px-24 text-center">
        {/* Headline with animation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-white">
              Pure Water, 
            </span>{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-200">
              Healthy Life
            </span>
          </h1>
        </motion.div>

        {/* Subheadline with animation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <p className="text-xl md:text-2xl lg:text-3xl mb-10 max-w-3xl mx-auto text-blue-100 font-light">
            Innovative water purification systems for healthier homes, thriving businesses, and sustainable communities.
          </p>
        </motion.div>

        {/* Call-to-Action Buttons with animation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex flex-col sm:flex-row justify-center gap-6 mb-16"
        >
          <a
            href="#our-services"
            className="relative overflow-hidden group bg-white text-blue-900 font-bold py-4 px-10 rounded-full hover:bg-blue-50 transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            <span className="relative z-10">Explore Our Solutions</span>
            <span className="absolute inset-0 bg-gradient-to-r from-blue-400 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
          </a>
          <Link to="/WaterTesting"
            className="relative overflow-hidden group bg-transparent border-2 border-white text-white font-bold py-4 px-10 rounded-full hover:bg-white hover:text-blue-900 transition-all duration-300 transform hover:scale-105"
          >
            <span className="relative z-10">Free Water Analysis</span>
            <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></span>
          </Link>
        </motion.div>

        {/* Animated scroll indicator */}
        <motion.div
          initial={{ opacity: 0, y: 0 }}
          animate={{ opacity: 1, y: 10 }}
          transition={{ 
            duration: 1.5,
            repeat: Infinity,
            repeatType: 'reverse'
          }}
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
        >
          <a href="#why-choose-us" className="text-white hover:text-blue-300 transition-colors">
            <FaArrowDown size={24} />
          </a>
        </motion.div>

        {/* Water droplet decorative elements */}
        <div className="absolute -bottom-20 -left-20 w-40 h-40 rounded-full bg-blue-500/20 blur-xl"></div>
        <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full bg-blue-400/20 blur-xl"></div>
      </div>

      {/* Floating water drop elements */}
      <div className="absolute top-1/4 left-1/5 w-4 h-4 rounded-full bg-blue-300/50 animate-float1"></div>
      <div className="absolute top-1/3 right-1/4 w-3 h-3 rounded-full bg-blue-200/70 animate-float2"></div>
      <div className="absolute bottom-1/4 left-1/3 w-5 h-5 rounded-full bg-blue-400/40 animate-float3"></div>
    </div>
  );
};

export default HeroSection;