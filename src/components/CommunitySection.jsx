import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NavigationBar from "./NavigationBar";
import Footer from "./Footer";
import comImage from "../assets/community_bg.jpg";

const CommunitySection = () => {
  const [formData, setFormData] = useState({
    photo: null,
    email: "",
    description: "",
    location: "",
  });

  const [posts, setPosts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [comments, setComments] = useState({});
  const [likes, setLikes] = useState({});
  const [menuOpen, setMenuOpen] = useState(null);
  const [editingPost, setEditingPost] = useState(null); // Track which post is being edited
  const navigate = useNavigate(); // Hook for navigation

  // Fetch all posts when the component mounts
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch("http://localhost:8070/commi/getAll");
        if (!response.ok) {
          throw new Error("Failed to fetch posts");
        }
        const data = await response.json();
        setPosts(data);
        const initialLikes = {};
        const initialComments = {};
        data.forEach((post) => {
          initialLikes[post._id] = 0;
          initialComments[post._id] = [];
        });
        setLikes(initialLikes);
        setComments(initialComments);
      } catch (err) {
        console.error("Error:", err);
        alert("Failed to fetch posts. Please try again.");
      }
    };

    fetchPosts();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "photo") {
      setFormData({ ...formData, photo: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataToSend = new FormData();
    formDataToSend.append("photo", formData.photo);
    formDataToSend.append("email", formData.email);
    formDataToSend.append("description", formData.description);
    formDataToSend.append("location", formData.location);

    try {
      const response = await fetch("http://localhost:8070/commi/add", {
        method: "POST",
        body: formDataToSend,
      });

      if (!response.ok) {
        throw new Error("Failed to add post");
      }

      const data = await response.json();
      setPosts([...posts, data.data]);
      setFormData({
        photo: null,
        email: "",
        description: "",
        location: "",
      });
      setShowForm(false);
    } catch (err) {
      console.error("Error:", err);
      alert("Failed to add post. Please try again.");
    }
  };

  const handleLike = (postId) => {
    setLikes((prevLikes) => ({
      ...prevLikes,
      [postId]: prevLikes[postId] + 1,
    }));
  };

  const handleComment = (postId, comment) => {
    setComments((prevComments) => ({
      ...prevComments,
      [postId]: [...prevComments[postId], comment],
    }));
  };

  const toggleMenu = (postId) => {
    setMenuOpen(menuOpen === postId ? null : postId);
  };

  const handleEdit = (post) => {
    setEditingPost(post); // Set the post being edited
    setFormData({
      photo: null,
      email: post.email,
      description: post.description,
      location: post.location,
    });
  };

  const handleDelete = async (postId) => {
    try {
      const response = await fetch(`http://localhost:8070/commi/delete/${postId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete post");
      }

      // Remove the deleted post from the state
      setPosts(posts.filter((post) => post._id !== postId));
      alert("Post deleted successfully!");
    } catch (err) {
      console.error("Error:", err);
      alert("Failed to delete post. Please try again.");
    }
  };

  const handleUpdatePost = async (e) => {
    e.preventDefault();

    const formDataToSend = new FormData();
    formDataToSend.append("photo", formData.photo);
    formDataToSend.append("email", formData.email);
    formDataToSend.append("description", formData.description);
    formDataToSend.append("location", formData.location);

    try {
      const response = await fetch(`http://localhost:8070/commi/update/${editingPost._id}`, {
        method: "PUT",
        body: formDataToSend,
      });

      if (!response.ok) {
        throw new Error("Failed to update post");
      }

      const updatedPost = await response.json();
      setPosts((prevPosts) =>
        prevPosts.map((post) => (post._id === editingPost._id ? updatedPost.data : post))
      );
      setEditingPost(null); // Close the edit form
      alert("Post updated successfully!");
    } catch (err) {
      console.error("Error:", err);
      alert("Failed to update post. Please try again.");
    }
  };

  return (
    <div className="bg-gradient-to-r from-purple-50 to-blue-50 min-h-screen">
      <NavigationBar/>
      {/* Hero Section */}
      <div className="bg-blue-600 text-white py-20 w-full bg-cover bg-center" style={{ backgroundImage: `url(${comImage})` }}>
        <div className="container mx-auto text-center">
          <h1 className="text-5xl font-bold mb-4">Welcome to Our Community!</h1>
          <p className="text-xl mb-8">
            Share your thoughts, connect with others, and be part of something amazing. Together, we can build a vibrant
            and supportive community.
          </p>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-white text-blue-600 px-8 py-3 rounded-full hover:bg-gray-100 transition duration-300 transform hover:scale-105 shadow-lg border border-blue-600"
          >
            {showForm ? "Cancel" : "Share Your Story"}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto p-4">
        {/* Add Post Button */}

        {/* Form */}
        {showForm && (
          <form onSubmit={handleSubmit} method="post" className="bg-white p-8 rounded-2xl shadow-2xl max-w-2xl mx-auto">
            <div className="mb-6">
              <label className="block text-gray-700 font-bold mb-2">Photo</label>
              <input
                type="file"
                name="photo"
                onChange={handleChange}
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                accept="image/*"
              />
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 font-bold mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your email"
              />
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 font-bold mb-2">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Share your thoughts..."
                rows="4"
              />
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 font-bold mb-2">Location</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your location"
              />
            </div>

            <div className="text-center">
              <button
                type="submit"
                className="bg-blue-600 text-white px-8 py-3 rounded-full hover:bg-blue-700 transition duration-300 transform hover:scale-105 shadow-lg"
              >
                Post
              </button>
            </div>
          </form>
        )}







        {/* Edit Form */}
        {editingPost && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-2xl w-full transform transition-all duration-300 scale-95 hover:scale-100">
              <h2 className="text-2xl font-bold text-blue-800 mb-6">Edit Post</h2>
              <form onSubmit={handleUpdatePost}>
                <div className="mb-6">
                  <label className="block text-gray-700 font-bold mb-2">Photo</label>
                  <input
                    type="file"
                    name="photo"
                    onChange={handleChange}
                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    accept="image/*"
                  />
                </div>

                <div className="mb-6">
                  <label className="block text-gray-700 font-bold mb-2">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your email"
                  />
                </div>

                <div className="mb-6">
                  <label className="block text-gray-700 font-bold mb-2">Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Share your thoughts..."
                    rows="4"
                  />
                </div>

                <div className="mb-6">
                  <label className="block text-gray-700 font-bold mb-2">Location</label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your location"
                  />
                </div>

                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => setEditingPost(null)}
                    className="bg-gray-500 text-white px-6 py-2 rounded-full hover:bg-gray-600 transition duration-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition duration-300"
                  >
                    Update
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Preview Section */}
        <div className="mt-12">
          <h2 className="text-3xl font-bold mb-8 text-center text-blue-700">Community Posts</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post, index) => (
              <div key={index} className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 relative">
                {/* 3-Dots Menu */}
                <div className="absolute top-4 right-4">
                  <button
                    onClick={() => toggleMenu(post._id)}
                    className="text-gray-500 hover:text-gray-700 focus:outline-none"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                      />
                    </svg>
                  </button>

                  {/* Edit and Delete Buttons */}
                  {menuOpen === post._id && (
                    <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                      <div className="py-1">
                        <button
                          onClick={() => handleEdit(post)}
                          className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(post._id)}
                          className="block w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {post.photo && (
                  <img
                    src={`http://localhost:8070${post.photo}`}
                    alt="Post"
                    className="w-full h-48 object-cover rounded-lg mb-4"
                  />
                )}
                <h1
                  onClick={() => navigate(`/SingleCommunity/${post._id}`)} // Navigate to single post page
                  className="text-gray-700 font-bold mb-2 cursor-pointer hover:text-blue-600"
                >
                  {post.email}
                </h1>
                <p className="text-gray-600 mb-4">{post.description}</p>
                <p className="text-gray-500 text-sm mb-4">{post.location}</p>

                {/* Like and Comment Section */}
                <div className="flex items-center justify-between mb-4">
                  <button
                    onClick={() => handleLike(post._id)}
                    className="flex items-center text-blue-600 hover:text-blue-700"
                  >
                    <span className="mr-2">❤️</span> {likes[post._id] || 0} Likes
                  </button>
                  <button
                    onClick={() => {
                      const comment = prompt("Enter your comment:");
                      if (comment) {
                        handleComment(post._id, comment);
                      }
                    }}
                    className="text-blue-600 hover:text-blue-700"
                  >
                    💬 Comment
                  </button>
                </div>

                {/* Display Comments */}
                {comments[post._id] && comments[post._id].length > 0 && (
                  <div className="mt-4">
                    <h3 className="text-sm font-bold text-gray-700 mb-2">Comments:</h3>
                    <ul>
                      {comments[post._id].map((comment, idx) => (
                        <li key={idx} className="text-sm text-gray-600 mb-1">
                          💬 {comment}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer/>
    </div>
  );
};

export default CommunitySection;