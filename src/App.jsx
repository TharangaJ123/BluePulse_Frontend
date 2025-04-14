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
import CommunitySection from "./components/CommunitySection";
import CommunityPost from "./components/CommunityPost";
import FeedbackForm from "./components/FeedbackForm";
import AdminSignIn from "./components/adminDashboard/AdminLogin";
import OnlineStoreHome_TestKits from "./components/OnlineStoreHome_TestKits";
import OnlineStoreHome_SpareParts from "./components/OnlineStoreHome_SpareParts";
import OnlineStoreHome_PurificationItems from "./components/OnlineStoreHome_PurificationItems";
import EmployeeProfile from "./components/adminDashboard/EmployeeProfile";
 
function App() {
  return (
    <>
      
      <Router>
        <Routes>
          <Route path="/" element={<HomePage/>} />

          <Route path="/onlineStoreHome" element={<OnlineStoreHome/>} />
          <Route path="/onlineStoreHome_testkits" element={<OnlineStoreHome_TestKits/>} />
          <Route path="/onlineStoreHome_spareparts" element={<OnlineStoreHome_SpareParts/>} />
          <Route path="/onlineStoreHome_purificationitems" element={<OnlineStoreHome_PurificationItems/>} />

          <Route path="/singleProduct/:id" element={<Product/>} />
          <Route path="/cart" element={<ShoppingCart/>} />
         
 
          {/* Route for UserProfile with dynamic `id` parameter */}
          <Route path="/UserProfile/:id" element={<UserProfile />} />
 
          {/* Route for Register */}
          <Route path="/Register" element={<Register/>} />
 
          {/* Route for Login */}
          <Route path="/Login" element={<SignIn />} />
 
          {/* Route for Login */}
          <Route path="/AdminDashboard/:employeeId" element={<AdminDashboard/>} />

          <Route path='/WaterTesting' element={<Water/>} />
          <Route path='/ServiceRequest' element={<ServiceRequest/>} />
          <Route path='/WaterQuality' element={<WaterQuality />} />
          <Route path="/waterQuality/:waterType" element={<WaterQuality />} />

          <Route path="/waterResourceFinance" element={<WaterResourceFinanceForm/>} />
          <Route path="/Community" element={<CommunitySection/>} />
          <Route path="/SingleCommunity/:id" element={<CommunityPost/>} />
          <Route path="/FeedbackForm" element={<FeedbackForm/>} />
          <Route path="/AdminLogin" element={<AdminSignIn/>} />
          <Route path="/AdminProfile/:id" element={<EmployeeProfile/>} />
        </Routes>
      </Router>
    </>
  );
}
 
export default App;