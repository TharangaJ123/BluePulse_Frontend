import React, { useState, useRef, useEffect } from "react";
import { FiUpload, FiX } from "react-icons/fi";
import { FaSpinner } from "react-icons/fa";
import { FiShoppingCart } from "react-icons/fi";
import Footer from "./Footer";
import NavigationBar from "./NavigationBar";
import { useLocation,useNavigate } from "react-router-dom";

const WaterResourceFinanceForm = () => {

  const location = useLocation();
  const navigate = useNavigate();
  const cartItems = location.state?.cartItems || [];

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    contact: "",
    documentType: "",
    message: "",
  });
  const [files, setFiles] = useState([]);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef(null);

  // Add useEffect to fetch user details from JWT
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        // Get user data from localStorage
        const userData = localStorage.getItem('user');
        if (userData) {
          const user = JSON.parse(userData);
          setFormData(prevData => ({
            ...prevData,
            fullName: user.full_name || '',
            email: user.email || '',
            contact: user.phone_number || '',
          }));
        } else {
          // If no user data in localStorage, try to fetch from API
          const token = localStorage.getItem('accessToken');
          if (!token) return;

          const response = await fetch('http://localhost:8070/User/me', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });

          if (response.ok) {
            const userData = await response.json();
            setFormData(prevData => ({
              ...prevData,
              fullName: userData.full_name || '',
              email: userData.email || '',
              contact: userData.phone_number || '',
            }));
          }
        }
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    };

    fetchUserDetails();
  }, []);

  // Validate form fields
  const validateForm = () => {
    const newErrors = {};
    if (!formData.fullName) newErrors.fullName = "Full name is required";
    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Valid email is required";
    }
 
    if (files.length === 0) newErrors.files = "At least one file is required"; // Validate files
    return newErrors;
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle contact number formatting
  const handleContactChange = (e) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length <= 10) {
      value = value.replace(/^(\d{3})(\d{3})(\d{4})$/, "$1-$2-$3");
      setFormData((prev) => ({
        ...prev,
        contact: value,
      }));
    }
  };

  // Handle file changes
  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files); // Convert FileList to an array
    console.log("Selected Files:", selectedFiles); // Debugging: Log selected files

    const validFiles = selectedFiles.filter((file) => {
      // Check file size (10MB limit)
      const isSizeValid = file.size <= 10 * 1024 * 1024; // 10MB in bytes

      // Check file extension
      const fileExtension = file.name.split(".").pop().toLowerCase();
      const isExtensionValid = [".pdf", ".doc", ".docx", ".jpg"].includes(
        `.${fileExtension}`
      );

      console.log(
        `File: ${file.name}, Size Valid: ${isSizeValid}, Extension Valid: ${isExtensionValid}`
      ); // Debugging: Log validation results

      return isSizeValid && isExtensionValid;
    });

    console.log("Valid Files:", validFiles); // Debugging: Log valid files
    setFiles(validFiles); // Update the files state
    setErrors((prev) => ({ ...prev, files: "" })); // Clear file error
  };

  // Remove a file from the list
  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setIsSubmitting(true);
      try {
        const formDataToSend = new FormData();
        formDataToSend.append("fullName", formData.fullName);
        formDataToSend.append("email", formData.email);
        formDataToSend.append("contactNumber", formData.contact);
        formDataToSend.append("documentType", formData.documentType);
        formDataToSend.append("message", formData.message);

        // Append each file
        if (files.length > 0) {
          files.forEach((file) => {
            formDataToSend.append("UploadDocuments", file);
          });
        }

        const response = await fetch("http://localhost:8070/Finance/add", {
          method: "POST",
          body: formDataToSend,
        });

        const result = await response.json();
        const transactionId = result._id || result.transactionId; // Assuming the response contains a transaction ID
        const email = result.email || formData.email; // Assuming the response contains an email
        console.log("Transaction ID:", transactionId);
        console.log("Email:", email); // Debugging: Log the email
        console.log("Response:", result); // Debugging: Log the response

        if (response.ok) {
          
          alert(result.message);
          handleReset();

          // Send to order management  
          
          const orderResponse = await fetch("http://localhost:8070/orders/createOrder", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ transactionId, cartItems,email }),
          });
          console.log("Sending data:", cartItems);
          

          if (orderResponse.ok) {
            const orderResult = await orderResponse.json();
            navigate("/thankyou");
            console.log("Order is created successfully: " + JSON.stringify(orderResult))

          } else {
            throw new Error("Failed to create order in order management system");
          }

        } else {
          const errorText = await response.text();
          throw new Error(`Failed to submit form: ${errorText}`);
        }

      } catch (error) {
        console.error(error);
        alert("An error occurred: " + error.message);
      } finally {
        setIsSubmitting(false);
      }
    }
  };


  // Reset the form
  const handleReset = () => {
    setFormData({
      fullName: "",
      email: "",
      contact: "",
      documentType: "",
      message: "",
    });
    setFiles([]);
    setErrors({});
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div>
      <NavigationBar/>
      <div className="min-h-screen  to-green-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">

          {/* Cart Items Preview Section */}
          {cartItems.length > 0 ? (
            <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
              <div className="bg-blue-600 px-6 py-4 flex items-center">
                <FiShoppingCart className="text-white h-6 w-6 mr-2" />
                <h2 className="text-xl font-bold text-white">
                  {cartItems.length} Item{cartItems.length !== 1 ? 's' : ''} in Your Payment
                </h2>
              </div>
              
              <div className="p-6">
                <ul className="divide-y divide-gray-200">
                  {cartItems.map((item, index) => (
                    <li key={`${item.id || index}`} className="py-4 flex">
                      <div className="flex-shrink-0 bg-blue-50 rounded-md p-3">
                        <img
                          className="h-16 w-16 object-contain"
                          src={item.image || '/default-item.png'}
                          alt={item.name || 'Cart item'}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = '/default-item.png';
                          }}
                        />
                      </div>
                      <div className="ml-4 flex-1">
                        <div className="flex justify-between">
                          <h3 className="text-sm font-medium text-gray-900">
                            {item.name || 'Unnamed Item'}
                          </h3>
                          <p className="ml-4 text-sm font-medium text-gray-900">
                            LKR {item.price ? item.price.toFixed(2) : '0.00'}
                          </p>
                        </div>
                        {item.description && (
                          <p className="mt-1 text-sm text-gray-500 truncate">
                            {item.description}
                          </p>
                        )}
                        <p className="mt-1 text-xs text-gray-400">
                          Qty: {item.quantity || 1}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>

                <div className="border-t border-gray-200 mt-4 pt-4">
                  <div className="flex justify-between text-base font-medium text-gray-900">
                    <p>Subtotal</p>
                    <p>
                      LKR {cartItems.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 1), 0).toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="mb-8 p-4 bg-yellow-50 border-l-4 border-yellow-400">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-yellow-700">
                    No items found in your payment. Please ensure you've added items before proceeding.
                  </p>
                </div>
              </div>
            </div>  
          )}

          <div className="bg-white rounded-xl p-6 sm:p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-blue-800 mb-2">
                Water Resource Management Financial Submission
              </h1>
              <p className="text-gray-600">
                Please fill out the form below for your financial documentation
                submission
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Full Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    maxLength={50}
                    className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 ${
                      errors.fullName ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Enter Full Name"
                  />
                  {errors.fullName && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.fullName}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 ${
                      errors.email ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="user@example.com"
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                  )}
                </div>

                {/* Contact Number */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Contact Number *
                  </label>
                  <input
                    type="text"
                    name="contact"
                    value={formData.contact}
                    onChange={handleContactChange}
                    className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 ${
                      errors.contact ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="xxx-xxx-xxxx"
                  />
                  {errors.contact && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.contact}
                    </p>
                  )}
                </div>

                {/* Document Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Document Type
                  </label>
                  <select
                    name="documentType"
                    value={formData.documentType}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Document Type</option>
                    <option value="financial_report">Bank Slip</option>
                  </select>
                </div>
              </div>

              {/* Upload Documents */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Upload Documents *
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                  <div className="space-y-1 text-center">
                    <FiUpload className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="flex text-sm text-gray-600">
                      <label className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                        <span>Upload files</span>
                        <input
                          ref={fileInputRef}
                          type="file"
                          multiple
                          accept=".pdf,.doc,.docx,.jpg"
                          onChange={handleFileChange}
                          className="sr-only"
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">
                      PDF, DOC, DOCX, JPG up to 10MB
                    </p>
                  </div>
                </div>
                {errors.files && (
                  <p className="mt-1 text-sm text-red-500">{errors.files}</p>
                )}

                {/* Display uploaded files */}
                {files.length > 0 && (
                  <div className="mt-4">
                    <h3 className="text-sm font-medium text-gray-700 mb-2">
                      Uploaded Files:
                    </h3>
                    <ul className="space-y-2">
                      {files.map((file, index) => (
                        <li
                          key={index}
                          className="flex items-center justify-between p-2 border border-gray-200 rounded-md"
                        >
                          <span className="text-sm text-gray-600">
                            {file.name}
                          </span>
                          <button
                            type="button"
                            onClick={() => removeFile(index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <FiX className="h-5 w-5" />
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Additional Comments */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Additional Comments
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  maxLength={500}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  placeholder="Additional notes or context about your submission"
                />
                <p className="mt-1 text-sm text-gray-500">
                  {formData.message.length}/500 characters
                </p>
              </div>

              {/* Form Actions */}
              <div className="flex items-center justify-between pt-4">
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-6 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Reset Form
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                    isSubmitting ? "opacity-75 cursor-not-allowed" : ""
                  }`}
                >
                  {isSubmitting ? (
                    <span className="flex items-center">
                      <FaSpinner className="animate-spin mr-2" />
                      Submitting...
                    </span>
                  ) : (
                    "Submit"
                  )}
                </button>
              </div>
            </form>

            {/* Privacy Policy */}
            <div className="mt-8 text-sm text-gray-500">
              <p>
                By submitting this form, you agree to our privacy policy and
                data handling practices. Your information will be processed
                securely and confidentially.
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer/>
    </div>
  );
};

export default WaterResourceFinanceForm;
