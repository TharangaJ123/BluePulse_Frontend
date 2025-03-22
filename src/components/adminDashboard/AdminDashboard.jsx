import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // Import useNavigate
import Sidebar from './SideBar';
import MainContent from './MainContent';
import UserManagement from './Sections/UserManagement';
import WaterQualityTesting from './Sections/WaterQualityTesting';
import Appointments from './Sections/Appointments';
import OnlineStore from './Sections/OnlineStore';
import FinancialManagement from './Sections/FinancialManagement';
import CommunityFeedback from './Sections/CommunityFeedback';
import ReportsAnalytics from './Sections/ReportsAnalytics';
import Settings from './Sections/Settings';
import HelpSupport from './Sections/HelpSupport';
import EmployeeManagement from './Sections/EmployeeManagement';
import RoleAccessManagement from './Sections/RoleAccesManagement';
import EmployeeTaskManagement from './Sections/EmployeeTaskManagement';
import SuppliersManagement from './Sections/SuppliersManagement';
import ContactForms from './Sections/ContactForms';

function AdminDashboard() {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [employeeName, setEmployeeName] = useState('');
  const { employeeId } = useParams();
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    const fetchEmployeeDetails = async () => {
      try {
        const response = await fetch(`http://localhost:8070/Employee/employees/${employeeId}`);
        if (response.ok) {
          const data = await response.json();
          setEmployeeName(data.full_name);
          console.log("Employee Name:", data.full_name);
        } else {
          console.error("Failed to fetch employee details");
        }
      } catch (error) {
        console.error("Error fetching employee details:", error);
      }
    };

    fetchEmployeeDetails();
  }, [employeeId]);

  // Function to handle click on the welcome message
  const handleProfileClick = () => {
    navigate(`/AdminProfile/${employeeId}`); // Navigate to the profile page
  };

  const renderSection = () => {
    switch (activeSection) {
      case 'dashboard':
        return <MainContent />;
      case 'user-management':
        return <UserManagement />;
      case 'water-quality-testing':
        return <WaterQualityTesting />;
      case 'appointments':
        return <Appointments />;
      case 'online-store':
        return <OnlineStore />;
      case 'supplier-management':
        return <SuppliersManagement />;
      case 'financial-management':
        return <FinancialManagement />;
      case 'community-feedback':
        return <CommunityFeedback />;
      case 'reports-analytics':
        return <ReportsAnalytics />;
      case 'settings':
        return <Settings />;
      case 'help-support':
        return <HelpSupport />;
      case 'employee-management':
        return <EmployeeManagement />;
      case 'roleAccess-management':
        return <RoleAccessManagement />;
      case 'employee-task-management':
        return <EmployeeTaskManagement />;
      case 'contact-forms':
        return <ContactForms />;
      default:
        return <MainContent />;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar setActiveSection={setActiveSection} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm p-4">
          <div className="container mx-auto flex justify-between items-center">
            <h1 className="text-xl font-semibold text-blue-800">Admin Dashboard</h1>
            <div className="flex items-center space-x-4">
              <span
                className="text-gray-700 cursor-pointer hover:text-blue-800"
                onClick={handleProfileClick} // Add onClick handler
              >
                Welcome, <span className="font-semibold text-blue-800">{employeeName}</span>
              </span>
            </div>
          </div>
        </header>
        {renderSection()}
      </div>
    </div>
  );
}

export default AdminDashboard;