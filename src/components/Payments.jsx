import React,{ useState } from "react";

export default function Payments() {
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("credit");
  const [cardDetails, setCardDetails] = useState({ number: "", expiry: "", cvv: "" });

  const handlePayment = (e) => {
    e.preventDefault();
    alert("Payment Successful!");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Water Resource Payment</h2>
        <form onSubmit={handlePayment} className="space-y-4">
          {/* Name Input */}
          <div>
            <label className="block font-medium">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 border rounded mt-1"
              required
            />
          </div>

          {/* Contact Number */}
          <div>
            <label className="block font-medium">Contact Number</label>
            <input
              type="tel"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              className="w-full p-2 border rounded mt-1"
              required
            />
          </div>

          {/* Payment Method Selection */}
          <div>
            <label className="block font-medium">Payment Method</label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="w-full p-2 border rounded mt-1"
            >
              <option value="credit">Credit Card</option>
              <option value="debit">Debit Card</option>
              <option value="paypal">PayPal</option>
            </select>
          </div>

          {/* Card Details */}
          {paymentMethod !== "paypal" && (
            <div className="space-y-2">
              <label className="block font-medium">Card Number</label>
              <input
                type="text"
                value={cardDetails.number}
                onChange={(e) => setCardDetails({ ...cardDetails, number: e.target.value })}
                className="w-full p-2 border rounded"
                required
              />

              <div className="flex gap-2">
                <div className="w-1/2">
                  <label className="block font-medium">Expiry Date</label>
                  <input
                    type="text"
                    value={cardDetails.expiry}
                    onChange={(e) => setCardDetails({ ...cardDetails, expiry: e.target.value })}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
                <div className="w-1/2">
                  <label className="block font-medium">CVV</label>
                  <input
                    type="text"
                    value={cardDetails.cvv}
                    onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value })}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
              </div>
            </div>
          )}

          {/* Unique Feature: Water Usage Analysis */}
          <div className="bg-blue-100 p-4 rounded-lg mt-4">
            <h3 className="font-semibold">Water Usage Analysis</h3>
            <p className="text-sm text-gray-600">Based on your previous payments, you consume an average of 50 liters per day.</p>
          </div>

          {/* Submit Button */}
          <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
            Pay Now
          </button>
        </form>
      </div>
    </div>
  );
}
