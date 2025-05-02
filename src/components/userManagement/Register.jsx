import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ModernFooter from "../Footer";
import NavigationBar from "../NavigationBar";
import ErrorModal from "../common/ErrorModal";

const Register = () => {
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone_number: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [errorModal, setErrorModal] = useState({
    isOpen: false,
    message: ""
  });
  const navigate = useNavigate();

  const showError = (message) => {
    setErrorModal({
      isOpen: true,
      message
    });
  };

  const closeErrorModal = () => {
    setErrorModal({
      isOpen: false,
      message: ""
    });
  };

  const validate = () => {
    const newErrors = {};

    // Full Name Validation
    if (!formData.full_name) {
      newErrors.full_name = "Full name is required";
    } else if (formData.full_name.length < 2) {
      newErrors.full_name = "Full name must be at least 2 characters";
    } else if (formData.full_name.length > 50) {
      newErrors.full_name = "Full name must be less than 50 characters";
    } else if (!/^[a-zA-Z\s'-]+$/.test(formData.full_name)) {
      newErrors.full_name = "Full name can only contain letters, spaces, hyphens, and apostrophes";
    }

    // Email Validation
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    } else if (formData.email.length > 100) {
      newErrors.email = "Email must be less than 100 characters";
    }

    // Phone Number Validation
    if (formData.phone_number) {
      const phoneRegex = /^[0-9]{10}$/;
      if (!phoneRegex.test(formData.phone_number)) {
        newErrors.phone_number = "Phone number must be 10 digits";
      }
    }

    // Password Validation
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else {
      if (formData.password.length < 8) {
        newErrors.password = "Password must be at least 8 characters";
      } else if (!/[A-Z]/.test(formData.password)) {
        newErrors.password = "Password must contain at least one uppercase letter";
      } else if (!/[a-z]/.test(formData.password)) {
        newErrors.password = "Password must contain at least one lowercase letter";
      } else if (!/[0-9]/.test(formData.password)) {
        newErrors.password = "Password must contain at least one number";
      } else if (!/[!@#$%^&*]/.test(formData.password)) {
        newErrors.password = "Password must contain at least one special character (!@#$%^&*)";
      } else if (formData.password.length > 50) {
        newErrors.password = "Password must be less than 50 characters";
      }
    }

    // Confirm Password Validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    setErrors({ ...errors, [name]: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);

    try {
      const response = await fetch("http://localhost:8070/User/form-reg", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: formData.full_name.trim(),
          email: formData.email.trim(),
          password: formData.password,
          phone_number: formData.phone_number.trim(),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        navigate("/login");
      } else {
        throw new Error(data.error || "Registration failed");
      }
    } catch (error) {
      console.error("Registration error:", error);
      showError(error.message || "An error occurred during registration. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <NavigationBar/>
      <div className="min-h-screen bg-gray-100 text-gray-900 flex justify-center">
      <div className="max-w-screen-xl m-0 sm:m-10 bg-white shadow sm:rounded-lg flex justify-center flex-1">
        <div className="lg:w-1/2 xl:w-5/12 p-6 sm:p-12">
          <div>
            <img
              src="https://storage.googleapis.com/devitary-image-host.appspot.com/15846435184459982716-LogoMakr_7POjrN.png"
              className="w-32 mx-auto"
              alt="Logo"
            />
          </div>
          <div className="mt-12 flex flex-col items-center">
            <h1 className="text-2xl xl:text-3xl font-extrabold">Sign Up</h1>
            <div className="w-full flex-1 mt-8">
              <form onSubmit={handleSubmit}>
                <div className="mx-auto max-w-xs">
                  {/* Full Name */}
                  <input
                    className={`w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border ${
                      errors.full_name ? "border-red-500" : "border-gray-200"
                    } placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white`}
                    type="text"
                    name="full_name"
                    placeholder="Full Name"
                    value={formData.full_name}
                    onChange={handleChange}
                  />
                  {errors.full_name && (
                    <p className="text-red-500 text-xs mt-1">{errors.full_name}</p>
                  )}

                  {/* Email */}
                  <input
                    className={`w-full px-8 py-4 mt-5 rounded-lg font-medium bg-gray-100 border ${
                      errors.email ? "border-red-500" : "border-gray-200"
                    } placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white`}
                    type="email"
                    name="email"
                    placeholder="Email Address"
                    value={formData.email}
                    onChange={handleChange}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                  )}

                  {/* Phone Number */}
                  <input
                    className={`w-full px-8 py-4 mt-5 rounded-lg font-medium bg-gray-100 border ${
                      errors.phone_number ? "border-red-500" : "border-gray-200"
                    } placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white`}
                    type="tel"
                    name="phone_number"
                    placeholder="Phone Number"
                    value={formData.phone_number}
                    onInput={(e) => {
                      e.target.value = e.target.value.replace(/[^0-9]/g, "");
                    }}
                    onChange={handleChange}
                    maxLength="10"
                  />
                  {errors.phone_number && (
                    <p className="text-red-500 text-xs mt-1">{errors.phone_number}</p>
                  )}

                  {/* Password */}
                  <input
                    className={`w-full px-8 py-4 mt-5 rounded-lg font-medium bg-gray-100 border ${
                      errors.password ? "border-red-500" : "border-gray-200"
                    } placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white`}
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                  />
                  {errors.password && (
                    <p className="text-red-500 text-xs mt-1">{errors.password}</p>
                  )}

                  {/* Confirm Password */}
                  <input
                    className={`w-full px-8 py-4 mt-5 rounded-lg font-medium bg-gray-100 border ${
                      errors.confirmPassword ? "border-red-500" : "border-gray-200"
                    } placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white`}
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm Password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                  />
                  {errors.confirmPassword && (
                    <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>
                  )}

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="mt-5 tracking-wide font-semibold bg-indigo-500 text-gray-100 w-full py-4 rounded-lg hover:bg-indigo-700 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none"
                  >
                    <span className="ml-3">Sign Up</span>
                  </button>

                  {/* Sign In Link */}
                  <p className="mt-6 text-xs text-gray-600 text-center">
                    Already have an account?{" "}
                    <Link to="/Login" className="text-indigo-500">
                      Sign In
                    </Link>
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Side Illustration */}
        <div className="flex-1 bg-indigo-100 text-center hidden lg:flex">
          <div
            className="m-12 xl:m-16 w-full bg-contain bg-center bg-no-repeat"
            style={{
              backgroundImage:
                "url('https://storage.googleapis.com/devitary-image-host.appspot.com/15848031292911696601-undraw_designer_life_w96d.svg')",
            }}
          ></div>
        </div>
      </div>
    </div>
    <ModernFooter/>
    <ErrorModal
      isOpen={errorModal.isOpen}
      onClose={closeErrorModal}
      errorMessage={errorModal.message}
    />
    </div>
  );
};

export default Register;
