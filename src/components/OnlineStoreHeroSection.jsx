import React from "react";
import img1 from "../assets/photoCollage.png";

export default function OnlineStoreHeroSection() {
  return (
    <div 
      className="relative w-full h-[50vh] flex items-center justify-center top-15 bg-gray-900 mb-20"
      style={{ backgroundImage: `url(${img1})`, backgroundSize: "cover", backgroundPosition: "center", backgroundRepeat: "no-repeat" }}
    > 
      {/* Hero Text */}
      <div className="absolute z-10 text-center text-white">
        <h1 className="text-4xl md:text-6xl font-bold">
          Welcome to Our Website
        </h1>
        <p className="text-lg md:text-xl mt-4">Discover amazing experiences</p>
      </div>
    </div>
  );
}
