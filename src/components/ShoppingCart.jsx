import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaTrash, FaPlus, FaMinus } from "react-icons/fa";
import { Navigate } from "react-router-dom";

const ShoppingCart = () => {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCartItems(savedCart);
  }, []);

  const updateQuantity = (id, amount) => {
    const updatedCart = cartItems.map((item) =>
      item.id === id
        ? { ...item, quantity: Math.max(1, item.quantity + amount) }
        : item
    );
    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const removeItem = (id) => {
    const updatedCart = cartItems.filter((item) => item.id !== id);
    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const totalPrice = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

    // Function to handle checkout and update product quantities
    const handleCheckout = async () => {
      try {
        const updatedCart = await Promise.all(
          cartItems.map(async (item) => {
            // get current items quantity from the database
            const response = await axios.get(`http://localhost:8070/products/getProduct/${item.id}`);
            const currentQuantity = response.data.quantity;
  
            // Calculate the new quantity
            const newQuantity = currentQuantity - item.quantity;
            if (newQuantity < 0) {
              alert(`Not enough stock for ${item.name}!`);
              return item; // Keep it in the cart
            }
  
            // Update quantity in the backend
            await axios.put(`http://localhost:8070/products/${item.id}`, { quantity: newQuantity });
  
            return null; // Remove item from cart after checkout
          })
        );
  
        // Remove items that were checked out successfully
        const filteredCart = updatedCart.filter((item) => item !== null);
  
        // Update local storage and state
        setCartItems(filteredCart);
        localStorage.setItem("cart", JSON.stringify(filteredCart));
  
        alert("Checkout successful!");
        window.location.href="/waterResourceFinance";
      } catch (error) {
        console.error("Error updating product quantities:", error);
        alert("Error processing checkout. Please try again.");
      }
    };

  return (
    <div className="h-screen w-full bg-gray-100 flex flex-col justify-center items-center">
      <div className="w-3xl mx-auto p-6 bg-white shadow-xl rounded-lg">
        <div className="w-full h-15 rounded-b-2xl bg-blue-950 flex items-center justify-center mb-6">
          <h2 className="text-2xl font-semibold text-amber-50">Shopping Cart</h2>
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
                  <div className="flex items-center space-x-4 w-1/2">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-30 h-30 object-cover"
                    />
                    <div>
                      <h3 className="font-medium">{item.name}</h3>
                      <p className="text-gray-500">
                        LKR {item.price.toFixed(2)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
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
                Total: LKR {totalPrice.toFixed(2)}
              </p>
              <button className="mt-3 px-6 py-2 bg-blue-950 text-white font-medium rounded hover:bg-blue-800" onClick={handleCheckout}>
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
