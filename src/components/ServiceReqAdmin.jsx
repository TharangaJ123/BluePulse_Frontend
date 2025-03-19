import React, { useEffect, useState } from 'react';
import {
  FaCheckCircle,  // Active Requests
  FaPauseCircle,  // Inactive Requests
  FaUserSlash,    // Banned Requests
  FaEdit,         // Edit
  FaTrash,        // Delete
  FaSearch,       // Search
} from 'react-icons/fa';
import Modal from 'react-modal'; // Modal for editing requests

// Styles for the modal
Modal.setAppElement('#root');

const ServiceReqAdmin = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const itemsPerPage = 10;

  // Fetch service requests
  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const response = await fetch('http://localhost:5003/api/services/');
      if (!response.ok) throw new Error('Failed to fetch requests');
      const data = await response.json();
      setRequests(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle Edit Click
  const handleEditClick = (request) => {
    setSelectedRequest(request);
    setIsEditModalOpen(true);
  };

  // Handle Save Edit
  const handleSaveEdit = async (updatedRequest) => {
    try {
      const response = await fetch(`http://localhost:5003/api/services/${updatedRequest._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedRequest),
      });
      if (!response.ok) throw new Error('Failed to update request');
      fetchRequests(); // Refresh the list
      setIsEditModalOpen(false);
    } catch (error) {
      console.error('Error updating request:', error);
      setError(error.message);
    }
  };

  // Handle Delete Request
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this request?")) return;
    try {
      const response = await fetch(`http://localhost:5003/api/services/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete request');
      fetchRequests(); // Refresh the list
    } catch (error) {
      console.error('Error deleting request:', error);
      setError(error.message);
    }
  };

  // Handle Search
  const filteredRequests = requests.filter((request) =>
    request.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    request.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    request.service.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Pagination Logic
  const totalPages = Math.ceil(filteredRequests.length / itemsPerPage);
  const paginatedRequests = filteredRequests.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Loading State
  if (loading) {
    return (
      <main className="flex-1 p-8 overflow-y-auto">
        <h1 className="text-2xl font-bold text-blue-800 mb-6">Service Requests Admin</h1>
        <div className="bg-white p-6 rounded-lg shadow-md animate-pulse">
          <p>Loading requests...</p>
        </div>
      </main>
    );
  }

  // Error State
  if (error) {
    return (
      <main className="flex-1 p-8 overflow-y-auto">
        <h1 className="text-2xl font-bold text-blue-800 mb-6">Service Requests Admin</h1>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <p className="text-red-600">Error: {error}</p>
          <button
            onClick={fetchRequests}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 p-8 overflow-y-auto">
      <h1 className="text-2xl font-bold text-blue-800 mb-6">Service Requests Admin</h1>

      {/* Tiles for Request Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {/* Active Requests Tile */}
        <div className="bg-gradient-to-r from-green-100 to-green-200 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
          <h2 className="text-lg font-semibold text-gray-800 mb-2 flex items-center">
            <FaCheckCircle className="text-green-600 mr-2" /> Active Requests
          </h2>
          <p className="text-3xl font-bold text-green-800">
            {requests.filter((request) => request.status === 'active').length}
          </p>
        </div>

        {/* Inactive Requests Tile */}
        <div className="bg-gradient-to-r from-yellow-100 to-yellow-200 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
          <h2 className="text-lg font-semibold text-gray-800 mb-2 flex items-center">
            <FaPauseCircle className="text-yellow-600 mr-2" /> Inactive Requests
          </h2>
          <p className="text-3xl font-bold text-yellow-800">
            {requests.filter((request) => request.status === 'inactive').length}
          </p>
        </div>

        {/* Banned Requests Tile */}
        <div className="bg-gradient-to-r from-red-100 to-red-200 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
          <h2 className="text-lg font-semibold text-gray-800 mb-2 flex items-center">
            <FaUserSlash className="text-red-600 mr-2" /> Banned Requests
          </h2>
          <p className="text-3xl font-bold text-red-800">
            {requests.filter((request) => request.status === 'banned').length}
          </p>
        </div>

        {/* Total Requests Tile */}
        <div className="bg-gradient-to-r from-blue-100 to-blue-200 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
          <h2 className="text-lg font-semibold text-gray-800 mb-2 flex items-center">
            📋 Total Requests
          </h2>
          <p className="text-3xl font-bold text-blue-800">{requests.length}</p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Search by name, email, or service..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
      </div>

      {/* Service Requests Table */}
      <div className="bg-white p-6 rounded-lg shadow-md overflow-x-auto">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">All Service Requests</h2>
        {filteredRequests.length === 0 ? (
          <p className="text-gray-600">No service requests available.</p>
        ) : (
          <>
            <table className="w-full table-auto border-collapse">
              <thead>
                <tr className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                  <th className="p-3 text-left">Full Name</th>
                  <th className="p-3 text-left">Email</th>
                  <th className="p-3 text-left">Phone</th>
                  <th className="p-3 text-left">Service</th>
                  <th className="p-3 text-left">Date</th>
                  <th className="p-3 text-left">Time</th>
                  <th className="p-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedRequests.map((request) => (
                  <tr
                    key={request._id}
                    className="border-b hover:bg-gray-50 transition-colors duration-200"
                  >
                    <td className="p-3">{request.fullName}</td>
                    <td className="p-3">{request.email}</td>
                    <td className="p-3">{request.phone}</td>
                    <td className="p-3">{request.service}</td>
                    <td className="p-3">{new Date(request.date).toLocaleDateString()}</td>
                    <td className="p-3">
                      {new Date(request.date).toLocaleTimeString('en-US', {
                        hour12: false,
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>

                    <td className="p-3 flex gap-3">
                      <button
                        className="text-blue-500 hover:text-blue-700 transition-colors duration-200"
                        onClick={() => handleEditClick(request)}
                      >
                        <FaEdit />
                      </button>
                      <button
                        className="text-red-500 hover:text-red-700 transition-colors duration-200"
                        onClick={() => handleDelete(request._id)}
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            <div className="flex justify-between items-center mt-6">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300 transition-colors duration-200"
              >
                Previous
              </button>
              <span className="text-gray-700">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300 transition-colors duration-200"
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>

      {/* Edit Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onRequestClose={() => setIsEditModalOpen(false)}
        contentLabel="Edit Request Modal"
        className="modal"
        overlayClassName="modal-overlay"
      >
        <h2 className="text-2xl font-bold text-blue-800 mb-6">Edit Service Request</h2>
        {selectedRequest && (
          <div>
            <label className="block text-sm font-semibold mb-2">Full Name</label>
            <input
              type="text"
              className="w-full p-3 border border-gray-300 rounded-lg mb-4"
              value={selectedRequest.fullName}
              onChange={(e) => setSelectedRequest({ ...selectedRequest, fullName: e.target.value })}
            />
            <label className="block text-sm font-semibold mb-2">Service</label>
            <input
              type="text"
              className="w-full p-3 border border-gray-300 rounded-lg mb-4"
              value={selectedRequest.service}
              onChange={(e) => setSelectedRequest({ ...selectedRequest, service: e.target.value })}
            />
            <div className="flex justify-between items-center">
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                onClick={() => handleSaveEdit(selectedRequest)}
              >
                Save Changes
              </button>
              <button
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                onClick={() => setIsEditModalOpen(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </Modal>
    </main>
  );
};

export default ServiceReqAdmin;
