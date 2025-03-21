import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const CommunityPost = () => {
  const { id } = useParams(); // Get the post ID from the URL
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [photo, setPhoto] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch the single post data
  useEffect(() => {
    const fetchPost = async () => {
      try {
        console.log("Fetching post with ID:", id); // Debugging log
        const response = await fetch(`http://localhost:8070/commi/get/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch post");
        }
        const data = await response.json();
        console.log("API Response:", data); // Debugging log

        // Access the nested `commi` object
        setEmail(data.commi.email);
        setDescription(data.commi.description);
        setLocation(data.commi.location);
        setPhoto(data.commi.photo);
      } catch (err) {
        console.error("Error:", err);
        setError("Failed to fetch post. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  if (loading) {
    return <div className="container mx-auto p-4">Loading...</div>;
  }

  if (error) {
    return <div className="container mx-auto p-4 text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <button
        onClick={() => navigate(-1)} // Go back to the previous page
        className="bg-purple-600 text-white px-4 py-2 rounded-full hover:bg-purple-700 transition duration-300 mb-4"
      >
        Back to Community
      </button>
      <div className="bg-white p-6 rounded-lg shadow-lg">
        {photo && (
          <img
            src={`http://localhost:8070${photo}`} // If photo is a relative path
            alt="Post"
            className="w-full h-64 object-cover rounded-lg mb-4"
          />
        )}
        <h1 className="text-3xl font-bold mb-2">
          {email || "No email available"}
        </h1>
        <p className="text-gray-600 mb-4">
          {description || "No description available"}
        </p>
        <p className="text-gray-500 text-sm mb-4">
          {location || "No location available"}
        </p>
      </div>
    </div>
  );
};

export default CommunityPost;