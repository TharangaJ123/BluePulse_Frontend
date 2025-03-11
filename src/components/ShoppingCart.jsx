import React, { useState } from "react";
import { FaTrash, FaPlus, FaMinus , FaShoppingCart  } from "react-icons/fa";
import img1 from "../assets/img1.jpg";
import img2 from "../assets/img2.jpg";
import img3 from "../assets/img3.jpg";

const ShoppingCart = () => {
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: "Wireless Headphones",
      price: 120,
      quantity: 1,
      image: img1,
    },
    { id: 2, name: "Smart Watch", price: 200, quantity: 1, image: img2 },
    { id: 3, name: "Gaming Mouse", price: 80, quantity: 1, image: img3 },
  ]);

  const updateQuantity = (id, amount) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + amount) }
          : item
      )
    );
  };

  const removeItem = (id) => {
    setCartItems(cartItems.filter((item) => item.id !== id));
  };

  const totalPrice = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  return (
    <div className="h-screen w-full bg-gray-100 flex flex-col justify-center items-center align-middle">

      <div className="w-3xl mx-auto p-6 bg-white shadow-xl rounded-lg columns-5xl">

        <div className="w-full h-15 rounded-b-2xl bg-blue-950 flex items-center justify-center align-middle mb-6 top-0">
          <h2 className="text-2xl font-semibold mb-4 text-amber-50 flex justify-center">Shopping Cart</h2>
        </div>

        {cartItems.length === 0 ? (
          <p className="text-gray-500">Your cart is empty.</p>
        ) : (
          <>
            <div className="divide-y divide-gray-200">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between py-4"
                >
                  <div className="flex items-center space-x-4 columns-2xl w-1/2">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-30 h-30 rounded-full object-cover"
                    />
                    <div>
                      <h3 className="font-medium">{item.name}</h3>
                      <p className="text-gray-500">
                        LKR.{item.price.toFixed(2)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 columns-2xl">
                    <button
                      onClick={() => updateQuantity(item.id, -1)}
                      className="p-2 bg-gray-200 rounded"
                    >
                      <FaMinus />
                    </button>
                    <span className="font-medium">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, 1)}
                      className="p-2 bg-gray-200 rounded"
                    >
                      <FaPlus />
                    </button>
                  </div>

                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <FaTrash />
                  </button>
                </div>
              ))}
            </div>

            <div className="mt-6 text-right">
              <p className="text-lg font-semibold">
                Total: LKR.{totalPrice.toFixed(2)}
              </p>
              <button className="mt-3 px-6 py-2 bg-blue-950 text-white font-medium rounded hover:bg-blue-800">
                Proceed to Checkout
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ShoppingCart;
