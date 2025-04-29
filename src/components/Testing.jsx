import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Star Rating Component
const StarRating = ({ rating }) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    stars.push(
      <span key={i} className={i <= rating ? "text-yellow-500" : "text-gray-300"}>
        ★
      </span>
    );
  }
  return <div className="flex">{stars}</div>;
};

const Testing = () => {
  const [feedbacks, setFeedbacks] = useState([]);

  useEffect(() => {
    function getFeedbacks() {
      axios.get("http://localhost:8070/feedback/")
        .then((res) => {
          console.log(res.data);
          setFeedbacks(res.data); // Assuming the response data is an array of feedbacks
        })
        .catch((err) => {
          console.error("Error fetching feedbacks:", err);
        });
    }

    getFeedbacks(); // Call the function to fetch feedbacks
  }, []);

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-center">Feedback</h1>
      <h2 className="text-2xl font-semibold mb-4 text-center">Clients Say</h2>

      <div className="space-y-6 max-w-2xl mx-auto">
        {feedbacks.map((feedback, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold">{feedback.name}</h3>
              <button className="text-gray-600 hover:text-red-500">❤️ Like</button>
            </div>
            <p className="text-gray-600">{feedback.username}</p>
            <div className="mt-2">
              <StarRating rating={feedback.rating} />
            </div>
            <p className="mt-4 text-gray-700">{feedback.message}</p>
            <p className="mt-2 text-sm text-gray-500">{feedback.timestamp}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Testing;