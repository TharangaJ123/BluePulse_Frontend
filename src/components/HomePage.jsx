import React from 'react';
import NavigationBar from './NavigationBar';
import Footer from './Footer';
  
import HeroSection from './HeroSection';
import Services from './Services';
import HomeFeedbackFormSection from './HomeFeedbackFormSection';
import WhySelectUsSection from './WhySelectUsSection';
import BenefitsSection from './BenefitsSection';
import ChatBot from './ChatBot';

export default function HomePage() {
  return (
    <div className="min-h-screen text-white">
        {/* Navbar */}
        <NavigationBar/>

        {/* Hero Section */}
        <HeroSection/>

        <WhySelectUsSection/>

        {/* Service section */}
        <Services/>

        <HomeFeedbackFormSection/>

        <BenefitsSection/>
        
        <ChatBot/>

        <Footer/>
    </div>
  );
}
