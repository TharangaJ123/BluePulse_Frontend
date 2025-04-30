import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const AdminSignIn = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState(""); // State to handle error messages
  const [loading, setLoading] = useState(false); // State to handle loading state
  const navigate = useNavigate(); // Hook for navigation

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous errors
    setLoading(true); // Set loading state

    try {
      const response = await fetch("http://localhost:8070/Employee/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Login successful:", data);

        // Extract employee ID from the response
        const employeeId = data._id; // Ensure the backend sends `_id` in the response

        // Redirect to AdminDashboard with employee ID as a parameter
        navigate(`/AdminDashboard/${employeeId}`);
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Login failed. Please check your credentials."); // Set error message
      }
    } catch (error) {
      console.error("Error during login:", error);
      setError("An error occurred. Please try again."); // Set error message
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-6">
          Welcome to Admin Login
        </h1>
        <div className="w-full flex-1">
          <div className="flex flex-col items-center">
            <img
              src="./src/assets/logo1.png"
              className="w-32"
              alt="Logo"
            />
            <h2 className="text-xl font-bold text-gray-800 mt-4">
              Admin Sign In
            </h2>
          </div>

          <div className="my-6 border-b text-center">
            <div className="leading-none px-2 inline-block text-sm text-gray-600 tracking-wide font-medium bg-white transform translate-y-1/2">
              Sign in with email
            </div>
          </div>

          {/* Display error message if any */}
          {error && (
            <div className="text-red-500 text-center mb-4">{error}</div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <input
                className="w-full px-4 py-2 rounded-lg border border-gray-300 placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
              />
              <input
                className="w-full px-4 py-2 rounded-lg border border-gray-300 placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <button
                type="submit"
                className="w-full py-2 px-4 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                disabled={loading} // Disable button when loading
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg
                      className="animate-spin h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    <span className="ml-3">Signing In...</span>
                  </span>
                ) : (
                  "Sign In"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminSignIn;