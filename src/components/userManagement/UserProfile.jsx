import { useState, useEffect, useMemo } from "react";
import React from 'react';
import { 
  FaCalendarAlt, 
  FaDownload, 
  FaTrash, 
  FaUser, 
  FaShoppingCart, 
  FaComments, 
  FaClock, 
  FaMoneyBillAlt, 
  FaMapMarkerAlt, 
  FaBell, 
  FaChartLine, 
  FaHistory, 
  FaEnvelope 
} from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useParams } from "react-router-dom";
import jsPDF from "jspdf";
import { motion, AnimatePresence } from "framer-motion";

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { duration: 0.5, when: "beforeChildren", staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1,
    transition: { duration: 0.5 }
  }
};

const cardVariants = {
  hidden: { scale: 0.8, opacity: 0 },
  visible: { 
    scale: 1, 
    opacity: 1,
    transition: { duration: 0.3 }
  },
  hover: { 
    scale: 1.02,
    boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
    transition: { duration: 0.2 }
  }
};

export default function ProfileSettings() {
  const { id } = useParams();
  console.log("User ID:", id);

  // Initialize formData with fields from the provided data
  const [formData, setFormData] = useState({
    _id: "",
    full_name: "",
    email: "",
    phone_number: "",
    status: "",
    created_at: "",
    updated_at: "",
    __v: 0,
    profile_image: "",
  });

  const [activeSection, setActiveSection] = useState("profile");
  const [selectedDate, setSelectedDate] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  
  // Community posts states
  const [communityPosts, setCommunityPosts] = useState([]);
  const [allCommunityPosts, setAllCommunityPosts] = useState([]);
  const [communityLoading, setCommunityLoading] = useState(true);
  const [sortOption, setSortOption] = useState('newest');

  // Appointments states
  const [appointments, setAppointments] = useState([]);
  const [appointmentsLoading, setAppointmentsLoading] = useState(true);
  const [appointmentSortOption, setAppointmentSortOption] = useState('newest');

  // Financial states
  const [financialRecords, setFinancialRecords] = useState([]);
  const [financialLoading, setFinancialLoading] = useState(true);
  const [financialSortOption, setFinancialSortOption] = useState('newest');

  // Notification states
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [recentActivity, setRecentActivity] = useState([]);
  const [quickStats, setQuickStats] = useState({
    totalAppointments: 0,
    completedAppointments: 0,
    totalSpent: 0,
    communityPosts: 0
  });

  // Fetch user details
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await fetch(`http://localhost:8070/User/users/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch user details");
        }
        const data = await response.json();
        setFormData({
          _id: data._id,
          full_name: data.full_name,
          email: data.email,
          phone_number: data.phone_number,
          status: data.status,
          created_at: data.created_at,
          updated_at: data.updated_at,
          __v: data.__v,
          profile_image: data.profile_image || "https://st3.depositphotos.com/15648834/17930/v/600/depositphotos_179308454-stock-illustration-unknown-person-silhouette-glasses-profile.jpg",
        });

        if (data.status !== "active") {
          alert("This account is not on active mode or has been deleted by the owner.");
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
        setError("Failed to load user details. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, [id]);

  // Fetch all community posts
  useEffect(() => {
    const fetchAllCommunityPosts = async () => {
      try {
        const response = await fetch('http://localhost:8070/commi/getAll');
        if (!response.ok) {
          throw new Error("Failed to fetch community posts");
        }
        const data = await response.json();
        setAllCommunityPosts(data);
      } catch (error) {
        console.error("Error fetching community posts:", error);
        setAllCommunityPosts([]);
      }
    };

    fetchAllCommunityPosts();
  }, []);

  // Filter community posts by user email
  useEffect(() => {
    if (formData.email && allCommunityPosts.length > 0) {
      const filteredPosts = allCommunityPosts.filter(post => 
        post.email === formData.email
      );
      setCommunityPosts(filteredPosts);
      setCommunityLoading(false);
    }
  }, [formData.email, allCommunityPosts]);

  // Fetch appointments
  useEffect(() => {
    const fetchAppointments = async () => {
      if (!formData.email) return;
      
      try {
        setAppointmentsLoading(true);
        const response = await fetch(`http://localhost:8070/api/services/byEmail/${encodeURIComponent(formData.email)}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            setAppointments([]);
            return;
          }
          throw new Error(`Failed to fetch appointments: ${response.statusText}`);
        }
        
        const data = await response.json();
        const formattedAppointments = data.map(appointment => ({
          _id: appointment._id,
          service_type: appointment.service_type || appointment.service || 'Unnamed Service',
          date: appointment.date || appointment.preferredDate,
          time: appointment.time || appointment.preferredTime,
          cost: parseFloat(appointment.cost) || 0,
          status: appointment.status || 'pending',
          notes: appointment.notes || appointment.additionalNotes || '',
          location: appointment.location || 'Not specified'
        }));
        
        setAppointments(formattedAppointments);
      } catch (error) {
        console.error("Error fetching appointments:", error);
        setAppointments([]);
      } finally {
        setAppointmentsLoading(false);
      }
    };

    fetchAppointments();
  }, [formData.email]);

  // Fetch financial records
  useEffect(() => {
    const fetchFinancialRecords = async () => {
      if (!formData.email) return;
      
      try {
        setFinancialLoading(true);
        const response = await fetch(`http://localhost:8070/Finance/byEmail/${encodeURIComponent(formData.email)}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            setFinancialRecords([]);
            return;
          }
          throw new Error(`Failed to fetch financial records: ${response.statusText}`);
        }
        
        const data = await response.json();
        const formattedRecords = data.map(record => ({
          _id: record._id,
          description: record.description || record.transactionType || 'Unnamed Transaction',
          date: record.date || record.createdAt,
          amount: parseFloat(record.amount) || 0,
          type: record.type || (record.amount >= 0 ? 'income' : 'expense'),
          notes: record.notes || record.description || ''
        }));
        
        setFinancialRecords(formattedRecords);
      } catch (error) {
        console.error("Error fetching financial records:", error);
        setFinancialRecords([]);
      } finally {
        setFinancialLoading(false);
      }
    };

    fetchFinancialRecords();
  }, [formData.email]);

  // Fetch notifications
  useEffect(() => {
    const fetchNotifications = async () => {
      if (!formData.email) return;
      
      try {
        const response = await fetch(`http://localhost:8070/notifications/${encodeURIComponent(formData.email)}`);
        if (!response.ok) {
          if (response.status === 404) {
            setNotifications([]);
            return;
          }
          throw new Error("Failed to fetch notifications");
        }
        const data = await response.json();
        setNotifications(data);
      } catch (error) {
        console.error("Error fetching notifications:", error);
        setNotifications([]);
      }
    };

    fetchNotifications();
  }, [formData.email]);

  // Update quick stats
  useEffect(() => {
    setQuickStats({
      totalAppointments: appointments.length,
      completedAppointments: appointments.filter(a => a.status === 'completed').length,
      totalSpent: financialRecords
        .filter(record => record.type === 'expense')
        .reduce((sum, record) => sum + Math.abs(record.amount), 0),
      communityPosts: communityPosts.length
    });
  }, [appointments, financialRecords, communityPosts]);

  // Update recent activity
  useEffect(() => {
    const activities = [
      ...appointments.map(a => ({
        type: 'appointment',
        date: new Date(a.date),
        title: a.service_type,
        status: a.status,
        icon: <FaCalendarAlt />
      })),
      ...financialRecords.map(f => ({
        type: 'financial',
        date: new Date(f.date),
        title: f.description,
        amount: f.amount,
        icon: <FaMoneyBillAlt />
      })),
      ...communityPosts.map(p => ({
        type: 'community',
        date: new Date(p.createdAt),
        title: p.location,
        icon: <FaComments />
      }))
    ].sort((a, b) => b.date - a.date);

    setRecentActivity(activities);
  }, [appointments, financialRecords, communityPosts]);

  // Sort posts based on selected option
  const sortedPosts = useMemo(() => {
    return [...communityPosts].sort((a, b) => {
      switch (sortOption) {
        case 'newest':
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'oldest':
          return new Date(a.createdAt) - new Date(b.createdAt);
        case 'location':
          return a.location.localeCompare(b.location);
        default:
          return 0;
      }
    });
  }, [communityPosts, sortOption]);

  // Sort appointments
  const sortedAppointments = useMemo(() => {
    return [...appointments].sort((a, b) => {
      switch (appointmentSortOption) {
        case 'newest':
          return new Date(b.date) - new Date(a.date);
        case 'oldest':
          return new Date(a.date) - new Date(b.date);
        case 'status':
          return a.status.localeCompare(b.status);
        default:
          return 0;
      }
    });
  }, [appointments, appointmentSortOption]);

  // Filter appointments by date
  const filteredAppointments = useMemo(() => {
    if (!selectedDate) return sortedAppointments;
    const selectedDateString = selectedDate.toISOString().split('T')[0];
    return sortedAppointments.filter(appointment => 
      new Date(appointment.date).toISOString().split('T')[0] === selectedDateString
    );
  }, [sortedAppointments, selectedDate]);

  // Sort financial records
  const sortedFinancialRecords = useMemo(() => {
    return [...financialRecords].sort((a, b) => {
      switch (financialSortOption) {
        case 'newest':
          return new Date(b.date) - new Date(a.date);
        case 'oldest':
          return new Date(a.date) - new Date(b.date);
        case 'amount':
          return Math.abs(b.amount) - Math.abs(a.amount);
        case 'type':
          return a.type.localeCompare(b.type);
        default:
          return 0;
      }
    });
  }, [financialRecords, financialSortOption]);

  // Filter financial records by date
  const filteredFinancialRecords = useMemo(() => {
    if (!selectedDate) return sortedFinancialRecords;
    const selectedDateString = selectedDate.toISOString().split('T')[0];
    return sortedFinancialRecords.filter(record => 
      new Date(record.date).toISOString().split('T')[0] === selectedDateString
    );
  }, [sortedFinancialRecords, selectedDate]);

  // Handle form changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle image selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle image upload
  const handleImageUpload = async () => {
    if (!selectedImage) {
      alert("Please select an image to upload.");
      return;
    }

    try {
      const response = await fetch(`http://localhost:8070/User/users/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ profile_image: selectedImage }),
      });

      if (!response.ok) {
        throw new Error("Failed to update profile image.");
      }

      const updatedUser = await response.json();
      setFormData(prev => ({ ...prev, profile_image: selectedImage }));
      alert("Profile image updated successfully!");
    } catch (error) {
      console.error("Error updating profile image:", error);
      alert("Failed to update profile image. Please try again.");
    }
  };

  // Save profile changes
  const handleSubmit = async () => {
    if (!formData.full_name || !formData.email) {
      setError("Full Name and Email are required.");
      return;
    }

    try {
      const response = await fetch(`http://localhost:8070/User/users/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to update user data.");
      }

      const updatedUser = await response.json();
      setError("");
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating user data:", error);
      setError("Failed to update user data. Please try again.");
    }
  };

  // Delete account
  const handleDeleteAccount = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete your account? This action cannot be undone.");
    if (confirmDelete) {
      try {
        const response = await fetch(`http://localhost:8070/User/users/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: "inactive" }),
        });

        if (!response.ok) {
          throw new Error("Failed to update account status.");
        }

        const updatedUser = await response.json();
        alert("Account status updated to inactive.");
        setFormData(prev => ({ ...prev, status: "inactive" }));
      } catch (error) {
        console.error("Error updating account status:", error);
        alert("Failed to update account status. Please try again.");
      }
    }
  };

  // Download report as PDF
  const handleDownloadReport = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    let yPosition = 20;
    const lineHeight = 10;

    doc.setFontSize(18);
    const title = `${activeSection.charAt(0).toUpperCase() + activeSection.slice(1)} Report`;
    doc.text(title, margin, yPosition);
    yPosition += lineHeight * 2;

    if (selectedDate) {
      doc.setFontSize(12);
      doc.text(`Filtered by date: ${formatDate(selectedDate)}`, margin, yPosition);
      yPosition += lineHeight * 1.5;
    }

    doc.setFontSize(12);

    switch (activeSection) {
      case "profile":
        const profileFields = [
          { label: "Full Name", value: formData.full_name },
          { label: "Email", value: formData.email },
          { label: "Phone Number", value: formData.phone_number },
          { label: "Status", value: formData.status },
          { label: "Created At", value: formatDate(formData.created_at) },
          { label: "Updated At", value: formatDate(formData.updated_at) }
        ];

        profileFields.forEach(field => {
          if (yPosition > doc.internal.pageSize.getHeight() - margin) {
            doc.addPage();
            yPosition = margin;
          }
          doc.text(`${field.label}: ${field.value}`, margin, yPosition);
          yPosition += lineHeight;
        });
        break;

      case "appointments":
        const totalAppointments = filteredAppointments.length;
        const completedAppointments = filteredAppointments.filter(a => a.status === 'completed').length;
        const pendingAppointments = filteredAppointments.filter(a => a.status === 'pending').length;

        doc.text(`Total Appointments: ${totalAppointments}`, margin, yPosition);
        yPosition += lineHeight;
        doc.text(`Completed: ${completedAppointments}`, margin, yPosition);
        yPosition += lineHeight;
        doc.text(`Pending: ${pendingAppointments}`, margin, yPosition);
        yPosition += lineHeight * 1.5;

        filteredAppointments.forEach(appointment => {
          if (yPosition > doc.internal.pageSize.getHeight() - margin) {
            doc.addPage();
            yPosition = margin;
          }

          doc.setFont(undefined, 'bold');
          doc.text(appointment.service_type, margin, yPosition);
          yPosition += lineHeight;

          doc.setFont(undefined, 'normal');
          const details = [
            `Date: ${formatDate(appointment.date)}`,
            `Cost: $${appointment.cost}`,
            `Status: ${appointment.status}`,
            appointment.notes ? `Notes: ${appointment.notes}` : null
          ].filter(Boolean);

          details.forEach(detail => {
            doc.text(detail, margin + 5, yPosition);
            yPosition += lineHeight;
          });
          yPosition += lineHeight;
        });
        break;

      case "financial":
        const totalIncome = filteredFinancialRecords
          .filter(record => record.type === 'income')
          .reduce((sum, record) => sum + record.amount, 0);
        const totalExpenses = filteredFinancialRecords
          .filter(record => record.type === 'expense')
          .reduce((sum, record) => sum + Math.abs(record.amount), 0);
        const balance = totalIncome - totalExpenses;

        doc.text(`Total Income: $${totalIncome.toFixed(2)}`, margin, yPosition);
        yPosition += lineHeight;
        doc.text(`Total Expenses: $${totalExpenses.toFixed(2)}`, margin, yPosition);
        yPosition += lineHeight;
        doc.text(`Balance: $${balance.toFixed(2)}`, margin, yPosition);
        yPosition += lineHeight * 1.5;

        filteredFinancialRecords.forEach(record => {
          if (yPosition > doc.internal.pageSize.getHeight() - margin) {
            doc.addPage();
            yPosition = margin;
          }

          doc.setFont(undefined, 'bold');
          doc.text(record.description, margin, yPosition);
          yPosition += lineHeight;

          doc.setFont(undefined, 'normal');
          const details = [
            `Date: ${formatDate(record.date)}`,
            `Amount: ${record.type === 'income' ? '+' : '-'}$${Math.abs(record.amount).toFixed(2)}`,
            `Type: ${record.type}`,
            record.notes ? `Notes: ${record.notes}` : null
          ].filter(Boolean);

          details.forEach(detail => {
            doc.text(detail, margin + 5, yPosition);
            yPosition += lineHeight;
          });
          yPosition += lineHeight;
        });
        break;

      case "community":
        doc.text(`Total Community Posts: ${communityPosts.length}`, margin, yPosition);
        yPosition += lineHeight * 1.5;

        sortedPosts.forEach(post => {
          if (yPosition > doc.internal.pageSize.getHeight() - margin) {
            doc.addPage();
            yPosition = margin;
          }

          doc.setFont(undefined, 'bold');
          doc.text(`Location: ${post.location}`, margin, yPosition);
          yPosition += lineHeight;

          doc.setFont(undefined, 'normal');
          const details = [
            `Description: ${post.description}`,
            `Posted on: ${formatDate(post.createdAt)}`
          ];

          details.forEach(detail => {
            doc.text(detail, margin + 5, yPosition);
            yPosition += lineHeight;
          });
          yPosition += lineHeight;
        });
        break;
    }

    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(10);
      doc.text(
        `Generated on ${new Date().toLocaleString()}`,
        margin,
        doc.internal.pageSize.getHeight() - margin
      );
      doc.text(
        `Page ${i} of ${pageCount}`,
        pageWidth - margin - 30,
        doc.internal.pageSize.getHeight() - margin
      );
    }

    doc.save(`${activeSection}_report_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'No date';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Invalid Date';
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Notification center component
  const NotificationCenter = () => (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg z-50"
    >
      <div className="p-4 border-b">
        <h3 className="text-lg font-semibold">Notifications</h3>
      </div>
      <div className="max-h-96 overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            No new notifications
          </div>
        ) : (
          notifications.map((notification, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-4 border-b hover:bg-gray-50"
            >
              <div className="flex items-start">
                <FaBell className="mt-1 mr-3 text-blue-500" />
                <div>
                  <p className="font-medium">{notification.title}</p>
                  <p className="text-sm text-gray-600">{notification.message}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(notification.date).toLocaleString()}
                  </p>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </motion.div>
  );

  // Quick stats component
  const QuickStats = () => (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6"
    >
      <motion.div
        variants={cardVariants}
        whileHover="hover"
        className="bg-white p-4 rounded-lg shadow-md"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Total Appointments</p>
            <p className="text-2xl font-bold text-blue-600">{quickStats.totalAppointments}</p>
          </div>
          <FaCalendarAlt className="text-2xl text-blue-500" />
        </div>
      </motion.div>

      <motion.div
        variants={cardVariants}
        whileHover="hover"
        className="bg-white p-4 rounded-lg shadow-md"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Completed</p>
            <p className="text-2xl font-bold text-green-600">{quickStats.completedAppointments}</p>
          </div>
          <FaChartLine className="text-2xl text-green-500" />
        </div>
      </motion.div>

      <motion.div
        variants={cardVariants}
        whileHover="hover"
        className="bg-white p-4 rounded-lg shadow-md"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Total Spent</p>
            <p className="text-2xl font-bold text-red-600">${quickStats.totalSpent.toFixed(2)}</p>
          </div>
          <FaMoneyBillAlt className="text-2xl text-red-500" />
        </div>
      </motion.div>

      <motion.div
        variants={cardVariants}
        whileHover="hover"
        className="bg-white p-4 rounded-lg shadow-md"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Community Posts</p>
            <p className="text-2xl font-bold text-purple-600">{quickStats.communityPosts}</p>
          </div>
          <FaComments className="text-2xl text-purple-500" />
        </div>
      </motion.div>
    </motion.div>
  );

  // Recent activity component
  const RecentActivity = () => (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="bg-white rounded-lg p-6 shadow-lg mb-6"
    >
      <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Activity</h2>
      <div className="space-y-4">
        {recentActivity.slice(0, 5).map((activity, index) => (
          <motion.div
            key={index}
            variants={itemVariants}
            className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg"
          >
            <div className="p-2 bg-blue-100 rounded-full">
              {activity.icon}
            </div>
            <div>
              <p className="font-medium">{activity.title}</p>
              <p className="text-sm text-gray-600">
                {activity.type === 'appointment' && `Status: ${activity.status}`}
                {activity.type === 'financial' && `Amount: $${Math.abs(activity.amount).toFixed(2)}`}
                {activity.type === 'community' && 'New community post'}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                {activity.date.toLocaleString()}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );

  // Render content based on active section
  const renderContent = () => {
    if (loading) {
      return <p className="text-blue-800">Loading user details...</p>;
    }

    if (error) {
      return <p className="text-red-500">{error}</p>;
    }

    if (formData.status !== "active") {
      return (
        <div>
          <h4 className="text-xl font-semibold mb-3 text-blue-800">Profile Settings</h4>
          <p className="text-red-500 mb-3">This account is not on active mode or has been deleted by the owner.</p>

          <div className="mt-3 flex flex-col gap-2">
            {[
              { name: "full_name", label: "Full Name", value: formData.full_name },
              { name: "email", label: "Email", value: formData.email },
              { name: "phone_number", label: "Phone Number", value: formData.phone_number },
              { name: "created_at", label: "Created At", value: new Date(formData.created_at).toLocaleString() },
              { name: "updated_at", label: "Updated At", value: new Date(formData.updated_at).toLocaleString() },
              { name: "__v", label: "Version", value: formData.__v },
            ].map((field) => (
              <div key={field.name}>
                <p className="text-sm text-blue-600 mb-1">{field.label}</p>
                <input
                  type="text"
                  name={field.name}
                  placeholder={field.label}
                  className="p-2 border border-blue-200 rounded-lg bg-blue-50 focus:bg-white focus:border-blue-500 transition duration-200 w-full"
                  value={field.value}
                  readOnly
                />
              </div>
            ))}
          </div>
        </div>
      );
    }

    switch (activeSection) {
      case "profile":
        return (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="bg-white rounded-lg p-6 shadow-lg backdrop-blur-lg bg-opacity-90"
          >
            <motion.div variants={itemVariants} className="flex flex-col items-center mb-8">
              <div className="relative w-32 h-32 mb-4">
                <motion.img
                  src={formData.profile_image}
                  alt="Profile"
                  className="w-full h-full rounded-full object-cover border-4 border-blue-500"
                  onError={(e) => {
                    e.target.src = "https://st3.depositphotos.com/15648834/17930/v/600/depositphotos_179308454-stock-illustration-unknown-person-silhouette-glasses-profile.jpg";
                  }}
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                />
                <motion.label
                  htmlFor="profile-image"
                  className="absolute bottom-0 right-0 bg-blue-500 p-2 rounded-full cursor-pointer hover:bg-blue-600 transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FaUser className="text-white" />
                  <input
                    type="file"
                    id="profile-image"
                    className="hidden"
                    onChange={handleImageChange}
                    accept="image/*"
                  />
                </motion.label>
              </div>

              <motion.h2 variants={itemVariants} className="text-2xl font-bold text-gray-800 mb-2">
                {formData.full_name}
              </motion.h2>
              <motion.p variants={itemVariants} className="text-gray-600 mb-4">
                {formData.email}
              </motion.p>
            </motion.div>

            <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.div
                variants={cardVariants}
                whileHover="hover"
                className="bg-white p-6 rounded-lg shadow-md"
              >
                <h3 className="text-lg font-semibold mb-4">Personal Information</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-600">Full Name</label>
                    <input
                      type="text"
                      name="full_name"
                      value={formData.full_name}
                      onChange={handleChange}
                      className="mt-1 w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600">Phone Number</label>
                    <input
                      type="text"
                      name="phone_number"
                      value={formData.phone_number}
                      onChange={handleChange}
                      className="mt-1 w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </motion.div>

              <motion.div
                variants={cardVariants}
                whileHover="hover"
                className="bg-white p-6 rounded-lg shadow-md"
              >
                <h3 className="text-lg font-semibold mb-4">Account Information</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-600">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="mt-1 w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600">Status</label>
                    <p className="mt-1 text-gray-800">{formData.status}</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>

            <motion.div variants={itemVariants} className="mt-8 flex justify-end space-x-4">
              {selectedImage && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
                  onClick={handleImageUpload}
                >
                  Save Image
                </motion.button>
              )}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                onClick={handleSubmit}
              >
                Save Changes
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                onClick={handleDeleteAccount}
              >
                Delete Account
              </motion.button>
            </motion.div>
          </motion.div>
        );

      case "community":
        return (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="bg-white rounded-lg p-6 shadow-lg backdrop-blur-lg bg-opacity-90"
          >
            <motion.div variants={itemVariants} className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Community Posts</h2>
              <div className="flex items-center space-x-4">
                <select
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                  className="px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="location">By Location</option>
                </select>
                <DatePicker
                  selected={selectedDate}
                  onChange={date => setSelectedDate(date)}
                  placeholderText="Filter by date"
                  className="px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleDownloadReport}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                >
                  <FaDownload />
                  <span>Download Report</span>
                </motion.button>
              </div>
            </motion.div>

            {communityLoading ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-center items-center h-48"
              >
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
              </motion.div>
            ) : communityPosts.length === 0 ? (
              <motion.div
                variants={itemVariants}
                className="text-center py-12 bg-gray-50 rounded-lg"
              >
                <FaComments className="mx-auto text-4xl text-gray-400 mb-4" />
                <p className="text-gray-600">No community posts found</p>
              </motion.div>
            ) : (
              <motion.div variants={itemVariants} className="space-y-4">
                <AnimatePresence>
                  {sortedPosts.map((post) => (
                    <motion.div
                      key={post._id}
                      variants={cardVariants}
                      initial="hidden"
                      animate="visible"
                      exit="hidden"
                      whileHover="hover"
                      className="bg-white p-6 rounded-lg shadow-md border border-gray-100"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-800 mb-2">
                            {post.location}
                          </h3>
                          <div className="space-y-2">
                            <p className="text-gray-600">
                              {post.description}
                            </p>
                            {post.photo && (
                              <img
                                src={`http://localhost:8070${post.photo}`}
                                alt="Community post"
                                className="mt-2 max-w-full h-auto rounded-lg"
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src = "https://via.placeholder.com/400x300?text=No+Image+Available";
                                }}
                              />
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="mt-4 flex items-center text-sm text-gray-500">
                        <FaClock className="mr-2" />
                        <span>{formatDate(post.createdAt)}</span>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            )}
          </motion.div>
        );

      case "appointments":
        return (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="bg-white rounded-lg p-6 shadow-lg backdrop-blur-lg bg-opacity-90"
          >
            <motion.div variants={itemVariants} className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">My Appointments</h2>
              <div className="flex items-center space-x-4">
                <DatePicker
                  selected={selectedDate}
                  onChange={date => setSelectedDate(date)}
                  placeholderText="Filter by date"
                  className="px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleDownloadReport}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                >
                  <FaDownload />
                  <span>Download Report</span>
                </motion.button>
              </div>
            </motion.div>

            {appointmentsLoading ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-center items-center h-48"
              >
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
              </motion.div>
            ) : appointments.length === 0 ? (
              <motion.div
                variants={itemVariants}
                className="text-center py-12 bg-gray-50 rounded-lg"
              >
                <FaCalendarAlt className="mx-auto text-4xl text-gray-400 mb-4" />
                <p className="text-gray-600">No appointments found</p>
              </motion.div>
            ) : (
              <motion.div variants={itemVariants} className="space-y-4">
                <div className="flex justify-between items-center mb-6">
                  <div className="grid grid-cols-3 gap-4 w-full max-w-2xl">
                    <motion.div
                      variants={cardVariants}
                      whileHover="hover"
                      className="bg-blue-50 p-4 rounded-lg"
                    >
                      <h3 className="text-sm font-medium text-blue-800 mb-2">Total Appointments</h3>
                      <p className="text-2xl font-bold text-blue-600">{filteredAppointments.length}</p>
                    </motion.div>
                    <motion.div
                      variants={cardVariants}
                      whileHover="hover"
                      className="bg-green-50 p-4 rounded-lg"
                    >
                      <h3 className="text-sm font-medium text-green-800 mb-2">Completed</h3>
                      <p className="text-2xl font-bold text-green-600">
                        {filteredAppointments.filter(a => a.status === 'completed').length}
                      </p>
                    </motion.div>
                    <motion.div
                      variants={cardVariants}
                      whileHover="hover"
                      className="bg-yellow-50 p-4 rounded-lg"
                    >
                      <h3 className="text-sm font-medium text-yellow-800 mb-2">Pending</h3>
                      <p className="text-2xl font-bold text-yellow-600">
                        {filteredAppointments.filter(a => a.status === 'pending').length}
                      </p>
                    </motion.div>
                  </div>
                </div>

                <div className="flex justify-end mb-4">
                  <select
                    value={appointmentSortOption}
                    onChange={(e) => setAppointmentSortOption(e.target.value)}
                    className="px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                    <option value="status">By Status</option>
                  </select>
                </div>

                <AnimatePresence>
                  {filteredAppointments.map((appointment) => (
                    <motion.div
                      key={appointment._id}
                      variants={cardVariants}
                      initial="hidden"
                      animate="visible"
                      exit="hidden"
                      whileHover="hover"
                      className="bg-white p-6 rounded-lg shadow-md border border-gray-100"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-800 mb-2">
                            {appointment.service_type}
                          </h3>
                          <div className="space-y-2">
                            <p className="text-gray-600 flex items-center">
                              <FaClock className="mr-2" />
                              {formatDate(appointment.date)}
                              {appointment.time && ` at ${appointment.time}`}
                            </p>
                            <p className="text-gray-600 flex items-center">
                              <FaMoneyBillAlt className="mr-2" />
                              ${appointment.cost.toFixed(2)}
                            </p>
                            {appointment.location && (
                              <p className="text-gray-600 flex items-center">
                                <FaMapMarkerAlt className="mr-2" />
                                {appointment.location}
                              </p>
                            )}
                          </div>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          appointment.status === 'completed' ? 'bg-green-100 text-green-800' :
                          appointment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {appointment.status}
                        </span>
                      </div>
                      
                      {appointment.notes && (
                        <p className="mt-4 text-gray-600 bg-gray-50 p-3 rounded">
                          <FaComments className="inline mr-2" />
                          {appointment.notes}
                        </p>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            )}
          </motion.div>
        );

      case "financial":
        return (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="bg-white rounded-lg p-6 shadow-lg backdrop-blur-lg bg-opacity-90"
          >
            <motion.div variants={itemVariants} className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Financial Records</h2>
              <div className="flex items-center space-x-4">
                <DatePicker
                  selected={selectedDate}
                  onChange={date => setSelectedDate(date)}
                  placeholderText="Filter by date"
                  className="px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleDownloadReport}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                >
                  <FaDownload />
                  <span>Download Report</span>
                </motion.button>
              </div>
            </motion.div>

            {financialLoading ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-center items-center h-48"
              >
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
              </motion.div>
            ) : financialRecords.length === 0 ? (
              <motion.div
                variants={itemVariants}
                className="text-center py-12 bg-gray-50 rounded-lg"
              >
                <FaMoneyBillAlt className="mx-auto text-4xl text-gray-400 mb-4" />
                <p className="text-gray-600">No financial records found</p>
              </motion.div>
            ) : (
              <motion.div variants={itemVariants} className="space-y-4">
                <div className="flex justify-between items-center mb-6">
                  <div className="grid grid-cols-2 gap-4 w-full max-w-2xl">
                    <motion.div
                      variants={cardVariants}
                      whileHover="hover"
                      className="bg-green-50 p-4 rounded-lg"
                    >
                      <h3 className="text-sm font-medium text-green-800 mb-2">Total Income</h3>
                      <p className="text-2xl font-bold text-green-600">
                        ${filteredFinancialRecords
                          .filter(record => record.type === 'income')
                          .reduce((sum, record) => sum + record.amount, 0)
                          .toFixed(2)}
                      </p>
                    </motion.div>
                    <motion.div
                      variants={cardVariants}
                      whileHover="hover"
                      className="bg-red-50 p-4 rounded-lg"
                    >
                      <h3 className="text-sm font-medium text-red-800 mb-2">Total Expenses</h3>
                      <p className="text-2xl font-bold text-red-600">
                        ${filteredFinancialRecords
                          .filter(record => record.type === 'expense')
                          .reduce((sum, record) => sum + Math.abs(record.amount), 0)
                          .toFixed(2)}
                      </p>
                    </motion.div>
                  </div>
                </div>

                <div className="flex justify-end mb-4">
                  <select
                    value={financialSortOption}
                    onChange={(e) => setFinancialSortOption(e.target.value)}
                    className="px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                    <option value="amount">By Amount</option>
                    <option value="type">By Type</option>
                  </select>
                </div>

                <AnimatePresence>
                  {filteredFinancialRecords.map((record) => (
                    <motion.div
                      key={record._id}
                      variants={cardVariants}
                      initial="hidden"
                      animate="visible"
                      exit="hidden"
                      whileHover="hover"
                      className="bg-white p-6 rounded-lg shadow-md border border-gray-100"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-800 mb-2">
                            {record.description}
                          </h3>
                          <div className="space-y-2">
                            <p className="text-gray-600 flex items-center">
                              <FaClock className="mr-2" />
                              {formatDate(record.date)}
                            </p>
                            <p className="text-gray-600 flex items-center">
                              <FaMoneyBillAlt className="mr-2" />
                              <span className={record.type === 'income' ? 'text-green-600' : 'text-red-600'}>
                                {record.type === 'income' ? '+' : '-'}${Math.abs(record.amount).toFixed(2)}
                              </span>
                            </p>
                          </div>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          record.type === 'income' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {record.type}
                        </span>
                      </div>
                      
                      {record.notes && (
                        <p className="mt-4 text-gray-600 bg-gray-50 p-3 rounded">
                          <FaComments className="inline mr-2" />
                          {record.notes}
                        </p>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            )}
          </motion.div>
        );

      default:
        return (
          <div>
            <h4 className="text-xl font-semibold mb-3 text-blue-800">Profile Settings</h4>
            {error && <p className="text-red-500 mb-3">{error}</p>}

            <div className="flex flex-col items-center mb-5">
              <img
                className="rounded-full w-36 h-36 border-4 border-blue-200 mb-3"
                src={selectedImage || formData.profile_image}
                alt="Profile"
              />
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
                id="profileImageInput"
              />
              <label
                htmlFor="profileImageInput"
                className="bg-gradient-to-r from-blue-600 to-blue-500 text-white py-2 px-4 rounded-lg hover:from-blue-700 hover:to-blue-600 transition duration-200 cursor-pointer"
              >
                Change Profile Image
              </label>
              {selectedImage && (
                <button
                  className="mt-2 bg-gradient-to-r from-green-600 to-green-500 text-white py-2 px-4 rounded-lg hover:from-green-700 hover:to-green-600 transition duration-200"
                  onClick={handleImageUpload}
                >
                  Save Image
                </button>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4 mt-3">
              <div>
                <p className="text-sm text-blue-600 mb-1">First Name</p>
                <input
                  type="text"
                  name="firstName"
                  placeholder="First Name"
                  className="p-2 border border-blue-200 rounded-lg bg-blue-50 focus:bg-white focus:border-blue-500 transition duration-200 w-full"
                  value={formData.full_name.split(" ")[0]}
                  onChange={(e) => {
                    const newFirstName = e.target.value;
                    setFormData({
                      ...formData,
                      full_name: `${newFirstName} ${formData.full_name.split(" ")[1]}`,
                    });
                  }}
                />
              </div>
              <div>
                <p className="text-sm text-blue-600 mb-1">Surname</p>
                <input
                  type="text"
                  name="surname"
                  placeholder="Surname"
                  className="p-2 border border-blue-200 rounded-lg bg-blue-50 focus:bg-white focus:border-blue-500 transition duration-200 w-full"
                  value={formData.full_name.split(" ")[1]}
                  onChange={(e) => {
                    const newSurname = e.target.value;
                    setFormData({
                      ...formData,
                      full_name: `${formData.full_name.split(" ")[0]} ${newSurname}`,
                    });
                  }}
                />
              </div>
            </div>
            <div className="mt-3 flex flex-col gap-2">
              {[
                { name: "email", label: "Email" },
                { name: "phone_number", label: "Phone Number" },
              ].map((field) => (
                <div key={field.name}>
                  <p className="text-sm text-blue-600 mb-1">{field.label}</p>
                  <input
                    type="text"
                    name={field.name}
                    placeholder={field.label}
                    className="p-2 border border-blue-200 rounded-lg bg-blue-50 focus:bg-white focus:border-blue-500 transition duration-200 w-full"
                    value={formData[field.name]}
                    onChange={handleChange}
                  />
                </div>
              ))}

              <div className="mt-3">
                <p className="text-sm text-blue-600 mb-1">Account Status</p>
                <div
                  className={`p-3 rounded-lg text-white font-semibold flex items-center gap-2 ${
                    formData.status === "active"
                      ? "bg-green-500 hover:bg-green-600"
                      : formData.status === "inactive"
                      ? "bg-yellow-500 hover:bg-yellow-600"
                      : "bg-red-500 hover:bg-red-600"
                  }`}
                >
                  {formData.status === "active" && (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                  {formData.status === "inactive" && (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 012 0v2a1 1 0 11-2 0V9zm5-1a1 1 0 011 1v2a1 1 0 11-2 0V9a1 1 0 011-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                  {formData.status === "suspended" && (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                  <span className="capitalize">{formData.status}</span>
                </div>
              </div>
            </div>

            <div className="mt-3 flex flex-col gap-2">
              {[
                {
                  name: "created_at",
                  label: "Created At",
                  value: new Date(formData.created_at).toLocaleString(),
                },
                {
                  name: "updated_at",
                  label: "Updated At",
                  value: new Date(formData.updated_at).toLocaleString(),
                },
              ].map((field) => (
                <div key={field.name}>
                  <p className="text-sm text-blue-600 mb-1">{field.label}</p>
                  <input
                    type="text"
                    name={field.name}
                    placeholder={field.label}
                    className="p-2 border border-blue-200 rounded-lg bg-blue-50 focus:bg-white focus:border-blue-500 transition duration-200 w-full"
                    value={field.value}
                    readOnly
                  />
                </div>
              ))}
            </div>

            {formData.status === "active" && (
              <div className="flex gap-4 mt-5">
                <button
                  className="bg-gradient-to-r from-blue-600 to-blue-500 text-white py-2 px-4 rounded-lg hover:from-blue-700 hover:to-blue-600 transition duration-200"
                  onClick={handleSubmit}
                >
                  Save Profile
                </button>
                <button
                  className="bg-gradient-to-r from-red-600 to-red-500 text-white py-2 px-4 rounded-lg hover:from-red-700 hover:to-red-600 transition duration-200 flex items-center gap-2"
                  onClick={handleDeleteAccount}
                >
                  <FaTrash /> Delete Account
                </button>
              </div>
            )}
          </div>
        );
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-6"
    >
      <div className="max-w-7xl mx-auto">
        <motion.nav
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="bg-white rounded-lg shadow-lg p-4 mb-8"
        >
          <motion.div variants={itemVariants} className="flex flex-wrap justify-between items-center">
            <div className="flex flex-wrap gap-4">
              {[
                { id: "profile", icon: <FaUser />, label: "Profile" },
                { id: "community", icon: <FaComments />, label: "Community" },
                { id: "appointments", icon: <FaCalendarAlt />, label: "Appointments" },
                { id: "financial", icon: <FaMoneyBillAlt />, label: "Financial" }
              ].map((item) => (
                <motion.button
                  key={item.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveSection(item.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
                    activeSection === item.id
                      ? "bg-blue-500 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </motion.button>
              ))}
            </div>
            <div className="relative">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowNotifications(!showNotifications)}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-600 rounded-md hover:bg-gray-200"
              >
                <FaBell />
                <span>Notifications</span>
                {notifications.length > 0 && (
                  <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1">
                    {notifications.length}
                  </span>
                )}
              </motion.button>
              {showNotifications && <NotificationCenter />}
            </div>
          </motion.div>
        </motion.nav>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            {activeSection === "profile" && (
              <>
                <QuickStats />
                <RecentActivity />
              </>
            )}
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
}