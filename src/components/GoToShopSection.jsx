import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function GoToShopSection() {
  return (
    <div className="relative bg-gradient-to-br  text-white overflow-hidden">
      {/* Background pattern */}

      <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8 relative z-10">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          

          {/* Left content - product showcase */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="relative rounded-xl p-6 shadow-2xl border">
              <div className="absolute rounded-xl"></div>
              <div className="relative">
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { name: "Premium Filters",tag: "NEW",img: '../src/assets/img1.jpg'},
                    { name: "Water Testing Kits",tag: "NEW",img: '../src/assets/wt_kits.jpg' },
                    { name: "Spare Parts",tag: "NEW",img: '../src/assets/sp_parts.jpg' },
                    { name: "Free Technical Services",tag: "NEW",img: '../src/assets/tech_sup.jpeg' },
                  ].map((item, index) => (
                    <div key={index} className="bg-blue-950 p-4 rounded-lg border border-blue-400/20 hover:border-blue-300/50 transition-all">
                      <div className="h-32 bg-white rounded mb-2 flex items-center justify-center">
                        <img 
                          src={item.img} 
                          alt="Water drop icon" 
                          className="w-25 h-25 object-contain"
                        />
                      </div>
                      <div className="text-sm text-blue-200 font-medium">{item.name}</div>
                      {item.tag && (
                        <span className="inline-block mt-2 px-2 py-1 text-xs font-bold rounded bg-blue-500/30 text-blue-100">
                          {item.tag}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
                <div className="mt-6 text-center text-blue-950 text-sm">
                  🔹 Limited-Time Stock up on essentials today.
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right content */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl md:text-5xl font-bold leading-tight text-blue-950">
                Upgrade Your Water Purity <span className="text-blue-600">– Shop Now!</span>
              </h1>
              <p className="text-lg text-gray-950 mt-4">
                Discover everything you need for crystal-clear, safe water in our online store!
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="space-y-4"
            >
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-1">
                  <svg className="h-5 w-5 text-blue-950" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="ml-3 text-lg text-blue-950">Expert-Recommended Products</p>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-1">
                  <svg className="h-5 w-5 text-blue-950" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="ml-3 text-lg text-blue-950">Free Technical Supports</p>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-1">
                  <svg className="h-5 w-5 text-blue-950" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="ml-3 text-lg text-blue-950">Fast & Reliable Delivery</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="flex flex-wrap gap-4 mt-8"
            >
              <Link
                to="/onlineStoreHome"
                className="px-8 py-4 bg-blue-500 hover:bg-blue-400 text-white font-bold rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                View Store
              </Link>
              <button className="px-8 py-4 bg-transparent border-2 border-blue-300 text-blue-700 hover:text-white hover:border-blue-100 font-bold rounded-lg transition-all duration-300 transform hover:scale-105">
                Learn More
              </button>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}