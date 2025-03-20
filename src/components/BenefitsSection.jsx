import React from 'react';

const BenefitsSection = () => {
  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-blue-950 mb-8">Why Choose Our Water Solutions?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Health Benefits Card */}
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <div className="text-4xl text-blue-500 mb-4">💧</div>
            <h3 className="text-xl font-semibold mb-2">Health Benefits</h3>
            <p className="text-gray-600">
              Our water solutions ensure clean, safe, and mineral-rich water, promoting better hydration and overall health.
            </p>
          </div>

          {/* Cost Savings Card */}
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <div className="text-4xl text-green-500 mb-4">💰</div>
            <h3 className="text-xl font-semibold mb-2">Cost Savings</h3>
            <p className="text-gray-600">
              Save money in the long run by reducing the need for bottled water and minimizing maintenance costs.
            </p>
          </div>

          {/* Eco-Friendly Card */}
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <div className="text-4xl text-emerald-500 mb-4">🌱</div>
            <h3 className="text-xl font-semibold mb-2">Eco-Friendly</h3>
            <p className="text-gray-600">
              Reduce plastic waste and your carbon footprint with our sustainable and environmentally friendly water systems.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;