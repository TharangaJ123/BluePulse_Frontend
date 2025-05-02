import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { FaUser, FaSignOutAlt } from "react-icons/fa";

export default function NavigationBar() {
  const navigate = useNavigate();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const user = JSON.parse(localStorage.getItem('user'));

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    navigate('/');
  };

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
          {user ? (
            <div className="relative">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center space-x-2 px-4 py-2 rounded-full text-white border border-blue-400 hover:bg-blue-400/20 transition-colors duration-300"
              >
                <FaUser className="text-xl" />
                <span>{user.full_name}</span>
              </motion.button>

              {showProfileMenu && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50"
                >
                  <Link
                    to={`/UserProfile/${user._id}`}
                    className="block px-4 py-2 text-gray-800 hover:bg-blue-50"
                    onClick={() => setShowProfileMenu(false)}
                  >
                    View Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-gray-800 hover:bg-blue-50 flex items-center"
                  >
                    <FaSignOutAlt className="mr-2" />
                    Logout
                  </button>
                </motion.div>
              )}
            </div>
          ) : (
            <>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-2 rounded-full text-white border border-blue-400 hover:bg-blue-400/20 transition-colors duration-300"
              >
                <Link to="/login-type">Login</Link>
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
            </>
          )}
        </div>
      </nav>
    </div>
  );
}