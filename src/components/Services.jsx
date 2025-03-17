import React from "react";

export default function Services() {
  return (
    <div className="w-full mt-10 mb-20">
      <div className="container mx-auto px-4 flex flex-col items-center">
        <h2 className="text-4xl font-bold text-center text-gray-800 mb-12">
          Our Services
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Service 1: Web Development */}
          <div className="p-8 text-center w-80 h-80 flex flex-col justify-center">
            <img width="64" height="64" src="https://img.icons8.com/nolan/64/online-store.png" alt="online-store" className="w-16 h-16 mx-auto mb-6"/>
            <h3 className="text-xl font-serif text-gray-800 mb-4">
              "Your Water Purification Marketplace – Shop Smart, Manage Smarter." 
            </h3>
          </div>

          {/* Service 2: Mobile Apps */}
          <div className="p-8 text-center w-80 h-80 flex flex-col justify-center">
          <img width="64" height="64" src="https://img.icons8.com/fluency/48/water.png" alt="water" className="w-16 h-16 mx-auto mb-6"/>
            <h3 className="text-xl font-serif text-gray-800 mb-4">
              "Empower Your Team – Simplified Access, Seamless Control." 
            </h3>
          </div>

          {/* Service 3: UI/UX Design */}
          <div className=" p-8 text-center w-80 h-80 flex flex-col justify-center">
          <img width="64" height="64" src="https://img.icons8.com/nolan/64/blur.png" alt="blur" className="w-16 h-16 mx-auto mb-6"/>
            <h3 className="text-xl font-serif text-gray-800 mb-4">
              "Purity at Your Fingertips – Test, Track, and Trust."  
            </h3>
          </div>

          {/* Service 4: Cloud Solutions */}
          <div className="p-8 text-center w-80 h-80 flex flex-col justify-center">
          <img width="64" height="64" src="https://img.icons8.com/nolan/64/billing.png" alt="billing" className="w-16 h-16 mx-auto mb-6"/>
            <h3 className="text-xl font-serif text-gray-800 mb-4">
              "Smart Finances, Clear Insights – Manage with Confidence." 
            </h3>
          </div>

          {/* Service 5: SEO Optimization */}
          <div className="p-8 text-center w-80 h-80 flex flex-col justify-center">
          <img width="64" height="64" src="https://img.icons8.com/nolan/64/communication.png" alt="communication" className="w-16 h-16 mx-auto mb-6"/>
            <h3 className="text-xl font-serif text-gray-800 mb-4">
              "Your Voice Matters – Connect, Share, and Grow."  
            </h3>
          </div>

          {/* Service 6: E-commerce */}
          <div className="p-8 text-center w-80 h-80 flex flex-col justify-center">
            <img width="64" height="64" src="https://img.icons8.com/nolan/64/blur.png" alt="blur" className="w-16 h-16 mx-auto mb-6"/>
            <h3 className="text-xl font-serif text-gray-800 mb-4">
              "One Platform, Endless Possibilities – Your Water, Your Way." 
            </h3>
          </div>
        </div>
      </div>
    </div>
  );
}