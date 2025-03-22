import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import DashboardChart from './DashboardChart';

const MainContent = () => {
  const [appointments, setAppointments] = useState(0);
  const [communityForms, setCommunityForms] = useState(0);
  const [financialDocuments, setFinancialDocuments] = useState(0);
  const [roles, setRoles] = useState(0);
  const [products, setProducts] = useState(0);
  const [employees, setEmployees] = useState(0);
  const [users, setUsers] = useState(0);

  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    // Fetch number of appointments
    fetch('http://localhost:8070/api/services/')
      .then((response) => response.json())
      .then((data) => setAppointments(data.length))
      .catch((error) => console.error('Error fetching appointments:', error));

    // Fetch number of community forms
    fetch('http://localhost:8070/commi/getAll')
      .then((response) => response.json())
      .then((data) => setCommunityForms(data.length))
      .catch((error) => console.error('Error fetching community forms:', error));

    // Fetch number of submitted financial documents
    fetch('http://localhost:8070/Finance/')
      .then((response) => response.json())
      .then((data) => setFinancialDocuments(data.length))
      .catch((error) => console.error('Error fetching financial documents:', error));

    // Fetch number of current roles
    fetch('http://localhost:8070/RoleAccess/')
      .then((response) => response.json())
      .then((data) => setRoles(data.length))
      .catch((error) => console.error('Error fetching roles:', error));

    // Fetch number of products in store
    fetch('http://localhost:8070/products/getAllProducts')
      .then((response) => response.json())
      .then((data) => setProducts(data.length))
      .catch((error) => console.error('Error fetching products:', error));

    // Fetch number of employees
    fetch('http://localhost:8070/Employee/employees')
      .then((response) => response.json())
      .then((data) => setEmployees(data.length))
      .catch((error) => console.error('Error fetching employees:', error));

    // Fetch number of users
    fetch('http://localhost:8070/User/users')
      .then((response) => response.json())
      .then((data) => setUsers(data.length))
      .catch((error) => console.error('Error fetching users:', error));
  }, []);

  // Function to navigate to AdminProfile
  const navigateToAdminProfile = () => {
    const userId = 1; // Replace with the actual user ID
    navigate(`/AdminProfile/${userId}`); // Use navigate instead of history.push
  };

  return (
    <main className="flex-1 p-8 overflow-y-auto bg-gray-50">
      <h1 className="text-3xl font-bold text-blue-900 mb-8">Dashboard Overview</h1>

     

      {/* Second Row of Tiles */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-blue-100 transform hover:scale-105">
          <h2 className="text-lg font-semibold text-blue-800 mb-2 flex items-center">
            <span className="mr-2">👥</span> Number of Employees
          </h2>
          <p className="text-4xl font-bold text-blue-600">{employees}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-blue-100 transform hover:scale-105">
          <h2 className="text-lg font-semibold text-blue-800 mb-2 flex items-center">
            <span className="mr-2">👤</span> Number of Users
          </h2>
          <p className="text-4xl font-bold text-blue-600">{users}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-blue-100 transform hover:scale-105">
          <h2 className="text-lg font-semibold text-blue-800 mb-2 flex items-center">
            <span className="mr-2">📅</span> Appointments
          </h2>
          <p className="text-4xl font-bold text-blue-600">{appointments}</p>
        </div>
      </div>

      {/* Third Row of Tiles */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-blue-100 transform hover:scale-105">
          <h2 className="text-lg font-semibold text-blue-800 mb-2 flex items-center">
            <span className="mr-2">🏘️</span> Community Forms
          </h2>
          <p className="text-4xl font-bold text-blue-600">{communityForms}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-blue-100 transform hover:scale-105">
          <h2 className="text-lg font-semibold text-blue-800 mb-2 flex items-center">
            <span className="mr-2">📄</span> Financial Documents
          </h2>
          <p className="text-4xl font-bold text-blue-600">{financialDocuments}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-blue-100 transform hover:scale-105">
          <h2 className="text-lg font-semibold text-blue-800 mb-2 flex items-center">
            <span className="mr-2">🔑</span> Current Roles
          </h2>
          <p className="text-4xl font-bold text-blue-600">{roles}</p>
        </div>
      </div>

      {/* First Row of Tiles */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-blue-100 transform hover:scale-105">
          <h2 className="text-lg font-semibold text-blue-800 mb-2 flex items-center">
            <span className="mr-2">🛒</span> Products in Store
          </h2>
          <p className="text-4xl font-bold text-blue-600">{products}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-blue-100 transform hover:scale-105">
          <h2 className="text-lg font-semibold text-blue-800 mb-2 flex items-center">
            <span className="mr-2">📱</span> Active Devices
          </h2>
          <p className="text-4xl font-bold text-blue-600">12</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-blue-100 transform hover:scale-105">
          <h2 className="text-lg font-semibold text-blue-800 mb-2 flex items-center">
            <span className="mr-2">🚨</span> Alerts
          </h2>
          <p className="text-4xl font-bold text-blue-600">3</p>
        </div>
      </div>

      {/* Chart Section */}
      <DashboardChart />
    </main>
  );
};

export default MainContent;