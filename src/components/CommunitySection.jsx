import React, { useState, useRef } from "react";
import { FaHeart, FaComment, FaShare, FaCloudUploadAlt } from "react-icons/fa";

const CommunitySection = () => {
  const [posts, setPosts] = useState([
    {
      id: 1,
      user: "Sarah Waters",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
      image: "https://images.unsplash.com/photo-1538300342682-cf57afb97285",
      description: "New water conservation project in downtown area",
      likes: 124,
      comments: 34,
      location: "Downtown River Basin"
    },
    {
      id: 2,
      user: "Mike Rivers",
      avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36",
      image: "https://images.unsplash.com/photo-1468421870903-4df1664ac249",
      description: "Community lake cleanup initiative success!",
      likes: 89,
      comments: 21,
      location: "Crystal Lake Park"
    }
  ]);

  const [newPost, setNewPost] = useState({
    description: "",
    location: "",
    image: null
  });

  const fileInputRef = useRef();

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.size <= 5000000) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewPost({ ...newPost, image: reader.result });
      };
      reader.readAsDataURL(file);
    } else {
      alert("File size should be less than 5MB");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newPost.description && newPost.image) {
      setPosts([
        {
          id: posts.length + 1,
          user: "Current User",
          avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde",
          ...newPost,
          likes: 0,
          comments: 0
        },
        ...posts
      ]);
      setNewPost({ description: "", location: "", image: null });
    }
  };

  const PostCreation = () => (
    <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Share your water resource initiative..."
          value={newPost.description}
          onChange={(e) => setNewPost({ ...newPost, description: e.target.value })}
        />
        <input
          type="text"
          className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Location"
          value={newPost.location}
          onChange={(e) => setNewPost({ ...newPost, location: e.target.value })}
        />
        <div className="flex items-center space-x-4">
          <button
            type="button"
            onClick={() => fileInputRef.current.click()}
            className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            <FaCloudUploadAlt className="mr-2" />
            Upload Photo
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".jpg,.png"
            className="hidden"
            onChange={handleImageUpload}
          />
          <button
            type="submit"
            className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
          >
            Post
          </button>
        </div>
        {newPost.image && (
          <div className="mt-4">
            <img
              src={newPost.image}
              alt="Preview"
              className="max-h-60 rounded-lg object-cover"
            />
          </div>
        )}
      </form>
    </div>
  );

  const PostCard = ({ post }) => (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden transition-transform hover:scale-[1.02]">
      <div className="p-4">
        <div className="flex items-center space-x-3 mb-4">
          <img
            src={post.avatar}
            alt={post.user}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div>
            <h3 className="font-semibold text-gray-800">{post.user}</h3>
            <p className="text-sm text-gray-500">{post.location}</p>
          </div>
        </div>
      </div>
      <img
        src={post.image}
        alt={post.description}
        className="w-full h-64 object-cover"
        loading="lazy"
      />
      <div className="p-4">
        <p className="text-gray-700 mb-4">{post.description}</p>
        <div className="flex items-center space-x-6">
          <button className="flex items-center space-x-2 text-gray-600 hover:text-red-500 transition-colors">
            <FaHeart />
            <span>{post.likes}</span>
          </button>
          <button className="flex items-center space-x-2 text-gray-600 hover:text-blue-500 transition-colors">
            <FaComment />
            <span>{post.comments}</span>
          </button>
          <button className="flex items-center space-x-2 text-gray-600 hover:text-green-500 transition-colors">
            <FaShare />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Water Resource Community
        </h1>
        <PostCreation />
        <div className="grid gap-8 md:grid-cols-2">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CommunitySection;
