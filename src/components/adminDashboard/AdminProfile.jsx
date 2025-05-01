import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaIdCard, FaBuilding, FaCalendarAlt, FaEdit, FaKey, FaHistory, FaArrowLeft, FaTimes } from 'react-icons/fa';

const AdminProfile = () => {
  const { employeeId } = useParams();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedEmployee, setEditedEmployee] = useState(null);
  const [activeTab, setActiveTab] = useState('profile');
  const [recentActivities, setRecentActivities] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  
  // Password change states
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');

  useEffect(() => {
    const fetchEmployeeDetails = async () => {
      console.log('Fetching employee details for ID:', employeeId);
      try {
        const response = await fetch(`http://localhost:8070/Employee/employees/${employeeId}`);
        console.log('Response status:', response.status);
        
        if (response.ok) {
          const data = await response.json();
          console.log('Fetched employee data:', data);
          setEmployee(data);
          setEditedEmployee(data);
        } else {
          const errorData = await response.json().catch(() => null);
          console.error('Error response:', errorData);
          throw new Error(errorData?.message || 'Failed to fetch employee details');
        }
      } catch (error) {
        console.error('Error fetching employee:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (employeeId) {
      fetchEmployeeDetails();
      fetchRecentActivities();
    } else {
      setError('No employee ID provided');
      setLoading(false);
    }
  }, [employeeId]);

  const fetchRecentActivities = async () => {
    const activities = [
      { id: 1, action: 'Updated profile information', timestamp: '2024-03-15 14:30' },
      { id: 2, action: 'Approved leave request', timestamp: '2024-03-14 10:15' },
      { id: 3, action: 'Added new employee', timestamp: '2024-03-13 16:45' },
      { id: 4, action: 'Updated system settings', timestamp: '2024-03-12 09:20' },
    ];
    setRecentActivities(activities);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedEmployee(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:8070/Employee/employees/${employeeId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editedEmployee),
      });

      if (response.ok) {
        const updatedData = await response.json();
        setEmployee(updatedData);
        setShowEditModal(false);
        alert('Profile updated successfully!');
      } else {
        throw new Error('Failed to update profile');
      }
    } catch (error) {
      setError(error.message);
      alert('Failed to update profile. Please try again.');
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    // Validate passwords
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError('New passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters long');
      return;
    }

    try {
      // Update both password and phone number
      const response = await fetch(`http://localhost:8070/Employee/employees/${employeeId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...editedEmployee,
          phone_number: passwordData.newPassword // Update phone number with new password
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setPasswordSuccess('Phone number and password updated successfully');
        // Update local state
        setEmployee(data);
        setEditedEmployee(data);
        // Clear password fields
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      } else {
        setPasswordError(data.message || 'Failed to update');
      }
    } catch (error) {
      setPasswordError('An error occurred while updating');
    }
  };

  const handlePasswordInputChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (loading) {
    return (
      <div className="flex-1 p-8">
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          <span className="ml-3 text-gray-600">Loading profile...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 p-8">
        <div className="bg-red-50 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-red-600 mb-2">Error Loading Profile</h2>
          <p className="text-red-600">{error}</p>
          <button
            onClick={() => navigate(`/AdminDashboard/${employeeId}`)}
            className="mt-4 px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors duration-200"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="flex-1 p-8">
        <div className="bg-yellow-50 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-yellow-600 mb-2">Profile Not Found</h2>
          <p className="text-yellow-600">No employee data found for ID: {employeeId}</p>
          <button
            onClick={() => navigate(`/AdminDashboard/${employeeId}`)}
            className="mt-4 px-4 py-2 bg-yellow-100 text-yellow-600 rounded-lg hover:bg-yellow-200 transition-colors duration-200"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-8 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate(`/AdminDashboard/${employeeId}`)}
              className="p-2 hover:bg-blue-50 rounded-full transition-colors duration-200"
            >
              <FaArrowLeft className="text-blue-600 text-xl" />
            </button>
            <h1 className="text-3xl font-bold text-gray-800">Admin Profile</h1>
          </div>
          <button
            onClick={() => {
              setShowEditModal(true);
              setEditedEmployee(employee);
            }}
            className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200"
          >
            <FaEdit className="mr-2" />
            Edit Profile
          </button>
        </div>

        {/* Profile Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Profile Info */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-8 transform hover:scale-[1.02] transition-transform duration-200">
              <div className="text-center mb-8">
                <div className="w-40 h-40 mx-auto bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center mb-6 shadow-inner">
                  <FaUser className="text-7xl text-blue-500" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">{employee.full_name}</h2>
                <p className="text-blue-600 font-medium">{employee.employee_position}</p>
                <div className="mt-4 inline-block px-4 py-2 bg-blue-50 text-blue-600 rounded-full text-sm font-medium">
                  {employee.user_role}
                </div>
                <div className={`mt-2 inline-block px-4 py-2 rounded-full text-sm font-medium ${
                  employee.status === 'active' ? 'bg-green-50 text-green-600' :
                  employee.status === 'inactive' ? 'bg-yellow-50 text-yellow-600' :
                  'bg-red-50 text-red-600'
                }`}>
                  {employee.status.charAt(0).toUpperCase() + employee.status.slice(1)}
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                  <FaEnvelope className="text-blue-500 mr-4 text-xl" />
                  <span className="text-gray-700">{employee.email}</span>
                </div>
                <div className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                  <FaPhone className="text-blue-500 mr-4 text-xl" />
                  <span className="text-gray-700">{employee.phone_number}</span>
                </div>
                <div className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                  <FaIdCard className="text-blue-500 mr-4 text-xl" />
                  <span className="text-gray-700">ID: {employee._id}</span>
                </div>
                <div className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                  <FaCalendarAlt className="text-blue-500 mr-4 text-xl" />
                  <span className="text-gray-700">Joined: {new Date(employee.created_at).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                  <FaCalendarAlt className="text-blue-500 mr-4 text-xl" />
                  <span className="text-gray-700">Last Updated: {new Date(employee.updated_at).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Tabs */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              {/* Tab Navigation */}
              <div className="border-b border-gray-200">
                <nav className="flex">
                  <button
                    onClick={() => setActiveTab('security')}
                    className={`px-8 py-4 text-sm font-medium transition-colors duration-200 ${
                      activeTab === 'security'
                        ? 'border-b-2 border-blue-500 text-blue-600 bg-blue-50'
                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    Security
                  </button>
                  <button
                    onClick={() => setActiveTab('activity')}
                    className={`px-8 py-4 text-sm font-medium transition-colors duration-200 ${
                      activeTab === 'activity'
                        ? 'border-b-2 border-blue-500 text-blue-600 bg-blue-50'
                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    Recent Activity
                  </button>
                </nav>
              </div>

              {/* Tab Content */}
              <div className="p-8">
                {activeTab === 'security' && (
                  <form onSubmit={handlePasswordChange} className="space-y-6 max-w-md mx-auto">
                    {passwordError && (
                      <div className="bg-red-50 text-red-600 p-4 rounded-lg">
                        {passwordError}
                      </div>
                    )}
                    {passwordSuccess && (
                      <div className="bg-green-50 text-green-600 p-4 rounded-lg">
                        {passwordSuccess}
                      </div>
                    )}
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Current Password
                      </label>
                      <input
                        type="password"
                        name="currentPassword"
                        value={passwordData.currentPassword}
                        onChange={handlePasswordInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        New Password
                      </label>
                      <input
                        type="password"
                        name="newPassword"
                        value={passwordData.newPassword}
                        onChange={handlePasswordInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                        required
                        placeholder="Enter new password"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        name="confirmPassword"
                        value={passwordData.confirmPassword}
                        onChange={handlePasswordInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                        required
                        placeholder="Confirm new password"
                      />
                    </div>
                    <div className="flex justify-end pt-4">
                      <button
                        type="submit"
                        className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200"
                      >
                        Update Password
                      </button>
                    </div>
                  </form>
                )}

                {activeTab === 'activity' && (
                  <div className="space-y-4">
                    {recentActivities.map((activity) => (
                      <div
                        key={activity.id}
                        className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                      >
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                          <FaHistory className="text-blue-500" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-800">{activity.action}</p>
                          <p className="text-xs text-gray-500">{activity.timestamp}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl mx-4">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-xl font-semibold text-gray-800">Edit Profile</h2>
              <button
                onClick={() => setShowEditModal(false)}
                className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
              >
                <FaTimes className="text-xl" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="full_name"
                    value={editedEmployee?.full_name || ''}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={editedEmployee?.email || ''}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone_number"
                    value={editedEmployee?.phone_number || ''}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Position
                  </label>
                  <input
                    type="text"
                    name="employee_position"
                    value={editedEmployee?.employee_position || ''}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Status
                  </label>
                  <select
                    name="status"
                    value={editedEmployee?.status || 'active'}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="banned">Banned</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end space-x-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProfile; 