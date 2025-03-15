import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import UserProfile from './components/userManagement/UserProfile';
import Login from './components/userManagement/Login';
import Register from './components/userManagement/Register';
import React from 'react';
import AdminDashboard from './components/adminDashboard/AdminDashboard';

function App() {
  return (
    <>
      <Router>
        <Routes>
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

        </Routes>
      </Router>
    </>
  );
}

export default App;