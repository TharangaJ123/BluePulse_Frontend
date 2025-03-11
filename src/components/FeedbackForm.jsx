import React, { useState } from "react";

const FeedbackForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    category: "General",
    message: "",
    rating: 0,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleRating = (rate) => {
    setFormData({ ...formData, rating: rate });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitted Feedback:", formData);
  };

  return (
    <div
      className="relative min-h-screen bg-cover bg-center flex items-center justify-center p-10" // Centering the form
      style={{
        backgroundImage: "url('https://img.freepik.com/free-vector/organic-flat-feedback-concept-illustrated_23-2148952275.jpg?t=st=1741632902~exp=1741636502~hmac=3b36cd14fbf109ee8aaab9bb9b2123ca65c821b1c7d8bc5b3baae7cb240ee04f&w=2000')",
      }}
    >
      <div className="max-w-md bg-white p-6 rounded-2xl shadow-lg w-96">
        <h2 className="text-2xl font-semibold mb-4 text-center">Feedback Form</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Your Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            required
          />
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="General">General</option>
            <option value="Water Quality">Water Quality</option>
            <option value="Service">Service</option>
            <option value="Other">Other</option>
          </select>
          <textarea
            name="message"
            placeholder="Your Feedback"
            value={formData.message}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            required
          ></textarea>
          <div className="flex space-x-2 justify-center">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                className={`text-2xl transition-transform transform hover:scale-110 ${
                  formData.rating >= star ? "text-yellow-400" : "text-gray-400"
                }`}
                onClick={() => handleRating(star)}
              >
                ★
              </button>
            ))}
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition-all"
          >
            Submit Feedback
          </button>
        </form>
      </div>
    </div>
  );
};

export default FeedbackForm;
