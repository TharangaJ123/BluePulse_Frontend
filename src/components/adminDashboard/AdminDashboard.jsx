import React, { useState } from 'react';
import Sidebar from './SideBar';
import Header from './Header';
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

function AdminDashboard() {
  const [activeSection, setActiveSection] = useState('dashboard');

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
      default:
        return <MainContent />;
            case 'employee-management':
            return <EmployeeManagement />;
            case 'roleAccess-management':
            return <RoleAccessManagement />;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar setActiveSection={setActiveSection} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <Header />

        {/* Main Content */}
        {renderSection()}
      </div>
    </div>
  );
}

export default AdminDashboard;