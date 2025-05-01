import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function NavigationBar() {
  return (
    <div>
      <nav className="top-0 left-0 p-4 bg-blue-950/80 backdrop-brightness-10 shadow-lg flex justify-between items-center px-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <img
            src="../src/assets/bplogo.png"
            alt="logo"
            className="h-15"
          />
        </motion.div>
        
        <ul className="flex space-x-6">
          {[
            { name: "Home", path: "/" },
            { name: "Water Quality Testings", path: "/WaterTesting" },
            { name: "Store", path: "/onlineStoreHome" },
            { name: "Community", path: "/Community" },
          ].map((item, index) => (
            <motion.li
              key={index}
              whileHover={{ scale: 1.1 }}
              className="cursor-pointer text-lg text-white hover:text-blue-400"
            >
              <Link to={item.path}>{item.name}</Link>
            </motion.li>
          ))}
        </ul>
        
        <div className="flex space-x-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-2 rounded-full text-white border border-blue-400 hover:bg-blue-400/20 transition-colors duration-300"
          >
            <Link to="/login">Login</Link>
          </motion.button>
          <motion.button
            whileHover={{ 
              scale: 1.05,
              boxShadow: "0 0 15px rgba(96, 165, 250, 0.5)"
            }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-2 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 transition-all duration-300"
          >
            <Link to="/Register">Sign Up</Link>
          </motion.button>
        </div>
      </nav>
    </div>
  );
}