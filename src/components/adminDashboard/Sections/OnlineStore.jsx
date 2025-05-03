import React, { useEffect, useState } from "react";
import {
  FaCheckCircle,
  FaTimesCircle,
  FaBox,
  FaDownload,
  FaPlus,
  FaAngleDown,
  FaAngleUp,
  FaSearch,
} from "react-icons/fa";
import logo from "../../../assets/bplogo_blackText.png";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import axios from "axios";

const InventoryManagement = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddProductForm, setShowAddProductForm] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    description: "",
    image: null,
    category: "",
    quantity: "",
    supplier: "",
  });
  const [quantities, setQuantities] = useState({});
  const [suppliers, setSuppliers] = useState([]);
  const [validationErrors, setValidationErrors] = useState({});
  const [editingProduct, setEditingProduct] = useState(null);
  const [showEditForm, setShowEditForm] = useState(false);
  const [expandedDescriptions, setExpandedDescriptions] = useState({});
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); 

  const categories = ["Test Kits", "Spare Parts", "Purification Items"];

  const toggleDescription = (productId) => {
    setExpandedDescriptions(prev => ({
      ...prev,
      [productId]: !prev[productId]
    }));
  };

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
      setProducts(data);

      const initialQuantities = data.reduce((acc, product) => {
        acc[product._id] = product.quantity;
        return acc;
      }, {});
      setQuantities(initialQuantities);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchSuppliers = async () => {
    try {
      const response = await fetch("http://localhost:8070/suppliers/getAllSuppliers");
      if (!response.ok) {
        throw new Error("Failed to fetch suppliers");
      }
      const data = await response.json();
      setSuppliers(data);
    } catch (error) {
      setError(error.message);
    }
  };

  const downloadPDF = async () => {
    const doc = new jsPDF();
    
    const response = await fetch(logo);
    const blob = await response.blob();
    const reader = new FileReader();
    
    reader.onloadend = function() {
      const base64data = reader.result;
      doc.addImage(base64data, "PNG", 10, 10, 40, 20);
      
      doc.setFontSize(14);
      doc.text("Order Management Report", 55, 16);
      doc.setFontSize(10);
      doc.text(`Generated on: ${new Date().toLocaleString()}`, 55, 22);
      doc.setFontSize(10);
      doc.text("Address: Minuwangoda Road,Gampaha", 55, 28);
      doc.setFontSize(10);
      doc.text("HotLine: +94 37 695 4879", 55, 34);
      doc.setFontSize(10);
      doc.text("Email: support@bluepulse.com", 55, 40);
      
      autoTable(doc, {
        head: [['Product ID', 'Product Name', 'Price', 'Description', 'Quantity','Category','Supplier']],
        body: filteredProducts.map(product => [
          product._id.substring(0, 8),
          product.name,
          product.price,
          product.description,
          product.quantity,
          product.category,
          product.supplier
        ]),
        startY: 50,
      });
      
      doc.save("product_report.pdf");
    };
    
    reader.readAsDataURL(blob);
  };

  // Function to handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct({ ...newProduct, [name]: value });
    setValidationErrors({ ...validationErrors, [name]: "" });
  };

  // Function to handle image changes
  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setNewProduct({
        ...newProduct,
        image: e.target.files[0],
      });
    }
  };

  // Function to validate form fields
  const validateForm = (product) => {
    const errors = {};

    if (!product.name.trim()) {
      errors.name = "Product name is required";
    }
    if (!product.price || isNaN(product.price) || product.price <= 0) {
      errors.price = "Price must be a valid positive number";
    }
    if (!product.category) {
      errors.category = "Category is required";
    }
    if (!product.quantity || isNaN(product.quantity) || product.quantity < 0) {
      errors.quantity = "Quantity must be a valid non-negative number";
    }
    if (!product.supplier) {
      errors.supplier = "Supplier is required";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0; // Return true if no errors
  };

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form fields
    if (!validateForm(newProduct)) {
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

    try {
      let response = await fetch("http://localhost:8070/products/addProduct", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Response Data:", data);
      alert("Product added successfully!");
      setShowAddProductForm(false);
      fetchProducts(); // Refresh the product list
      // Reset form
      setNewProduct({
        name: "",
        price: "",
        description: "",
        image: null,
        category: "",
        quantity: "",
        supplier: "",
      });
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Failed to add product.");
    }
  };

  // Function to handle opening the edit form
  const handleEditClick = (product) => {
    setEditingProduct(product);
    setShowEditForm(true);
    // Set the form values to the current product's values
    setNewProduct({
      name: product.name,
      price: product.price,
      description: product.description,
      image: product.imageUrl,
      category: product.category,
      quantity: product.quantity,
      supplier: product.supplier,
    });
  };

  //filtered products
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter(product => 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product._id.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredProducts(filtered);
    }
  }, [searchTerm, products]);

  // Function to handle updating a product
  const handleUpdateProduct = async (e) => {
    e.preventDefault();
  
    if (!validateForm(newProduct)) {
      return;
    }
  
    const formData = new FormData();
    formData.append("name", newProduct.name);
    formData.append("price", newProduct.price);
    formData.append("description", newProduct.description);
    formData.append("category", newProduct.category);
    formData.append("quantity", newProduct.quantity);
    formData.append("supplier", newProduct.supplier);
  
    // Only append image if it's a new file
    if (newProduct.image instanceof File) {
      formData.append("image", newProduct.image);
    } else if (typeof newProduct.image === "string") {
      // If it's a string (existing image URL), send it as imageUrl
      formData.append("imageUrl", newProduct.image);
    }
  
    try {
      const response = await axios.put(
        `http://localhost:8070/products/updateProduct/${editingProduct._id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
  
      if (response.status === 200) {
        alert("Product updated successfully!");
        setShowEditForm(false);
        fetchProducts(); // Refresh the product list
      }
    } catch (error) {
      console.error("Error updating product:", error);
      alert("Failed to update product.");
    }
  };

  // Function to delete a product
  const deleteProduct = (id, name) => {
    if (window.confirm(`Are you sure you want to delete ${name}?`)) {
      axios
        .delete(`http://localhost:8070/products/deleteProduct/${id}`)
        .then((res) => {
          console.log(res.data);
          alert(`Product Deleted: ${name}`);
          fetchProducts(); // Refresh the product list
        })
        .catch((err) => {
          alert(err);
        });
    }
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
          body: JSON.stringify({ quantity: newQuantity }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to check quantity");
      }

      const result = await response.json();
      console.log(result);
      alert("Quantity checked successfully!");
    } catch (error) {
      console.error("Error checking quantity:", error);
      alert("Failed to check quantity.");
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
      <div className="mb-8 flex flex-col sm:flex-row gap-4 sm:items-center justify-between">
        <div className="flex-1 sm:flex-none">
          <button
            onClick={() => setShowAddProductForm(!showAddProductForm)}
            className="text-white px-4 py-2.5 rounded-lg transition-all duration-300 flex items-center shadow-md hover:shadow-lg"
          >
            <FaPlus className="mr-2" />
            {showAddProductForm ? "Hide Form" : "Add Product"}
          </button>
        </div>

        <div className="flex-1 min-w-0">
          <div className="relative max-w-xl mx-auto">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search products by name or ID..."
              className="pl-10 w-full p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent shadow-sm transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                <FaTimesCircle className="text-gray-400 hover:text-gray-600 transition-colors" />
              </button>
            )}
          </div>
        </div>

        <div className="flex-1 sm:flex-none text-right">
            <button
              onClick={downloadPDF}
              className="text-black px-4 py-2.5 rounded-lg transition-all duration-300 flex items-center shadow-md hover:shadow-lg ml-auto"
            >
              <FaDownload className="mr-2" />
              <span className="hidden sm:inline">Download Inventory</span>
              <span className="sm:hidden">Download</span>
            </button>
        </div>
      </div>                                

      {/* Add Product Form */}
      {showAddProductForm && (
        <div className="bg-white p-6 rounded-lg shadow-lg mb-6 w-200">
          <h2 className="text-xl font-bold mb-4">Add New Product</h2>
          <form onSubmit={handleSubmit}>
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
              <textarea
                name="description"
                value={newProduct.description}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                rows="3"
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
              {newProduct.image && (
                <div className="mb-2">
                  {typeof newProduct.image === "string" ? (
                    <img
                      src={`http://localhost:8070${newProduct.image}`}
                      alt="Current Product"
                      className="w-20 h-20 object-cover"
                    />
                  ) : (
                    <img
                      src={URL.createObjectURL(newProduct.image)}
                      alt="New Product Preview"
                      className="w-20 h-20 object-cover"
                    />
                  )}
                </div>
              )}
              <input
                type="file"
                name="image"
                onChange={handleImageChange}
                className="w-full p-2 border rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Supplier</label>
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

      {/* Edit Product Form Modal */}
      {showEditForm && (
        <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Edit Product</h2>
            <form onSubmit={handleUpdateProduct}>
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
                <textarea
                  name="description"
                  value={newProduct.description}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                  rows="3"
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
                <label className="block text-gray-700">Supplier</label>
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
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowEditForm(false)}
                  className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition duration-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-300"
                >
                  Update Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Product Details Table */}
      <div className="bg-white p-6 rounded-lg shadow-lg overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left p-3 text-gray-700">Product ID</th>
              <th className="text-left p-3 text-gray-700">Product Name</th>
              <th className="text-left p-3 text-gray-700">Price</th>
              <th className="text-left p-3 text-gray-700">Description</th>
              <th className="text-left p-3 text-gray-700">Image</th>
              <th className="text-left p-3 text-gray-700">Category</th>
              <th className="text-left p-3 text-gray-700">Quantity</th>
              <th className="text-left p-3 text-gray-700">Supplier</th>
              <th className="text-left p-3 text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
          {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <tr key={product._id} className="border-b hover:bg-gray-50">
                  <td className="p-3 text-sm text-gray-600">{product._id}</td>
                  <td className="p-3">{product.name}</td>
                  <td className="p-3">${product.price}</td>
                  <td className="p-3 max-w-xs">
                    {product.description ? (
                      <div className="relative">
                        <div 
                          className={`overflow-hidden ${expandedDescriptions[product._id] ? '' : 'max-h-16'}`}
                        >
                          {product.description}
                        </div>
                        {product.description.length > 100 && (
                          <button
                            onClick={() => toggleDescription(product._id)}
                            className="text-blue-500 hover:text-blue-700 text-sm mt-1 flex items-center"
                          >
                            {expandedDescriptions[product._id] ? (
                              <>
                                <FaAngleUp className="mr-1" /> Show Less
                              </>
                            ) : (
                              <>
                                <FaAngleDown className="mr-1" /> Read More
                              </>
                            )}
                          </button>
                        )}
                      </div>
                    ) : (
                      "N/A"
                    )}
                  </td>
                  <td className="p-3">
                    {product.imageUrl ? (
                      <img
                        src={`http://localhost:8070${product.imageUrl}`}
                        className="w-10 h-10 object-cover rounded"
                        alt={product.name}
                      />
                    ) : (
                      <span className="text-gray-400">No Image</span>
                    )}
                  </td>
                  <td className="p-3 whitespace-nowrap">{product.category}</td>
                  <td className="p-3">
                    <div className="flex items-center">
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
                            className="w-16 p-1 border rounded text-center"
                            readOnly
                          />
                          <button
                            onClick={() =>
                              checkProductQuantity(
                                product._id,
                                quantities[product._id]
                              )
                            }
                            className={`ml-2 text-white px-2 py-1 rounded text-sm ${
                              quantities[product._id] < 10
                                ? "bg-red-500 hover:bg-red-600"
                                : "bg-emerald-700 hover:bg-emerald-700"
                            }`}
                          >
                            Notify
                          </button>
                        </>
                      ) : (
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm">
                          {quantities[product._id]}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="p-3">
                    {suppliers.find(s => s._id === product.supplier)?.name || product.supplier}
                  </td>
                  <td className="p-3">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => deleteProduct(product._id, product.name)}
                        className="text-white px-3 py-1 rounded bg-red-500 hover:bg-red-600 text-sm"
                      >
                        Delete
                      </button>
                      <button
                        onClick={() => handleEditClick(product)}
                        className="text-white px-3 py-1 rounded bg-blue-500 hover:bg-blue-600 text-sm"
                      >
                        Edit
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9" className="p-4 text-center text-gray-500">
                  No products found matching your search criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
};

export default InventoryManagement;