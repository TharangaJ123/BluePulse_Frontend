import { motion } from "framer-motion";
import React from "react";

export default function HomeFeedbackFormSection() {
  // Function to handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent the default form submission behavior

    // Get form data
    const formData = new FormData(event.target);
    const name = formData.get("name");
    const email = formData.get("email");
    const message = formData.get("message");

    // Send data to the backend
    try {
      const response = await fetch("http://localhost:8070/Contact/addContact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, message }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit the form");
      }

      const result = await response.json();
      alert(result.message); // Show success message
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Failed to submit the form. Please try again.");
    }
  };

  return (
    <div className="w-full bg-blue-950 py-20">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-stretch">
          {/* Left Side: Form */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col justify-center"
          >
            <h2 className="text-3xl font-bold text-white mb-6">
              We'd Love to Hear From You
            </h2>
            <p className="text-white mb-8">
              Share your feedback or inquiries, and we'll get back to you shortly.
            </p>
            <form className="space-y-6" onSubmit={handleSubmit}>
              {/* Full Name Input */}
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-white"
                >
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  placeholder="John Doe"
                  className="mt-1 block w-full px-4 py-2 bg-transparent border-b-1 border-white text-white placeholder-gray-300 focus:outline-none focus:border-amber-500"
                  required
                />
              </div>

              {/* Email Input */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-white"
                >
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="johndoe@example.com"
                  className="mt-1 block w-full px-4 py-2 bg-transparent border-b-1 border-white text-white placeholder-gray-300 focus:outline-none focus:border-amber-500"
                  required
                />
              </div>

              {/* Message Textarea */}
              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-white"
                >
                  Your Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows="4"
                  placeholder="Type your message here..."
                  className="mt-1 block w-full px-4 py-2 bg-transparent border-b-1 border-white text-white placeholder-gray-300 focus:outline-none focus:border-amber-500"
                  required
                ></textarea>
              </div>

              {/* Submit Button */}
              <div>
                <button
                  type="submit"
                  className="w-full bg-blue-900 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-300"
                >
                  Submit
                </button>
              </div>
            </form>
          </motion.div>

          {/* Right Side: Photo */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="hidden md:block h-full"
          >
            <img
              src="../src/assets/why.jpg" // Replace with your image URL
              alt="Feedback Form"
              className="w-full h-full object-cover shadow-lg"
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
}