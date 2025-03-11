import React from 'react';
import NavigationBar from './NavigationBar';
import Footer from './Footer';
  
import HeroSection from './HeroSection';
import Services from './Services';

export default function HomePage() {
  return (
    <div className="min-h-screen text-white">
        {/* Navbar */}
        <NavigationBar/>

        {/* Hero Section */}
        <HeroSection/>

        {/* Service section */}
        <Services/>

        

        <Footer/>
    </div>
  );
}
