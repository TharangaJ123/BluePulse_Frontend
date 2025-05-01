import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function GoToShopSection() {
  return (
    <div className="relative bg-gradient-to-br from-blue-50 to-indigo-50 overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -left-20 w-96 h-96 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-indigo-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-24 sm:px-6 lg:px-8 relative z-10">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          {/* Left content - product showcase */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative"
          >
            <div className="relative rounded-2xl p-1 bg-gradient-to-r from-blue-400 to-indigo-500 shadow-2xl">
              <div className="bg-white rounded-xl p-6 shadow-inner">
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { 
                      name: "Premium Filters", 
                      tag: "NEW", 
                      img: '../src/assets/img1.jpg',
                      bg: "bg-blue-50"
                    },
                    { 
                      name: "Water Testing Kits", 
                      tag: "SALE", 
                      img: '../src/assets/wt_kits.jpg',
                      bg: "bg-indigo-50"
                    },
                    { 
                      name: "Spare Parts", 
                      tag: "HOT", 
                      img: '../src/assets/sp_parts.jpg',
                      bg: "bg-purple-50"
                    },
                    { 
                      name: "Tech Support", 
                      tag: "FREE", 
                      img: '../src/assets/tech_sup.jpeg',
                      bg: "bg-cyan-50"
                    },
                  ].map((item, index) => (
                    <motion.div 
                      key={index} 
                      whileHover={{ y: -5 }}
                      className={`${item.bg} p-4 rounded-xl border border-gray-200 hover:shadow-md transition-all`}
                    >
                      <div className="h-32 rounded-lg mb-3 flex items-center justify-center overflow-hidden">
                        <img 
                          src={item.img} 
                          alt={item.name}
                          className="w-full h-full object-cover transition-transform hover:scale-105"
                        />
                      </div>
                      <div className="font-medium text-gray-900">{item.name}</div>
                      {item.tag && (
                        <span className="inline-block mt-2 px-2.5 py-1 text-xs font-bold rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
                          {item.tag}
                        </span>
                      )}
                    </motion.div>
                  ))}
                </div>
                <div className="mt-6 text-center text-sm font-medium text-gray-500">
                  🔹 Limited stock available - shop now to avoid disappointment
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right content */}
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <span className="inline-block mb-4 px-3 py-1 text-sm font-semibold rounded-full bg-blue-100 text-blue-800">
                Premium Water Solutions
              </span>
              <h1 className="text-4xl md:text-5xl font-bold leading-tight text-gray-900">
                Elevate Your <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Water Experience</span>
              </h1>
              <p className="text-lg text-gray-600 mt-4">
                Discover our curated collection of water purification products designed for purity, performance, and peace of mind.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="space-y-5"
            >
              {[
                "Certified water purification technology",
                "Free lifetime technical support",
                "Fast nationwide delivery",
                "30-day satisfaction guarantee"
              ].map((item, index) => (
                <div key={index} className="flex items-start">
                  <div className="flex-shrink-0 mt-1.5">
                    <div className="flex items-center justify-center h-6 w-6 rounded-full bg-blue-100 text-blue-600">
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </div>
                  <p className="ml-3 text-lg text-gray-700">{item}</p>
                </div>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="flex flex-wrap gap-4 mt-8"
            >
              <Link
                to="/onlineStoreHome"
                className="relative px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl"
              >
                <span className="relative z-10">Explore Products</span>
                <div className="absolute inset-0 rounded-xl border-2 border-white/20"></div>
              </Link>
              <button className="px-8 py-4 bg-white border-2 border-gray-200 text-gray-700 hover:text-indigo-700 hover:border-indigo-300 font-semibold rounded-xl transition-all duration-300 transform hover:scale-[1.02] shadow-sm hover:shadow-md flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                How It Works
              </button>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}