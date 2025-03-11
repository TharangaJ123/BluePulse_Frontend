import React from "react";
import { Link } from "react-router-dom";
import OnlineStoreNavigationBar from "./OnlineStoreNavigationBar";
import OnlineStoreHeroSection from "./OnlineStoreHeroSection";

const products = [
  {
    id: 1,
    name: "Product A",
    price: 29.99,
    image: "https://picsum.photos/150",
  },
  {
    id: 2,
    name: "Product B",
    price: 39.99,
    image: "https://picsum.photos/150",
  },
  {
    id: 3,
    name: "Product C",
    price: 49.99,
    image: "https://picsum.photos/150",
  },
  {
    id: 4,
    name: "Product D",
    price: 49.99,
    image: "https://picsum.photos/150",
  },
  {
    id: 5,
    name: "Product E",
    price: 49.99,
    image: "https://picsum.photos/150",
  },
  {
    id: 6,
    name: "Product F",
    price: 49.99,
    image: "https://picsum.photos/150",
  },
];

export default function OnlineStoreHome() {
  return (
    <>
      <OnlineStoreNavigationBar />
      <div className="mx-auto">
        <OnlineStoreHeroSection/>
        {/* product list */}
        <div className="container mx-auto top-20">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
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
                <p className="text-gray-600">LKR.{product.price.toFixed(2)}</p>
                <Link
                  to={`/product/${product.id}`}
                  className="block bg-blue-600 text-white mt-2 py-2 px-4 rounded-lg text-center hover:bg-blue-600 transition-colors duration-300"
                >
                  View Product
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
