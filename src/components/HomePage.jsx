import React from 'react';
import NavigationBar from './NavigationBar';
import Footer from './Footer';
  
import HeroSection from './HeroSection';
import Services from './Services';
import HomeFeedbackFormSection from './HomeFeedbackFormSection';
import WhySelectUsSection from './WhySelectUsSection';
import GoToShopSection from './GoToShopSection';

export default function HomePage() {
  return (
    <div className="min-h-screen text-white">
        <NavigationBar />

        <HeroSection />

        <WhySelectUsSection/>

        <Services/>

        <div id='feedback-form'>
          <HomeFeedbackFormSection/>
        </div>

        <GoToShopSection/>

        <Footer/>
    </div>
  );
}
