import React, { useEffect, useState } from 'react';
import {
  FaCheckCircle,
  FaPauseCircle,
  FaUserSlash,
  FaDownload,
  FaUserPlus,
  FaEdit,
  FaTrash,
  FaEye,
  FaSort,
  FaSortUp,
  FaSortDown,
  FaTimes,
  FaSearch
} from 'react-icons/fa';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchFilters, setSearchFilters] = useState({
    name: true,
    email: true,
    role: true
  });

  const [editFormData, setEditFormData] = useState({
    full_name: '',
    email: '',
    phone_number: '',
    status: 'active'
  });

  const [validationErrors, setValidationErrors] = useState({});

  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [addUserFormData, setAddUserFormData] = useState({
      full_name: '',
      email: '',
      phone_number: '',
    password: '',
    role: 'user'
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch('http://localhost:8070/User/users');
      if (!response.ok) throw new Error('Failed to fetch users');
      const data = await response.json();
      setUsers(data);
      setFilteredUsers(data);
      setLoading(false);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
    if (!term.trim()) {
      setFilteredUsers(users);
      return;
    }

    const termLower = term.toLowerCase();
    const filtered = users.filter(user => {
      const matchesSearch = (
        (searchFilters.name && user.full_name?.toLowerCase().includes(termLower)) ||
        (searchFilters.email && user.email?.toLowerCase().includes(termLower)) ||
        (searchFilters.role && user.role?.toLowerCase().includes(termLower))
      );
      return matchesSearch;
    });

    setFilteredUsers(filtered);
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });

    const sortedUsers = [...filteredUsers].sort((a, b) => {
      if (a[key] < b[key]) return direction === 'asc' ? -1 : 1;
      if (a[key] > b[key]) return direction === 'asc' ? 1 : -1;
      return 0;
    });

    setFilteredUsers(sortedUsers);
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return <FaSort className="text-gray-400" />;
    return sortConfig.direction === 'asc' ? 
      <FaSortUp className="text-blue-500" /> : 
      <FaSortDown className="text-blue-500" />;
  };

  const handleStatusChange = (userId, currentStatus) => {
    let newStatus;
    switch (currentStatus) {
      case 'active': newStatus = 'inactive'; break;
      case 'inactive': newStatus = 'banned'; break;
      case 'banned': newStatus = 'active'; break;
      default: newStatus = 'active';
    }
    updateUserStatus(userId, newStatus);
  };

  const updateUserStatus = async (userId, newStatus) => {
    try {
      const response = await fetch(`http://localhost:8070/User/users/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) throw new Error('Failed to update user status');
      const updatedUser = await response.json();
      setUsers(prevUsers =>
        prevUsers.map(user =>
          user._id === userId ? { ...user, status: newStatus } : user
        )
      );
      setFilteredUsers(prevUsers =>
        prevUsers.map(user =>
          user._id === userId ? { ...user, status: newStatus } : user
        )
      );
    } catch (error) {
      console.error('Error updating user status:', error);
      setError(error.message);
    }
  };

  const handleDeleteClick = (user) => {
    setSelectedUser(user);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      const response = await fetch(`http://localhost:8070/User/users/${selectedUser._id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete user');
      
      setUsers(prevUsers => prevUsers.filter(user => user._id !== selectedUser._id));
      setFilteredUsers(prevUsers => prevUsers.filter(user => user._id !== selectedUser._id));
      setShowDeleteModal(false);
      setSelectedUser(null);
    } catch (error) {
      console.error('Error deleting user:', error);
      setError(error.message);
    }
  };

  const handleEditClick = (user) => {
    setSelectedUser(user);
    setEditFormData({
      full_name: user.full_name,
      email: user.email,
      phone_number: user.phone_number || '',
      status: user.status
    });
    setShowEditModal(true);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = (formData) => {
    const errors = {};
    
    // Name validation - only letters and spaces allowed
    if (!formData.full_name?.trim()) {
      errors.full_name = "Name is required";
    } else if (!/^[A-Za-z\s]+$/.test(formData.full_name)) {
      errors.full_name = "Name can only contain letters and spaces";
    }

    // Phone number validation - exactly 10 digits
    if (!formData.phone_number) {
      errors.phone_number = "Phone number is required";
    } else if (!/^\d{10}$/.test(formData.phone_number)) {
      errors.phone_number = "Phone number must be exactly 10 digits";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm(editFormData)) return;

      try {
        const response = await fetch(`http://localhost:8070/User/users/${selectedUser._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(editFormData),
        });

        if (!response.ok) throw new Error('Failed to update user');
        
        const updatedUser = await response.json();
        setUsers(prevUsers =>
          prevUsers.map(user =>
            user._id === updatedUser._id ? updatedUser : user
          )
        );
        setFilteredUsers(prevUsers =>
          prevUsers.map(user =>
            user._id === updatedUser._id ? updatedUser : user
          )
        );
        setShowEditModal(false);
        setSelectedUser(null);
      setValidationErrors({});
      } catch (error) {
        console.error('Error updating user:', error);
        setError(error.message);
      }
  };

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

    return [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
  };

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

  const handleAddUserClick = () => {
    setShowAddUserModal(true);
    setAddUserFormData({
      full_name: '',
      email: '',
      phone_number: '',
      password: '',
      role: 'user'
    });
  };

  const handleAddUserChange = (e) => {
    const { name, value } = e.target;
    setAddUserFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddUserSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm(addUserFormData)) return;

    try {
      const response = await fetch('http://localhost:8070/User/form-reg', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name: addUserFormData.full_name,
          email: addUserFormData.email,
          phone_number: addUserFormData.phone_number,
          password: addUserFormData.password,
          user_role: addUserFormData.role
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add user');
      }
      
      const newUser = await response.json();
      setUsers(prevUsers => [...prevUsers, newUser]);
      setFilteredUsers(prevUsers => [...prevUsers, newUser]);
      setShowAddUserModal(false);
      setAddUserFormData({
        full_name: '',
        email: '',
        phone_number: '',
        password: '',
        role: 'user'
      });
      setValidationErrors({});
      alert('User added successfully!');
    } catch (error) {
      console.error('Error adding user:', error);
      setError(error.message);
      alert(`Error adding user: ${error.message}`);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
          <div className="flex">
            <div className="flex-shrink-0">
              <FaUserSlash className="h-5 w-5 text-red-500" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">Error: {error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header Section */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
  <button 
          onClick={downloadCSV}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
  >
          <FaDownload className="mr-2" />
          Export Users
  </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100">
              <FaCheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Users</p>
              <p className="text-2xl font-semibold text-gray-900">
                {users.filter(user => user.status === 'active').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100">
              <FaPauseCircle className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Inactive Users</p>
              <p className="text-2xl font-semibold text-gray-900">
                {users.filter(user => user.status === 'inactive').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-red-100">
              <FaUserSlash className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Banned Users</p>
              <p className="text-2xl font-semibold text-gray-900">
                {users.filter(user => user.status === 'banned').length}
              </p>
            </div>
          </div>
        </div>
    </div>

      {/* Search and Filter Section */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative">
    <input
      type="text"
      placeholder="Search users..."
      value={searchTerm}
      onChange={(e) => handleSearch(e.target.value)}
            className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
        <button
          onClick={handleAddUserClick}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        >
          <FaUserPlus className="mr-2" />
          Add User
        </button>
      </div>

      {/* Results Count */}
      <div className="text-sm text-gray-600">
        Showing {filteredUsers.length} of {users.length} users
  </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {['full_name', 'email', 'phone_number', 'status', 'created_at', 'updated_at'].map((header) => (
                  <th
                    key={header}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort(header)}
                  >
                    <div className="flex items-center space-x-1">
                      <span className="capitalize">{header.replace('_', ' ')}</span>
                      {getSortIcon(header)}
                    </div>
                  </th>
                ))}
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0">
                        <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                          <span className="text-gray-500 font-medium">
                            {user.full_name?.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{user.full_name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{user.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{user.phone_number || 'N/A'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => handleStatusChange(user._id, user.status)}
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                        user.status === 'active'
                          ? 'bg-green-100 text-green-800'
                          : user.status === 'inactive'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {user.status === 'active' && <FaCheckCircle className="mr-1" />}
                      {user.status === 'inactive' && <FaPauseCircle className="mr-1" />}
                      {user.status === 'banned' && <FaUserSlash className="mr-1" />}
                      {user.status}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(user.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(user.updated_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button
                        className="text-blue-600 hover:text-blue-900"
                        onClick={() => {/* View user details */}}
                      >
                        <FaEye />
                      </button>
                      <button
                        className="text-yellow-600 hover:text-yellow-900"
                        onClick={() => handleEditClick(user)}
                      >
                        <FaEdit />
                      </button>
          <button 
                        className="text-red-600 hover:text-red-900"
                        onClick={() => handleDeleteClick(user)}
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Confirm Deletion</h2>
              <button onClick={() => setShowDeleteModal(false)} className="text-gray-500 hover:text-gray-700">
            <FaTimes />
          </button>
            </div>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete user <span className="font-semibold">{selectedUser?.full_name}</span>? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-4 py-2 text-white bg-red-600 rounded-md hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {showEditModal && (
        <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Edit User</h2>
              <button onClick={() => setShowEditModal(false)} className="text-gray-500 hover:text-gray-700">
                <FaTimes />
              </button>
            </div>
            <form onSubmit={handleEditSubmit} className="space-y-4">
          <div>
                <label className="block text-sm font-medium text-gray-700">Full Name</label>
            <input
              type="text"
              name="full_name"
                  value={editFormData.full_name}
                  onChange={handleEditChange}
                  className={`w-full px-3 py-2 border rounded-md ${
                    validationErrors.full_name ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {validationErrors.full_name && (
                  <p className="mt-1 text-sm text-red-500">{validationErrors.full_name}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                <input
                  type="tel"
                  name="phone_number"
                  value={editFormData.phone_number}
                  onChange={handleEditChange}
                  maxLength="10"
                  className={`w-full px-3 py-2 border rounded-md ${
                    validationErrors.phone_number ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {validationErrors.phone_number && (
                  <p className="mt-1 text-sm text-red-500">{validationErrors.phone_number}</p>
                )}
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add User Modal */}
      {showAddUserModal && (
        <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Add New User</h2>
              <button onClick={() => setShowAddUserModal(false)} className="text-gray-500 hover:text-gray-700">
                <FaTimes />
              </button>
            </div>
            <form onSubmit={handleAddUserSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Full Name</label>
                <input
                  type="text"
                  name="full_name"
                  value={addUserFormData.full_name}
                  onChange={handleAddUserChange}
                  className={`w-full px-3 py-2 border rounded-md ${
                    validationErrors.full_name ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {validationErrors.full_name && (
                  <p className="mt-1 text-sm text-red-500">{validationErrors.full_name}</p>
                )}
              </div>
          <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
                  value={addUserFormData.email}
                  onChange={handleAddUserChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
          </div>
          <div>
                <label className="block text-sm font-medium text-gray-700">Phone Number</label>
            <input
              type="tel"
              name="phone_number"
                  value={addUserFormData.phone_number}
                  onChange={handleAddUserChange}
              maxLength="10"
                  className={`w-full px-3 py-2 border rounded-md ${
                    validationErrors.phone_number ? 'border-red-500' : 'border-gray-300'
                  }`}
            />
                {validationErrors.phone_number && (
                  <p className="mt-1 text-sm text-red-500">{validationErrors.phone_number}</p>
            )}
          </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Password</label>
                <input
                  type="password"
                  name="password"
                  value={addUserFormData.password}
                  onChange={handleAddUserChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
          <div>
                <label className="block text-sm font-medium text-gray-700">Role</label>
            <select
                  name="role"
                  value={addUserFormData.role}
                  onChange={handleAddUserChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
            </select>
          </div>
              <div className="flex justify-end space-x-3">
            <button
              type="button"
                  onClick={() => setShowAddUserModal(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
                  className="px-4 py-2 text-white bg-green-600 rounded-md hover:bg-green-700"
            >
              Add User
            </button>
          </div>
        </form>
      </div>
    </div>
  )}
    </div>
  );
};

export default UserManagement;