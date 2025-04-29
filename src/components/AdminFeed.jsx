import React, { useEffect, useState } from 'react';
import {
  FaCheckCircle, // Active
  FaPauseCircle, // Inactive
  FaUserSlash,   // Banned
  FaDownload,    // Download
} from 'react-icons/fa'; // Import icons

const AdminFeed = () => {
  const [feedbacks, setFeedbacks] = useState([]); // State to store feedback data
  const [loading, setLoading] = useState(true); // State to handle loading state
  const [error, setError] = useState(null); // State to handle errors

  // Fetch feedback data from the backend
  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const fetchFeedbacks = async () => {
    try {
      const response = await fetch('http://localhost:8070/feedback');
      if (!response.ok) {
        throw new Error('Failed to fetch feedbacks');
      }
      const data = await response.json();
      setFeedbacks(data); // Set the fetched data to the state
    } catch (error) {
      setError(error.message); // Set error message if something goes wrong
    } finally {
      setLoading(false); // Set loading to false after fetching
    }
  };

  // Function to convert feedback data to CSV
  const convertToCSV = (data) => {
    const headers = ['Feedback ID', 'User ID', 'Feedback Text', 'Created At'];
    const rows = data.map(feedback => [
      feedback._id,
      feedback.user_id,
      feedback.feedback_text,
      new Date(feedback.created_at).toLocaleString(),
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    return csvContent;
  };

  // Function to trigger CSV download
  const downloadCSV = () => {
    const csvData = convertToCSV(feedbacks);
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'feedback_details.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Display loading state
  if (loading) {
    return (
      <main className="flex-1 p-8 overflow-y-auto">
        <h1 className="text-2xl font-bold text-blue-800 mb-6">Feedback Management</h1>
        <div className="bg-white p-6 rounded-lg shadow-md animate-pulse">
          <p>Loading feedbacks...</p>
        </div>
      </main>
    );
  }

  // Display error message
  if (error) {
    return (
      <main className="flex-1 p-8 overflow-y-auto">
        <h1 className="text-2xl font-bold text-blue-800 mb-6">Feedback Management</h1>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <p className="text-red-600">Error: {error}</p>
        </div>
      </main>
    );
  }

  // Display feedback data
  return (
    <main className="flex-1 p-8 overflow-y-auto">
      <h1 className="text-2xl font-bold text-blue-800 mb-6">Feedback Management</h1>

      {/* Download Button */}
      <div className="mb-6">
        <button
          onClick={downloadCSV}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-300 flex items-center"
        >
          <FaDownload className="mr-2" /> Download Feedback Details
        </button>
      </div>

      {/* Feedback Details Table */}
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left p-3 text-gray-700">Feedback ID</th>
              <th className="text-left p-3 text-gray-700">User ID</th>
              <th className="text-left p-3 text-gray-700">Feedback name</th>
              <th className="text-left p-3 text-gray-700">email</th>
              <th className="text-left p-3 text-gray-700">section</th>
              <th className="text-left p-3 text-gray-700">message</th>
              <th className="text-left p-3 text-gray-700">percentage</th>
            </tr>
          </thead>
          <tbody>
            {feedbacks.map((feedback) => (
              <tr
                key={feedback._id}
                className="border-b hover:bg-gray-50 transition duration-200"
              >
                <td className="p-3 text-gray-800">{feedback._id}</td>
                <td className="p-3 text-gray-800">{feedback.id}</td>
                <td className="p-3 text-gray-800">{feedback.name}</td>
                <td className="p-3 text-gray-800">{feedback.Email}</td>
                <td className="p-3 text-gray-800">{feedback.section}</td>
                <td className="p-3 text-gray-800">{feedback.message}</td>
                <td className="p-3 text-gray-800">{feedback.percentage}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
};

export default AdminFeed;