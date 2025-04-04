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
  const [productToUpdate, setProductToUpdate] = useState(null); // State to store the product being updated
  const [suppliers, setSuppliers] = useState([]); // State to store supplier IDs

  // Fetch product data from the backend
  useEffect(() => {
    fetchProducts();
    fetchSuppliers();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch(
        "http://localhost:8070/products/getAllProducts"
      );
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
          "product name",
          "price",
          "description",
          "category",
          "quantity",
          "supplier",
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

  const handleImageChange = (e) => {
    setNewProduct({ ...newProduct, image: e.target.files[0] });
  };

  // Function to handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct({ ...newProduct, [name]: value });
  };

  const updateProduct = (product) => {
    setProductToUpdate(product); // Set the product to update
    setShowAddProductForm(true); // Show the form
  };

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", newProduct.name);
    formData.append("price", newProduct.price);
    formData.append("description", newProduct.description);
    formData.append("category", newProduct.category);
    formData.append("quantity", newProduct.quantity);
    formData.append("supplier", newProduct.supplier);
    if (newProduct.image) {
      formData.append("image", newProduct.image);
    }

    try {
      let response;
      if (productToUpdate) {
        // Update existing product
        response = await fetch(
          `http://localhost:8070/products/updateProduct/${productToUpdate._id}`,
          {
            method: "PUT",
            body: formData,
          }
        );
      } else {
        // Add new product
        response = await fetch(
          "http://localhost:8070/products/addProduct",
          {
            method: "POST",
            body: formData,
          }
        );
      }

      if (!response.ok) {
        throw new Error(productToUpdate ? "Failed to update product" : "Failed to add product");
      }

      const data = await response.json();
      if (productToUpdate) {
        // Update the product in the list
        setProducts(products.map((p) => (p._id === productToUpdate._id ? data : p)));
        setProductToUpdate(null); // Clear the product to update
        window.location.href = "#";
      } else {
        // Add the new product to the list
        setProducts([...products, data]);
        window.location.href = "#";
      }
      setShowAddProductForm(false); // Hide the form after submission
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
      setError(error.message);
    }
  };

  //delete data from DB
  const deleteProduct = (id, name) => {
    axios
      .delete(`http://localhost:8070/products/deleteProduct/${id}`)
      .then((res) => {
        console.log(res.data); // Optional: log server response
        alert(`product Deleted : ${name}`);
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
          onClick={() => setShowAddProductForm(!showAddProductForm)}
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
            {productToUpdate ? "Update Product" : "Add New Product"}
          </h2>
          <form method="post" onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700">Product Name</label>
              <input
                type="text"
                name="name"
                value={productToUpdate ? productToUpdate.name : newProduct.name}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Price</label>
              <input
                type="number"
                name="price"
                value={productToUpdate ? productToUpdate.price : newProduct.price}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Description</label>
              <input
                type="text"
                name="description"
                value={productToUpdate ? productToUpdate.description : newProduct.description}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Category</label>
              <input
                type="text"
                name="category"
                value={productToUpdate ? productToUpdate.category : newProduct.category}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Quantity</label>
              <input
                type="number"
                name="quantity"
                value={productToUpdate ? productToUpdate.quantity : newProduct.quantity}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Image</label>
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
                value={productToUpdate ? productToUpdate.supplier : newProduct.supplier}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                required
              >
                <option value="">Select Supplier</option>
                {suppliers.map((supplier) => (
                  <option key={supplier._id} value={supplier._id}>
                    {supplier.name} ({supplier._id})
                  </option>
                ))}
              </select>
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition duration-300"
              >
                {productToUpdate ? "Update Product" : "Add Product"}
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
                    onClick={() => updateProduct(product)}
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