import React from 'react';

const HeroSection = () => {
  return (
    <div className="relative bg-blue-900 text-white py-20 px-6 md:px-12 lg:px-24 h-screen  flex flex-col items-center justify-center">
      {/* Background Image or Video */}
      <div className="absolute inset-0 bg-[url('./assets/landing.jpg')] bg-cover bg-center opacity-80"></div>

      {/* Content Container */}
      <div className="relative z-10 max-w-4xl mx-auto text-center">
        {/* Headline */}
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
          Pure Water, Healthy Life
        </h1>

        {/* Subheadline */}
        <p className="text-lg md:text-xl lg:text-2xl mb-8">
          Providing innovative, sustainable, and reliable water purification systems for homes, businesses, and communities.
        </p>

        {/* Call-to-Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <a
            href="#services"
            className="bg-white text-blue-900 font-semibold py-3 px-8 rounded-lg hover:bg-blue-100 transition duration-300"
          >
            Explore Our Solutions
          </a>
          <a
            href="#contact"
            className="bg-transparent border-2 border-white text-white font-semibold py-3 px-8 rounded-lg hover:bg-white hover:text-blue-900 transition duration-300"
          >
            Request a Free Consultation
          </a>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;