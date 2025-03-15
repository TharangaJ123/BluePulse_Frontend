import React, { useEffect, useState } from 'react';
import {
  FaCheckCircle, // Active
  FaPauseCircle, // Inactive
  FaUserSlash,   // Banned
} from 'react-icons/fa'; // Import icons

const EmployeeManagement = () => {
  const [employees, setEmployees] = useState([]); // State to store employee data
  const [loading, setLoading] = useState(true); // State to handle loading state
  const [error, setError] = useState(null); // State to handle errors

  // Fetch employee data from the backend
  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await fetch('http://localhost:5000/Employee/employees');
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

  // Update employee status in the database
  const updateEmployeeStatus = async (employeeId, newStatus) => {
    try {
      const response = await fetch(`http://localhost:5000/Employee/employees/${employeeId}`, {
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
              <th className="text-left p-3 text-gray-700">Status</th>
              <th className="text-left p-3 text-gray-700">Created At</th>
              <th className="text-left p-3 text-gray-700">Updated At</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((employee) => (
              <tr
                key={employee._id}
                className="border-b hover:bg-gray-50 transition duration-200"
              >
                <td className="p-3 text-gray-800">{employee.full_name}</td>
                <td className="p-3 text-gray-800">{employee.email}</td>
                <td className="p-3 text-gray-800">{employee.phone_number || 'N/A'}</td>
                <td className="p-3 text-gray-800">{employee.employee_position || 'N/A'}</td>
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
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
};

export default EmployeeManagement;