import React from "react";
import storeImage from "../assets/Online-Store.jpg";

export default function OnlineStoreHeroSection() {
  return (
    <div 
    className="relative w-full h-[80vh] flex items-center justify-center bg-gray-900 overflow-hidden"
    style={{ 
      backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${storeImage})`, 
      backgroundSize: "cover", 
      backgroundPosition: "center", 
      backgroundRepeat: "no-repeat" 
    }}
  > 
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-black/30"></div>

      {/* Hero Text */}
      <div className="relative z-10 text-center text-white px-4">
        <h1 className="text-4xl md:text-6xl font-bold mb-4 transform transition-all duration-500 hover:scale-105">
          Welcome to BluePulse Store
        </h1>
        <p className="text-lg md:text-xl mb-8">Discover amazing experiences</p>
        <a href="#explore-section">
        <button 
          className="bg-blue-600 text-white py-3 px-8 rounded-full font-semibold hover:bg-blue-700 transition-colors duration-300 transform hover:scale-105"
        >
          Explore Now
        </button>
        </a>
      </div>
    </div>
  );
}