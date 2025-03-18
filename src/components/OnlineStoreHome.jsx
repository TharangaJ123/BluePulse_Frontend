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
    stock: "in_stock", // "in_stock" or "out_of_stock"
  },
  {
    id: 2,
    name: "Product B",
    price: 39.99,
    image: "https://picsum.photos/150",
    stock: "out_of_stock",
  },
  {
    id: 3,
    name: "Product C",
    price: 49.99,
    image: "https://picsum.photos/150",
    stock: "in_stock",
  },
  {
    id: 4,
    name: "Product D",
    price: 49.99,
    image: "https://picsum.photos/150",
    stock: "in_stock",
  },
  {
    id: 5,
    name: "Product E",
    price: 49.99,
    image: "https://picsum.photos/150",
    stock: "out_of_stock",
  },
  {
    id: 6,
    name: "Product F",
    price: 49.99,
    image: "https://picsum.photos/150",
    stock: "in_stock",
  },
];

export default function OnlineStoreHome() {
  return (
    <>
      <OnlineStoreNavigationBar />
      <div className="mx-auto">
        <OnlineStoreHeroSection />
        {/* Product List */}
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-6 justify-items-center">
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 transform hover:-translate-y-1 w-70 relative"
              >
                {/* Stock Status Tag */}
                <div
                  className={`absolute top-2 right-2 px-3 py-1 rounded-full text-sm font-semibold ${
                    product.stock === "in_stock"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {product.stock === "in_stock" ? "In Stock" : "Out of Stock"}
                </div>

                {/* Product Image */}
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-56 object-cover"
                />

                {/* Product Details */}
                <div className="p-4">
                  <h2 className="text-xl font-semibold text-gray-800 mb-2">
                    {product.name}
                  </h2>
                  <p className="text-gray-600 font-medium">
                    LKR {product.price.toFixed(2)}
                  </p>
                  <Link
                    to={`/product/${product.id}`}
                    className={`block mt-4 text-center py-2 px-4 rounded-lg transition-colors duration-300 ${
                      product.stock === "in_stock"
                        ? "bg-blue-600 text-white hover:bg-blue-700"
                        : "bg-gray-400 text-white cursor-not-allowed"
                    }`}
                    onClick={(e) => {
                      if (product.stock === "out_of_stock") {
                        e.preventDefault(); // Prevent navigation if out of stock
                      }
                    }}
                  >
                    {product.stock === "in_stock" ? "View Product" : "Out of Stock"}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}