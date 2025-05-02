import React from "react";
import { Link } from "react-router-dom";
import ModernFooter from "../Footer";
import NavigationBar from "../NavigationBar";

const LoginType = () => {
  return (
    <div>
      <NavigationBar />
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
              <h1 className="text-2xl xl:text-3xl font-extrabold">Select Login Type</h1>
              <div className="w-full flex-1 mt-8">
                <div className="flex flex-col space-y-4">
                  {/* User Login Button */}
                  <Link
                    to="/login"
                    className="w-full px-8 py-4 rounded-lg font-medium bg-indigo-500 text-white hover:bg-indigo-600 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none"
                  >
                    <span className="ml-3">User Login</span>
                  </Link>

                  {/* Admin Login Button */}
                  <Link
                    to="/admin-login"
                    className="w-full px-8 py-4 rounded-lg font-medium bg-gray-800 text-white hover:bg-gray-900 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none"
                  >
                    <span className="ml-3">Administrator Login</span>
                  </Link>
                </div>

                {/* Register Link */}
                <p className="mt-6 text-xs text-gray-600 text-center">
                  Don't have an account?{" "}
                  <Link to="/register" className="text-indigo-500">
                    Sign Up
                  </Link>
                </p>
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
      <ModernFooter />
    </div>
  );
};

export default LoginType; 