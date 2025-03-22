import React, { useEffect, useState } from 'react';
import {
  FaCheckCircle, // Active
  FaPauseCircle, // Inactive
  FaUserSlash,   // Banned
  FaPlus,        // Add New Employee
  FaFileCsv,     // CSV Download
  FaEdit,        // Edit Employee
  FaTrash,       // Delete Employee
  FaSearch,      // Search Icon
} from 'react-icons/fa'; // Import icons

const EmployeeManagement = () => {
  const [employees, setEmployees] = useState([]); // State to store employee data
  const [loading, setLoading] = useState(true); // State to handle loading state
  const [error, setError] = useState(null); // State to handle errors
  const [showAddForm, setShowAddForm] = useState(false); // State to toggle add form visibility
  const [roles, setRoles] = useState([]); // State to store roles
  const [newEmployee, setNewEmployee] = useState({
    full_name: '',
    email: '',
    password: 'password123', // Default password (can be customized)
    phone_number: '',
    employee_position: '', // Employee position (selectable from roles)
  }); // State for new employee data
  const [editingEmployeeId, setEditingEmployeeId] = useState(null); // State to track which employee is being edited
  const [editingEmployeePosition, setEditingEmployeePosition] = useState(''); // State to store the edited position
  const [searchQuery, setSearchQuery] = useState(''); // State for search query

  // Fetch employee data and roles from the backend
  useEffect(() => {
    fetchEmployees();
    fetchRoles(); // Fetch roles when the component mounts
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await fetch('http://localhost:8070/Employee/employees');
      if (!response.ok) {
        throw new Error('Failed to fetch employees');
      }
      const data = await response.json();
      setEmployees(data); // Set the fetched data to the state
    } catch (error) {
      setError(error.message); // Set error message if something goes wrong
    } finally {
      setLoading(false); // Set loading to false after fetching
    }
  };

  // Fetch roles from the backend
  const fetchRoles = async () => {
    try {
      const response = await fetch('http://localhost:8070/RoleAccess/');
      if (!response.ok) {
        throw new Error('Failed to fetch roles');
      }
      const data = await response.json();
      setRoles(data); // Set the fetched roles to the state
    } catch (error) {
      console.error('Error fetching roles:', error);
      setError(error.message);
    }
  };

  // Update employee status in the database
  const updateEmployeeStatus = async (employeeId, newStatus) => {
    try {
      const response = await fetch(`http://localhost:8070/Employee/employees/${employeeId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error('Failed to update employee status');
      }

      const updatedEmployee = await response.json();

      // Update the specific employee in the state
      setEmployees((prevEmployees) =>
        prevEmployees.map((employee) =>
          employee._id === employeeId ? { ...employee, status: newStatus } : employee
        )
      );

      console.log('Employee status updated successfully:', updatedEmployee);
    } catch (error) {
      console.error('Error updating employee status:', error);
      setError(error.message);
    }
  };

  // Handle status button click
  const handleStatusChange = (employeeId, currentStatus) => {
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
    updateEmployeeStatus(employeeId, newStatus); // Update the status in the database
  };

  // Handle input change for new employee form
  const handleNewEmployeeChange = (e) => {
    const { name, value } = e.target;
    setNewEmployee({ ...newEmployee, [name]: value });
  };

  // Handle form submission to add a new employee
  const addNewEmployee = async () => {
    try {
      const response = await fetch('http://localhost:8070/Employee/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          full_name: newEmployee.full_name,
          email: newEmployee.email,
          password: newEmployee.password,
          phone_number: newEmployee.phone_number,
          employee_position: newEmployee.employee_position,
          role: 'employee', // Fixed role as "employee"
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to add new employee');
      }

      const addedEmployee = await response.json();
      console.log('Backend Response:', addedEmployee);

      // Add the new employee to the state
      setEmployees((prevEmployees) => [...prevEmployees, addedEmployee]);

      // Reset the form
      setNewEmployee({
        full_name: '',
        email: '',
        password: 'password123',
        phone_number: '',
        employee_position: '',
      });

      // Hide the form
      setShowAddForm(false);

      console.log('Employee added successfully:', addedEmployee);
    } catch (error) {
      console.error('Error adding employee:', error);
      setError(error.message);
    }
  };

  // Function to generate and download CSV report
  const downloadCSV = () => {
    // Define CSV headers
    const headers = [
      'Full Name',
      'Email',
      'Phone Number',
      'Position',
      'Role',
      'Status',
      'Created At',
      'Updated At',
    ];

    // Map employee data to rows
    const rows = employees.map((employee) => [
      employee.full_name,
      employee.email,
      employee.phone_number || 'N/A',
      employee.employee_position,
      employee.role || 'employee', // Default role
      employee.status,
      new Date(employee.createdAt).toLocaleString(),
      new Date(employee.updatedAt).toLocaleString(),
    ]);

    // Combine headers and rows
    const csvContent = [headers, ...rows]
      .map((row) => row.map((cell) => `"${cell}"`).join(','))
      .join('\n');

    // Create a Blob with the CSV content
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });

    // Create a link element to trigger the download
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'employee_report.csv';
    link.click();

    // Clean up
    URL.revokeObjectURL(link.href);
  };

  // Function to handle editing employee position
  const handleEditPosition = (employeeId, currentPosition) => {
    setEditingEmployeeId(employeeId);
    setEditingEmployeePosition(currentPosition);
  };

  // Function to save the edited position
  const saveEditedPosition = async (employeeId) => {
    try {
      const response = await fetch(`http://localhost:8070/Employee/employees/${employeeId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ employee_position: editingEmployeePosition }),
      });

      if (!response.ok) {
        throw new Error('Failed to update employee position');
      }

      const updatedEmployee = await response.json();

      // Update the specific employee in the state
      setEmployees((prevEmployees) =>
        prevEmployees.map((employee) =>
          employee._id === employeeId ? { ...employee, employee_position: editingEmployeePosition } : employee
        )
      );

      // Reset editing state
      setEditingEmployeeId(null);
      setEditingEmployeePosition('');

      console.log('Employee position updated successfully:', updatedEmployee);
    } catch (error) {
      console.error('Error updating employee position:', error);
      setError(error.message);
    }
  };

  // Function to delete an employee
  const deleteEmployee = async (employeeId) => {
    try {
      const response = await fetch(`http://localhost:8070/Employee/employees/${employeeId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete employee');
      }

      // Remove the employee from the state
      setEmployees((prevEmployees) =>
        prevEmployees.filter((employee) => employee._id !== employeeId)
      );

      console.log('Employee deleted successfully');
    } catch (error) {
      console.error('Error deleting employee:', error);
      setError(error.message);
    }
  };

  // Filter employees based on search query
  const filteredEmployees = employees.filter((employee) =>
    employee.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    employee.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    employee.employee_position.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Display loading state
  if (loading) {
    return (
      <main className="flex-1 p-8 overflow-y-auto">
        <h1 className="text-2xl font-bold text-blue-800 mb-6">Employee Management</h1>
        <div className="bg-white p-6 rounded-lg shadow-md animate-pulse">
          <p>Loading employees...</p>
        </div>
      </main>
    );
  }

  // Display error message
  if (error) {
    return (
      <main className="flex-1 p-8 overflow-y-auto">
        <h1 className="text-2xl font-bold text-blue-800 mb-6">Employee Management</h1>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <p className="text-red-600">Error: {error}</p>
        </div>
      </main>
    );
  }

  // Display employee data
  return (
    <main className="flex-1 p-8 overflow-y-auto">
      <h1 className="text-2xl font-bold text-blue-800 mb-6">Employee Management</h1>

      {/* Add New Employee Button */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center hover:bg-blue-600 transition duration-300"
        >
          <FaPlus className="mr-2" /> Add New Employee
        </button>

        {/* Download CSV Button */}
        <button
          onClick={downloadCSV}
          className="bg-green-500 text-white px-4 py-2 rounded-lg flex items-center hover:bg-green-600 transition duration-300"
        >
          <FaFileCsv className="mr-2" /> Download Report (CSV)
        </button>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Search employees by name, email, or position"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 pl-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <FaSearch className="absolute left-3 top-3 text-gray-500" />
        </div>
      </div>

      {/* Add New Employee Form */}
      {showAddForm && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-bold text-blue-800 mb-4">Add New Employee</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-gray-700">Full Name</label>
              <input
                type="text"
                name="full_name"
                value={newEmployee.full_name}
                onChange={handleNewEmployeeChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-gray-700">Email</label>
              <input
                type="email"
                name="email"
                value={newEmployee.email}
                onChange={handleNewEmployeeChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-gray-700">Phone Number</label>
              <input
                type="text"
                name="phone_number"
                value={newEmployee.phone_number}
                onChange={handleNewEmployeeChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-gray-700">Employee Position</label>
              <select
                name="employee_position"
                value={newEmployee.employee_position}
                onChange={handleNewEmployeeChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select a position</option>
                {roles.map((role) => (
                  <option key={role._id} value={role.role_name}>
                    {role.role_name}
                  </option>
                ))}
              </select>
            </div>
            <button
              onClick={addNewEmployee}
              className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition duration-300"
            >
              Save Employee
            </button>
          </div>
        </div>
      )}

      {/* Tiles for Employee Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Active Employees Tile */}
        <div className="bg-gradient-to-r from-green-100 to-green-200 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
          <h2 className="text-lg font-semibold text-gray-800 mb-2 flex items-center">
            <FaCheckCircle className="text-green-600 mr-2" /> Active Employees
          </h2>
          <p className="text-3xl font-bold text-green-800">
            {employees.filter((employee) => employee.status === 'active').length}
          </p>
        </div>

        {/* Inactive Employees Tile */}
        <div className="bg-gradient-to-r from-yellow-100 to-yellow-200 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
          <h2 className="text-lg font-semibold text-gray-800 mb-2 flex items-center">
            <FaPauseCircle className="text-yellow-600 mr-2" /> Inactive Employees
          </h2>
          <p className="text-3xl font-bold text-yellow-800">
            {employees.filter((employee) => employee.status === 'inactive').length}
          </p>
        </div>

        {/* Banned Employees Tile */}
        <div className="bg-gradient-to-r from-red-100 to-red-200 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
          <h2 className="text-lg font-semibold text-gray-800 mb-2 flex items-center">
            <FaUserSlash className="text-red-600 mr-2" /> Banned Employees
          </h2>
          <p className="text-3xl font-bold text-red-800">
            {employees.filter((employee) => employee.status === 'banned').length}
          </p>
        </div>
      </div>

      {/* Employee Details Table */}
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left p-3 text-gray-700">Full Name</th>
              <th className="text-left p-3 text-gray-700">Email</th>
              <th className="text-left p-3 text-gray-700">Phone Number</th>
              <th className="text-left p-3 text-gray-700">Position</th>
              <th className="text-left p-3 text-gray-700">Role</th>
              <th className="text-left p-3 text-gray-700">Status</th>
              <th className="text-left p-3 text-gray-700">Created At</th>
              <th className="text-left p-3 text-gray-700">Updated At</th>
              <th className="text-left p-3 text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredEmployees.map((employee) => (
              <tr
                key={employee._id}
                className="border-b hover:bg-gray-50 transition duration-200"
              >
                <td className="p-3 text-gray-800">{employee.full_name}</td>
                <td className="p-3 text-gray-800">{employee.email}</td>
                <td className="p-3 text-gray-800">{employee.phone_number || 'N/A'}</td>
                <td className="p-3 text-gray-800">
                  {editingEmployeeId === employee._id ? (
                    <select
                      value={editingEmployeePosition}
                      onChange={(e) => setEditingEmployeePosition(e.target.value)}
                      className="w-full px-2 py-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select a position</option>
                      {roles.map((role) => (
                        <option key={role._id} value={role.role_name}>
                          {role.role_name}
                        </option>
                      ))}
                    </select>
                  ) : (
                    employee.employee_position || 'N/A'
                  )}
                </td>
                <td className="p-3 text-gray-800">{employee.role || 'employee'}</td>
                <td className="p-3">
                  <button
                    onClick={() => handleStatusChange(employee._id, employee.status)}
                    className={`px-3 py-2 rounded-lg flex items-center justify-center ${
                      employee.status === 'active'
                        ? 'bg-green-100 text-green-800 hover:bg-green-200'
                        : employee.status === 'inactive'
                        ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                        : 'bg-red-100 text-red-800 hover:bg-red-200'
                    } transition duration-300`}
                  >
                    {employee.status === 'active' && (
                      <FaCheckCircle className="mr-2" />
                    )}
                    {employee.status === 'inactive' && (
                      <FaPauseCircle className="mr-2" />
                    )}
                    {employee.status === 'banned' && (
                      <FaUserSlash className="mr-2" />
                    )}
                    {employee.status}
                  </button>
                </td>
                <td className="p-3 text-gray-800">
                  {new Date(employee.createdAt).toLocaleString()}
                </td>
                <td className="p-3 text-gray-800">
                  {new Date(employee.updatedAt).toLocaleString()}
                </td>
                <td className="p-3 text-gray-800">
                  {editingEmployeeId === employee._id ? (
                    <button
                      onClick={() => saveEditedPosition(employee._id)}
                      className="bg-green-500 text-white px-3 py-1 rounded-lg hover:bg-green-600 transition duration-300"
                    >
                      Save
                    </button>
                  ) : (
                    <button
                      onClick={() => handleEditPosition(employee._id, employee.employee_position)}
                      className="bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600 transition duration-300"
                    >
                      <FaEdit />
                    </button>
                  )}
                  {(employee.status === 'inactive' || employee.status === 'banned') && (
                    <button
                      onClick={() => deleteEmployee(employee._id)}
                      className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition duration-300 ml-2"
                    >
                      <FaTrash />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
};

export default EmployeeManagement;