import React,{ useState } from "react";
import { FaTrash, FaPlus, FaMinus } from "react-icons/fa";
import img1 from "../assets/img1.jpg";
import img2 from "../assets/img2.jpg";
import img3 from "../assets/img3.jpg";

const ShoppingCart = () => {
  const [cartItems, setCartItems] = useState([
    { id: 1, name: "Wireless Headphones", price: 120, quantity: 1, image: img1 },
    { id: 2, name: "Smart Watch", price: 200, quantity: 1, image: img2 },
    { id: 3, name: "Gaming Mouse", price: 80, quantity: 1, image: img3 },
  ]);

  const updateQuantity = (id, amount) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, quantity: Math.max(1, item.quantity + amount) } : item
      )
    );
  };

  const removeItem = (id) => {
    setCartItems(cartItems.filter((item) => item.id !== id));
  };

  const totalPrice = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-xl rounded-lg mt-10">
      <h2 className="text-2xl font-semibold mb-4">Shopping Cart</h2>

      {cartItems.length === 0 ? (
        <p className="text-gray-500">Your cart is empty.</p>
      ) : (
        <>
          <div className="divide-y divide-gray-200">
            {cartItems.map((item) => (
              <div key={item.id} className="flex items-center justify-between py-4">
                <div className="flex items-center space-x-4">
                  <img src={item.image} alt={item.name} className="w-16 h-16 rounded-lg object-cover" />
                  <div>
                    <h3 className="font-medium">{item.name}</h3>
                    <p className="text-gray-500">LKR.{item.price.toFixed(2)}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <button onClick={() => updateQuantity(item.id, -1)} className="p-2 bg-gray-200 rounded">
                    <FaMinus />
                  </button>
                  <span className="font-medium">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, 1)} className="p-2 bg-gray-200 rounded">
                    <FaPlus />
                  </button>
                </div>

                <button onClick={() => removeItem(item.id)} className="text-red-500 hover:text-red-700">
                  <FaTrash />
                </button>
              </div>
            ))}
          </div>

          <div className="mt-6 text-right">
            <p className="text-lg font-semibold">Total: LKR.{totalPrice.toFixed(2)}</p>
            <button className="mt-3 px-6 py-2 bg-blue-600 text-white font-medium rounded hover:bg-blue-700">
              Proceed to Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ShoppingCart;
