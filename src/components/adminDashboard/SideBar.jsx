import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FaHome,                  // Dashboard
  FaUsers,                 // User Management
  FaUserTie,               // Employee Management
  FaCalendarAlt,           // Appointments
  FaStore,                 // Online Store & Inventory
  FaChartLine,             // Financial Management
  FaComments,              // Community & Feedback
  FaShieldAlt,             // Role Access Management
  FaChartBar,              // Reports & Analytics
  FaCog,                   // Settings
  FaBars,                  // Sidebar Toggle
  FaShoppingCart,
  FaMoneyBillAlt,
  FaUserShield,
  FaClipboardList,
  FaTruck,
  FaEnvelope,
  FaSignOutAlt
} from 'react-icons/fa'; // Import icons

const Sidebar = ({ setActiveSection, activeSection }) => {
  const [isCollapsed, setIsCollapsed] = useState(false); // State to handle sidebar collapse
  const [accessibleSections, setAccessibleSections] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Get role information from localStorage
    const roleInfo = localStorage.getItem('employeeRole');
    if (roleInfo) {
      const { accessibleSections } = JSON.parse(roleInfo);
      setAccessibleSections(accessibleSections);
    }
  }, []);

  const handleLogout = () => {
    // Clear role information and other stored data
    localStorage.removeItem('employeeRole');
    // Redirect to login page
    navigate('/AdminLogin');
  };

  // Navigation items with icons
  const navItems = [
    { text: 'Dashboard', key: 'dashboard', icon: <FaHome /> },
    { text: 'User Management', key: 'user-management', icon: <FaUsers /> },
    { text: 'Employee Management', key: 'employee-management', icon: <FaUserTie /> },
    { text: 'Appointments', key: 'appointments', icon: <FaCalendarAlt /> },
    { text: 'Online Store & Inventory', key: 'online-store', icon: <FaStore /> },
    { text: 'Order Management', key: 'order-management', icon: <FaStore /> },
    { text: 'Suppliers Management', key: 'supplier-management', icon: <FaStore /> },
    { text: 'Financial Management', key: 'financial-management', icon: <FaChartLine /> },
    { text: 'Community & Feedback', key: 'community-feedback', icon: <FaComments /> },
    { text: 'Role Access Management', key: 'roleAccess-management', icon: <FaUserShield /> },
    { text: 'Reports & Analytics', key: 'reports-analytics', icon: <FaChartBar /> },
    { text: 'Contact Us Management', key: 'contact-form-management', icon: <FaEnvelope /> },
    { text: 'Settings', key: 'settings', icon: <FaCog /> },
  ];

  return (
    <div
      className={`${
        isCollapsed ? 'w-20' : 'w-64'
      } bg-gradient-to-b from-blue-100 to-blue-200 text-gray-800 min-h-screen p-6 shadow-lg transition-all duration-300 flex flex-col`}
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

      {/* Navigation Items */}
      <nav className="flex-1">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.key}>
              <button
                onClick={() => setActiveSection(item.key)}
                className={`w-full flex items-center p-3 rounded-lg transition duration-300 ${
                  activeSection === item.key
                    ? 'bg-blue-600 text-white'
                    : 'hover:bg-blue-50'
                }`}
              >
                <span className="text-xl">{item.icon}</span>
                {!isCollapsed && (
                  <span className="ml-3">{item.text}</span>
                )}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Logout Button */}
      <button
        onClick={handleLogout}
        className="mt-auto flex items-center p-3 rounded-lg hover:bg-blue-50 transition duration-300"
      >
        <FaSignOutAlt className="text-xl" />
        {!isCollapsed && (
          <span className="ml-3">Logout</span>
        )}
      </button>
    </div>
  );
};

export default Sidebar;


