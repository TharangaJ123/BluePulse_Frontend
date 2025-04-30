import React from "react";
import { FaCheckCircle } from "react-icons/fa";

const PaymentSuccessPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-xl shadow-lg p-8 sm:p-12 max-w-md w-full text-center">
        {/* Success Icon */}
        <div className="flex justify-center">
          <FaCheckCircle className="h-16 w-16 text-green-500" />
        </div>

        {/* Thank You Message */}
        <h1 className="text-3xl font-bold text-green-600 mt-6">
         Payment Successful
        </h1>
        <p className="mt-4 text-gray-600">
          We will contact you soon.
        </p>

        
      </div>
    </div>
  );
};

export default PaymentSuccessPage;