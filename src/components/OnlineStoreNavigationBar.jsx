import React from "react";
import { Link } from "react-router-dom";

export default function OnlineStoreNavigationBar({ searchQuery, setSearchQuery }) {
  return (
    <nav className="bg-blue-950 shadow-md w-full top-0 mx-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Navigation Links */}
          <div className="hidden md:flex space-x-8">
            <Link to="/onlineStoreHome" className="text-white hover:text-blue-600 font-medium">Shop</Link>
            <Link to="/onlineStoreHome_testkits" className="text-white hover:text-blue-600 font-medium">Test Kits</Link>
            <Link to="/onlineStoreHome_spareparts" className="text-white hover:text-blue-600 font-medium">Spare Parts</Link>
            <Link to="/onlineStoreHome_purificationitems" className="text-white hover:text-blue-600 font-medium">Purification Items</Link>
          </div>

          {/* Search Bar & Cart */}
          <div className="flex items-center space-x-4">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products..."
              className="px-4 py-2 border bg-white rounded-lg focus:ring-2 focus:ring-blue-400 outline-none hidden md:block"
            />

            <button className="md:hidden text-white text-2xl">
              ☰
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
