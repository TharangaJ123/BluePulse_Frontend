import React, { useState } from "react";
import axios from "axios";
import NavigationBar from "./NavigationBar";
import Footer from "./Footer";

const FeedbackForm = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [rating, setRating] = useState(0);
  const [errors, setErrors] = useState({});

  // Validate the form
  const validateForm = () => {
    let errors = {};
    let isValid = true;

    if (!name.trim()) {
      errors.name = "Name is required";
      isValid = false;
    }

    if (!email.trim()) {
      errors.email = "Email is required";
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = "Invalid email format";
      isValid = false;
    }

    if (!category) {
      errors.category = "Please select a category";
      isValid = false;
    }

    if (!description.trim()) {
      errors.description = "Description cannot be empty";
      isValid = false;
    }

    if (rating === 0) {
      errors.rating = "Please select a rating";
      isValid = false;
    }

    setErrors(errors);
    return isValid;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return; // Stop submission if validation fails
    }

    const newFeedback = {
      id: Math.random().toString(36).substr(2, 9), // Generate a unique ID
      name: name,
      Email: email, // Match the backend's field name
      section: category, // Map 'category' to 'section'
      message: description, // Map 'description' to 'message'
      percentage: rating.toString(), // Map 'rating' to 'percentage' and convert to string
    };

    try {
      const response = await axios.post(
        "http://localhost:8070/feedback/add",
        newFeedback
      );
      if (response.data) {
        alert("Feedback Added Successfully!");
        // Reset form fields
        setName("");
        setEmail("");
        setCategory("");
        setDescription("");
        setRating(0);
        setErrors({});
      }
    } catch (err) {
      console.error("Error submitting feedback:", err);
      alert("Failed to submit feedback. Please try again.");
    }
  };

  return (
    <div>
      <NavigationBar />
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-white flex flex-col md:flex-row w-full max-w-4xl overflow-hidden">
          {/* Image Section */}
          <div
            className="w-full md:w-1/2 bg-cover bg-center"
            style={{
              backgroundImage:
                "url('https://source.unsplash.com/800x600/?feedback')",
            }}
          >
            <div className="h-full bg-black bg-opacity-50 flex items-center justify-center">
              <h2 className="text-white text-4xl font-bold text-center p-8">
                We Value Your Feedback!
              </h2>
            </div>
          </div>

          {/* Form Section */}
          <div className="w-full md:w-1/2 p-8">
            <h2 className="text-3xl font-bold mb-6 text-gray-800 text-center">
              Feedback Form
            </h2>

            {/* Name Field */}
            <div className="mb-6">
              <label
                className="block text-gray-700 text-sm font-semibold mb-2"
                htmlFor="name"
              >
                Name
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                placeholder="Enter your name"
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name}</p>
              )}
            </div>

            {/* Email Field */}
            <div className="mb-6">
              <label
                className="block text-gray-700 text-sm font-semibold mb-2"
                htmlFor="email"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                placeholder="Enter your email"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            {/* Category Dropdown */}
            <div className="mb-6">
              <label
                className="block text-gray-700 text-sm font-semibold mb-2"
                htmlFor="category"
              >
                Category
              </label>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              >
                <option value="" disabled>
                  Select a category
                </option>
                <option value="General">General</option>
                <option value="Bug Report">Bug Report</option>
                <option value="Feature Request">Feature Request</option>
                <option value="Improvement">Improvement</option>
              </select>
              {errors.category && (
                <p className="text-red-500 text-sm mt-1">{errors.category}</p>
              )}
            </div>

            {/* Description Textarea */}
            <div className="mb-6">
              <label
                className="block text-gray-700 text-sm font-semibold mb-2"
                htmlFor="description"
              >
                Description
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                rows="4"
                placeholder="Enter your feedback"
              />
              {errors.description && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.description}
                </p>
              )}
            </div>

            {/* Star Rating */}
            <div className="mb-8">
              <label className="block text-gray-700 text-sm font-semibold mb-2">
                Rating
              </label>
              <div className="flex space-x-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    type="button"
                    key={star}
                    onClick={() => setRating(star)}
                    className={`text-3xl ${
                      star <= rating ? "text-yellow-400" : "text-gray-300"
                    } hover:text-yellow-400 focus:outline-none transition-all`}
                  >
                    ★
                  </button>
                ))}
              </div>
              {errors.rating && (
                <p className="text-red-500 text-sm mt-1">{errors.rating}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-purple-600 text-white py-3 px-4 rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all" onClick={handleSubmit}
            >
              Submit Feedback
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default FeedbackForm;
