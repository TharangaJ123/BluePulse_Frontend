import React from 'react';
import { motion } from 'framer-motion';
import LandingImage from '../assets/landing.jpg'; 

export default function HeroSection() {
  return (
    <div>
      <div
        className="flex flex-col items-center justify-center h-screen text-center px-5"
        style={{ backgroundImage: `url(${LandingImage})` }}
      >
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-5xl font-extrabold text-amber-300"
        >
          Welcome to Our <span className="text-blue-500">Modern Website</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="mt-4 text-lg text-gray-300"
        >
          Professional solutions for modern businesses.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
          className="mt-6"
        >
          <button className="px-6 py-3 text-lg bg-blue-500 hover:bg-blue-600 transition-all rounded-lg">
            Get Started
          </button>
        </motion.div>
      </div>
    </div>
  );
}
