import React, { useEffect, useState } from 'react';
import {
  FaCheckCircle, // In Stock
  FaTimesCircle, // Out of Stock
  FaBox,         // Total Products
  FaDownload,    // Download
  FaPlus,        // Add Product
  FaEdit,        // Edit
  FaTrash,       // Delete
} from 'react-icons/fa'; // Import icons
import jsPDF from 'jspdf'; // Import jsPDF library
import autoTable from 'jspdf-autotable';
import logo from "../../../assets/logo1.png"; // Import logo

const SuppliersManagement = () => {
  const [loading, setLoading] = useState(true); // State to handle loading state
  const [error, setError] = useState(null); // State to handle errors
  const [showAddSupplierForm, setShowAddSupplierForm] = useState(false);
  const [showEditSupplierForm, setShowEditSupplierForm] = useState(false);
  const [suppliers, setSuppliers] = useState([]); // State to store supplier data
  const [newSupplier, setNewSupplier] = useState({
    name: '',
    email: '',
    phone: '',
  });
  const [editSupplier, setEditSupplier] = useState({
    _id: '',
    name: '',
    email: '',
    phone: '',
  });

  // Fetch supplier data from the backend
  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    try {
      const response = await fetch('http://localhost:8070/suppliers/getAllSuppliers');
      if (!response.ok) {
        throw new Error('Failed to fetch suppliers');
      }
      const data = await response.json();
      setSuppliers(data); // Set the fetched data to the state
    } catch (error) {
      setError(error.message); // Set error message if something goes wrong
    } finally {
      setLoading(false); // Set loading to false after fetching
    }
  };

  // Handle input change for add supplier form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewSupplier({ ...newSupplier, [name]: value });
  };

  // Handle input change for edit supplier form
  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditSupplier({ ...editSupplier, [name]: value });
  };

  // Function to handle form submission for adding a supplier
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8070/suppliers/addSupplier', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newSupplier),
      });

      if (!response.ok) {
        throw new Error('Failed to add supplier');
      }

      const data = await response.json();
      setSuppliers([...suppliers, data]); // Add the new supplier to the list
      setShowAddSupplierForm(false); // Hide the form after submission
      setNewSupplier({
        name: '',
        email: '',
        phone: '',
      });
    } catch (error) {
      setError(error.message);
    }
  };

  // Function to handle form submission for editing a supplier
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:8070/suppliers/${editSupplier._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editSupplier),
      });

      if (!response.ok) {
        throw new Error('Failed to update supplier');
      }

      const updatedSupplier = await response.json();
      setSuppliers(suppliers.map((supplier) =>
        supplier._id === updatedSupplier._id ? updatedSupplier : supplier
      ));
      setShowEditSupplierForm(false); // Hide the form after submission
    } catch (error) {
      setError(error.message);
    }
  };

  // Function to delete a supplier
  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:8070/suppliers/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete supplier');
      }

      setSuppliers(suppliers.filter((supplier) => supplier._id !== id)); // Remove the supplier from the list
    } catch (error) {
      setError(error.message);
    }
  };

  // Function to open the edit form with the selected supplier's data
  const openEditForm = (supplier) => {
    setEditSupplier(supplier);
    setShowEditSupplierForm(true);
  };

  // Download PDF function
  const downloadPDF = async () => {
    try {
      const doc = new jsPDF();

      // Convert image to Base64
      const response = await fetch(logo);
      const blob = await response.blob();
      const reader = new FileReader();

      reader.onloadend = function () {
        const base64data = reader.result; // Base64 string

        // Add image to PDF
        doc.addImage(base64data, 'PNG', 10, 10, 40, 20);

        // Add company details
        doc.setFontSize(14);
        doc.text('The Cafe House', 55, 20);
        doc.setFontSize(10);
        doc.text('123 Main Street, Colombo', 55, 26);
        doc.text('Phone: +94 71 234 5678', 55, 32);

        // Add title
        doc.setFontSize(18);
        doc.text('Supplier Details', 10, 50);

        // Define table headers and data
        const headers = ['Supplier Name', 'Email', 'Phone'];
        const data = suppliers.map((supplier) => [
          supplier.name,
          supplier.email,
          supplier.phone || 'N/A',
        ]);

        // Generate table
        autoTable(doc, {
          head: [headers],
          body: data,
          startY: 60,
        });

        // Save the PDF
        doc.save('supplier_details.pdf');
      };

      reader.readAsDataURL(blob); // Convert Blob to Base64
    } catch (error) {
      console.error('Error generating PDF:', error);
      setError('Failed to generate PDF');
    }
  };

  // Display loading state
  if (loading) {
    return (
      <main className="flex-1 p-8 overflow-y-auto">
        <h1 className="text-2xl font-bold text-blue-800 mb-6">Supplier Management</h1>
        <div className="bg-white p-6 rounded-lg shadow-md animate-pulse">
          <p>Loading Suppliers...</p>
        </div>
      </main>
    );
  }

  // Display error message
  if (error) {
    return (
      <main className="flex-1 p-8 overflow-y-auto">
        <h1 className="text-2xl font-bold text-blue-800 mb-6">Supplier Management</h1>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <p className="text-red-600">Error: {error}</p>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 p-8 overflow-y-auto">
      <h1 className="text-2xl font-bold text-blue-800 mb-6">Supplier Management</h1>

      {/* Add Supplier Button */}
      <div className="mb-6">
        <button
          onClick={() => setShowAddSupplierForm(!showAddSupplierForm)}
          className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition duration-300 flex items-center"
        >
          <FaPlus className="mr-2" /> {showAddSupplierForm ? 'Hide Form' : 'Add Supplier'}
        </button>
      </div>

      {/* Add Supplier Form */}
      {showAddSupplierForm && (
        <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
          <h2 className="text-xl font-bold mb-4">Add New Supplier</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700">Supplier Name</label>
              <input
                type="text"
                name="name"
                value={newSupplier.name}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Email Address</label>
              <input
                type="email"
                name="email"
                value={newSupplier.email}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Phone Number</label>
              <input
                type="text"
                name="phone"
                value={newSupplier.phone}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              />
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition duration-300"
              >
                Register Supplier
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Edit Supplier Form */}
      {showEditSupplierForm && (
        <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
          <h2 className="text-xl font-bold mb-4">Edit Supplier</h2>
          <form onSubmit={handleEditSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700">Supplier Name</label>
              <input
                type="text"
                name="name"
                value={editSupplier.name}
                onChange={handleEditInputChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Email Address</label>
              <input
                type="email"
                name="email"
                value={editSupplier.email}
                onChange={handleEditInputChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Phone Number</label>
              <input
                type="text"
                name="phone"
                value={editSupplier.phone}
                onChange={handleEditInputChange}
                className="w-full p-2 border rounded"
              />
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-300"
              >
                Update Supplier
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Download Button */}
      <div className="mb-6">
        <button
          onClick={downloadPDF}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-300 flex items-center"
        >
          <FaDownload className="mr-2" /> Download Supplier Details
        </button>
      </div>

      {/* Supplier Details Table */}
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left p-3 text-gray-700">Supplier Name</th>
              <th className="text-left p-3 text-gray-700">Email</th>
              <th className="text-left p-3 text-gray-700">Phone</th>
              <th className="text-left p-3 text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {suppliers.map((supplier) => (
              <tr key={supplier._id} className="border-b">
                <td className="p-3">{supplier.name}</td>
                <td className="p-3">{supplier.email}</td>
                <td className="p-3">{supplier.phone || 'N/A'}</td>
                <td className="p-3 flex space-x-2">
                  <button
                    onClick={() => openEditForm(supplier)}
                    className="bg-blue-500 text-white px-2 py-1 rounded-lg hover:bg-blue-600 transition duration-300 flex items-center"
                  >
                    <FaEdit className="mr-1" /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(supplier._id)}
                    className="bg-red-500 text-white px-2 py-1 rounded-lg hover:bg-red-600 transition duration-300 flex items-center"
                  >
                    <FaTrash className="mr-1" /> Delete
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

export default SuppliersManagement;