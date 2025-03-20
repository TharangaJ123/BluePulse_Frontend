<<<<<<< HEAD
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import React,{ useState } from "react";

import './App.css'
import OnlineStoreHome from "./components/OnlineStoreHome";
import Product from "./components/Product";
import ShoppingCart from "./components/ShoppingCart";

=======
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import UserProfile from './components/userManagement/UserProfile';
import Login from './components/userManagement/Login';
import Register from './components/userManagement/Register';
import React from 'react';
import AdminDashboard from './components/adminDashboard/AdminDashboard';
 
>>>>>>> main
function App() {
  return (
    <>
      <Router>
        <Routes>
<<<<<<< HEAD
          <Route path="/" element={<OnlineStoreHome/>} />
          <Route path="/singleProduct/:id" element={<Product/>} />
          <Route path="/cart" element={<ShoppingCart/>} />
=======
          {/* Root route redirects to /Login by default */}
          <Route path="/" element={<Navigate to="/Login" />} />
 
          {/* Route for UserProfile with dynamic `id` parameter */}
          <Route path="/UserProfile/:id" element={<UserProfile />} />
 
          {/* Route for Register */}
          <Route path="/Register" element={<Register />} />
 
          {/* Route for Login */}
          <Route path="/Login" element={<Login />} />
 
          {/* Route for Login */}
          <Route path="/AdminDashboard" element={<AdminDashboard/>} />
 
>>>>>>> main
        </Routes>
      </Router>
    </>
  );
}
 
export default App;