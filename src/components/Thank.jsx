import React from 'react';

const Thank = () => {
  // Handle Update Button Click
  const handleUpdate = () => {
    alert('Update functionality goes here!');
    // Add your update logic here
  };

  // Handle Delete Button Click
  const handleDelete = async () => {
    const itemId = '123'; // Replace with the actual ID of the item you want to delete

    try {
      // Send a DELETE request to the backend API
      const response = await fetch(`http://localhost:5000/feedback/delete/${itemId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          // Add any other headers like authorization tokens if needed
        },
      });

      // Check if the request was successful
      if (!response.ok) {
        throw new Error('Failed to delete the item');
      }

      // Parse the response (if any)
      const data = await response.json();

      // Notify the user of success
      alert('Item deleted successfully!');
      console.log(data); // Handle the response data as needed
    } catch (error) {
      // Handle errors
      console.error('Error deleting item:', error);
      alert('Error deleting item. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4 text-center">
        Thank you for your feedback
      </h1>
      <p className="text-lg md:text-xl text-gray-600 text-center mb-8">
        ...........
      </p>

      {/* Update and Delete Buttons */}
      <div className="flex space-x-4">
        <button
          onClick={handleUpdate}
          className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition duration-300"
        >
          Update
        </button>
        <button
          onClick={handleDelete}
          className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition duration-300"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default Thank;