import React, { useEffect, useState } from 'react';
import {
  FaCheckCircle, // Active
  FaPauseCircle, // Inactive
  FaUserSlash,   // Banned
  FaDownload,    // Download
} from 'react-icons/fa'; // Import icons

const UserManagement = () => {
  const [users, setUsers] = useState([]); // State to store user data
  const [loading, setLoading] = useState(true); // State to handle loading state
  const [error, setError] = useState(null); // State to handle errors

  // Fetch user data from the backend
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch('http://localhost:8070/User/users');
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }
      const data = await response.json();
      setUsers(data); // Set the fetched data to the state
    } catch (error) {
      setError(error.message); // Set error message if something goes wrong
    } finally {
      setLoading(false); // Set loading to false after fetching
    }
  };

  // Update user status in the database
  const updateUserStatus = async (userId, newStatus) => {
    try {
      const response = await fetch(`http://localhost:8070/User/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error('Failed to update user status');
      }

      const updatedUser = await response.json();

      // Update the specific user in the state
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === userId ? { ...user, status: newStatus } : user
        )
      );

      console.log('User status updated successfully:', updatedUser);
    } catch (error) {
      console.error('Error updating user status:', error);
      setError(error.message);
    }
  };

  // Handle status button click
  const handleStatusChange = (userId, currentStatus) => {
    let newStatus;
    switch (currentStatus) {
      case 'active':
        newStatus = 'inactive';
        break;
      case 'inactive':
        newStatus = 'banned';
        break;
      case 'banned':
        newStatus = 'active';
        break;
      default:
        newStatus = 'active';
    }
    updateUserStatus(userId, newStatus); // Update the status in the database
  };

  // Function to convert user data to CSV
  const convertToCSV = (data) => {
    const headers = ['Full Name', 'Email', 'Phone Number', 'Status', 'Created At', 'Updated At'];
    const rows = data.map(user => [
      user.full_name,
      user.email,
      user.phone_number || 'N/A',
      user.status,
      new Date(user.created_at).toLocaleString(),
      new Date(user.updated_at).toLocaleString(),
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    return csvContent;
  };

  // Function to trigger CSV download
  const downloadCSV = () => {
    const csvData = convertToCSV(users);
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'user_details.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Display loading state
  if (loading) {
    return (
      <main className="flex-1 p-8 overflow-y-auto">
        <h1 className="text-2xl font-bold text-blue-800 mb-6">User Management</h1>
        <div className="bg-white p-6 rounded-lg shadow-md animate-pulse">
          <p>Loading users...</p>
        </div>
      </main>
    );
  }

  // Display error message
  if (error) {
    return (
      <main className="flex-1 p-8 overflow-y-auto">
        <h1 className="text-2xl font-bold text-blue-800 mb-6">User Management</h1>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <p className="text-red-600">Error: {error}</p>
        </div>
      </main>
    );
  }

  // Display user data
  return (
    <main className="flex-1 p-8 overflow-y-auto">
      <h1 className="text-2xl font-bold text-blue-800 mb-6">User Management</h1>

      {/* Tiles for User Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Active Users Tile */}
        <div className="bg-gradient-to-r from-green-100 to-green-200 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
          <h2 className="text-lg font-semibold text-gray-800 mb-2 flex items-center">
            <FaCheckCircle className="text-green-600 mr-2" /> Active Users
          </h2>
          <p className="text-3xl font-bold text-green-800">
            {users.filter((user) => user.status === 'active').length}
          </p>
        </div>

        {/* Inactive Users Tile */}
        <div className="bg-gradient-to-r from-yellow-100 to-yellow-200 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
          <h2 className="text-lg font-semibold text-gray-800 mb-2 flex items-center">
            <FaPauseCircle className="text-yellow-600 mr-2" /> Inactive Users
          </h2>
          <p className="text-3xl font-bold text-yellow-800">
            {users.filter((user) => user.status === 'inactive').length}
          </p>
        </div>

        {/* Banned Users Tile */}
        <div className="bg-gradient-to-r from-red-100 to-red-200 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
          <h2 className="text-lg font-semibold text-gray-800 mb-2 flex items-center">
            <FaUserSlash className="text-red-600 mr-2" /> Banned Users
          </h2>
          <p className="text-3xl font-bold text-red-800">
            {users.filter((user) => user.status === 'banned').length}
          </p>
        </div>
      </div>

      {/* Download Button */}
      <div className="mb-6">
        <button
          onClick={downloadCSV}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-300 flex items-center"
        >
          <FaDownload className="mr-2" /> Download User Details
        </button>
      </div>

      {/* User Details Table */}
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left p-3 text-gray-700">Full Name</th>
              <th className="text-left p-3 text-gray-700">Email</th>
              <th className="text-left p-3 text-gray-700">Phone Number</th>
              <th className="text-left p-3 text-gray-700">Status</th>
              <th className="text-left p-3 text-gray-700">Created At</th>
              <th className="text-left p-3 text-gray-700">Updated At</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr
                key={user._id}
                className="border-b hover:bg-gray-50 transition duration-200"
              >
                <td className="p-3 text-gray-800">{user.full_name}</td>
                <td className="p-3 text-gray-800">{user.email}</td>
                <td className="p-3 text-gray-800">{user.phone_number || 'N/A'}</td>
                <td className="p-3">
                  <button
                    onClick={() => handleStatusChange(user._id, user.status)}
                    className={`px-3 py-2 rounded-lg flex items-center justify-center ${
                      user.status === 'active'
                        ? 'bg-green-100 text-green-800 hover:bg-green-200'
                        : user.status === 'inactive'
                        ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                        : 'bg-red-100 text-red-800 hover:bg-red-200'
                    } transition duration-300`}
                  >
                    {user.status === 'active' && (
                      <FaCheckCircle className="mr-2" />
                    )}
                    {user.status === 'inactive' && (
                      <FaPauseCircle className="mr-2" />
                    )}
                    {user.status === 'banned' && (
                      <FaUserSlash className="mr-2" />
                    )}
                    {user.status}
                  </button>
                </td>
                <td className="p-3 text-gray-800">
                  {new Date(user.created_at).toLocaleString()}
                </td>
                <td className="p-3 text-gray-800">
                  {new Date(user.updated_at).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
};

export default UserManagement;