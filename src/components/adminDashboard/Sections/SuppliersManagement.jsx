import React, { useEffect, useState } from 'react';
import {
  FaCheckCircle, // In Stock
  FaTimesCircle, // Out of Stock
  FaBox,         // Total Products
  FaDownload,    // Download
  FaPlus,        // Add Product
} from 'react-icons/fa'; // Import icons
import jsPDF from 'jspdf'; // Import jsPDF library
import autoTable from 'jspdf-autotable';
import logo from "../../../assets/logo1.png"; // Import logo

const SuppliersManagement = () => {
  
  const [loading, setLoading] = useState(true); // State to handle loading state
  const [error, setError] = useState(null); // State to handle errors
  const [ShowAddSupplierForm, setShowAddSupplierForm] = useState(false);
  const [suppliers, setSuppliers] = useState([]); // State to store product data
  const [newSupplier, setNewSupplier] = useState({
    name: '',
    email: '',
    phone: '',
  });

  // Fetch product data from the backend
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
        doc.addImage(base64data, "PNG", 10, 10, 40, 20);
  
        // Add company details
        doc.setFontSize(14);
        doc.text("The Cafe House", 55, 20);
        doc.setFontSize(10);
        doc.text("123 Main Street, Colombo", 55, 26);
        doc.text("Phone: +94 71 234 5678", 55, 32);
  
        // Add title
        doc.setFontSize(18);
        doc.text("Supplier Details", 10, 50);
  
        // Define table headers and data
        const headers = ["Supplier Name", "Email", "Phone"];
        const data = suppliers.map((supplier) => [
          supplier.name,
          supplier.email,
          supplier.phone || "N/A",
        ]);
  
        // Generate table
        autoTable(doc, {
          head: [headers],
          body: data,
          startY: 60,
        });
  
        // Save the PDF
        doc.save("supplier_details.pdf");
      };
  
      reader.readAsDataURL(blob); // Convert Blob to Base64
    } catch (error) {
      console.error("Error generating PDF:", error);
      setError("Failed to generate PDF");
    }
  };

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", newSupplier.name);
    formData.append("email", newSupplier.email);
    formData.append("phone", newSupplier.phone);
    console.log(formData)

    try {
      const response = await fetch("http://localhost:8070/suppliers/addSupplier", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to add product");
      }

      const data = await response.json();
      setSuppliers([...suppliers, data]); // Add the new product to the list
      setShowAddSupplierForm(false); // Hide the form after submission
      setNewSupplier({
        name: '',
        email: '',
        phone: ''
      });
    } catch (error) {
      setError(error.message);
    }
  };

  // Display loading state
  if (loading) {
    return (
      <main className="flex-1 p-8 overflow-y-auto">
        <h1 className="text-2xl font-bold text-blue-800 mb-6">Inventory Management</h1>
        <div className="bg-white p-6 rounded-lg shadow-md animate-pulse">
          <p>Loading Products...</p>
        </div>
      </main>
    );
  }

  // Display error message
  if (error) {
    return (
      <main className="flex-1 p-8 overflow-y-auto">
        <h1 className="text-2xl font-bold text-blue-800 mb-6">Inventory Management</h1>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <p className="text-red-600">Error: {error}</p>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 p-8 overflow-y-auto">
      <h1 className="text-2xl font-bold text-blue-800 mb-6">Inventory Management</h1>

      {/* Tiles for Product Statistics 
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">*/}
        {/* Total Products Tile x
        <div className="bg-gradient-to-r from-blue-100 to-blue-200 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
          <h2 className="text-lg font-semibold text-gray-800 mb-2 flex items-center">
            <FaBox className="text-blue-600 mr-2" /> Total Products
          </h2>
          <p className="text-3xl font-bold text-blue-800">
            {suppliers.length}
          </p>
        </div>*/}

        {/* In Stock Products Tile 
        <div className="bg-gradient-to-r from-green-100 to-green-200 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
          <h2 className="text-lg font-semibold text-gray-800 mb-2 flex items-center">
            <FaCheckCircle className="text-green-600 mr-2" /> In Stock
          </h2>
          <p className="text-3xl font-bold text-green-800">
            {products.filter((suppliers) => suppliers.quantity > 0).length}
          </p>
        </div>*/}

        {/* Out of Stock Products Tile 
        <div className="bg-gradient-to-r from-red-100 to-red-200 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
          <h2 className="text-lg font-semibold text-gray-800 mb-2 flex items-center">
            <FaTimesCircle className="text-red-600 mr-2" /> Out of Stock
          </h2>
          <p className="text-3xl font-bold text-red-800">
            {products.filter((product) => product.quantity === 0).length}
          </p>
        </div>
      </div>*/}

      {/* Add Product Button */}
      <div className="mb-6">
        <button
          onClick={() => setShowAddSupplierForm(!ShowAddSupplierForm)}
          className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition duration-300 flex items-center"
        >
          <FaPlus className="mr-2" /> {ShowAddSupplierForm ? 'Hide Form' : 'Add Product'}
        </button>
      </div>

      {/* Add Product Form */}
      {ShowAddSupplierForm && (
        <div className="bg-white p-6 rounded-lg shadow-lg mb-6 w-200">
          <h2 className="text-xl font-bold mb-4">Add New Supplier</h2>
          <form method='post' onSubmit={handleSubmit}>
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
                type="text"
                name="email"
                value={newSupplier.email}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Telephone Number</label>
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
                Register the supplier
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
          <FaDownload className="mr-2" /> Download Inventory Details
        </button>
      </div>

      {/* Product Details Table */}
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left p-3 text-gray-700">Supplier Name</th>
              <th className="text-left p-3 text-gray-700">Supplier Name</th>
              <th className="text-left p-3 text-gray-700">Email</th>
              <th className="text-left p-3 text-gray-700">Phone</th>
            </tr>
          </thead>
          <tbody>
            {suppliers.map((supplier) => (
              <tr key={supplier._id} className="border-b">
                <td className="p-3">{supplier._id}</td>
                <td className="p-3">{supplier.name}</td>
                <td className="p-3">{supplier.email}</td>
                <td className="p-3">{supplier.phone || 'N/A'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
};

export default SuppliersManagement;