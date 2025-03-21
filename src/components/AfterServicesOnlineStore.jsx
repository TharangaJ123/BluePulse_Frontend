// src/components/FeatureSection.jsx
import React from 'react';

const AfterServicesOnlineStore = () => {
  const features = [
    {
      icon: '🚚',
      title: 'Shipping',
      description: 'Career Information',
    },
    {
      icon: '💳',
      title: 'Online Payment',
      description: 'Payments methods',
    },
    {
      icon: '🛠️',
      title: '24 / 7 Support',
      description: 'Unlimited Help desk',
    },
    {
      icon: '🛡️',
      title: '100% Safety',
      description: 'Benifits',
    },
    {
      icon: '🔄',
      title: 'Free Return',
      description: 'Track or cancel orders',
    },
  ];

  return (
    <div className="bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="text-center">
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-lg font-semibold text-gray-900">{feature.title}</h3>
              <p className="mt-2 text-sm text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AfterServicesOnlineStore;