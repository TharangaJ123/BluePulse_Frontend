import React, { useEffect, useState } from 'react';
import { FaDownload, FaTrash, FaEdit } from 'react-icons/fa';

const FinanceAdmin = () => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [showUpdateForm, setShowUpdateForm] = useState(false);

  // Fetch financial submissions from the backend
  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    try {
      const response = await fetch('http://localhost:8070/Finance/');
      if (!response.ok) {
        throw new Error('Failed to fetch submissions');
      }
      const data = await response.json();
      setSubmissions(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Function to delete a submission
  const deleteSubmission = async (id) => {
    try {
      const response = await fetch(`http://localhost:8070/Finance/delete/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete submission');
      }

      // Remove the deleted submission from the state
      setSubmissions((prevSubmissions) =>
        prevSubmissions.filter((submission) => submission._id !== id)
      );
    } catch (error) {
      console.error('Error deleting submission:', error);
      setError(error.message);
    }
  };

  // Function to handle updating a submission
  const updateSubmission = (id) => {
    const submission = submissions.find((sub) => sub._id === id);
    setSelectedSubmission(submission);
    setShowUpdateForm(true);
  };

  // Function to handle the update form submission
  const handleUpdate = async (updatedData) => {
    try {
      const response = await fetch(`http://localhost:8070/Finance/update/${updatedData._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
      });

      if (!response.ok) {
        throw new Error('Failed to update submission');
      }

      // Update the submission in the state
      setSubmissions((prevSubmissions) =>
        prevSubmissions.map((sub) =>
          sub._id === updatedData._id ? updatedData : sub
        )
      );
      setShowUpdateForm(false); // Close the update form
    } catch (error) {
      console.error('Error updating submission:', error);
      setError(error.message);
    }
  };

  // Function to convert submissions data to CSV
  const convertToCSV = (data) => {
    const headers = ['Full Name', 'Email', 'Contact Number', 'Document Type', 'Message', 'Files'];
    const rows = data.map((submission) => [
      submission.fullName,
      submission.email,
      submission.contactNumber,
      submission.documentType,
      submission.message,
      submission.UploadDocuments.join(', '),
    ]);

    const csvContent = [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
    return csvContent;
  };

  // Function to trigger CSV download
  const downloadCSV = () => {
    const csvData = convertToCSV(submissions);
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'financial_submissions.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Update Form Component
  const UpdateForm = ({ submission, onClose, onUpdate }) => {
    const [formData, setFormData] = useState(submission);

    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData({
        ...formData,
        [name]: value,
      });
    };

    const handleSubmit = (e) => {
      e.preventDefault();
      onUpdate(formData);
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
          <h2 className="text-xl font-bold mb-4">Update Submission</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700">Full Name</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Contact Number</label>
              <input
                type="text"
                name="contactNumber"
                value={formData.contactNumber}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Document Type</label>
              <input
                type="text"
                name="documentType"
                value={formData.documentType}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Message</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>
            <div className="flex justify-end">
              <button
                type="button"
                onClick={onClose}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg mr-2"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded-lg"
              >
                Update
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  // Display loading state
  if (loading) {
    return (
      <main className="flex-1 p-8 overflow-y-auto">
        <h1 className="text-2xl font-bold text-blue-800 mb-6">Financial Submissions</h1>
        <div className="bg-white p-6 rounded-lg shadow-md animate-pulse">
          <p>Loading submissions...</p>
        </div>
      </main>
    );
  }

  // Display error message
  if (error) {
    return (
      <main className="flex-1 p-8 overflow-y-auto">
        <h1 className="text-2xl font-bold text-blue-800 mb-6">Financial Submissions</h1>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <p className="text-red-600">Error: {error}</p>
        </div>
      </main>
    );
  }

  // Display financial submissions
  return (
    <main className="flex-1 p-8 overflow-y-auto">
      <h1 className="text-2xl font-bold text-blue-800 mb-6">Financial Submissions</h1>

      {/* Download Button */}
      <div className="mb-6">
        <button
          onClick={downloadCSV}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-300 flex items-center"
        >
          <FaDownload className="mr-2" /> Download Submissions
        </button>
      </div>

      {/* Submissions Table */}
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left p-3 text-gray-700">Full Name</th>
              <th className="text-left p-3 text-gray-700">Email</th>
              <th className="text-left p-3 text-gray-700">Contact Number</th>
              <th className="text-left p-3 text-gray-700">Document Type</th>
              <th className="text-left p-3 text-gray-700">Message</th>
              <th className="text-left p-3 text-gray-700">Files</th>
              <th className="text-left p-3 text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {submissions.map((submission) => (
              <tr
                key={submission._id}
                className="border-b hover:bg-gray-50 transition duration-200"
              >
                <td className="p-3 text-gray-800">{submission.fullName}</td>
                <td className="p-3 text-gray-800">{submission.email}</td>
                <td className="p-3 text-gray-800">{submission.contactNumber}</td>
                <td className="p-3 text-gray-800">{submission.documentType}</td>
                <td className="p-3 text-gray-800">{submission.message}</td>
                <td className="p-3 text-gray-800">
                  {submission.UploadDocuments}
                </td>
                <td className="p-3 flex space-x-2">
                  <button
                    onClick={() => updateSubmission(submission._id)}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    <FaEdit className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => deleteSubmission(submission._id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <FaTrash className="h-5 w-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Update Form */}
      {showUpdateForm && (
        <UpdateForm
          submission={selectedSubmission}
          onClose={() => setShowUpdateForm(false)}
          onUpdate={handleUpdate}
        />
      )}
    </main>
  );
};

export default FinanceAdmin;