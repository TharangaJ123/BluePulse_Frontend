import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiMoreVertical,
  FiMessageSquare,
  FiX,
  FiSend,
  FiEdit2,
  FiTrash2,
  FiMapPin,
  FiClock,
  FiUser,
  FiPlus,
} from "react-icons/fi";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import ModernFooter from "./Footer";
import NavigationBar from "./NavigationBar";

const CommunitySection = () => {
  const [formData, setFormData] = useState({
    photo: null,
    email: "",
    description: "",
    location: "",
  });

  const [posts, setPosts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [menuOpen, setMenuOpen] = useState(null);
  const [editingPost, setEditingPost] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeComment, setActiveComment] = useState(null);
  const [commentText, setCommentText] = useState("");
  const navigate = useNavigate();

  // Add useEffect to fetch user details from JWT
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        // Get user data from localStorage
        const userData = localStorage.getItem('user');
        if (userData) {
          const user = JSON.parse(userData);
          setFormData(prevData => ({
            ...prevData,
            email: user.email || '',
          }));
        } else {
          // If no user data in localStorage, try to fetch from API
          const token = localStorage.getItem('accessToken');
          if (!token) return;

          const response = await fetch('http://localhost:8070/User/me', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });

          if (response.ok) {
            const userData = await response.json();
            setFormData(prevData => ({
              ...prevData,
              email: userData.email || '',
            }));
          }
        }
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    };

    fetchUserDetails();
  }, []);

  // Fetch all posts when the component mounts
  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("http://localhost:8070/commi/getAll");
        if (!response.ok) {
          throw new Error("Failed to fetch posts");
        }
        const data = await response.json();
        setPosts(data);
      } catch (err) {
        console.error("Error:", err);
        alert("Failed to fetch posts. Please try again.");
      } finally {
        setIsLoading(false);
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
    setIsLoading(true);

    // Validation checks
    if (!formData.email || !formData.description || !formData.location) {
      alert("Please fill in all required fields.");
      setIsLoading(false);
      return;
    }

    if (!formData.photo) {
      alert("Please upload a photo.");
      setIsLoading(false);
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      alert("Please enter a valid email address.");
      setIsLoading(false);
      return;
    }

    if (formData.description.length < 10) {
      alert("Description must be at least 10 characters long.");
      setIsLoading(false);
      return;
    }

    // Proceed with form submission
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
      setPosts([data.data, ...posts]);
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
    } finally {
      setIsLoading(false);
    }
  };

  const handleLike = async (postId) => {
    try {
      const response = await fetch(
        `http://localhost:8070/commi/${postId}/like`,
        {
          method: "POST",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to like post");
      }

      const data = await response.json();
      setPosts(
        posts.map((post) =>
          post._id === postId ? { ...post, likes: data.likes } : post
        )
      );
    } catch (err) {
      console.error("Error:", err);
      alert("Failed to like post. Please try again.");
    }
  };

  const handleCommentSubmit = async (postId) => {
    if (!commentText.trim()) return;

    try {
      const response = await fetch(
        `http://localhost:8070/commi/${postId}/comments`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ text: commentText }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to add comment");
      }

      const data = await response.json();
      setPosts(
        posts.map((post) =>
          post._id === postId
            ? {
                ...post,
                comments: [...post.comments, data.comment],
              }
            : post
        )
      );
      setCommentText("");
      setActiveComment(null);
    } catch (err) {
      console.error("Error:", err);
      alert("Failed to add comment. Please try again.");
    }
  };

  const toggleMenu = (postId) => {
    setMenuOpen(menuOpen === postId ? null : postId);
  };

  const handleEdit = (post) => {
    setEditingPost(post);
    setFormData({
      photo: null,
      email: post.email,
      description: post.description,
      location: post.location,
    });
  };

  const handleDelete = async (postId) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;

    try {
      const response = await fetch(
        `http://localhost:8070/commi/delete/${postId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete post");
      }

      setPosts(posts.filter((post) => post._id !== postId));
      alert("Post deleted successfully!");
    } catch (err) {
      console.error("Error:", err);
      alert("Failed to delete post. Please try again.");
    }
  };

  const handleUpdatePost = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!formData.email || !formData.description || !formData.location) {
      alert("Please fill in all required fields.");
      setIsLoading(false);
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      alert("Please enter a valid email address.");
      setIsLoading(false);
      return;
    }

    if (formData.description.length < 10) {
      alert("Description must be at least 10 characters long.");
      setIsLoading(false);
      return;
    }

    const formDataToSend = new FormData();
    if (formData.photo) formDataToSend.append("photo", formData.photo);
    formDataToSend.append("email", formData.email);
    formDataToSend.append("description", formData.description);
    formDataToSend.append("location", formData.location);

    try {
      const response = await fetch(
        `http://localhost:8070/commi/update/${editingPost._id}`,
        {
          method: "PUT",
          body: formDataToSend,
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update post");
      }

      const updatedPost = await response.json();
      setPosts(
        posts.map((post) =>
          post._id === editingPost._id ? updatedPost.commi : post
        )
      );
      setEditingPost(null);
      alert("Post updated successfully!");
    } catch (err) {
      console.error("Error:", err);
      alert("Failed to update post. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <NavigationBar/>
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-20 w-full">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Community Hub
            </h1>
            <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto">
              Connect with others, share your experiences, and be part of our
              growing community.
            </p>
            <button
              onClick={() => setShowForm(!showForm)}
              className="bg-white text-blue-600 px-8 py-3 rounded-full hover:bg-gray-100 transition duration-300 font-medium shadow-md hover:shadow-lg"
            >
              {showForm ? "Cancel" : "Create Post"}
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-12">
          {/* Community Form */}
          {showForm && (
            <div className="max-w-2xl mx-auto mb-12">
              <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="p-6">
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">
                    Create New Post
                  </h2>
                  <form onSubmit={handleSubmit}>
                    <div className="mb-6">
                      <label className="block text-gray-700 font-medium mb-2">
                        Upload Photo
                      </label>
                      <div className="flex items-center justify-center w-full">
                        <label className="flex flex-col w-full h-32 border-2 border-dashed border-gray-300 hover:border-blue-500 rounded-lg cursor-pointer transition duration-300">
                          <div className="flex flex-col items-center justify-center pt-7">
                            {formData.photo ? (
                              <p className="text-sm text-gray-600">
                                {formData.photo.name}
                              </p>
                            ) : (
                              <>
                                <svg
                                  className="w-10 h-10 text-gray-400"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                  />
                                </svg>
                                <p className="pt-1 text-sm text-gray-600">
                                  Click to upload a photo
                                </p>
                              </>
                            )}
                          </div>
                          <input
                            type="file"
                            name="photo"
                            onChange={handleChange}
                            className="opacity-0"
                            accept="image/*"
                            required
                          />
                        </label>
                      </div>
                    </div>

                    <div className="mb-6">
                      <label className="block text-gray-700 font-medium mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="your@email.com"
                        required
                      />
                    </div>

                    <div className="mb-6">
                      <label className="block text-gray-700 font-medium mb-2">
                        Description
                      </label>
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Share your thoughts with the community..."
                        rows="4"
                        required
                        minLength="10"
                      />
                    </div>

                    <div className="mb-6">
                      <label className="block text-gray-700 font-medium mb-2">
                        Location
                      </label>
                      <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Where are you posting from?"
                        required
                      />
                    </div>

                    <div className="flex justify-end">
                      <button
                        type="submit"
                        disabled={isLoading}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition duration-300 flex items-center"
                      >
                        {isLoading ? (
                          <>
                            <svg
                              className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              ></circle>
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              ></path>
                            </svg>
                            Posting...
                          </>
                        ) : (
                          "Post"
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}

          {/* Edit Form Modal */}
          {editingPost && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl transform transition-all duration-300">
                <div className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-gray-800">
                      Edit Post
                    </h2>
                    <button
                      onClick={() => setEditingPost(null)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <FiX size={24} />
                    </button>
                  </div>

                  <form onSubmit={handleUpdatePost}>
                    <div className="mb-6">
                      <label className="block text-gray-700 font-medium mb-2">
                        Change Photo
                      </label>
                      <div className="flex items-center space-x-4">
                        {editingPost.photo && (
                          <img
                            src={`http://localhost:8070${editingPost.photo}`}
                            alt="Current"
                            className="w-20 h-20 object-cover rounded-lg"
                          />
                        )}
                        <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg cursor-pointer px-4 py-2 hover:border-blue-500 transition duration-300">
                          <span className="text-sm text-gray-600">
                            Upload new photo
                          </span>
                          <input
                            type="file"
                            name="photo"
                            onChange={handleChange}
                            className="hidden"
                            accept="image/*"
                          />
                        </label>
                      </div>
                    </div>

                    <div className="mb-6">
                      <label className="block text-gray-700 font-medium mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>

                    <div className="mb-6">
                      <label className="block text-gray-700 font-medium mb-2">
                        Description
                      </label>
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        rows="4"
                        required
                        minLength="10"
                      />
                    </div>

                    <div className="mb-6">
                      <label className="block text-gray-700 font-medium mb-2">
                        Location
                      </label>
                      <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>

                    <div className="flex justify-end space-x-3">
                      <button
                        type="button"
                        onClick={() => setEditingPost(null)}
                        className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition duration-300"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isLoading}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition duration-300 flex items-center"
                      >
                        {isLoading ? (
                          <>
                            <svg
                              className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              ></circle>
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              ></path>
                            </svg>
                            Updating...
                          </>
                        ) : (
                          "Update Post"
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}

          {/* post desplay sectionn */}
          <div className="max-w-7xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Community Feed
            </h2>

            {isLoading && posts.length === 0 ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : posts.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm p-8 text-center">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1"
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
                <h3 className="mt-2 text-lg font-medium text-gray-900">
                  No posts yet
                </h3>
                <p className="mt-1 text-gray-500">
                  Be the first to share something with the community!
                </p>
                <div className="mt-6">
                  <button
                    onClick={() => setShowForm(true)}
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Create Post
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {posts.map((post) => (
                  <div
                    key={post._id}
                    className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg flex flex-col h-full"
                  >
                    {/* Enhanced Post Header */}
                    <div className="p-4 border-b border-gray-100 flex justify-between items-start">
                      <div className="flex items-start space-x-3">
                        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white w-10 h-10 rounded-full flex items-center justify-center font-medium text-sm shadow-sm">
                          {post.email.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-800 text-sm">
                            {post.email}
                          </h3>
                          <div className="flex items-center space-x-2 mt-1">
                            <span className="flex items-center text-xs text-gray-500">
                              <FiClock className="mr-1" />
                              {new Date(post.createdAt).toLocaleString(
                                "en-US",
                                {
                                  month: "short",
                                  day: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                }
                              )}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Post Menu (ara dot 3) */}
                      <div className="relative">
                        <button
                          onClick={() => toggleMenu(post._id)}
                          className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100"
                        >
                          <FiMoreVertical size={16} />
                        </button>

                        {menuOpen === post._id && (
                          <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 ring-1 ring-black ring-opacity-5">
                            <div className="py-1">
                              <button
                                onClick={() => {
                                  handleEdit(post);
                                  setMenuOpen(null);
                                }}
                                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                              >
                                <FiEdit2 className="mr-2" /> Edit
                              </button>
                              <button
                                onClick={() => {
                                  handleDelete(post._id);
                                  setMenuOpen(null);
                                }}
                                className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100 w-full text-left"
                              >
                                <FiTrash2 className="mr-2" /> Delete
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Enhanced Post content eka gana details */}
                    <div className="p-4 flex-grow">
                      <div className="mb-3">
                        <span className="flex items-center text-xs text-gray-500 mb-2">
                          <FiMapPin className="mr-1" />
                          {post.location}
                        </span>
                      </div>

                      <p className="text-gray-700 mb-4 text-sm line-clamp-3">
                        {post.description}
                      </p>

                      {post.photo && (
                        <div className="mb-4 rounded-lg overflow-hidden shadow-sm">
                          <img
                            src={`http://localhost:8070${post.photo}`}
                            alt="Post"
                            className="w-full h-48 object-cover cursor-pointer hover:opacity-90 transition-opacity duration-300"
                            onClick={() =>
                              window.open(
                                `http://localhost:8070${post.photo}`,
                                "_blank"
                              )
                            }
                          />
                        </div>
                      )}

                      {/* Enhanced Post Actions */}
                      <div className="flex items-center justify-between border-t border-gray-100 pt-3 mt-auto">
                        <button
                          onClick={() => handleLike(post._id)}
                          className={`flex items-center space-x-1 px-2 py-1 rounded-lg transition-colors duration-300 ${
                            post.likes > 0
                              ? "text-red-500"
                              : "text-gray-500 hover:text-red-500"
                          }`}
                        >
                          {post.likes > 0 ? (
                            <FaHeart className="text-sm" />
                          ) : (
                            <FaRegHeart className="text-sm" />
                          )}
                          <span className="text-xs">{post.likes || 0}</span>
                        </button>
                        <button
                          onClick={() =>
                            setActiveComment(
                              activeComment === post._id ? null : post._id
                            )
                          }
                          className={`flex items-center space-x-1 px-2 py-1 rounded-lg transition-colors duration-300 ${
                            activeComment === post._id
                              ? "text-blue-600"
                              : "text-gray-500 hover:text-blue-600"
                          }`}
                        >
                          <FiMessageSquare className="text-sm" />
                          <span className="text-xs">
                            {post.comments ? post.comments.length : 0}
                          </span>
                        </button>
                      </div>

                      {/* Enhanced Comments Section */}
                      <div
                        className={`mt-3 ${
                          activeComment === post._id ? "block" : "hidden"
                        }`}
                      >
                        {/* Comment Form */}
                        <div className="flex items-start space-x-2 mb-3">
                          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-medium text-xs shadow-sm">
                            {formData.email ? (
                              formData.email.charAt(0).toUpperCase()
                            ) : (
                              <FiUser size={12} />
                            )}
                          </div>
                          <div className="flex-1 flex bg-gray-50 rounded-lg overflow-hidden">
                            <input
                              type="text"
                              value={commentText}
                              onChange={(e) => setCommentText(e.target.value)}
                              placeholder="Write a comment..."
                              className="flex-1 px-3 py-2 bg-transparent focus:outline-none text-xs"
                              onKeyPress={(e) =>
                                e.key === "Enter" &&
                                handleCommentSubmit(post._id)
                              }
                            />
                            <button
                              onClick={() => handleCommentSubmit(post._id)}
                              className="bg-blue-600 text-white px-2 hover:bg-blue-700 transition-colors duration-300 flex items-center justify-center"
                              disabled={!commentText.trim()}
                            >
                              <FiSend size={14} />
                            </button>
                          </div>
                        </div>

                        {/* Comments List */}
                        {post.comments && post.comments.length > 0 && (
                          <div className="space-y-2 max-h-32 overflow-y-auto">
                            {post.comments.map((comment, idx) => (
                              <div
                                key={idx}
                                className="flex items-start space-x-2"
                              >
                                <div className="bg-gray-200 text-gray-600 w-8 h-8 rounded-full flex items-center justify-center font-medium text-xs">
                                  {comment.text.charAt(0).toUpperCase()}
                                </div>
                                <div className="flex-1">
                                  <div className="bg-gray-50 p-2 rounded-lg">
                                    <div className="text-xs text-gray-700">
                                      {comment.text}
                                    </div>
                                    <div className="text-xxs text-gray-400 mt-1 flex items-center">
                                      <FiClock className="mr-1" />
                                      {new Date(
                                        comment.createdAt
                                      ).toLocaleString("en-US", {
                                        month: "short",
                                        day: "numeric",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                      })}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Floating Create Post Button */}
        <div className="fixed bottom-8 right-8 z-40">
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-blue-600 hover:bg-blue-700 text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 transform hover:scale-110"
            aria-label="Create post"
          >
            <FiPlus size={24} />
          </button>
        </div>
      </div>
      <ModernFooter/>
    </div>
  );
};

export default CommunitySection;
