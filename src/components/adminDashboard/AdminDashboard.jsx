import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from './SideBar';
import MainContent from './MainContent';
import UserManagement from './Sections/UserManagement';
import Appointments from './Sections/Appointments';
import OnlineStore from './Sections/OnlineStore';
import FinancialManagement from './Sections/FinancialManagement';
import CommunityFeedback from './Sections/CommunityFeedback';
import ReportsAnalytics from './Sections/ReportsAnalytics';
import Settings from './Sections/Settings';
import EmployeeManagement from './Sections/EmployeeManagement';
import RoleAccessManagement from './Sections/RoleAccesManagement';
import SuppliersManagement from './Sections/SuppliersManagement';
import ContactForms from './Sections/ContactForms';
import OrderManagement from './Sections/OrderManagement';
import './adminDashboard.css';

function AdminDashboard() {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [employeeName, setEmployeeName] = useState('');
  const [employeeRole, setEmployeeRole] = useState(null);
  const [greeting, setGreeting] = useState('');
  const { employeeId } = useParams();
  const navigate = useNavigate();

  // Function to get time-based greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) {
      return 'Good Morning';
    } else if (hour < 18) {
      return 'Good Afternoon';
    } else {
      return 'Good Evening';
    }
  };

  useEffect(() => {
    // Set initial greeting
    setGreeting(getGreeting());

    // Update greeting every minute
    const interval = setInterval(() => {
      setGreeting(getGreeting());
    }, 60000);

    return () => clearInterval(interval);
  }, []);

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
          // Redirect to login if employee details can't be fetched
          navigate('/AdminLogin');
        }
      } catch (error) {
        console.error("Error fetching employee details:", error);
        navigate('/AdminLogin');
      }
    };

    // Get role information from localStorage
    const roleInfo = localStorage.getItem('employeeRole');
    if (roleInfo) {
      setEmployeeRole(JSON.parse(roleInfo));
    } else {
      // Redirect to login if no role information is found
      navigate('/AdminLogin');
    }

    fetchEmployeeDetails();
  }, [employeeId, navigate]);

  // Function to handle click on the welcome message
  const handleProfileClick = () => {
    // Navigate to the AdminProfile page with the employeeId
    navigate(`/AdminProfile/${employeeId}`);
  };

  // Function to check if a section is accessible
  const isSectionAccessible = (sectionName) => {
    if (!employeeRole) return false;
    // Dashboard is always accessible
    if (sectionName === 'dashboard') return true;
    return employeeRole.accessibleSections.includes(sectionName) || 
           employeeRole.accessibleSections.includes('All');
  };

  const renderSection = () => {
    // Check if the section is accessible
    if (!isSectionAccessible(activeSection)) {
      return (
        <div className="flex-1 p-8">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h2>
            <p className="text-gray-600">
              You don't have permission to access this section. Please contact your administrator if you believe this is an error.
            </p>
          </div>
        </div>
      );
    }

    switch (activeSection) {
      case 'dashboard':
        return <MainContent />;
      case 'user-management':
        return <UserManagement />;
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
      case 'employee-management':
        return <EmployeeManagement />;
      case 'roleAccess-management':
        return <RoleAccessManagement />;
      case 'employee-task-management':
        return <EmployeeTaskManagement />;
      case 'contact-form-management':
        return <ContactForms/>;
      case 'order-management':
        return <OrderManagement/>;
      default:
        return <MainContent />;
    }
  };

  return (
    <div className="admin-dashboard flex min-h-screen bg-gray-50">
      <Sidebar setActiveSection={setActiveSection} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm p-4">
          <div className="container mx-auto flex justify-between items-center">
            <h1 className="text-xl font-semibold text-blue-800">Admin Dashboard</h1>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">
                <span className="font-semibold text-blue-800">{greeting}</span>,{' '}
                <span className="font-semibold text-blue-800">{employeeName}</span>
                {employeeRole && (
                  <span className="ml-2 text-sm text-gray-500">
                    ({employeeRole.position})
                  </span>
                )}
              </span>
              <button
                onClick={handleProfileClick}
                className="text-blue-600 hover:text-blue-800 transition-colors duration-200"
              >
                View Profile
              </button>
            </div>
          </div>
        </header>
        {renderSection()}
      </div>
    </div>
  );
}

export default AdminDashboard;