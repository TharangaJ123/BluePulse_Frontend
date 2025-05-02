import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ModernFooter from "../Footer";
import NavigationBar from "../NavigationBar";
import ErrorModal from "../common/ErrorModal";

const SignIn = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [forgotPasswordData, setForgotPasswordData] = useState({
    email: "",
    phone_number: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetToken, setResetToken] = useState(null);
  const [resetSuccess, setResetSuccess] = useState(false);
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

  // Validation function
  const validate = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Input handler
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Clear field-specific error
    setErrors({ ...errors, [name]: "" });
  };

  // Form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);

    try {
      const response = await fetch("http://localhost:8070/User/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email.trim(),
          password: formData.password.trim()
        }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("accessToken", data.accessToken);
        localStorage.setItem("refreshToken", data.refreshToken);
        localStorage.setItem("user", JSON.stringify(data.user));
        navigate(`/UserProfile/${data.user._id}`);
      } else {
        throw new Error(data.error || "Login failed. Please check your credentials.");
      }
    } catch (error) {
      console.error("Login error:", error);
      showError(error.message || "An error occurred during login. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const popup = window.open(
        "http://localhost:8070/auth/google",
        "Google Sign In",
        "width=600,height=600"
      );

      window.addEventListener('message', async (event) => {
        if (event.origin === 'http://localhost:8070') {
          const { user, accessToken, refreshToken } = event.data;
          
          if (user && accessToken && refreshToken) {
            localStorage.setItem("accessToken", accessToken);
            localStorage.setItem("refreshToken", refreshToken);
            localStorage.setItem("user", JSON.stringify(user));
            navigate('/');
          } else {
            throw new Error("Google authentication failed");
          }
        }
      });
    } catch (error) {
      console.error("Google sign-in error:", error);
      showError("Google authentication failed. Please try again.");
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("http://localhost:8070/User/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: forgotPasswordData.email,
          phone_number: forgotPasswordData.phone_number,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setResetToken(data.resetToken);
      } else {
        throw new Error(data.error || "Verification failed");
      }
    } catch (error) {
      console.error("Forgot password error:", error);
      showError(error.message || "An error occurred during password reset. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (forgotPasswordData.newPassword !== forgotPasswordData.confirmPassword) {
        throw new Error("Passwords do not match");
      }

      if (forgotPasswordData.newPassword.length < 6) {
        throw new Error("Password must be at least 6 characters");
      }

      const response = await fetch("http://localhost:8070/User/reset-password", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${resetToken}`
        },
        body: JSON.stringify({
          resetToken,
          newPassword: forgotPasswordData.newPassword,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setResetSuccess(true);
        setTimeout(() => {
          setShowForgotPassword(false);
          setResetSuccess(false);
          setResetToken(null);
          setForgotPasswordData({
            email: "",
            phone_number: "",
            newPassword: "",
            confirmPassword: "",
          });
        }, 3000);
      } else {
        throw new Error(data.error || "Password reset failed");
      }
    } catch (error) {
      console.error("Reset password error:", error);
      showError(error.message || "An error occurred during password reset. Please try again.");
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
            <h1 className="text-2xl xl:text-3xl font-extrabold">Sign in</h1>
            <div className="w-full flex-1 mt-8">
              <div className="flex flex-col items-center">
                <button
                  onClick={handleGoogleSignIn}
                  className="w-full max-w-xs font-bold shadow-sm rounded-lg py-3 bg-indigo-100 text-gray-800 flex items-center justify-center transition-all duration-300 ease-in-out focus:outline-none hover:shadow focus:shadow-sm focus:shadow-outline"
                >
                  <span className="ml-4">Sign In with Google</span>
                </button>
              </div>

              <div className="my-12 border-b text-center">
                <div className="leading-none px-2 inline-block text-sm text-gray-600 tracking-wide font-medium bg-white transform translate-y-1/2">
                  Or sign in with email
                </div>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="mx-auto max-w-xs">
                  {/* Email */}
                  <input
                    className={`w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border ${
                      errors.email ? "border-red-500" : "border-gray-200"
                    } placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white`}
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-xs mt-1">{errors.email}</p>
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

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="mt-5 tracking-wide font-semibold bg-indigo-500 text-gray-100 w-full py-4 rounded-lg hover:bg-indigo-700 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none"
                  >
                    {loading ? (
                      <span className="flex items-center">
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
                      <span className="ml-3">Sign In</span>
                    )}
                  </button>

                  <p className="mt-6 text-xs text-gray-600 text-center">
                    Don't have an account?{" "}
                    <Link to="/Register" className="text-indigo-500">
                      Sign Up
                    </Link>
                  </p>
                </div>
              </form>

              <div className="mt-4 text-center">
                <button
                  onClick={() => setShowForgotPassword(true)}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  Forgot your password?
                </button>
              </div>

              {/* Forgot Password Modal */}
              {showForgotPassword && (
                <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50">
                  <div className="bg-white/90 p-8 rounded-lg w-full max-w-md shadow-xl">
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-2xl font-bold">Reset Password</h2>
                      <button
                        onClick={() => {
                          setShowForgotPassword(false);
                          setResetToken(null);
                          setForgotPasswordData({
                            email: "",
                            phone_number: "",
                            newPassword: "",
                            confirmPassword: "",
                          });
                        }}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        ✕
                      </button>
                    </div>

                    {resetSuccess ? (
                      <div className="text-green-500 text-center">
                        Password has been reset successfully!
                      </div>
                    ) : !resetToken ? (
                      <form onSubmit={handleForgotPassword}>
                        <div className="space-y-4">
                          <input
                            type="email"
                            placeholder="Email"
                            value={forgotPasswordData.email}
                            onChange={(e) =>
                              setForgotPasswordData({
                                ...forgotPasswordData,
                                email: e.target.value,
                              })
                            }
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                          />
                          <input
                            type="tel"
                            placeholder="Phone Number"
                            value={forgotPasswordData.phone_number}
                            onChange={(e) =>
                              setForgotPasswordData({
                                ...forgotPasswordData,
                                phone_number: e.target.value.replace(/[^0-9]/g, ""),
                              })
                            }
                            maxLength="10"
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                          />
                          <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                          >
                            {loading ? "Verifying..." : "Verify"}
                          </button>
                        </div>
                      </form>
                    ) : (
                      <form onSubmit={handleResetPassword}>
                        <div className="space-y-4">
                          <input
                            type="password"
                            placeholder="New Password"
                            value={forgotPasswordData.newPassword}
                            onChange={(e) =>
                              setForgotPasswordData({
                                ...forgotPasswordData,
                                newPassword: e.target.value,
                              })
                            }
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                          />
                          <input
                            type="password"
                            placeholder="Confirm New Password"
                            value={forgotPasswordData.confirmPassword}
                            onChange={(e) =>
                              setForgotPasswordData({
                                ...forgotPasswordData,
                                confirmPassword: e.target.value,
                              })
                            }
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                          />
                          <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                          >
                            {loading ? "Resetting..." : "Reset Password"}
                          </button>
                        </div>
                      </form>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Side Illustration */}
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

export default SignIn;
