import { BrowserRouter as Router, Routes, Route} from "react-router-dom";
import React from 'react'
import './App.css'
import 'react-toastify/dist/ReactToastify.css';
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
import FAQSection from "./components/FAQ";
import HomeFeedbackFormSection from "./components/HomeFeedbackFormSection";
import ThankYouPage from "./components/ThankYouPage";
import AdminProfile from "./components/adminDashboard/AdminProfile";
import LoginType from './components/userManagement/LoginType';
 
function App() {
  return (
    <>
      
      <Router>
        <Routes>
          <Route path="/" element={<HomePage/>} />

          {/* Login Routes */}
          <Route path="/login-type" element={<LoginType/>} />
          <Route path="/login" element={<SignIn/>} />
          <Route path="/admin-login" element={<AdminSignIn/>} />

        
          <Route path="/onlineStoreHome" element={<OnlineStoreHome/>} />
          <Route path="/onlineStoreHome_testkits" element={<OnlineStoreHome_TestKits/>} />
          <Route path="/onlineStoreHome_spareparts" element={<OnlineStoreHome_SpareParts/>} />
          <Route path="/onlineStoreHome_purificationitems" element={<OnlineStoreHome_PurificationItems/>} />

          <Route path="/singleProduct/:id" element={<Product/>} />
          <Route path="/cart" element={<ShoppingCart/>} />
          <Route path="/faqs" element={<FAQSection/>} />
          <Route path="/thankyou" element={<ThankYouPage/>} />  
         
 
          {/* Route for UserProfile with dynamic `id` parameter */}
          <Route path="/UserProfile/:id" element={<UserProfile />} />
 
          {/* Route for Register */}
          <Route path="/Register" element={<Register/>} />
 
         
 
          {/* Route for AdminDashboard */}
          <Route path="/AdminDashboard/:employeeId" element={<AdminDashboard/>} />

          {/* Route for AdminProfile */}
          <Route path="/AdminProfile/:employeeId" element={<AdminProfile/>} />
          
          <Route path='/WaterTesting' element={<Water/>} />
          <Route path='/ServiceRequest' element={<ServiceRequest/>} />
          <Route path='/WaterQuality' element={<WaterQuality />} />
          <Route path="/waterQuality/:waterType" element={<WaterQuality />} />

          {/* Sasika */}
          <Route path="/waterResourceFinance" element={<WaterResourceFinanceForm/>} />

          {/* Lahiru */}
          <Route path="/Community" element={<CommunitySection/>} />
          <Route path="/SingleCommunity/:id" element={<CommunityPost/>} />
          <Route path="/FeedbackForm" element={<FeedbackForm/>} />

          <Route path="/AdminLogin" element={<AdminSignIn/>} />
        </Routes>
      </Router>
    </>
  );
}
 
export default App;