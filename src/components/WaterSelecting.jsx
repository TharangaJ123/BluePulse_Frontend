import React from "react";
import { useNavigate } from "react-router-dom";
import NavigationBar from "./NavigationBar";
import Footer from "./Footer";

const Water = () => {
  const navigate = useNavigate();

  const tiles = [
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
