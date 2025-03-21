import { BrowserRouter as Router, Routes, Route} from "react-router-dom";
import React from 'react'
import './App.css'
import HomePage from './components/HomePage'
import OnlineStoreHome from "./components/OnlineStoreHome";
import Product from "./components/Product";
import ShoppingCart from "./components/ShoppingCart";
import UserProfile from './components/userManagement/UserProfile';
import Login from './components/userManagement/Login';

import AdminDashboard from './components/adminDashboard/AdminDashboard';
import { Navigate } from "react-router-dom";
import WaterQuality from "./components/WaterQuality";
import Water from "./components/WaterSelecting";
import ServiceRequest from "./components/ServiceRequest";
import SignIn from "./components/userManagement/Login";
import Register from "./components/userManagement/Register";
import WaterResourceFinanceForm from "./components/WaterResourceFinanceForm";
 
function App() {
  return (
    <>
      
      <Router>
        <Routes>
          <Route path="/" element={<HomePage/>} />
          <Route path="/onlineStoreHome" element={<OnlineStoreHome/>} />
          <Route path="/singleProduct/:id" element={<Product/>} />
          <Route path="/cart" element={<ShoppingCart/>} />
         
 
          {/* Route for UserProfile with dynamic `id` parameter */}
          <Route path="/UserProfile/:id" element={<UserProfile />} />
 
          {/* Route for Register */}
          <Route path="/Register" element={<Register/>} />
 
          {/* Route for Login */}
          <Route path="/Login" element={<SignIn />} />
 
          {/* Route for Login */}
          <Route path="/AdminDashboard" element={<AdminDashboard/>} />

          <Route path='/WaterTesting' element={<Water/>} />
          <Route path='/ServiceRequest' element={<ServiceRequest/>} />
          <Route path='/WaterQuality' element={<WaterQuality />} />
          <Route path="/waterQuality/:waterType" element={<WaterQuality />} />

          <Route path="/waterResourceFinance" element={<WaterResourceFinanceForm/>} />
 
        </Routes>
      </Router>
    </>
  );
}
 
export default App;