<<<<<<< HEAD
import React,{ useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import HomePage from './components/HomePage'

=======
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import React,{ useState } from "react";

import './App.css'
import OnlineStoreHome from "./components/OnlineStoreHome";
import Product from "./components/Product";
import ShoppingCart from "./components/ShoppingCart";
import UserProfile from './components/userManagement/UserProfile';
import Login from './components/userManagement/Login';
import Register from './components/userManagement/Register';
import AdminDashboard from './components/adminDashboard/AdminDashboard';
import { Navigate } from "react-router-dom";
 
>>>>>>> main
function App() {
  return (
    <>
<<<<<<< HEAD
      <HomePage/>
=======
      <Router>
        <Routes>
          <Route path="/" element={<OnlineStoreHome/>} />
          <Route path="/singleProduct/:id" element={<Product/>} />
          <Route path="/cart" element={<ShoppingCart/>} />
          {/* Root route redirects to /Login by default */}
          <Route path="/login" element={<Navigate to="/Login" />} />
 
          {/* Route for UserProfile with dynamic `id` parameter */}
          <Route path="/UserProfile/:id" element={<UserProfile />} />
 
          {/* Route for Register */}
          <Route path="/Register" element={<Register />} />
 
          {/* Route for Login */}
          <Route path="/Login" element={<Login />} />
 
          {/* Route for Login */}
          <Route path="/AdminDashboard" element={<AdminDashboard/>} />
 
        </Routes>
      </Router>
>>>>>>> main
    </>
  );
}
 
export default App;