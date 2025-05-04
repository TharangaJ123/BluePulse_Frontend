import React, { useEffect, useState } from 'react';
import {
  FaCheckCircle, // Active
  FaPauseCircle, // Inactive
  FaUserSlash,   // Banned
  FaPlus,        // Add New Employee
  FaFileCsv,     // CSV Download
  FaEdit,        // Edit Employee
  FaTrash,       // Delete Employee
  FaSearch,      // Search Icon
  FaChartBar,    // Performance
  FaUsers,       // Department
  FaCalendarCheck, // Attendance
  FaCalendarAlt,  // Leave
  FaGraduationCap, // Training
  FaTasks,        // Task Management
  FaCalendarPlus, // Add Task
  FaCheckDouble,  // Task Completion
  FaClock,        // Task Deadline
  FaUserPlus,     // Assign Task
  FaComment,      // Comments
  FaPaperclip,    // Attachments
  FaBell,         // Notifications
  FaChartLine,    // Analytics
  FaDownload,     // Download
  FaTimes,        // Close
  FaEye,          // View Employee
} from 'react-icons/fa'; // Import icons
import styles from './EmployeeManagement.module.css';

const EmployeeManagement = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState({});
  const [showAddForm, setShowAddForm] = useState(false);
  const [roles, setRoles] = useState([]);
  const [newEmployee, setNewEmployee] = useState({
    full_name: '',
    email: '',
    password: 'password123', // Default password (can be customized)
    phone_number: '',
    employee_position: '', // Employee position (selectable from roles)
  });
  const [editingEmployeeId, setEditingEmployeeId] = useState(null);
  const [editingEmployeePosition, setEditingEmployeePosition] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  const [performanceData, setPerformanceData] = useState([]);
  const [attendanceData, setAttendanceData] = useState([]);
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [trainingRecords, setTrainingRecords] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    assignedTo: '',
    priority: 'medium',
    deadline: '',
    status: 'pending'
  });
  const [taskFilter, setTaskFilter] = useState('all');
  const [selectedTask, setSelectedTask] = useState(null);
  const [showTaskDetails, setShowTaskDetails] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [taskAnalytics, setTaskAnalytics] = useState(null);
  const [showAnalytics, setShowAnalytics] = useState(false);

  // Add new state variables for features
  const [performanceMetrics, setPerformanceMetrics] = useState({
    ratings: {},
    goals: {},
    reviews: {}
  });
  const [attendanceRecords, setAttendanceRecords] = useState({
    present: [],
    absent: [],
    late: []
  });
  const [leaveManagement, setLeaveManagement] = useState({
    pending: [],
    approved: [],
    rejected: []
  });
  const [trainingPrograms, setTrainingPrograms] = useState([]);
  const [departmentStats, setDepartmentStats] = useState({});
  const [activeSection, setActiveSection] = useState('overview');

  // New form states
  const [showAddPerformanceForm, setShowAddPerformanceForm] = useState(false);
  const [showAddAttendanceForm, setShowAddAttendanceForm] = useState(false);
  const [showAddLeaveForm, setShowAddLeaveForm] = useState(false);
  const [showAddTrainingForm, setShowAddTrainingForm] = useState(false);

  // New form states
  const [newPerformanceReview, setNewPerformanceReview] = useState({
    employeeId: '',
    rating: '',
    comment: '',
    goals: [{ description: '', status: 'pending' }]
  });

  const [newAttendance, setNewAttendance] = useState({
    employeeId: '',
    date: '',
    status: 'present',
    notes: ''
  });

  const [newLeaveRequest, setNewLeaveRequest] = useState({
    employeeId: '',
    type: 'annual',
    startDate: '',
    endDate: '',
    reason: ''
  });

  const [newTrainingProgram, setNewTrainingProgram] = useState({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    status: 'upcoming',
    capacity: ''
  });

  const [isAddFormOpen, setIsAddFormOpen] = useState(false);
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);
  const [isViewFormOpen, setIsViewFormOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const [validationErrors, setValidationErrors] = useState({});

  const validateForm = (formData) => {
    const errors = {};
    
    // Name validation - only letters and spaces allowed
    if (!formData.full_name?.trim()) {
      errors.full_name = "Name is required";
    } else if (!/^[A-Za-z\s]+$/.test(formData.full_name)) {
      errors.full_name = "Name can only contain letters and spaces";
    }

    // Phone number validation - exactly 10 digits
    if (!formData.phone_number) {
      errors.phone_number = "Phone number is required";
    } else if (!/^\d{10}$/.test(formData.phone_number)) {
      errors.phone_number = "Phone number must be exactly 10 digits";
    }

    // Email validation
    if (!formData.email) {
      errors.email = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      errors.email = "Please enter a valid email address";
    }

    // Position validation
    if (!formData.employee_position) {
      errors.employee_position = "Position is required";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Search filters configuration
  const searchFilters = [
    { id: 'full_name', label: 'Name' },
    { id: 'email', label: 'Email' },
    { id: 'employee_position', label: 'Position' },
    { id: 'department', label: 'Department' },
    { id: 'status', label: 'Status' }
  ];

  const handleSearch = (searchData) => {
    setSearchQuery(searchData.searchTerm || '');
    setActiveFilters(searchData.activeFilters || {});
  };

  const filteredEmployees = employees.filter((employee) => {
    if (!searchQuery) return true;
    
    const searchTerm = searchQuery.toLowerCase();
    return (
      employee.full_name?.toLowerCase().includes(searchTerm) ||
      employee.email?.toLowerCase().includes(searchTerm) ||
      employee.employee_position?.toLowerCase().includes(searchTerm) ||
      employee.department?.toLowerCase().includes(searchTerm) ||
      employee.status?.toLowerCase().includes(searchTerm)
    );
  });

  // Fetch employee data and roles from the backend
  useEffect(() => {
    fetchEmployees();
    fetchRoles(); // Fetch roles when the component mounts
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await fetch('http://localhost:8070/Employee/employees');
      if (!response.ok) {
        throw new Error('Failed to fetch employees');
      }
      const data = await response.json();
      setEmployees(data); // Set the fetched data to the state
      setLoading(false); // Set loading to false after fetching
    } catch (error) {
      setError(error.message); // Set error message if something goes wrong
      setLoading(false); // Set loading to false in case of error
    }
  };

  // Fetch roles from the backend
  const fetchRoles = async () => {
    try {
      const response = await fetch('http://localhost:8070/RoleAccess/');
      if (!response.ok) {
        throw new Error('Failed to fetch roles');
      }
      const data = await response.json();
      console.log('Fetched roles:', data);

      // Ensure we have an array of roles with proper structure
      const rolesArray = Array.isArray(data) ? data.map(role => ({
        id: role.role_id,
        name: role.role_name
      })) : [];

      console.log('Processed roles:', rolesArray);
      setRoles(rolesArray);
    } catch (error) {
      console.error('Error fetching roles:', error);
      setError(error.message);
      setRoles([]);
    }
  };

  // Add useEffect to log roles when they change
  useEffect(() => {
    console.log('Current roles state:', roles);
  }, [roles]);

  // Update employee status in the database
  const updateEmployeeStatus = async (employeeId, newStatus) => {
    try {
      const response = await fetch(`http://localhost:8070/Employee/employees/${employeeId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error('Failed to update employee status');
      }

      const updatedEmployee = await response.json();

      // Update the specific employee in the state
      setEmployees((prevEmployees) =>
        prevEmployees.map((employee) =>
          employee._id === employeeId ? { ...employee, status: newStatus } : employee
        )
      );

      console.log('Employee status updated successfully:', updatedEmployee);
    } catch (error) {
      console.error('Error updating employee status:', error);
      setError(error.message);
    }
  };

  // Handle status button click
  const handleStatusChange = (employeeId, currentStatus) => {
    let newStatus;
    switch (currentStatus) {
      case 'active':
        newStatus = 'inactive';
        break;
      case 'inactive':
        newStatus = 'banned';
        break;
      case 'banned':
        newStatus = 'active';
        break;
      default:
        newStatus = 'active';
    }
    updateEmployeeStatus(employeeId, newStatus); // Update the status in the database
  };

  // Handle input change for new employee form
  const handleNewEmployeeChange = (e) => {
    const { name, value } = e.target;
    setNewEmployee({ ...newEmployee, [name]: value });
  };

  // Handle form submission to add a new employee
  const addNewEmployee = async () => {
    try {
      const response = await fetch('http://localhost:8070/Employee/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          full_name: newEmployee.full_name,
          email: newEmployee.email,
          password: newEmployee.password,
          phone_number: newEmployee.phone_number,
          employee_position: newEmployee.employee_position,
          role: 'employee', // Fixed role as "employee"
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to add new employee');
      }

      const addedEmployee = await response.json();
      console.log('Backend Response:', addedEmployee);

      // Add the new employee to the state
      setEmployees((prevEmployees) => [...prevEmployees, addedEmployee]);

      // Reset the form
      setNewEmployee({
        full_name: '',
        email: '',
        password: 'password123',
        phone_number: '',
        employee_position: '',
      });

      // Hide the form
      setShowAddForm(false);

      console.log('Employee added successfully:', addedEmployee);
    } catch (error) {
      console.error('Error adding employee:', error);
      setError(error.message);
    }
  };

  // Function to generate and download CSV report
  const downloadCSV = () => {
    // Define CSV headers
    const headers = [
      'Full Name',
      'Email',
      'Phone Number',
      'Position',
      'Department',
      'Status',
      'Created At',
      'Updated At',
    ];

    // Map employee data to rows
    const rows = employees.map((employee) => [
      employee.full_name,
      employee.email,
      employee.phone_number || 'N/A',
      employee.employee_position,
      employee.department || 'N/A',
      employee.status,
      new Date(employee.createdAt).toLocaleString(),
      new Date(employee.updatedAt).toLocaleString(),
    ]);

    // Combine headers and rows
    const csvContent = [headers, ...rows]
      .map((row) => row.map((cell) => `"${cell}"`).join(','))
      .join('\n');

    // Create a Blob with the CSV content
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });

    // Create a link element to trigger the download
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'employee_report.csv';
    link.click();

    // Clean up
    URL.revokeObjectURL(link.href);
  };

  // Function to handle editing employee position
  const handleEditPosition = (employeeId, currentPosition) => {
    setEditingEmployeeId(employeeId);
    setEditingEmployeePosition(currentPosition);
  };

  // Function to save the edited position
  const saveEditedPosition = async (employeeId) => {
    try {
      const response = await fetch(`http://localhost:8070/Employee/employees/${employeeId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ employee_position: editingEmployeePosition }),
      });

      if (!response.ok) {
        throw new Error('Failed to update employee position');
      }

      const updatedEmployee = await response.json();

      // Update the specific employee in the state
      setEmployees((prevEmployees) =>
        prevEmployees.map((employee) =>
          employee._id === employeeId ? { ...employee, employee_position: editingEmployeePosition } : employee
        )
      );

      // Reset editing state
      setEditingEmployeeId(null);
      setEditingEmployeePosition('');

      console.log('Employee position updated successfully:', updatedEmployee);
    } catch (error) {
      console.error('Error updating employee position:', error);
      setError(error.message);
    }
  };

  // Function to delete an employee
  const deleteEmployee = async (employeeId) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
    try {
      const response = await fetch(`http://localhost:8070/Employee/employees/${employeeId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete employee');
      }

      // Remove the employee from the state
      setEmployees((prevEmployees) =>
        prevEmployees.filter((employee) => employee._id !== employeeId)
      );

      console.log('Employee deleted successfully');
    } catch (error) {
      console.error('Error deleting employee:', error);
      setError(error.message);
    }
    }
  };

  // New function to fetch performance data
  const fetchPerformanceData = async () => {
    try {
      const response = await fetch('http://localhost:8070/Employee/performance');
      if (!response.ok) throw new Error('Failed to fetch performance data');
      const data = await response.json();
      setPerformanceData(data);
    } catch (error) {
      console.error('Error fetching performance data:', error);
    }
  };

  // New function to fetch attendance data
  const fetchAttendanceData = async () => {
    try {
      const response = await fetch('http://localhost:8070/Employee/attendance');
      if (!response.ok) throw new Error('Failed to fetch attendance data');
      const data = await response.json();
      setAttendanceData(data);
    } catch (error) {
      console.error('Error fetching attendance data:', error);
    }
  };

  // New function to fetch leave requests
  const fetchLeaveRequests = async () => {
    try {
      const response = await fetch('http://localhost:8070/Employee/leave-requests');
      if (!response.ok) throw new Error('Failed to fetch leave requests');
      const data = await response.json();
      setLeaveRequests(data);
    } catch (error) {
      console.error('Error fetching leave requests:', error);
    }
  };

  // New function to fetch training records
  const fetchTrainingRecords = async () => {
    try {
      const response = await fetch('http://localhost:8070/Employee/training-records');
      if (!response.ok) throw new Error('Failed to fetch training records');
      const data = await response.json();
      setTrainingRecords(data);
    } catch (error) {
      console.error('Error fetching training records:', error);
    }
  };

  // Calculate department distribution
  const departmentDistribution = employees.reduce((acc, employee) => {
    const dept = employee.employee_position || 'Unassigned';
    acc[dept] = (acc[dept] || 0) + 1;
    return acc;
  }, {});

  // Fetch tasks from the backend
  const fetchTasks = async () => {
    try {
      const response = await fetch('http://localhost:8070/Employee/tasks');
      if (!response.ok) throw new Error('Failed to fetch tasks');
      const data = await response.json();
      setTasks(data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      setError(error.message);
    }
  };

  // Add new task
  const addNewTask = async () => {
    try {
      const response = await fetch('http://localhost:8070/Employee/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newTask),
      });

      if (!response.ok) throw new Error('Failed to add task');
      const addedTask = await response.json();
      setTasks(prevTasks => [...prevTasks, addedTask]);
      setShowTaskForm(false);
      setNewTask({
        title: '',
        description: '',
        assignedTo: '',
        priority: 'medium',
        deadline: '',
        status: 'pending'
      });
    } catch (error) {
      console.error('Error adding task:', error);
      setError(error.message);
    }
  };

  // Update task status
  const updateTaskStatus = async (taskId, newStatus) => {
    try {
      const response = await fetch(`http://localhost:8070/Employee/tasks/${taskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) throw new Error('Failed to update task status');
      const updatedTask = await response.json();
      setTasks(prevTasks =>
        prevTasks.map(task =>
          task._id === taskId ? { ...task, status: newStatus } : task
        )
      );
    } catch (error) {
      console.error('Error updating task status:', error);
      setError(error.message);
    }
  };

  // Handle task form input changes
  const handleTaskInputChange = (e) => {
    const { name, value } = e.target;
    setNewTask(prev => ({ ...prev, [name]: value }));
  };

  // Filter tasks based on status
  const filteredTasks = tasks.filter(task => {
    if (taskFilter === 'all') return true;
    return task.status === taskFilter;
  });

  // Fetch task analytics
  const fetchTaskAnalytics = async () => {
    try {
      const response = await fetch('http://localhost:8070/Employee/tasks/analytics');
      if (!response.ok) throw new Error('Failed to fetch task analytics');
      const data = await response.json();
      setTaskAnalytics(data);
    } catch (error) {
      console.error('Error fetching task analytics:', error);
    }
  };

  // Add comment to task
  const addComment = async (taskId) => {
    try {
      const response = await fetch(`http://localhost:8070/Employee/tasks/${taskId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: newComment }),
      });

      if (!response.ok) throw new Error('Failed to add comment');
      const updatedTask = await response.json();
      setTasks(prevTasks =>
        prevTasks.map(task =>
          task._id === taskId ? updatedTask : task
        )
      );
      setNewComment('');
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  // Handle file selection
  const handleFileSelect = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  // Upload attachment
  const uploadAttachment = async (taskId) => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await fetch(`http://localhost:8070/Employee/tasks/${taskId}/attachments`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Failed to upload attachment');
      const updatedTask = await response.json();
      setTasks(prevTasks =>
        prevTasks.map(task =>
          task._id === taskId ? updatedTask : task
        )
      );
      setSelectedFile(null);
    } catch (error) {
      console.error('Error uploading attachment:', error);
    }
  };

  // Download attachment
  const downloadAttachment = async (filename) => {
    try {
      const response = await fetch(`http://localhost:8070/Employee/tasks/attachments/${filename}`);
      if (!response.ok) throw new Error('Failed to download attachment');
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading attachment:', error);
    }
  };

  // Mark notification as read
  const markNotificationAsRead = async (taskId, notificationId) => {
    try {
      const response = await fetch(
        `http://localhost:8070/Employee/tasks/${taskId}/notifications/${notificationId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) throw new Error('Failed to mark notification as read');
      const updatedTask = await response.json();
      setTasks(prevTasks =>
        prevTasks.map(task =>
          task._id === taskId ? updatedTask : task
        )
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  // Fetch performance metrics
  const fetchPerformanceMetrics = async (employeeId) => {
    try {
      const response = await fetch(`http://localhost:8070/Employee/performance/${employeeId}`);
      if (!response.ok) throw new Error('Failed to fetch performance metrics');
      const data = await response.json();
      setPerformanceMetrics(prev => ({
        ...prev,
        ratings: { ...prev.ratings, [employeeId]: data.ratings },
        goals: { ...prev.goals, [employeeId]: data.goals },
        reviews: { ...prev.reviews, [employeeId]: data.reviews }
      }));
    } catch (error) {
      console.error('Error fetching performance metrics:', error);
    }
  };

  // Fetch attendance records
  const fetchAttendanceRecords = async (employeeId) => {
    try {
      const response = await fetch(`http://localhost:8070/Employee/attendance/${employeeId}`);
      if (!response.ok) throw new Error('Failed to fetch attendance records');
      const data = await response.json();
      setAttendanceRecords(prev => ({
        present: [...prev.present, ...data.present],
        absent: [...prev.absent, ...data.absent],
        late: [...prev.late, ...data.late]
      }));
    } catch (error) {
      console.error('Error fetching attendance records:', error);
    }
  };

  // Handle leave requests
  const handleLeaveRequest = async (employeeId, request) => {
    try {
      const response = await fetch(`http://localhost:8070/Employee/leave/${employeeId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request)
      });
      if (!response.ok) throw new Error('Failed to submit leave request');
      const data = await response.json();
      setLeaveManagement(prev => ({
        ...prev,
        pending: [...prev.pending, data]
      }));
    } catch (error) {
      console.error('Error submitting leave request:', error);
    }
  };

  // Manage training programs
  const manageTrainingProgram = async (action, programData) => {
    try {
      const response = await fetch('http://localhost:8070/Employee/training', {
        method: action === 'add' ? 'POST' : 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(programData)
      });
      if (!response.ok) throw new Error('Failed to manage training program');
      const data = await response.json();
      setTrainingPrograms(prev => [...prev, data]);
    } catch (error) {
      console.error('Error managing training program:', error);
    }
  };

  // Calculate department statistics
  const calculateDepartmentStats = () => {
    const stats = employees.reduce((acc, emp) => {
      const dept = emp.employee_position;
      if (!acc[dept]) acc[dept] = { total: 0, active: 0, inactive: 0 };
      acc[dept].total++;
      acc[dept][emp.status]++;
      return acc;
    }, {});
    setDepartmentStats(stats);
  };

  useEffect(() => {
    calculateDepartmentStats();
  }, [employees]);

  // Form handlers
  const handlePerformanceSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8070/Employee/performance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPerformanceReview)
      });
      if (!response.ok) throw new Error('Failed to add performance review');
      const data = await response.json();
      setPerformanceMetrics(prev => ({
        ...prev,
        reviews: { ...prev.reviews, [data.employeeId]: [...(prev.reviews[data.employeeId] || []), data] }
      }));
      setShowAddPerformanceForm(false);
      setNewPerformanceReview({
        employeeId: '',
        rating: '',
        comment: '',
        goals: [{ description: '', status: 'pending' }]
      });
    } catch (error) {
      console.error('Error adding performance review:', error);
      setError(error.message);
    }
  };

  const handleAttendanceSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8070/Employee/attendance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newAttendance)
      });
      if (!response.ok) throw new Error('Failed to record attendance');
      const data = await response.json();
      setAttendanceRecords(prev => ({
        ...prev,
        [data.status]: [...prev[data.status], data]
      }));
      setShowAddAttendanceForm(false);
      setNewAttendance({
        employeeId: '',
        date: '',
        status: 'present',
        notes: ''
      });
    } catch (error) {
      console.error('Error recording attendance:', error);
      setError(error.message);
    }
  };

  const handleLeaveSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8070/Employee/leave', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newLeaveRequest)
      });
      if (!response.ok) throw new Error('Failed to submit leave request');
      const data = await response.json();
      setLeaveManagement(prev => ({
        ...prev,
        pending: [...prev.pending, data]
      }));
      setShowAddLeaveForm(false);
      setNewLeaveRequest({
        employeeId: '',
        type: 'annual',
        startDate: '',
        endDate: '',
        reason: ''
      });
    } catch (error) {
      console.error('Error submitting leave request:', error);
      setError(error.message);
    }
  };

  const handleTrainingSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8070/Employee/training', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTrainingProgram)
      });
      if (!response.ok) throw new Error('Failed to add training program');
      const data = await response.json();
      setTrainingPrograms(prev => [...prev, data]);
      setShowAddTrainingForm(false);
      setNewTrainingProgram({
        title: '',
        description: '',
        startDate: '',
        endDate: '',
        status: 'upcoming',
        capacity: ''
      });
    } catch (error) {
      console.error('Error adding training program:', error);
      setError(error.message);
    }
  };

  // Add these form components before the main return statement
  const renderAddPerformanceForm = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">Add Performance Review</h3>
          <button onClick={() => setShowAddPerformanceForm(false)} className="text-gray-500 hover:text-gray-700">
            <FaTimes />
          </button>
        </div>
        <form onSubmit={handlePerformanceSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Employee</label>
            <select
              value={newPerformanceReview.employeeId}
              onChange={(e) => setNewPerformanceReview(prev => ({ ...prev, employeeId: e.target.value }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            >
              <option value="">Select Employee</option>
              {employees.map(emp => (
                <option key={emp._id} value={emp._id}>{emp.full_name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Rating</label>
            <input
              type="number"
              min="1"
              max="5"
              value={newPerformanceReview.rating}
              onChange={(e) => setNewPerformanceReview(prev => ({ ...prev, rating: e.target.value }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Comment</label>
            <textarea
              value={newPerformanceReview.comment}
              onChange={(e) => setNewPerformanceReview(prev => ({ ...prev, comment: e.target.value }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              rows="3"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Goals</label>
            {newPerformanceReview.goals.map((goal, index) => (
              <div key={index} className="mt-2 flex gap-2">
                <input
                  type="text"
                  value={goal.description}
                  onChange={(e) => {
                    const newGoals = [...newPerformanceReview.goals];
                    newGoals[index].description = e.target.value;
                    setNewPerformanceReview(prev => ({ ...prev, goals: newGoals }));
                  }}
                  className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Goal description"
                  required
                />
                <button
                  type="button"
                  onClick={() => {
                    const newGoals = newPerformanceReview.goals.filter((_, i) => i !== index);
                    setNewPerformanceReview(prev => ({ ...prev, goals: newGoals }));
                  }}
                  className="text-red-600 hover:text-red-800"
                >
                  <FaTrash />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => setNewPerformanceReview(prev => ({
                ...prev,
                goals: [...prev.goals, { description: '', status: 'pending' }]
              }))}
              className="mt-2 text-blue-600 hover:text-blue-800"
            >
              Add Goal
            </button>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
          >
            Submit Review
          </button>
        </form>
      </div>
    </div>
  );

  const renderAddAttendanceForm = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">Record Attendance</h3>
          <button onClick={() => setShowAddAttendanceForm(false)} className="text-gray-500 hover:text-gray-700">
            <FaTimes />
          </button>
        </div>
        <form onSubmit={handleAttendanceSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Employee</label>
            <select
              value={newAttendance.employeeId}
              onChange={(e) => setNewAttendance(prev => ({ ...prev, employeeId: e.target.value }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            >
              <option value="">Select Employee</option>
              {employees.map(emp => (
                <option key={emp._id} value={emp._id}>{emp.full_name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Date</label>
            <input
              type="date"
              value={newAttendance.date}
              onChange={(e) => setNewAttendance(prev => ({ ...prev, date: e.target.value }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Status</label>
            <select
              value={newAttendance.status}
              onChange={(e) => setNewAttendance(prev => ({ ...prev, status: e.target.value }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            >
              <option value="present">Present</option>
              <option value="absent">Absent</option>
              <option value="late">Late</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Notes</label>
            <textarea
              value={newAttendance.notes}
              onChange={(e) => setNewAttendance(prev => ({ ...prev, notes: e.target.value }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              rows="3"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
          >
            Record Attendance
          </button>
        </form>
      </div>
    </div>
  );

  const renderAddLeaveForm = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">New Leave Request</h3>
          <button onClick={() => setShowAddLeaveForm(false)} className="text-gray-500 hover:text-gray-700">
            <FaTimes />
          </button>
        </div>
        <form onSubmit={handleLeaveSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Employee</label>
            <select
              value={newLeaveRequest.employeeId}
              onChange={(e) => setNewLeaveRequest(prev => ({ ...prev, employeeId: e.target.value }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            >
              <option value="">Select Employee</option>
              {employees.map(emp => (
                <option key={emp._id} value={emp._id}>{emp.full_name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Leave Type</label>
            <select
              value={newLeaveRequest.type}
              onChange={(e) => setNewLeaveRequest(prev => ({ ...prev, type: e.target.value }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            >
              <option value="annual">Annual Leave</option>
              <option value="sick">Sick Leave</option>
              <option value="unpaid">Unpaid Leave</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Start Date</label>
            <input
              type="date"
              value={newLeaveRequest.startDate}
              onChange={(e) => setNewLeaveRequest(prev => ({ ...prev, startDate: e.target.value }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">End Date</label>
            <input
              type="date"
              value={newLeaveRequest.endDate}
              onChange={(e) => setNewLeaveRequest(prev => ({ ...prev, endDate: e.target.value }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Reason</label>
            <textarea
              value={newLeaveRequest.reason}
              onChange={(e) => setNewLeaveRequest(prev => ({ ...prev, reason: e.target.value }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              rows="3"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
          >
            Submit Request
          </button>
        </form>
      </div>
    </div>
  );

  const renderAddTrainingForm = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">Add Training Program</h3>
          <button onClick={() => setShowAddTrainingForm(false)} className="text-gray-500 hover:text-gray-700">
            <FaTimes />
          </button>
        </div>
        <form onSubmit={handleTrainingSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Title</label>
            <input
              type="text"
              value={newTrainingProgram.title}
              onChange={(e) => setNewTrainingProgram(prev => ({ ...prev, title: e.target.value }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              value={newTrainingProgram.description}
              onChange={(e) => setNewTrainingProgram(prev => ({ ...prev, description: e.target.value }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              rows="3"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Start Date</label>
            <input
              type="date"
              value={newTrainingProgram.startDate}
              onChange={(e) => setNewTrainingProgram(prev => ({ ...prev, startDate: e.target.value }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">End Date</label>
            <input
              type="date"
              value={newTrainingProgram.endDate}
              onChange={(e) => setNewTrainingProgram(prev => ({ ...prev, endDate: e.target.value }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Capacity</label>
            <input
              type="number"
              value={newTrainingProgram.capacity}
              onChange={(e) => setNewTrainingProgram(prev => ({ ...prev, capacity: e.target.value }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
          >
            Add Program
          </button>
        </form>
      </div>
    </div>
  );

  // Define employee fields configuration
  const [employeeFields, setEmployeeFields] = useState([
    {
      name: 'full_name',
      label: 'Full Name',
      type: 'text',
      required: true,
      placeholder: 'Enter full name'
    },
    {
      name: 'email',
      label: 'Email',
      type: 'email',
      required: true,
      placeholder: 'Enter email address'
    },
    {
      name: 'phone_number',
      label: 'Phone Number',
      type: 'tel',
      required: true,
      placeholder: 'Enter phone number'
    },
    {
      name: 'employee_position',
      label: 'Position',
      type: 'select',
      required: true,
      options: []
    }
  ]);

  // Update employee fields when roles are loaded
  useEffect(() => {
    if (roles.length > 0) {
      setEmployeeFields(prevFields => 
        prevFields.map(field => 
          field.name === 'employee_position' 
            ? {
                ...field,
                options: roles.map(role => ({
                  value: role.name,
                  label: role.name
                }))
              }
            : field
        )
      );
    }
  }, [roles]);

  // Handle adding new employee
  const handleAddEmployee = async (formData) => {
    try {
      // Validate form data
      if (!validateForm(formData)) {
        return;
      }

      const response = await fetch('http://localhost:8070/Employee/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          full_name: formData.full_name,
          email: formData.email,
          phone_number: formData.phone_number,
          employee_position: formData.employee_position,
          password: 'defaultPassword123', // You might want to make this configurable
          role: 'employee' // Default role
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add employee');
      }
      
      const newEmployee = await response.json();
      setEmployees(prevEmployees => [...prevEmployees, newEmployee]);
      setIsAddFormOpen(false);
      
      // Reset form data
      setNewEmployee({
        full_name: '',
        email: '',
        phone_number: '',
        employee_position: '',
      });
      
      // Clear validation errors
      setValidationErrors({});
      
      // Show success message
      alert('Employee added successfully!');
    } catch (error) {
      console.error('Error adding employee:', error);
      setError(error.message);
      // Show error message to user
      alert(`Error adding employee: ${error.message}`);
    }
  };

  // Handle editing employee
  const handleEditEmployee = async (formData) => {
    if (!selectedEmployee) return;

    try {
      const response = await fetch(`http://localhost:8070/Employee/employees/${selectedEmployee._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to update employee');
      }

      const updatedEmployee = await response.json();
      
      // Update the employee in the state
      setEmployees(prevEmployees =>
        prevEmployees.map(emp =>
          emp._id === selectedEmployee._id ? updatedEmployee : emp
        )
      );
      
      // Close the form
      setIsEditFormOpen(false);
      setSelectedEmployee(null);
    } catch (error) {
      console.error('Error updating employee:', error);
      setError(error.message);
    }
  };

  // Main render function
  return (
    <div className={styles['employee-management']}>
      <div className={styles['section-navigation']}>
        <button 
          className={`${styles['nav-button']} ${activeSection === 'overview' ? styles.active : ''}`}
          onClick={() => setActiveSection('overview')}
        >
          Overview
        </button>
      </div>

      {/* Add form modals */}
      {showAddPerformanceForm && renderAddPerformanceForm()}
      {showAddAttendanceForm && renderAddAttendanceForm()}
      {showAddLeaveForm && renderAddLeaveForm()}
      {showAddTrainingForm && renderAddTrainingForm()}

      {/* Render active section */}
      {activeSection === 'overview' && (
        <div className={styles['overview-section']}>
          <div className="flex justify-between items-center mb-6">
            <h3 className={styles['section-title']}>Employee Overview</h3>
            <div className="flex gap-4">
              <button
                onClick={() => setIsAddFormOpen(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
              >
                <FaPlus className="mr-2" />
                Add Employee
              </button>
              <button
                onClick={downloadCSV}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center"
              >
                <FaFileCsv className="mr-2" />
                Export CSV
              </button>
                  </div>
                </div>

          {/* Search Bar */}
          <div className="mb-6 relative">
            <div className="relative">
              <input
                type="text"
                placeholder="Search employees..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          {/* Employee Table */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Position</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredEmployees.map((employee) => (
                  <tr key={employee._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <span className="text-blue-800 font-medium">
                              {employee.full_name.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{employee.full_name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{employee.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{employee.employee_position}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{employee.department || 'N/A'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        employee.status === 'active' ? 'bg-green-100 text-green-800' :
                        employee.status === 'inactive' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {employee.status.charAt(0).toUpperCase() + employee.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-3">
                        <button
                          onClick={() => {
                            setSelectedEmployee(employee);
                            setIsViewFormOpen(true);
                          }}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <FaEye />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedEmployee(employee);
                            setIsEditFormOpen(true);
                          }}
                          className="text-yellow-600 hover:text-yellow-900"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => deleteEmployee(employee._id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
          </div>
      )}

      {activeSection === 'performance' && (
        <div className={styles['performance-section']}>
          <div className="flex justify-between items-center mb-6">
            <h3 className={styles['section-title']}>Performance Management</h3>
            <button
              onClick={() => setShowAddPerformanceForm(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
            >
              <FaPlus className="mr-2" />
              Add Performance Review
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {employees.map(employee => (
              <div key={employee._id} className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex justify-between items-start mb-4">
                  <h4 className="text-lg font-semibold">{employee.full_name}</h4>
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    performanceMetrics.ratings[employee._id]?.overall >= 4 ? 'bg-green-100 text-green-800' :
                    performanceMetrics.ratings[employee._id]?.overall >= 3 ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    Rating: {performanceMetrics.ratings[employee._id]?.overall || 'N/A'}
                  </span>
                  </div>
                
                <div className="space-y-4">
                  <div>
                    <h5 className="font-medium mb-2">Goals</h5>
                    <ul className="space-y-2">
                      {performanceMetrics.goals[employee._id]?.map((goal, idx) => (
                        <li key={idx} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                          <span>{goal.description}</span>
                          <span className={`px-2 py-1 rounded text-xs ${
                            goal.status === 'completed' ? 'bg-green-100 text-green-800' :
                            goal.status === 'in-progress' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {goal.status}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h5 className="font-medium mb-2">Recent Reviews</h5>
                    <ul className="space-y-2">
                      {performanceMetrics.reviews[employee._id]?.map((review, idx) => (
                        <li key={idx} className="bg-gray-50 p-2 rounded">
                          <p className="text-sm">{review.comment}</p>
                          <p className="text-xs text-gray-500 mt-1">{new Date(review.date).toLocaleDateString()}</p>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeSection === 'attendance' && (
        <div className={styles['attendance-section']}>
          <div className="flex justify-between items-center mb-6">
          <h3 className={styles['section-title']}>Attendance Management</h3>
            <button
              onClick={() => setShowAddAttendanceForm(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
            >
              <FaPlus className="mr-2" />
              Record Attendance
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {employees.map(employee => (
              <div key={employee._id} className="bg-white p-6 rounded-lg shadow-md">
                <h4 className="text-lg font-semibold mb-4">{employee.full_name}</h4>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-green-50 p-3 rounded-lg text-center">
                      <p className="text-sm text-gray-600">Present</p>
                      <p className="text-xl font-semibold text-green-600">
                        {attendanceRecords.present.filter(a => a.employeeId === employee._id).length}
                      </p>
                  </div>
                    <div className="bg-red-50 p-3 rounded-lg text-center">
                      <p className="text-sm text-gray-600">Absent</p>
                      <p className="text-xl font-semibold text-red-600">
                        {attendanceRecords.absent.filter(a => a.employeeId === employee._id).length}
                      </p>
                  </div>
                    <div className="bg-yellow-50 p-3 rounded-lg text-center">
                      <p className="text-sm text-gray-600">Late</p>
                      <p className="text-xl font-semibold text-yellow-600">
                        {attendanceRecords.late.filter(a => a.employeeId === employee._id).length}
                      </p>
                    </div>
                  </div>

                  <div>
                    <h5 className="font-medium mb-2">Recent Attendance</h5>
                    <ul className="space-y-2">
                      {attendanceData
                        .filter(a => a.employeeId === employee._id)
                        .slice(0, 5)
                        .map((record, idx) => (
                          <li key={idx} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                            <span>{new Date(record.date).toLocaleDateString()}</span>
                            <span className={`px-2 py-1 rounded text-xs ${
                              record.status === 'present' ? 'bg-green-100 text-green-800' :
                              record.status === 'late' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {record.status}
                            </span>
                          </li>
                        ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeSection === 'leave' && (
        <div className={styles['leave-section']}>
          <div className="flex justify-between items-center mb-6">
          <h3 className={styles['section-title']}>Leave Management</h3>
            <button
              onClick={() => setShowAddLeaveForm(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
            >
              <FaPlus className="mr-2" />
              New Leave Request
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h4 className="text-lg font-semibold mb-4">Pending Requests</h4>
              <div className="space-y-4">
              {leaveManagement.pending.map((request, idx) => (
                  <div key={idx} className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-medium">{request.employeeName}</p>
                        <p className="text-sm text-gray-600">{request.type} Leave</p>
                      </div>
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">
                        Pending
                      </span>
                    </div>
                    <p className="text-sm mb-2">
                      {new Date(request.startDate).toLocaleDateString()} - {new Date(request.endDate).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-gray-600 mb-3">{request.reason}</p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleLeaveRequest(request.id, 'approve')}
                        className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleLeaveRequest(request.id, 'reject')}
                        className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
                      >
                        Reject
                      </button>
                  </div>
                </div>
              ))}
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h4 className="text-lg font-semibold mb-4">Leave History</h4>
              <div className="space-y-4">
                {[...leaveManagement.approved, ...leaveManagement.rejected].map((request, idx) => (
                  <div key={idx} className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-medium">{request.employeeName}</p>
                        <p className="text-sm text-gray-600">{request.type} Leave</p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        request.status === 'approved' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {request.status}
                      </span>
                    </div>
                    <p className="text-sm mb-2">
                      {new Date(request.startDate).toLocaleDateString()} - {new Date(request.endDate).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-gray-600">{request.reason}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeSection === 'training' && (
        <div className={styles['training-section']}>
          <div className="flex justify-between items-center mb-6">
          <h3 className={styles['section-title']}>Training Programs</h3>
            <button
              onClick={() => setShowAddTrainingForm(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
            >
              <FaPlus className="mr-2" />
              Add Training Program
          </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trainingPrograms.map((program, idx) => (
              <div key={idx} className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex justify-between items-start mb-4">
                  <h4 className="text-lg font-semibold">{program.title}</h4>
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    program.status === 'active' ? 'bg-green-100 text-green-800' :
                    program.status === 'upcoming' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {program.status}
                  </span>
                </div>

                <p className="text-gray-600 mb-4">{program.description}</p>

                <div className="space-y-4">
                  <div>
                    <h5 className="font-medium mb-2">Schedule</h5>
                    <p className="text-sm">
                      {new Date(program.startDate).toLocaleDateString()} - {new Date(program.endDate).toLocaleDateString()}
                    </p>
                  </div>

                  <div>
                    <h5 className="font-medium mb-2">Enrolled Employees</h5>
                    <ul className="space-y-2">
                    {program.enrolled.map((emp, i) => (
                        <li key={i} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                          <span>{emp.name}</span>
                          <span className={`px-2 py-1 rounded text-xs ${
                            emp.progress === 'completed' ? 'bg-green-100 text-green-800' :
                            emp.progress === 'in-progress' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {emp.progress}
                          </span>
                        </li>
                    ))}
                  </ul>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEnrollEmployee(program.id)}
                      className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                    >
                      Enroll Employee
                    </button>
                    <button
                      onClick={() => handleViewProgress(program.id)}
                      className="px-3 py-1 bg-gray-600 text-white rounded hover:bg-gray-700 text-sm"
                    >
                      View Progress
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Employee Form */}
      {isAddFormOpen && (
        <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Add New Employee</h2>
              <button onClick={() => setIsAddFormOpen(false)} className="text-gray-500 hover:text-gray-700">
                <FaTimes />
              </button>
            </div>
            <form onSubmit={(e) => {
              e.preventDefault();
              if (validateForm(newEmployee)) {
                handleAddEmployee(newEmployee);
                setIsAddFormOpen(false);
              }
            }} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Full Name</label>
                <input
                  type="text"
                  name="full_name"
                  value={newEmployee.full_name}
                  onChange={handleNewEmployeeChange}
                  className={`w-full px-3 py-2 border rounded-md ${
                    validationErrors.full_name ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {validationErrors.full_name && (
                  <p className="mt-1 text-sm text-red-500">{validationErrors.full_name}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  name="email"
                  value={newEmployee.email}
                  onChange={handleNewEmployeeChange}
                  className={`w-full px-3 py-2 border rounded-md ${
                    validationErrors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {validationErrors.email && (
                  <p className="mt-1 text-sm text-red-500">{validationErrors.email}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                <input
                  type="tel"
                  name="phone_number"
                  value={newEmployee.phone_number}
                  onChange={handleNewEmployeeChange}
                  maxLength="10"
                  className={`w-full px-3 py-2 border rounded-md ${
                    validationErrors.phone_number ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {validationErrors.phone_number && (
                  <p className="mt-1 text-sm text-red-500">{validationErrors.phone_number}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Position</label>
                <select
                  name="employee_position"
                  value={newEmployee.employee_position}
                  onChange={handleNewEmployeeChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select Position</option>
                  {roles && roles.length > 0 ? (
                    roles.map((role) => (
                      <option key={role.id} value={role.name}>
                        {role.name}
                      </option>
                    ))
                  ) : (
                    <option value="" disabled>Loading positions...</option>
                  )}
                </select>
                {validationErrors.employee_position && (
                  <p className="mt-1 text-sm text-red-500">{validationErrors.employee_position}</p>
                )}
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsAddFormOpen(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-white bg-green-600 rounded-md hover:bg-green-700"
                >
                  Add Employee
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Employee Form */}
      {isEditFormOpen && selectedEmployee && (
        <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Edit Employee</h2>
              <button onClick={() => {
            setIsEditFormOpen(false);
            setSelectedEmployee(null);
              }} className="text-gray-500 hover:text-gray-700">
                <FaTimes />
              </button>
            </div>
            <form onSubmit={(e) => {
              e.preventDefault();
              if (validateForm(selectedEmployee)) {
                handleEditEmployee(selectedEmployee);
              }
            }} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Full Name</label>
                <input
                  type="text"
                  name="full_name"
                  value={selectedEmployee.full_name}
                  onChange={(e) => setSelectedEmployee({ ...selectedEmployee, full_name: e.target.value })}
                  className={`w-full px-3 py-2 border rounded-md ${
                    validationErrors.full_name ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {validationErrors.full_name && (
                  <p className="mt-1 text-sm text-red-500">{validationErrors.full_name}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  name="email"
                  value={selectedEmployee.email}
                  onChange={(e) => setSelectedEmployee({ ...selectedEmployee, email: e.target.value })}
                  className={`w-full px-3 py-2 border rounded-md ${
                    validationErrors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {validationErrors.email && (
                  <p className="mt-1 text-sm text-red-500">{validationErrors.email}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                <input
                  type="tel"
                  name="phone_number"
                  value={selectedEmployee.phone_number}
                  onChange={(e) => setSelectedEmployee({ ...selectedEmployee, phone_number: e.target.value })}
                  maxLength="10"
                  className={`w-full px-3 py-2 border rounded-md ${
                    validationErrors.phone_number ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {validationErrors.phone_number && (
                  <p className="mt-1 text-sm text-red-500">{validationErrors.phone_number}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Position</label>
                <select
                  name="employee_position"
                  value={selectedEmployee.employee_position}
                  onChange={(e) => setSelectedEmployee({ ...selectedEmployee, employee_position: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="">Select Position</option>
                  {roles.map(role => (
                    <option key={role._id} value={role.name}>{role.name}</option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditFormOpen(false);
                    setSelectedEmployee(null);
                  }}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Employee Modal */}
      {isViewFormOpen && selectedEmployee && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-800">Employee Details</h3>
                <button
                  onClick={() => {
                    setIsViewFormOpen(false);
                    setSelectedEmployee(null);
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <FaTimes className="text-xl" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h4 className="text-lg font-semibold text-gray-700 mb-4">Personal Information</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-600">Full Name</label>
                      <p className="mt-1 text-gray-900">{selectedEmployee.full_name}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600">Email</label>
                      <p className="mt-1 text-gray-900">{selectedEmployee.email}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600">Phone</label>
                      <p className="mt-1 text-gray-900">{selectedEmployee.phone_number}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-lg font-semibold text-gray-700 mb-4">Employment Details</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-600">Position</label>
                      <p className="mt-1 text-gray-900">{selectedEmployee.employee_position}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600">Department</label>
                      <p className="mt-1 text-gray-900">{selectedEmployee.department || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600">Status</label>
                      <p className="mt-1">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          selectedEmployee.status === 'active' ? 'bg-green-100 text-green-800' :
                          selectedEmployee.status === 'inactive' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {selectedEmployee.status.charAt(0).toUpperCase() + selectedEmployee.status.slice(1)}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeManagement;