import React from "react";
import { Link } from "react-router-dom";

const products = [
  {
    id: 1,
    name: "Product A",
    price: 29.99,
    image: "https://via.placeholder.com/150",
  },
  {
    id: 2,
    name: "Product B",
    price: 39.99,
    image: "https://via.placeholder.com/150",
  },
  {
    id: 3,
    name: "Product C",
    price: 49.99,
    image: "https://via.placeholder.com/150",
  },
];

export default function OnlineStoreHome() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Welcome to Our Store</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <div
            key={product.id}
            className="border p-4 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
          >
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-48 object-cover rounded-t-lg"
            />
            <h2 className="text-lg font-semibold mt-2">{product.name}</h2>
            <p className="text-gray-600">${product.price.toFixed(2)}</p>
            <Link
              to={`/product/${product.id}`}
              className="block bg-blue-500 text-white mt-2 py-2 px-4 rounded-lg text-center hover:bg-blue-600 transition-colors duration-300"
            >
              View Details
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}