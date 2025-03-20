import React from 'react';

const Header = () => {
  return (
    <header className="bg-white shadow-sm p-4">
      <div className="container mx-auto flex justify-between items-center">
        {/* Dashboard Title */}
        <h1 className="text-xl font-semibold text-blue-800">Admin Dashboard</h1>

        {/* User Profile */}
        <div className="flex items-center space-x-4">
          <span className="text-gray-700">Admin</span>
          <img
            src="https://via.placeholder.com/40"
            alt="Profile"
            className="rounded-full shadow-sm"
          />
        </div>
      </div>
    </header>
  );
};

export default Header;