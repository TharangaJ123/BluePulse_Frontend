import React from 'react';
import { motion } from "framer-motion";

const WhySelectUsSection = () => {
  return (
    <div className="mt-12 py-16 px-6 md:px-12 lg:px-24">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12 justify-center">
        {/* Image Section (Left Side) */}
        <motion.div
         initial={{opacity:0,x:-50}}
         whileInView={{opacity:1,x:0}}
         transition={{duration:0.8}}
         className="w-7xl lg:w-1/2">
          <img
            src="../src/assets/FAO_Knowat22.jpg" // Replace with your image path
            alt="Why Choose Us"
            className="w-7xl h-140"
          />
        </motion.div>

        {/* Text Section (Right Side) */}
        <motion.div
        initial={{opacity:0,x:+50}}
        whileInView={{opacity:1,x:0}}
        transition={{duration:0.8}}
        className="w-full lg:w-1/2">
          <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-6">
            Why Select Us?
          </h2>

          {/* List of Reasons */}
          <ul className="space-y-4 text-gray-700">
            <li className="flex items-start">
              <span className="text-green-500 mr-3">✔</span>
              <span className="flex-1">
                <strong>Innovative Technology:</strong> State-of-the-art water purification systems designed for efficiency and sustainability.
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-3">✔</span>
              <span className="flex-1">
                <strong>Expert Team:</strong> Certified professionals with decades of experience in water purification.
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-3">✔</span>
              <span className="flex-1">
                <strong>Custom Solutions:</strong> Tailored systems to meet your specific needs, whether residential, commercial, or industrial.
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-3">✔</span>
              <span className="flex-1">
                <strong>Eco-Friendly:</strong> Commitment to reducing environmental impact through sustainable practices.
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-3">✔</span>
              <span className="flex-1">
                <strong>Proven Track Record:</strong> Trusted by thousands of satisfied customers worldwide.
              </span>
            </li>
          </ul>

          <div className="w-full flex justify-center">
            <div className="justify-center flex flex-col align-middle text-center">
              <button className="bg-blue-950 mt-10 p-3 rounded-2xl w-50 hover:bg-blue-700">Make a Reservation</button>
            </div>
          </div>

        </motion.div>
      </div>
    </div>
  );
};

export default WhySelectUsSection;