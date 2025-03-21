import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function OnlineStoreNavigationBar() {
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);

  const toggleCategory = () => {
    setIsCategoryOpen(!isCategoryOpen);
  };

  return (
    <nav className="bg-blue-950 shadow-md w-full top-0 mx-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">  

          {/* Navigation Links */}
          <div className="hidden md:flex space-x-8">
            <a href="/" className="text-white hover:text-blue-600 font-medium">Shop</a>
            <a href="/" className="text-white hover:text-blue-600 font-medium">Test Kits</a>
            <a href="/shop" className="text-white hover:text-blue-600 font-medium">Spare Parts</a>
            <a href="/deals" className="text-white hover:text-blue-600 font-medium">Purification Items</a>
          </div>

          {/* Search Bar & Cart */}
          <div className="flex items-center space-x-4">
            <input
              type="text"
              placeholder="Search products..."
              className="px-4 py-2 border bg-white rounded-lg focus:ring-2 focus:ring-blue-400 outline-none hidden md:block"
            />

            {/* Cart Icon */}
            <a href="/cart" className="relative">
              <span className="text-2xl text-white hover:text-blue-600">🛍️</span>
              <span className="absolute top-0 right-0 text-xs bg-red-500 text-white rounded-full px-1">2</span>
            </a>

            {/* Mobile Menu Button */}
            <button className="md:hidden text-white text-2xl">
              ☰
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}