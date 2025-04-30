import React from "react";
import { motion } from "framer-motion";
import { CheckCircleIcon } from "@heroicons/react/24/outline";
import ModernFooter from "./Footer";
import NavigationBar from "./NavigationBar";
import { Link } from "react-router-dom";

export default function ThankYouPage() {
  return (
    <div>
        <NavigationBar/>
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-cyan-50 flex items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden"
      >
        {/* Header Section */}
        <div className="bg-gradient-to-r from-blue-500 to-cyan-400 p-8 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="flex justify-center mb-4"
          >
            <CheckCircleIcon className="h-16 w-16 text-white" />
          </motion.div>
          <h1 className="text-3xl font-bold text-white mb-2">Order Confirmed!</h1>
          <p className="text-blue-100">Thank you for choosing our water solutions</p>
        </div>

        {/* Main Content */}
        <div className="p-8 text-center">
          <img 
            src="../src/assets/bplogo_blackText.png"
            alt="Water drop illustration"
            className="w-40 h-40 mx-auto mb-6 object-contain"
          />
          
          <h2 className="text-2xl font-semibold text-gray-800 mb-3">
            Your Clean Water Journey Begins
          </h2>
          
          <p className="text-gray-600 mb-6">
            We've received your order and are preparing it with care. You'll receive a confirmation email shortly.
          </p>
          
          <div className="space-y-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-cyan-500 hover:bg-cyan-600 text-white py-3 px-4 rounded-lg font-medium transition-colors shadow-md"
            >
              <Link to={"/onlineStoreHome"}>Continue Shopping</Link>
            </motion.button>

          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-8 py-4 border-t border-gray-200 text-center">
          <p className="text-gray-600 text-sm">
            Questions? <a href="#" className="text-cyan-600 hover:underline">Contact support</a> 
            <span className="mx-2">•</span>
                +94 37 695 4879
          </p>
        </div>
      </motion.div>
    </div>
    <ModernFooter/>
    </div>
  );
}