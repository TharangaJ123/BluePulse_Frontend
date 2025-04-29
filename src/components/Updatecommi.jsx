import React, { useState, useRef } from 'react';
import { FaCloudUploadAlt } from 'react-icons/fa';

const PostCreation = () => {
  const [newPost, setNewPost] = useState({
    description: '',
    location: '',
    image: null,
  });

  const fileInputRef = useRef(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPost({
      ...newPost,
      [name]: value,
    });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewPost({
        ...newPost,
        image: file,
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission, e.g., send data to an API
    console.log('New Post:', newPost);
    // Reset form after submission
    setNewPost({
      description: '',
      location: '',
      image: null,
    });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          name="description"
          className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Share your water resource initiative..."
          value={newPost.description}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="location"
          className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Location"
          value={newPost.location}
          onChange={handleInputChange}
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
            accept="image/jpeg,image/png"
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
              src={URL.createObjectURL(newPost.image)}
              alt="Preview"
              className="max-h-60 rounded-lg object-cover"
            />
          </div>
        )}
      </form>
    </div>
  );
};

export default PostCreation;