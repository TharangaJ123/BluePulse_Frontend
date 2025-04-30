import React, { useState, useRef, useEffect } from 'react';

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
      id: 'potable',
      title: 'Potable Water',
      description: 'Clean drinking water essential for hydration and healthy living. Meets strict safety standards for human consumption.',
      videoSrc: '/images/potable-water.mp4',
      link: '/waterquality/potable',
      icon: <DropletIcon />,
      color: 'bg-blue-500',
      hoverColor: 'bg-blue-600',
      facts: ['Represents less than 1% of Earth\'s water', 'Should contain 0 harmful bacteria', 'Essential for human survival']
    },
    {
      id: 'non-potable',
      title: 'Non-Potable Water',
      description: 'Water used for irrigation, sanitation, and other non-drinking purposes. Safe for many uses but not for consumption.',
      videoSrc: '/images/non-potable-water.mp4',
      link: '/waterquality/nonpotable',
      icon: <WindIcon />,
      color: 'bg-cyan-500',
      hoverColor: 'bg-cyan-600',
      facts: ['Used in toilet systems', 'Important for conservation', 'Can include treated greywater']
    },
    {
      id: 'agricultural',
      title: 'Agricultural Water',
      description: 'Essential water for crop growth, livestock care, and sustainable farming practices. The backbone of food production.',
      videoSrc: '/images/agricultural-water.mp4',
      link: '/waterquality/agricultural',
      icon: <LeafIcon />,
      color: 'bg-green-500',
      hoverColor: 'bg-green-600',
      facts: ['70% of global freshwater use', 'Critical for food security', 'Often uses irrigation systems']
    },
    {
      id: 'industrial',
      title: 'Industrial Water',
      description: 'Water used in manufacturing, energy production, and processing. A vital resource for economic activity worldwide.',
      videoSrc: '/images/industrial-water.mp4',
      link: '/waterquality/industrial',
      icon: <FactoryIcon />,
      color: 'bg-purple-500',
      hoverColor: 'bg-purple-600',
      facts: ['Used for cooling equipment', 'Requires treatment after use', 'Essential for power generation']
    },
  ];

  const handleCardClick = (link, id) => {
    if (activeCategory === id) {
      if (onNavigate) {
        onNavigate(link);
      } else {
        window.location.href = link;
      }
    } else {
      setActiveCategory(id);
    }
  };

  return (
    <section 
      ref={sectionRef}
      className="py-24 bg-gradient-to-b from-blue-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 overflow-hidden"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`max-w-3xl mx-auto mb-12 text-center transition-all duration-1000 transform ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="inline-flex items-center justify-center mb-4">
            <span className="px-4 py-1.5 text-sm font-medium rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
              Water Resources
            </span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-blue-900 dark:text-blue-100 tracking-tight">
            Explore <span className="text-blue-600 dark:text-blue-400 relative">
              Water
              <span className="absolute bottom-1 left-0 w-full h-1 bg-blue-400 dark:bg-blue-600 rounded opacity-50"></span>
            </span> Categories
          </h2>
          
          <p className="text-lg text-blue-700 dark:text-blue-300 max-w-2xl mx-auto">
            Discover the different water classifications and their critical roles in sustaining our ecosystem, industries, and daily life
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {categories.map((category, index) => {
            const isActive = activeCategory === category.id;
            
            return (
              <div
                key={category.id}
                className={`group relative flex flex-col bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-lg transition-all duration-500 
                  ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'} 
                  ${isActive ? 'ring-2 ring-blue-400 dark:ring-blue-500 shadow-xl scale-[1.02]' : 'hover:shadow-xl hover:-translate-y-1'} 
                  cursor-pointer border border-transparent hover:border-blue-200 dark:hover:border-blue-800 focus-within:ring-2 focus-within:ring-blue-400 outline-none`}
                style={{ transitionDelay: `${index * 100}ms` }}
                onClick={() => handleCardClick(category.link, category.id)}
                tabIndex="0"
                role="button"
                aria-label={isActive ? `View ${category.title} details` : `Learn more about ${category.title}`}
                aria-expanded={isActive}
              >
                <div className="relative overflow-hidden">
                  <div className="aspect-video bg-gray-100 dark:bg-gray-700">
                    <video
                      src={category.videoSrc}
                      className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105"
                      autoPlay
                      muted
                      loop
                      playsInline
                      aria-hidden="true"
                    />
                  </div>
                  
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                  
                  <div className={`absolute top-4 right-4 ${category.color} group-hover:${category.hoverColor} text-white p-3 rounded-full shadow-md transition-all duration-300 transform group-hover:scale-110 z-10`}>
                    {category.icon}
                  </div>
                  
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="text-xl font-semibold text-white mb-1 transition-colors duration-300">
                      {category.title}
                    </h3>
                  </div>
                </div>
                
                <div className="p-6 flex-grow bg-gradient-to-br from-gray-50 to-white dark:from-slate-800 dark:to-slate-800 flex flex-col">
                  <p className="text-gray-600 dark:text-gray-300 flex-grow">
                    {category.description}
                  </p>
                  
                  <div 
                    className={`overflow-hidden transition-all duration-500 ease-in-out ${isActive ? 'max-h-96 mt-4 opacity-100' : 'max-h-0 opacity-0'}`}
                  >
                    <div className="p-4 rounded-xl bg-blue-50 dark:bg-slate-700 mb-4">
                      <div className="flex items-center text-blue-800 dark:text-blue-300 mb-2 text-sm font-medium">
                        <span className="mr-2">
                          <InfoIcon />
                        </span>
                        Key Facts
                      </div>
                      <ul className="space-y-2">
                        {category.facts.map((fact, i) => (
                          <li key={i} className="flex items-start">
                            <span className="text-blue-500 mr-2">•</span>
                            <span className="text-sm text-gray-700 dark:text-gray-300">{fact}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  
                  <div className="mt-4 flex items-center text-blue-600 dark:text-blue-400 font-medium">
                    <span>{isActive ? 'View details' : 'Learn more'}</span>
                    <span className={`ml-2 transition-transform duration-300 inline-block ${isActive ? 'translate-x-1' : 'group-hover:translate-x-1'}`}>
                      <ChevronRightIcon />
                    </span>
                  </div>
                </div>
                
                {/* Accessibility focus indicator */}
                <span className="absolute inset-0 rounded-2xl pointer-events-none border-2 border-blue-500 opacity-0 group-focus-visible:opacity-100"></span>
              </div>
            );
          })}
        </div>
        
        {/* Mobile navigation hint */}
        <div className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400 md:hidden">
          <p>Tap a category to see details, then tap again to navigate</p>
        </div>
      </div>
    </section>
  );
};

export default Water;