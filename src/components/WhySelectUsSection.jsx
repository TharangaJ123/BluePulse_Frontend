import React from 'react';
import { motion } from "framer-motion";
import { 
  CheckBadgeIcon, 
  LightBulbIcon, 
  UserGroupIcon, 
  Cog6ToothIcon, 
  ChartBarIcon,
  ShieldCheckIcon 
} from "@heroicons/react/24/solid";
import { Link } from 'react-router-dom';

const WhySelectUsSection = () => {
  const features = [
    {
      icon: <LightBulbIcon className="h-6 w-6 text-blue-500" />,
      title: "Innovative Technology",
      description: "State-of-the-art water purification systems designed for maximum efficiency and sustainability."
    },
    {
      icon: <UserGroupIcon className="h-6 w-6 text-blue-500" />,
      title: "Expert Team",
      description: "Certified professionals with decades of combined experience in water treatment solutions."
    },
    {
      icon: <Cog6ToothIcon className="h-6 w-6 text-blue-500" />,
      title: "Custom Solutions",
      description: "Tailored systems to meet your specific residential, commercial, or industrial needs."
    },
    {
      icon: <ShieldCheckIcon className="h-6 w-6 text-blue-500" />, // Replaced LeafIcon
      title: "Eco-Friendly",
      description: "Sustainable practices that reduce environmental impact while delivering pure water."
    },
    {
      icon: <ChartBarIcon className="h-6 w-6 text-blue-500" />,
      title: "Proven Results",
      description: "Trusted by thousands of customers with verified water quality improvements."
    }
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-blue-50" id='why-choose-us'>
      <div className="max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Why Choose <span className="text-blue-600">BluePulse</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Delivering exceptional water solutions through innovation, expertise, and commitment to quality.
          </p>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-12 xl:gap-16 items-center">
          {/* Image Section */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="w-full lg:w-1/2 rounded-2xl overflow-hidden shadow-xl"
          >
            <img
              src="../src/assets/FAO_Knowat22.jpg" // Replace with your image
              alt="Water purification technology"
              className="w-full h-auto object-cover rounded-2xl transform hover:scale-105 transition duration-700"
            />
          </motion.div>

          {/* Features Section */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="w-full lg:w-1/2"
          >
            <div className="space-y-8">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  whileHover={{ y: -5 }}
                  className="flex items-start p-5 bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300"
                >
                  <div className="flex-shrink-0 p-3 bg-blue-50 rounded-lg mr-5">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="mt-12 text-center"
            >
              <button className="relative inline-flex items-center justify-center px-8 py-4 overflow-hidden font-medium text-white bg-blue-600 rounded-full group hover:bg-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl">
                <Link to="/ServiceRequest" className="relative z-10">Schedule a Consultation</Link>
                <span className="absolute inset-0 bg-blue-700 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              </button>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default WhySelectUsSection;