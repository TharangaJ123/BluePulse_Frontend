import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  FaCheckCircle, // Active
  FaPauseCircle, // Inactive
  FaTrash,       // Delete
  FaPlus,        // Add New Role
} from 'react-icons/fa'; // Import icons

const RoleAccessManagement = () => {
  const [roles, setRoles] = useState([]); // State to store role data
  const [loading, setLoading] = useState(true); // State to handle loading state
  const [error, setError] = useState(null); // State to handle errors
  const [showAddForm, setShowAddForm] = useState(false); // State to toggle add form visibility
  const [newRole, setNewRole] = useState({
    role_id: '',
    role_name: '',
    accessible_sections: [],
  }); // State for new role data

  // Fetch role data from the backend
  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    try {
      const response = await axios.get('http://localhost:8070/RoleAccess/');
      setRoles(response.data); // Set the fetched data to the state
    } catch (error) {
      setError(error.message); // Set error message if something goes wrong
    } finally {
      setLoading(false); // Set loading to false after fetching
    }
  };

  // Delete a role from the database
  const deleteRole = async (roleId) => {
    try {
      await axios.delete(`http://localhost:8070/RoleAccess/${roleId}`);
      setRoles((prevRoles) => prevRoles.filter((role) => role.role_id !== roleId)); // Remove the role from the state
      console.log('Role deleted successfully');
    } catch (error) {
      console.error('Error deleting role:', error);
      setError(error.message);
    }
  };

  // Handle input change for new role form
  const handleNewRoleChange = (e) => {
    const { name, value } = e.target;
    setNewRole({ ...newRole, [name]: value });
  };

  // Handle checkbox change for new role form
  const handleNewRoleSectionChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setNewRole({
        ...newRole,
        accessible_sections: [...newRole.accessible_sections, value],
      });
    } else {
      setNewRole({
        ...newRole,
        accessible_sections: newRole.accessible_sections.filter((section) => section !== value),
      });
    }
  };

  // Add a new role to the database
  const addNewRole = async () => {
    try {
      const response = await axios.post('http://localhost:8070/RoleAccess/', newRole);
      setRoles([...roles, response.data]); // Add the new role to the state
      setNewRole({ role_id: '', role_name: '', accessible_sections: [] }); // Reset form
      setShowAddForm(false); // Hide the form
      console.log('Role added successfully:', response.data);
    } catch (error) {
      console.error('Error adding role:', error);
      setError(error.message);
    }
  };

  // Display loading state
  if (loading) {
    return (
      <main className="flex-1 p-8 overflow-y-auto">
        <h1 className="text-2xl font-bold text-blue-800 mb-6">Role Access Management</h1>
        <div className="bg-white p-6 rounded-lg shadow-md animate-pulse">
          <p>Loading roles...</p>
        </div>
      </main>
    );
  }

  // Display error message
  if (error) {
    return (
      <main className="flex-1 p-8 overflow-y-auto">
        <h1 className="text-2xl font-bold text-blue-800 mb-6">Role Access Management</h1>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <p className="text-red-600">Error: {error}</p>
        </div>
      </main>
    );
  }

  // Display role data
  return (
    <main className="flex-1 p-8 overflow-y-auto">
      <h1 className="text-2xl font-bold text-blue-800 mb-6">Role Access Management</h1>

      {/* Add New Role Button */}
      <button
        onClick={() => setShowAddForm(!showAddForm)}
        className="bg-blue-500 text-white px-4 py-2 rounded-lg mb-6 flex items-center hover:bg-blue-600 transition duration-300"
      >
        <FaPlus className="mr-2" /> Add New Role
      </button>

      {/* Add New Role Form */}
      {showAddForm && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-bold text-blue-800 mb-4">Add New Role</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-gray-700">Role ID</label>
              <input
                type="text"
                name="role_id"
                value={newRole.role_id}
                onChange={handleNewRoleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-gray-700">Role Name</label>
              <input
                type="text"
                name="role_name"
                value={newRole.role_name}
                onChange={handleNewRoleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-gray-700">Accessible Sections</label>
              {[
                'Dashboard',
                'User Management',
                'Employee Management',
                'Water Quality Testing',
                'Appointments',
                'Online Store & Inventory',
                'Financial Management',
                'Community & Feedback',
                'Reports & Analytics',
                'Settings',
                'Help & Support',
              ].map((section) => (
                <label key={section} className="block">
                  <input
                    type="checkbox"
                    value={section}
                    checked={newRole.accessible_sections.includes(section)}
                    onChange={handleNewRoleSectionChange}
                    className="mr-2"
                  />
                  {section}
                </label>
              ))}
            </div>
            <button
              onClick={addNewRole}
              className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition duration-300"
            >
              Save Role
            </button>
          </div>
        </div>
      )}

      {/* Tiles for Role Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Total Roles Tile */}
        <div className="bg-gradient-to-r from-blue-100 to-blue-200 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
          <h2 className="text-lg font-semibold text-gray-800 mb-2 flex items-center">
            <FaCheckCircle className="text-blue-600 mr-2" /> Total Roles
          </h2>
          <p className="text-3xl font-bold text-blue-800">{roles.length}</p>
        </div>

        {/* Roles with Full Access Tile */}
        <div className="bg-gradient-to-r from-green-100 to-green-200 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
          <h2 className="text-lg font-semibold text-gray-800 mb-2 flex items-center">
            <FaCheckCircle className="text-green-600 mr-2" /> Full Access Roles
          </h2>
          <p className="text-3xl font-bold text-green-800">
            {roles.filter((role) => role.accessible_sections.includes('All')).length}
          </p>
        </div>

        {/* Restricted Roles Tile */}
        <div className="bg-gradient-to-r from-yellow-100 to-yellow-200 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
          <h2 className="text-lg font-semibold text-gray-800 mb-2 flex items-center">
            <FaPauseCircle className="text-yellow-600 mr-2" /> Restricted Roles
          </h2>
          <p className="text-3xl font-bold text-yellow-800">
            {roles.filter((role) => !role.accessible_sections.includes('All')).length}
          </p>
        </div>
      </div>

      {/* Role Details Table */}
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left p-3 text-gray-700">Role ID</th>
              <th className="text-left p-3 text-gray-700">Role Name</th>
              <th className="text-left p-3 text-gray-700">Accessible Sections</th>
              <th className="text-left p-3 text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {roles.map((role) => (
              <tr key={role.role_id} className="border-b hover:bg-gray-50 transition duration-200">
                <td className="p-3 text-gray-800">{role.role_id}</td>
                <td className="p-3 text-gray-800">{role.role_name}</td>
                <td className="p-3 text-gray-800">
                  {role.accessible_sections.map((section) => (
                    <div key={section} className="flex items-center">
                      <FaCheckCircle className="text-green-500 mr-2" />
                      <span>{section}</span>
                    </div>
                  ))}
                </td>
                <td className="p-3">
                  <button
                    onClick={() => deleteRole(role.role_id)}
                    className="bg-red-100 text-red-800 px-3 py-2 rounded-lg flex items-center hover:bg-red-200 transition duration-300"
                  >
                    <FaTrash className="mr-2" /> Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
};

export default RoleAccessManagement;