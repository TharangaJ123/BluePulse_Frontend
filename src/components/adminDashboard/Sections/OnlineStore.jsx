import React, { useEffect, useState } from "react";
import {
  FaCheckCircle, // In Stock
  FaTimesCircle, // Out of Stock
  FaBox, // Total Products
  FaDownload, // Download
  FaPlus, // Add Product
} from "react-icons/fa"; // Import icons
import logo from "../../../assets/logo1.png";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import axios from "axios";

const InventoryManagement = () => {
  const [products, setProducts] = useState([]); // State to store product data
  const [loading, setLoading] = useState(true); // State to handle loading state
  const [error, setError] = useState(null); // State to handle errors
  const [showAddProductForm, setShowAddProductForm] = useState(false); // State to control form visibility
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    description: "",
    image: null,
    category: "",
    quantity: "",
    supplier: "",
  });
  const [quantities, setQuantities] = useState({}); // State to manage quantities for each product
  const [suppliers, setSuppliers] = useState([]); // State to store supplier IDs
  const [validationErrors, setValidationErrors] = useState({}); // State to track validation errors
  const [showUpdateProductForm, setShowUpdateProductForm] = useState(false); // State to control update form visibility
  const [productToUpdate, setProductToUpdate] = useState({
    _id: "",
    name: "",
    price: "",
    description: "",
    image: null,
    category: "",
    quantity: "",
    supplier: "",
  });

  // Define categories for the dropdown
  const categories = ["Test Kits", "Spare Parts", "Purification Items"];

  // Fetch product data from the backend
  useEffect(() => {
    fetchProducts();
    fetchSuppliers();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch("http://localhost:8070/products/getAllProducts");
      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }
      const data = await response.json();
      setProducts(data); // Set the fetched data to the state

      // Initialize quantities state with current product quantities
      const initialQuantities = data.reduce((acc, product) => {
        acc[product._id] = product.quantity;
        return acc;
      }, {});
      setQuantities(initialQuantities);
    } catch (error) {
      setError(error.message); // Set error message if something goes wrong
    } finally {
      setLoading(false); // Set loading to false after fetching
    }
  };

  const fetchSuppliers = async () => {
    try {
      const response = await fetch("http://localhost:8070/suppliers/getAllSuppliers");
      if (!response.ok) {
        throw new Error("Failed to fetch suppliers");
      }
      const data = await response.json();
      setSuppliers(data); // Set the fetched supplier IDs to the state
    } catch (error) {
      setError(error.message); // Set error message if something goes wrong
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
        const headers = [
          "Product Name",
          "Price",
          "Description",
          "Category",
          "Quantity",
          "Supplier",
        ];
        const data = products.map((product) => [
          product.name,
          product.price,
          product.description || "N/A",
          product.category || "N/A",
          product.quantity || "N/A",
          product.supplier || "N/A",
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

  // Function to handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct((prevProduct) => ({
      ...prevProduct,
      [name]: value,
    }));
    // Clear validation error for the field being updated
    setValidationErrors({ ...validationErrors, [name]: "" });
  };

  // Function to handle image changes
  const handleImageChange = (e) => {
    setNewProduct({ ...newProduct, image: e.target.files[0] });
  };

  // Function to validate form fields
  const validateForm = () => {
    const errors = {};

    if (!newProduct.name.trim()) {
      errors.name = "Product name is required";
    }
    if (!newProduct.price || isNaN(newProduct.price) || newProduct.price <= 0) {
      errors.price = "Price must be a valid positive number";
    }
    if (!newProduct.category) {
      errors.category = "Category is required";
    }
    if (!newProduct.quantity || isNaN(newProduct.quantity) || newProduct.quantity < 0) {
      errors.quantity = "Quantity must be a valid non-negative number";
    }
    if (!newProduct.supplier) {
      errors.supplier = "Supplier is required";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0; // Return true if no errors
  };

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form fields
    if (!validateForm()) {
      return; // Stop submission if validation fails
    }

    const formData = new FormData();
    formData.append("name", newProduct.name);
    formData.append("price", newProduct.price);
    formData.append("description", newProduct.description);
    formData.append("category", newProduct.category);
    formData.append("quantity", newProduct.quantity);
    formData.append("supplier", newProduct.supplier);

    // Append the image only if a new image is selected
    if (newProduct.image instanceof File) {
      formData.append("image", newProduct.image);
    }

    // Debugging: Log FormData
    for (let [key, value] of formData.entries()) {
      console.log(key, value);
    }

    try {
      let response = await fetch("http://localhost:8070/products/addProduct", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Response Data:", data); // Debugging

    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  // Function to delete a product
  const deleteProduct = (id, name) => {
    axios
      .delete(`http://localhost:8070/products/deleteProduct/${id}`)
      .then((res) => {
        console.log(res.data); // Optional: log server response
        alert(`Product Deleted: ${name}`);
        window.location.href = "#";
      })
      .catch((err) => {
        alert(err);
      });
  };

  // Function to check product quantity
  const checkProductQuantity = async (productId, newQuantity) => {
    try {
      const response = await fetch(
        `http://localhost:8070/products/${productId}/quantity`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ quantity: newQuantity }), // Pass product ID and quantity
        }
      );

      if (!response.ok) {
        throw new Error("Failed to check quantity");
      }

      const result = await response.json();
      console.log(result); // Log the response from the backend
      alert("Quantity checked successfully!");
    } catch (error) {
      console.error("Error checking quantity:", error);
      alert("Failed to check quantity.");
    }
  };

  // Function to handle update button click
  const handleUpdateClick = (product) => {
    setProductToUpdate({
      _id: product._id,
      name: product.name,
      price: product.price,
      description: product.description,
      image: product.imageUrl,
      category: product.category,
      quantity: product.quantity,
      supplier: product.supplier,
    });
    setShowUpdateProductForm(true);
  };

  // Function to handle update form submission
  const handleUpdateSubmit = async (e) => {
    e.preventDefault();

    // Validate form fields
    if (!validateForm()) {
      return; // Stop submission if validation fails
    }

    const formData = new FormData();
    formData.append("name", productToUpdate.name);
    formData.append("price", productToUpdate.price);
    formData.append("description", productToUpdate.description);
    formData.append("category", productToUpdate.category);
    formData.append("quantity", productToUpdate.quantity);
    formData.append("supplier", productToUpdate.supplier);

    // Append the image only if a new image is selected
    if (productToUpdate.image instanceof File) {
      formData.append("image", productToUpdate.image);
    }

    try {
      let response = await fetch(`http://localhost:8070/products/updateProduct/${productToUpdate._id}`, {
        method: "PUT",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Response Data:", data); // Debugging

      // Refresh the product list
      fetchProducts();
      setShowUpdateProductForm(false); // Hide the update form
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  // Display loading state
  if (loading) {
    return (
      <main className="flex-1 p-8 overflow-y-auto">
        <h1 className="text-2xl font-bold text-blue-800 mb-6">
          Inventory Management
        </h1>
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
        <h1 className="text-2xl font-bold text-blue-800 mb-6">
          Inventory Management
        </h1>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <p className="text-red-600">Error: {error}</p>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 p-8 overflow-y-auto">
      <h1 className="text-2xl font-bold text-blue-800 mb-6">
        Inventory Management
      </h1>

      {/* Tiles for Product Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Total Products Tile */}
        <div className="bg-gradient-to-r from-blue-100 to-blue-200 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
          <h2 className="text-lg font-semibold text-gray-800 mb-2 flex items-center">
            <FaBox className="text-blue-600 mr-2" /> Total Products
          </h2>
          <p className="text-3xl font-bold text-blue-800">{products.length}</p>
        </div>

        {/* In Stock Products Tile */}
        <div className="bg-gradient-to-r from-green-100 to-green-200 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
          <h2 className="text-lg font-semibold text-gray-800 mb-2 flex items-center">
            <FaCheckCircle className="text-green-600 mr-2" /> In Stock
          </h2>
          <p className="text-3xl font-bold text-green-800">
            {products.filter((product) => product.quantity > 0).length}
          </p>
        </div>

        {/* Out of Stock Products Tile */}
        <div className="bg-gradient-to-r from-red-100 to-red-200 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
          <h2 className="text-lg font-semibold text-gray-800 mb-2 flex items-center">
            <FaTimesCircle className="text-red-600 mr-2" /> Out of Stock
          </h2>
          <p className="text-3xl font-bold text-red-800">
            {products.filter((product) => product.quantity === 0).length}
          </p>
        </div>
      </div>

      {/* Add Product Button */}
      <div className="mb-6">
        <button
          onClick={() => {
            setShowAddProductForm(!showAddProductForm);
          }}
          className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition duration-300 flex items-center"
        >
          <FaPlus className="mr-2" />{" "}
          {showAddProductForm ? "Hide Form" : "Add Product"}
        </button>
      </div>

      {/* Add Product Form */}
      {showAddProductForm && (
        <div className="bg-white p-6 rounded-lg shadow-lg mb-6 w-200">
          <h2 className="text-xl font-bold mb-4">
            Add New Product
          </h2>
          <form method="post" onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700">Product Name</label>
              <input
                type="text"
                name="name"
                value={newProduct.name}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              />
              {validationErrors.name && (
                <p className="text-red-500 text-sm mt-1">{validationErrors.name}</p>
              )}
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Price</label>
              <input
                type="number"
                name="price"
                value={newProduct.price}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              />
              {validationErrors.price && (
                <p className="text-red-500 text-sm mt-1">{validationErrors.price}</p>
              )}
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Description</label>
              <input
                type="text"
                name="description"
                value={newProduct.description}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Category</label>
              <select
                name="category"
                value={newProduct.category}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              >
                <option value="">Select Category</option>
                {categories.map((category, index) => (
                  <option key={index} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              {validationErrors.category && (
                <p className="text-red-500 text-sm mt-1">{validationErrors.category}</p>
              )}
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Quantity</label>
              <input
                type="number"
                name="quantity"
                value={newProduct.quantity}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              />
              {validationErrors.quantity && (
                <p className="text-red-500 text-sm mt-1">{validationErrors.quantity}</p>
              )}
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Image</label>
              {newProduct.image && typeof newProduct.image === "string" ? (
                <img
                  src={`http://localhost:8070${newProduct.image}`}
                  alt="Product"
                  className="w-20 h-20 mb-2"
                />
              ) : null}
              <input
                type="file"
                name="image"
                onChange={handleImageChange}
                className="w-full p-2 border rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Supplier ID</label>
              <select
                name="supplier"
                value={newProduct.supplier}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              >
                <option value="">Select Supplier</option>
                {suppliers.map((supplier) => (
                  <option key={supplier._id} value={supplier._id}>
                    {supplier.name} ({supplier._id})
                  </option>
                ))}
              </select>
              {validationErrors.supplier && (
                <p className="text-red-500 text-sm mt-1">{validationErrors.supplier}</p>
              )}
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition duration-300"
              >
                Add Product
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Update Product Form */}
      {showUpdateProductForm && (
        <div className="bg-white p-6 rounded-lg shadow-lg mb-6 w-200">
          <h2 className="text-xl font-bold mb-4">Update Product</h2>
          <form method="post" onSubmit={handleUpdateSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700">Product Name</label>
              <input
                type="text"
                name="name"
                value={productToUpdate.name}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              />
              {validationErrors.name && (
                <p className="text-red-500 text-sm mt-1">{validationErrors.name}</p>
              )}
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Price</label>
              <input
                type="number"
                name="price"
                value={productToUpdate.price}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              />
              {validationErrors.price && (
                <p className="text-red-500 text-sm mt-1">{validationErrors.price}</p>
              )}
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Description</label>
              <input
                type="text"
                name="description"
                value={productToUpdate.description}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Category</label>
              <select
                name="category"
                value={productToUpdate.category}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              >
                <option value="">Select Category</option>
                {categories.map((category, index) => (
                  <option key={index} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              {validationErrors.category && (
                <p className="text-red-500 text-sm mt-1">{validationErrors.category}</p>
              )}
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Quantity</label>
              <input
                type="number"
                name="quantity"
                value={productToUpdate.quantity}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              />
              {validationErrors.quantity && (
                <p className="text-red-500 text-sm mt-1">{validationErrors.quantity}</p>
              )}
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Image</label>
              {productToUpdate.image && typeof productToUpdate.image === "string" ? (
                <img
                  src={`http://localhost:8070${productToUpdate.image}`}
                  alt="Product"
                  className="w-20 h-20 mb-2"
                />
              ) : null}
              <input
                type="file"
                name="image"
                onChange={handleImageChange}
                className="w-full p-2 border rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Supplier ID</label>
              <select
                name="supplier"
                value={productToUpdate.supplier}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              >
                <option value="">Select Supplier</option>
                {suppliers.map((supplier) => (
                  <option key={supplier._id} value={supplier._id}>
                    {supplier.name} ({supplier._id})
                  </option>
                ))}
              </select>
              {validationErrors.supplier && (
                <p className="text-red-500 text-sm mt-1">{validationErrors.supplier}</p>
              )}
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition duration-300"
              >
                Update Product
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
              <th className="text-left p-3 text-gray-700">Product Name</th>
              <th className="text-left p-3 text-gray-700">Price</th>
              <th className="text-left p-3 text-gray-700">Description</th>
              <th className="text-left p-3 text-gray-700">Image</th>
              <th className="text-left p-3 text-gray-700">Category</th>
              <th className="text-left p-3 text-gray-700">Quantity</th>
              <th className="text-left p-3 text-gray-700">Supplier ID</th>
              <th className="text-left p-3 text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product._id} className="border-b">
                <td className="p-3">{product.name}</td>
                <td className="p-3">{product.price}</td>
                <td className="p-3">{product.description || "N/A"}</td>
                <td className="p-3">
                  {product.imageUrl ? (
                    <img
                      src={`http://localhost:8070${product.imageUrl}`}
                      className="w-10 h-10"
                      alt={product.name}
                    />
                  ) : (
                    <span>No Image</span>
                  )}
                </td>
                <td className="p-3 whitespace-nowrap">{product.category}</td>
                <td className="p-3 flex justify-center align-middle">
                  {quantities[product._id] < 10 ? (
                    <>
                      <input
                        type="number"
                        value={quantities[product._id] || ""}
                        onChange={(e) =>
                          setQuantities((prevQuantities) => ({
                            ...prevQuantities,
                            [product._id]: e.target.value,
                          }))
                        }
                        className="w-10 h-5 p-1 border-0"
                        readOnly
                      />
                      <button
                        onClick={() =>
                          checkProductQuantity(
                            product._id,
                            quantities[product._id]
                          )
                        }
                        className={`ml-2 text-white px-2 py-1 rounded ${
                          quantities[product._id] < 10
                            ? "bg-red-500 hover:bg-red-600" // Red color for low quantity
                            : "bg-emerald-700 hover:bg-emerald-700" // Blue color for normal quantity
                        }`}
                      >
                        Notify to supplier
                      </button>
                    </>
                  ) : (
                    <span>{quantities[product._id]}</span> // Display quantity if it's normal
                  )}
                </td>

                <td className="p-3">{product.supplier}</td>
                <td className="p-3 flex align-middle justify-center" colSpan={2}>
                  <button
                    onClick={() => deleteProduct(product._id, product.name)}
                    className="ml-2 text-white px-2 py-1 rounded bg-emerald-700 hover:bg-emerald-700"
                  >
                    Delete
                  </button>

                  <button
                    onClick={() => handleUpdateClick(product)}
                    className="ml-2 text-white px-2 py-1 rounded bg-emerald-700 hover:bg-emerald-700"
                  >
                    Update
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

export default InventoryManagement;