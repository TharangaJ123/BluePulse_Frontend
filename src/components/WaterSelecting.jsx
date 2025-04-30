<<<<<<< HEAD
import React, { useState, useRef, useEffect } from 'react';
=======
import React from "react";
import { useNavigate } from "react-router-dom";
import NavigationBar from "./NavigationBar";
import Footer from "./Footer";
>>>>>>> 905712e0bf653e3bd0dac9000a691caa0ced254a

const Water = ({ onNavigate }) => {
  const [activeCategory, setActiveCategory] = useState(null);
  const [isInView, setIsInView] = useState(false);
  const sectionRef = useRef(null);

  // IntersectionObserver for revealing animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  // SVG Icons
  const DropletIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
      <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"></path>
    </svg>
  );
  
  const WindIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
      <path d="M9.59 4.59A2 2 0 1 1 11 8H2m10.59 11.41A2 2 0 1 0 14 16H2m15.73-8.27A2.5 2.5 0 1 1 19.5 12H2"></path>
    </svg>
  );
  
  const LeafIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
      <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"></path>
      <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"></path>
    </svg>
  );
  
  const FactoryIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
      <path d="M2 20a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8l-7 5V8l-7 5V4a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"></path>
      <path d="M17 18h1"></path>
      <path d="M12 18h1"></path>
      <path d="M7 18h1"></path>
    </svg>
  );
  
  const ChevronRightIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <path d="m9 18 6-6-6-6"></path>
    </svg>
  );
  
  const InfoIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
      <circle cx="12" cy="12" r="10"></circle>
      <path d="M12 16v-4"></path>
      <path d="M12 8h.01"></path>
    </svg>
  );

  const categories = [
    {
      id: 1,
      title: "Potable Water",
      description: "Clean drinking water for healthy living.",
      videoSrc: "/images/potable-water.mp4",
      link: "/waterquality/potable",
    },
    {
      id: 2,
      title: "Non-Potable Water",
      description: "Water used for irrigation and sanitation.",
      videoSrc: "/images/non-potable-water.mp4",
      link: "/waterquality/nonpotable",
    },
    {
      id: 3,
      title: "Agricultural Water",
      description: "Essential water for crop growth and farming.",
      videoSrc: "/images/agricultural-water.mp4",
      link: "/waterquality/agricultural",
    },
    {
      id: 4,
      title: "Industrial Water",
      description: "Water used in manufacturing and processing.",
      videoSrc: "/images/industrial-water.mp4",
      link: "/waterquality/industrial",
    },
  ];

  console.log("Tiles data:", tiles); // Debugging: Check if tiles array is populated

  return (
    <div>
      <NavigationBar />
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-16 text-blue-800">
            Explore Water Resources
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            {tiles.map((tile) => (
              <div
                key={tile.id}
                className="flex flex-col h-full bg-white rounded-2xl shadow-xl overflow-hidden transition-transform hover:scale-105"
                onClick={() => navigate(tile.link)}
              >
                <video
                  src={tile.videoSrc}
                  className="w-full h-100 object-cover"
                  autoPlay
                  muted
                  loop
                  onError={() => console.error("Video not loading:", tile.videoSrc)}
                />
                <div className="p-6 flex-1">
                  <h3 className="text-2xl font-semibold text-gray-800">
                    {tile.title}
                  </h3>
                  <p className="text-gray-600 text-sm">{tile.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Water;