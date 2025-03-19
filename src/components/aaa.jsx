import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import OnlineStoreNavigationBar from "./OnlineStoreNavigationBar";

export default function Product() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [category, setCategory] = useState("");
  const [quantity, setQuantity] = useState("");

  useEffect(() => {
    function getProduct() {
      axios
        .get(`http://localhost:8070/products/getProduct/${id}`)
        .then((res) => {
          setName(res.data.name);
          setPrice(res.data.price);
          setDescription(res.data.description);
          setImageUrl(res.data.imageUrl);
          setCategory(res.data.category);
          setQuantity(res.data.quantity);
        })
        .catch((err) => {
          console.log(err);
        });
    }
    getProduct();
  }, [id]);

  const addToCart = () => {
    const product = {
      id,
      name,
      price: Number(price),
      image: `http://localhost:8070${imageUrl}`,
      quantity: 1,
    };

    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const existingItem = cart.find((item) => item.id === id);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push(product);
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    alert("Item added to cart!");
  };

  return (
    <div className="min-h-screen w-full top-20 mt-20">
      <OnlineStoreNavigationBar />
      <div className="container mx-auto p-6 max-w-7xl">
        <div className="bg-white overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
            <div className="flex flex-col">
              <img
                src={`http://localhost:8070${imageUrl}`}
                alt={name}
                className="w-full max-h-120 object-cover rounded-lg"
              />
            </div>
            <div className="flex flex-col justify-between">
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-4">{name}</h1>
                <p className="text-gray-600 text-lg mb-6">{description}</p>
              </div>
              <div className="space-y-4">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Price: LKR {Number(price).toFixed(2)}
                </h2>
                <div className="flex space-x-4">
                  <button
                    onClick={addToCart}
                    className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-colors duration-300"
                  >
                    Add to Cart
                  </button>
                  <button
                    onClick={() => navigate("/cart")}
                    className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 transition-colors duration-300"
                  >
                    Go to Cart
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>    
    </div>
  );
}
