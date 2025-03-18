import React from 'react';
import { useNavigate } from 'react-router-dom';

const Water = () => {
  const navigate = useNavigate();

  const tiles = [
    {
      id: 1,
      title: 'Potable Water',
      description: 'Clean drinking water for healthy living.',
      videoSrc: '/images/potable-water.mp4', // Use videoSrc instead of imgSrc
      link: '/waterquality/potable',
    },
    {
      id: 2,
      title: 'Non-Potable Water',
      description: 'Water used for irrigation and sanitation.',
      videoSrc: '/images/non-potable-water.mp4',
      link: '/waterquality/nonpotable',
    },
    {
      id: 3,
      title: 'Agricultural Water',
      description: 'Essential water for crop growth and farming.',
      videoSrc: '/images/agricultural-water.mp4',
      link: '/waterquality/agricultural',
    },
    {
      id: 4,
      title: 'Industrial Water',
      description: 'Water used in manufacturing and processing.',
      videoSrc: '/images/industrial-water.mp4',
      link: '/waterquality/industrial',
    },
  ];

  const handleTileClick = (link) => {
    navigate(link); // Use navigate() to move to the water quality test page
  };

  return (
    <section className="py-20 bg-gradient-to-r from-blue-50 to-blue-100">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-extrabold text-center mb-16 text-blue-800">
          Explore Water Resources
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {tiles.map((tile) => (
            <div
              key={tile.id}
              className="block relative bg-white rounded-2xl shadow-xl overflow-hidden transition-transform transform hover:scale-105 duration-300"
              onClick={() => handleTileClick(tile.link)} // Add onClick handler for navigation
            >
              <div className="aspect-w-16 aspect-h-9">
                <video
                  src={tile.videoSrc}
                  alt={tile.title}
                  className="object-cover w-full h-full"
                  autoPlay
                  muted
                  loop
                /> {/* Use video tag */}
              </div>
              <div className="p-8">
                <h3 className="text-2xl font-semibold text-gray-800 mb-3">
                  {tile.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {tile.description}
                </p>
              </div>
              <div className="absolute inset-0 bg-black bg-opacity-10 hover:bg-opacity-0 transition-opacity duration-300"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Water;
