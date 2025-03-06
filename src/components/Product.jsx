import React from "react";
import { useParams } from "react-router-dom";

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
    <div className="container mx-auto p-4">
      <div className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-lg">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-64 object-cover rounded-lg"
        />
        <h1 className="text-2xl font-bold mt-4">{product.name}</h1>
        <p className="text-gray-600 mt-2">${product.price.toFixed(2)}</p>
        <button className="bg-green-500 text-white py-2 px-4 rounded-lg mt-4 w-full hover:bg-green-600 transition-colors duration-300">
          Add to Cart
        </button>
      </div>
    </div>
  );
}