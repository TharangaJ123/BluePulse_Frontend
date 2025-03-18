import React, { useEffect, useState } from 'react';
import { FaCheckCircle, FaPauseCircle, FaEdit, FaTrash } from 'react-icons/fa'; // Import icons

const ServiceRequestManagement = () => {
  const [requests, setRequests] = useState([]); // Service requests state
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const [editingRequest, setEditingRequest] = useState(null);
  const [updatedData, setUpdatedData] = useState({});
  const [users, setUsers] = useState([]); // Users state
  const [serviceTypes, setServiceTypes] = useState([]); // Service Types state

  const REQUESTS_API_URL = 'http://localhost:5003/api/services/'; // URL for Service Requests API
  const USERS_API_URL = 'http://localhost:5000/api/users'; // URL for Users API (or static data)

  // Sample Service Types (replace with actual data or API call)
  const serviceTypesList = ["Plumbing", "Electrical", "HVAC", "Cleaning"];

  // Fetch users and service requests
  useEffect(() => {
    fetchUsers();
    fetchRequests();
  }, []);

  // Fetch users (Simulated or API call)
  const fetchUsers = async () => {
    try {
      // Simulate fetching users or make an API call
      const response = await fetch(USERS_API_URL);
      if (response.ok) {
        const data = await response.json();
        setUsers(data); // Set users data
      } else {
        // Fallback to static data
        setUsers([
          { _id: '1', name: 'John Doe' },
          { _id: '2', name: 'Jane Smith' },
        ]);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  // Fetch service requests
  const fetchRequests = async () => {
    try {
      const response = await fetch(REQUESTS_API_URL);
      if (!response.ok) {
        throw new Error('Failed to fetch service requests');
      }
      const data = await response.json();
      setRequests(data); // Set service requests data
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle update service request
  const handleUpdate = async (id) => {
    try {
      await fetch(`${REQUESTS_API_URL}${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData),
      });
      setEditingRequest(null);
      setUpdatedData({});
      fetchRequests();
    } catch (error) {
      console.error('Error updating service request:', error);
    }
  };

  // Handle input change for request fields
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle delete request
  const handleDelete = async (id) => {
    try {
      await fetch(`${REQUESTS_API_URL}${id}`, {
        method: 'DELETE',
      });
      fetchRequests();
    } catch (error) {
      console.error('Error deleting service request:', error);
    }
  };

  // Display loading state
  if (loading) {
    return (
      <main className="flex-1 p-8 overflow-y-auto">
        <h1 className="text-2xl font-bold text-blue-800 mb-6">Service Request Management</h1>
        <div className="bg-white p-6 rounded-lg shadow-md animate-pulse">
          <p>Loading...</p>
        </div>
      </main>
    );
  }

  // Display error message
  if (error) {
    return (
      <main className="flex-1 p-8 overflow-y-auto">
        <h1 className="text-2xl font-bold text-blue-800 mb-6">Service Request Management</h1>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <p className="text-red-600">Error: {error}</p>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 p-8 overflow-y-auto">
      <h1 className="text-2xl font-bold text-blue-800 mb-6">Service Request Management</h1>

      {/* Service Requests Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Pending Requests Tile */}
        <div className="bg-gradient-to-r from-yellow-100 to-yellow-200 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
          <h2 className="text-lg font-semibold text-gray-800 mb-2 flex items-center">
            <FaPauseCircle className="text-yellow-600 mr-2" /> Pending Requests
          </h2>
          <p className="text-3xl font-bold text-yellow-800">
            {requests.filter((request) => request.status === 'pending').length}
          </p>
        </div>

        {/* In Progress Requests Tile */}
        <div className="bg-gradient-to-r from-blue-100 to-blue-200 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
          <h2 className="text-lg font-semibold text-gray-800 mb-2 flex items-center">
            <FaCheckCircle className="text-blue-600 mr-2" /> In Progress Requests
          </h2>
          <p className="text-3xl font-bold text-blue-800">
            {requests.filter((request) => request.status === 'in-progress').length}
          </p>
        </div>

        {/* Completed Requests Tile */}
        <div className="bg-gradient-to-r from-green-100 to-green-200 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
          <h2 className="text-lg font-semibold text-gray-800 mb-2 flex items-center">
            <FaCheckCircle className="text-green-600 mr-2" /> Completed Requests
          </h2>
          <p className="text-3xl font-bold text-green-800">
            {requests.filter((request) => request.status === 'completed').length}
          </p>
        </div>
      </div>

      {/* Service Requests Table */}
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left p-3 text-gray-700">Request ID</th>
              <th className="text-left p-3 text-gray-700">Service Type</th>
              <th className="text-left p-3 text-gray-700">User</th>
              <th className="text-left p-3 text-gray-700">Status</th>
              <th className="text-left p-3 text-gray-700">Created At</th>
              <th className="text-left p-3 text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((request) => (
              <tr key={request._id} className="border-b hover:bg-gray-50 transition duration-200">
                <td className="p-3 text-gray-800">{request._id}</td>
                <td className="p-3 text-gray-800">{request.serviceType}</td>
                <td className="p-3 text-gray-800">{request.userId}</td>
                <td className="p-3 text-gray-800">{request.status}</td>
                <td className="p-3 text-gray-800">{new Date(request.createdAt).toLocaleString()}</td>
                <td className="p-3">
                  <button
                    onClick={() => setEditingRequest(request)}
                    className="bg-blue-500 text-white px-3 py-2 rounded-lg hover:bg-blue-600 mr-2"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDelete(request._id)}
                    className="bg-red-500 text-white px-3 py-2 rounded-lg hover:bg-red-600"
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit Service Request Modal */}
      {editingRequest && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold mb-4">Edit Service Request</h3>
            <select
              name="serviceType"
              value={updatedData.serviceType || editingRequest.serviceType}
              onChange={handleInputChange}
              className="p-3 border border-gray-300 rounded-lg mb-4 w-full"
            >
              {serviceTypesList.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
            <select
              name="userId"
              value={updatedData.userId || editingRequest.userId}
              onChange={handleInputChange}
              className="p-3 border border-gray-300 rounded-lg mb-4 w-full"
            >
              {users.map((user) => (
                <option key={user._id} value={user._id}>
                  {user.name}
                </option>
              ))}
            </select>
            <select
              name="status"
              value={updatedData.status || editingRequest.status}
              onChange={handleInputChange}
              className="p-3 border border-gray-300 rounded-lg mb-4 w-full"
            >
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
            <button
              onClick={() => handleUpdate(editingRequest._id)}
              className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
            >
              Update
            </button>
            <button
              onClick={() => setEditingRequest(null)}
              className="ml-4 bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </main>
  );
};

export default ServiceRequestManagement;
