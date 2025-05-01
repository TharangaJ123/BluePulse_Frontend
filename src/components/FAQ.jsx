import { useState } from 'react';
import ModernFooter from './Footer';
import NavigationBar from './NavigationBar';
import { Link } from 'react-router-dom';

const FAQSection = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const faqs = [
    {
      question: "How often should I test my water?",
      answer: "We recommend testing your water at least once a year. If you notice changes in taste, odor, or appearance, test immediately. Well owners should test every 6 months."
    },
    {
      question: "What contaminants do your purification systems remove?",
      answer: "Our systems remove 99.9% of common contaminants including lead, chlorine, fluoride, heavy metals, bacteria, and microplastics. Specific removal rates vary by model - check product specifications."
    },
    {
      question: "How do I know which purification system I need?",
      answer: "Start with our free water test kit to identify your contaminants. Our specialists will then recommend the perfect system based on your results, household size, and water usage."
    },
    {
      question: "Are your systems easy to install?",
      answer: "Yes! Most homeowners can install our countertop and under-sink systems in under 30 minutes with basic tools. Whole-house systems may require professional installation - we can recommend certified installers."
    },
    {
      question: "How often do filters need replacement?",
      answer: "Typically every 6-12 months depending on usage and water quality. Our smart systems include indicator lights, and we offer automatic filter replacement subscriptions for convenience."
    },
    {
      question: "Do you offer water testing services?",
      answer: "Yes! We provide both DIY test kits with lab analysis ($29-$99) and professional in-home testing ($149). All tests include detailed reports and purification recommendations."
    }
  ];

  return (
    <div>
      <NavigationBar/>
      <section className="max-w-4xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-blue-800 mb-4">Water Solutions FAQs</h2>
        <p className="text-lg text-blue-600 max-w-2xl mx-auto">
          Answers to common questions about water testing and purification systems
        </p>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div 
            key={index} 
            className="border border-blue-100 rounded-xl overflow-hidden transition-all duration-200"
          >
            <button
              className={`w-full px-6 py-5 text-left flex justify-between items-center transition-colors ${activeIndex === index ? 'bg-blue-50' : 'hover:bg-blue-50'}`}
              onClick={() => toggleFAQ(index)}
            >
              <h3 className="text-lg font-medium text-blue-900">{faq.question}</h3>
              <svg
                className={`w-6 h-6 text-blue-600 transform transition-transform ${activeIndex === index ? 'rotate-180' : ''}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            <div
              className={`px-6 overflow-hidden transition-all duration-300 ${activeIndex === index ? 'max-h-96 pb-5' : 'max-h-0'}`}
            >
              <p className="text-blue-700">{faq.answer}</p>
              {index === 2 && (
                <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  <Link to="/onlineStoreHome_testkits">Get Your Free Test Kit</Link>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 text-center">
        <p className="text-blue-700 mb-6">Still have questions?</p>
        <button className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-md">
          Contact : support@bluepulse.com
        </button>
      </div>
    </section>
    <ModernFooter/>
    </div>
  );
};

export default FAQSection;