import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Footer from "./Footer";
import NavigationBar from "./NavigationBar";

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
    return (
      <div className="flex items-center justify-center min-h-screen bg-cover bg-center" style={{ backgroundImage: `url('https://example.com/path/to/image.jpg')` }}>
        <div className="text-2xl font-semibold text-white bg-blue-600 bg-opacity-90 p-4 rounded-lg">
          Loading...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-cover bg-center" style={{ backgroundImage: `url('https://example.com/path/to/image.jpg')` }}>
        <div className="text-2xl font-semibold text-white bg-blue-600 bg-opacity-90 p-4 rounded-lg">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div>
    <NavigationBar/>
    <div className="min-h-screen bg-cover bg-center p-6 relative" style={{ backgroundImage: `url('https://example.com/path/to/image.jpg')` }}>
      {/* Navigation Color Bar */}
      <div className=" left-0 w-full bg-blue-600 p-4 shadow-lg z-50">
        <div className="container mx-auto flex justify-between items-center">
          {/* Back Button */}
          <button
            onClick={() => navigate(-1)} // Go back to the previous page
            className="bg-white text-blue-600 px-6 py-2 rounded-full hover:bg-blue-50 transition duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            Back to Community
          </button>

          {/* Additional Navigation Links (Optional) */}
          <div className="space-x-4">
            {/* Add additional navigation links here if needed */}
          </div>
        </div>
      </div>

      {/* Post Card */}
      <div className="max-w-4xl mx-auto mt-20"> {/* Adjusted max-width for better layout */}
        <div className="bg-white p-6 rounded-2xl shadow-2xl hover:shadow-3xl transition-shadow duration-300">
          {/* Flex Container for Photo and Details */}
          <div className="flex flex-col md:flex-row gap-6">
            {/* Photo on Left Side */}
            {photo && (
              <div className="w-full md:w-1/2">
                <img
                  src={`http://localhost:8070${photo}`} // If photo is a relative path
                  alt="Post"
                  className="w-full h-64 md:h-96 object-cover rounded-lg transform hover:scale-105 transition-transform duration-300"
                />
              </div>
            )}

            {/* Details on Right Side */}
            <div className="w-full md:w-1/2 space-y-4">
              <h1 className="text-2xl font-bold text-blue-600">
                {email || "No email available"}
              </h1>
              <p className="text-gray-700">
                {description || "No description available"}
              </p>
              <p className="text-blue-600 text-sm">
                {location || "No location available"}
              </p>
            </div>
          </div>
        </div>
      </div>
      
    </div>
    <Footer/>
    </div>
  );
};

export default CommunityPost;