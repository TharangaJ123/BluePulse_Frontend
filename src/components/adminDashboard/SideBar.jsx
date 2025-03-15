import React, { useState } from 'react';
import {
  FaHome,                  // Dashboard
  FaUsers,                 // User Management
  FaUserTie,               // Employee Management
  FaFlask,                 // Water Quality Testing
  FaCalendarAlt,           // Appointments
  FaStore,                 // Online Store & Inventory
  FaChartLine,             // Financial Management
  FaComments,              // Community & Feedback
  FaShieldAlt,             // Role Access Management
  FaChartBar,              // Reports & Analytics
  FaCog,                   // Settings
  FaQuestionCircle,        // Help & Support
  FaBars,                  // Sidebar Toggle
} from 'react-icons/fa'; // Import icons

const Sidebar = ({ setActiveSection, activeSection }) => {
  const [isCollapsed, setIsCollapsed] = useState(false); // State to handle sidebar collapse

  // Navigation items with icons
  const navItems = [
    { text: 'Dashboard', key: 'dashboard', icon: <FaHome /> },
    { text: 'User Management', key: 'user-management', icon: <FaUsers /> },
    { text: 'Employee Management', key: 'employee-management', icon: <FaUserTie /> },
    { text: 'Water Quality Testing', key: 'water-quality-testing', icon: <FaFlask /> },
    { text: 'Appointments', key: 'appointments', icon: <FaCalendarAlt /> },
    { text: 'Online Store & Inventory', key: 'online-store', icon: <FaStore /> },
    { text: 'Financial Management', key: 'financial-management', icon: <FaChartLine /> },
    { text: 'Community & Feedback', key: 'community-feedback', icon: <FaComments /> },
    { text: 'Role Access Management', key: 'roleAccess-management', icon: <FaShieldAlt /> },
    { text: 'Reports & Analytics', key: 'reports-analytics', icon: <FaChartBar /> },
    { text: 'Settings', key: 'settings', icon: <FaCog /> },
    { text: 'Help & Support', key: 'help-support', icon: <FaQuestionCircle /> },
  ];

  return (
    <div
      className={`${
        isCollapsed ? 'w-20' : 'w-64'
      } bg-gradient-to-b from-blue-100 to-blue-200 text-gray-800 min-h-screen p-6 shadow-lg transition-all duration-300`}
    >
      {/* Sidebar Toggle Button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="block w-full text-left mb-6 p-2 rounded-lg hover:bg-blue-50 transition duration-300"
      >
        <FaBars className="text-blue-800 text-xl" />
      </button>

      {/* Logo */}
      <h1
        className={`text-2xl font-bold mb-8 text-blue-800 ${
          isCollapsed ? 'hidden' : 'block'
        }`}
      >
        BluePulse
      </h1>

      {/* Navigation Links */}
      <nav>
        <ul className="space-y-3">
          {navItems.map((item) => (
            <li key={item.key}>
              <button
                onClick={() => setActiveSection(item.key)}
                className={`flex items-center w-full text-left px-4 py-2 rounded-lg hover:bg-blue-50 transition duration-300 ${
                  activeSection === item.key ? 'bg-blue-50 font-semibold' : ''
                }`}
              >
                <span className="text-blue-800 text-xl mr-3">{item.icon}</span>
                <span className={isCollapsed ? 'hidden' : 'block'}>
                  {item.text}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;