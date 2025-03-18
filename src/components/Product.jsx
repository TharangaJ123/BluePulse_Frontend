import React from "react";
import { useParams } from "react-router-dom";
import OnlineStoreNavigationBar from "./OnlineStoreNavigationBar";

const products = [
  {
    id: 1,
    name: "Product A",
    price: 29.99,
    image: "https://picsum.photos/400",
  },
  {
    id: 2,
    name: "Puritas Water Purifier Classic (HD-CLASSIC)",
    price: 8900.0,
    image: "https://picsum.photos/400",
  },
  {
    id: 3,
    name: "Product C",
    price: 49.99,
    image: "/assets/img1.jpg",
  },
];

export default function Product() {
  const { id } = useParams();
  const product = products.find((p) => p.id === parseInt(id));

  if (!product) {
    return (
      <div className="container mx-auto p-4">
        <p className="text-red-500 text-xl">Product not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full top-20 mt-20">
      <OnlineStoreNavigationBar />
      <div className="container mx-auto p-6 max-w-7xl">
        {/* Product Details Section */}
        <div className="bg-white overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
            {/* Product Image */}
            <div className="flex flex-col">
              
              <img
                src={product.image}
                alt={product.name}
                className="w-full max-h-120 object-cover rounded-lg"
              />
            </div>

            {/* Product Information */}
            <div className="flex flex-col justify-between">
              <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                  {product.name}
              </h1>
                <p className="text-gray-600 text-lg mb-6">
                  Lorem Ipsum is simply dummy text of the printing and typesetting
                  industry. It has been the industry's standard dummy text ever
                  since the 1500s.
                </p>
              </div>

              {/* Delivery and Warranty Info */}
              <div className="space-y-4">
                <div className="flex items-center">
                  <img
                    src="https://img.icons8.com/external-flaticons-flat-flat-icons/64/external-delivery-truck-e-commerce-flaticons-flat-flat-icons.png"
                    alt="Delivery"
                    className="w-10 h-10 mr-3"
                  />
                  <span className="text-emerald-700 text-xl font-semibold">
                    Delivery - Standard 3 To 5 Working Days
                  </span>
                </div>
                <div className="flex items-center">
                  <img
                    src="https://img.icons8.com/office/40/approval.png"
                    alt="Warranty"
                    className="w-10 h-10 mr-3"
                  />
                  <span className="text-emerald-700 text-xl font-semibold">
                    1 Year(s) Manufacturer Warranty
                  </span>
                </div>
              </div>

              {/* Price and Add to Cart */}
              <div className="mt-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Price: LKR {product.price.toFixed(2)}
                </h2>
                <button className="w-full md:w-auto px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-colors duration-300">
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Specifications Table */}
        <div className="bg-white mt-8 p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Specifications
          </h2>
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-3 text-left text-gray-700 uppercase font-semibold">
                  Specification
                </th>
                <th className="p-3 text-left text-gray-700 uppercase font-semibold">
                  Description
                </th>
              </tr>
            </thead>
            <tbody>
              {[
                { spec: "Material", desc: "High-quality plastic" },
                { spec: "Dimensions", desc: "20 x 15 x 10 cm" },
                { spec: "Weight", desc: "1.5 kg" },
                { spec: "Color", desc: "White" },
                { spec: "Warranty", desc: "1 year" },
              ].map((row, index) => (
                <tr
                  key={index}
                  className="hover:bg-gray-50 transition-colors duration-200"
                >
                  <td className="p-3 border-b border-gray-200 text-gray-800">
                    {row.spec}
                  </td>
                  <td className="p-3 border-b border-gray-200 text-gray-800">
                    {row.desc}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}