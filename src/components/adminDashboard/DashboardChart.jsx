import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, PieChart, Pie, Cell } from 'recharts';

const DashboardChart = () => {
  // State to store fetched data
  const [appointments, setAppointments] = useState(0);
  const [communityForms, setCommunityForms] = useState(0);
  const [financialDocuments, setFinancialDocuments] = useState(0);
  const [roles, setRoles] = useState(0);
  const [products, setProducts] = useState(0);
  const [employees, setEmployees] = useState(0);
  const [users, setUsers] = useState(0);

  // Fetch data from the backend
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

  // Data for Bar Chart
  const barChartData = [
    { name: 'Appointments', value: appointments },
    { name: 'Community Forms', value: communityForms },
    { name: 'Financial Docs', value: financialDocuments },
    { name: 'Roles', value: roles },
    { name: 'Products', value: products },
    { name: 'Employees', value: employees },
    { name: 'Users', value: users },
  ];

  // Data for Pie Chart
  const pieChartData = [
    { name: 'Appointments', value: appointments },
    { name: 'Community Forms', value: communityForms },
    { name: 'Financial Docs', value: financialDocuments },
    { name: 'Roles', value: roles },
    { name: 'Products', value: products },
    { name: 'Employees', value: employees },
    { name: 'Users', value: users },
  ];

  // Colors for Pie Chart
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF', '#FF1919', '#19FFAF'];

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-blue-800 mb-6">Dashboard Overview</h1>

      {/* Bar Chart */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Data Overview (Bar Chart)</h2>
        <BarChart width={800} height={400} data={barChartData}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="value" fill="#8884d8" />
        </BarChart>
      </div>

      {/* Pie Chart */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Data Distribution (Pie Chart)</h2>
        <PieChart width={800} height={400}>
          <Pie
            data={pieChartData}
            cx="50%"
            cy="50%"
            outerRadius={150}
            fill="#8884d8"
            dataKey="value"
            label
          >
            {pieChartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </div>

      {/* Table */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Data Summary (Table)</h2>
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left p-3 text-gray-700">Category</th>
              <th className="text-left p-3 text-gray-700">Count</th>
            </tr>
          </thead>
          <tbody>
            {barChartData.map((item, index) => (
              <tr key={index} className="border-b hover:bg-gray-50 transition duration-200">
                <td className="p-3 text-gray-800">{item.name}</td>
                <td className="p-3 text-gray-800">{item.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DashboardChart;