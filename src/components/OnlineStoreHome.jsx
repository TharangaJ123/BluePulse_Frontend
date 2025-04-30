import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import OnlineStoreNavigationBar from "./OnlineStoreNavigationBar";
import OnlineStoreHeroSection from "./OnlineStoreHeroSection";
import NavigationBar from "./NavigationBar";
import Footer from "./Footer";

export default function OnlineStoreHome() {
  const [product, setProduct] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    function getProducts() {
      axios
        .get("http://localhost:8070/products/getAllProducts")
        .then((res) => {
          setProduct(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    }
    getProducts();
  }, []);

  // Function to determine stock status
  const getStockStatus = (quantity) => {
    if (quantity === 0) {
      return "Out of Stock";
    } else if (quantity < 10) {
      return "Low Stock";
    } else {
      return "In Stock";
    }
  };

  //filtering product by searched words
  const filteredProducts = product.length
  ? product.filter(
      (p) =>
        (!searchQuery.trim() ||
          p.name.toLowerCase().includes(searchQuery.trim().toLowerCase()))
    )
  : [];

  return (
    <>
      <NavigationBar />
      <div className="mx-auto">
        <OnlineStoreHeroSection />
        <OnlineStoreNavigationBar searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}/>
        {/* Product List */}
        <div className="container mx-auto px-4 py-8" id="explore-section">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-6 justify-items-center">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <div
                  key={product._id}
                  className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 transform hover:-translate-y-1 w-70 relative"
                >
                  <div
                    className={`absolute top-2 right-2 px-3 py-1 rounded-full text-sm font-semibold ${
                      getStockStatus(product.quantity) === "Out of Stock"
                        ? "bg-red-100 text-red-800"
                        : getStockStatus(product.quantity) === "Low Stock"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    {getStockStatus(product.quantity)}
                  </div>

                  <img
                    src={`http://localhost:8070${product.imageUrl}`}
                    alt={product.name}
                    className="w-full h-56 object-cover"
                  />

                  <div className="p-4">
                    <h2 className="text-xl font-semibold text-gray-800 mb-2">
                      {product.name}
                    </h2>
                    <p className="text-gray-600 font-medium">
                      LKR {product.price.toFixed(2)}
                    </p>
                    <Link
                      to={`/singleProduct/${product._id}`}
                      className={`block mt-4 text-center py-2 px-4 rounded-lg transition-colors duration-300 ${
                        product.quantity > 0
                          ? "bg-blue-600 text-white hover:bg-blue-700"
                          : "bg-gray-400 text-white cursor-not-allowed"
                      }`}
                      onClick={(e) => {
                        if (product.quantity === 0) e.preventDefault();
                      }}
                    >
                      {product.quantity > 0 ? "View Product" : "Out of Stock"}
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center col-span-full text-gray-500">
                No matching products found.
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
