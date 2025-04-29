import { useState, useEffect } from "react";
import React from 'react';
import { FaCalendarAlt, FaDownload, FaTrash, FaUser, FaShoppingCart, FaComments, FaClock, FaMoneyBillAlt } from "react-icons/fa"; // Icons from react-icons
import DatePicker from "react-datepicker"; // DatePicker component
import "react-datepicker/dist/react-datepicker.css"; // DatePicker CSS
import { useParams } from "react-router-dom"; // Import useParams
import jsPDF from "jspdf"; // Import jsPDF for PDF generation

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

  // State for user data
  const [userData, setUserData] = useState({
    purchases: [],
    uploads: [],
    communityPosts: [],
    feeds: []
  });

  // Fetch user details and data when the component mounts or userId changes
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No authentication token found');
        }

        // Fetch user profile
        const profileResponse = await fetch(`http://localhost:8070/User/users/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!profileResponse.ok) {
          throw new Error("Failed to fetch user details");
        }
        
        const profileData = await profileResponse.json();
        setFormData({
          _id: profileData._id,
          full_name: profileData.full_name,
          email: profileData.email,
          phone_number: profileData.phone_number,
          status: profileData.status,
          created_at: profileData.created_at,
          updated_at: profileData.updated_at,
          __v: profileData.__v,
          profile_image: profileData.profile_image || "https://st3.depositphotos.com/15648834/17930/v/600/depositphotos_179308454-stock-illustration-unknown-person-silhouette-glasses-profile.jpg",
        });

        // Fetch user data (purchases, uploads, etc.)
        const userDataResponse = await fetch(`http://localhost:8070/User/user-data/${profileData.email}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!userDataResponse.ok) {
          throw new Error("Failed to fetch user data");
        }

        const userData = await userDataResponse.json();
        setUserData({
          purchases: userData.purchases || [],
          uploads: userData.uploads || [],
          communityPosts: userData.communityPosts || [],
          feeds: userData.feeds || []
        });

        if (profileData.status !== "active") {
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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle image selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result); // Set the selected image for preview
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
        body: JSON.stringify({ profile_image: selectedImage }), // Send the new image URL
      });

      if (!response.ok) {
        throw new Error("Failed to update profile image.");
      }

      const updatedUser = await response.json();
      console.log("Profile image updated successfully:", updatedUser);
      setFormData((prevData) => ({ ...prevData, profile_image: selectedImage })); // Update local state
      alert("Profile image updated successfully!");
    } catch (error) {
      console.error("Error updating profile image:", error);
      alert("Failed to update profile image. Please try again.");
    }
  };

  // Save Changes Functionality
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
        body: JSON.stringify(formData), // Send updated form data
      });

      if (!response.ok) {
        throw new Error("Failed to update user data.");
      }

      const updatedUser = await response.json();
      console.log("User data updated successfully:", updatedUser);
      setError(""); // Clear error on successful submission
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating user data:", error);
      setError("Failed to update user data. Please try again.");
    }
  };

  // Delete Account Functionality
  const handleDeleteAccount = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete your account? This action cannot be undone.");
    if (confirmDelete) {
      try {
        const response = await fetch(`http://localhost:8070/User/users/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: "inactive" }), // Update status to inactive
        });

        if (!response.ok) {
          throw new Error("Failed to update account status.");
        }

        const updatedUser = await response.json();
        console.log("Account status updated to inactive:", updatedUser);
        alert("Account status updated to inactive.");
        setFormData((prevData) => ({ ...prevData, status: "inactive" })); // Update local state
      } catch (error) {
        console.error("Error updating account status:", error);
        alert("Failed to update account status. Please try again.");
      }
    } else {
      console.log("Account deletion canceled.");
    }
  };

  // Filter activities based on the selected date
  const filterActivities = (activities) => {
    if (!selectedDate || !activities) return activities || [];
    const selectedDateString = selectedDate.toISOString().split('T')[0];
    return activities.filter((activity) => {
      const activityDate = new Date(activity.createdAt).toISOString().split('T')[0];
      return activityDate === selectedDateString;
    });
  };

  // Handle report download as PDF
  const handleDownloadReport = () => {
    let dataToDownload = [];
    
    switch (activeSection) {
      case 'onlinePurchases':
        dataToDownload = filterActivities(userData.purchases);
        break;
      case 'communityFeedback':
        dataToDownload = filterActivities(userData.communityPosts);
        break;
      case 'appointments':
        dataToDownload = filterActivities(userData.uploads);
        break;
      case 'financial':
        dataToDownload = filterActivities(userData.feeds);
        break;
      default:
        dataToDownload = [];
    }

    if (dataToDownload.length === 0) {
      alert("No data available for the selected date.");
      return;
    }

    // Create a new PDF document
    const doc = new jsPDF();

    // Add a title to the PDF
    doc.setFontSize(18);
    doc.text(`${activeSection.replace(/([A-Z])/g, " $1").trim()} Report`, 10, 10);

    // Add the filtered data to the PDF
    doc.setFontSize(12);
    let yPosition = 20;

    dataToDownload.forEach((item, index) => {
      const date = new Date(item.createdAt).toLocaleDateString();
      
      switch (activeSection) {
        case 'onlinePurchases':
          doc.text(`Purchase ID: ${item._id}`, 10, yPosition);
          doc.text(`Product: ${item.product?.name || 'N/A'}`, 10, yPosition + 10);
          doc.text(`Amount: $${item.totalPrice}`, 10, yPosition + 20);
          doc.text(`Date: ${date}`, 10, yPosition + 30);
          yPosition += 40;
          break;
          
        case 'communityFeedback':
          doc.text(`Post Title: ${item.title}`, 10, yPosition);
          doc.text(`Category: ${item.category}`, 10, yPosition + 10);
          doc.text(`Date: ${date}`, 10, yPosition + 20);
          yPosition += 30;
          break;
          
        case 'appointments':
          doc.text(`Upload Title: ${item.title}`, 10, yPosition);
          doc.text(`File Type: ${item.fileType}`, 10, yPosition + 10);
          doc.text(`Date: ${date}`, 10, yPosition + 20);
          yPosition += 30;
          break;
          
        case 'financial':
          doc.text(`Content Type: ${item.type}`, 10, yPosition);
          doc.text(`Likes: ${item.likes?.length || 0}`, 10, yPosition + 10);
          doc.text(`Comments: ${item.comments?.length || 0}`, 10, yPosition + 20);
          doc.text(`Date: ${date}`, 10, yPosition + 30);
          yPosition += 40;
          break;
      }

      // Add a separator line if not the last item
      if (index < dataToDownload.length - 1) {
        doc.line(10, yPosition - 5, 200, yPosition - 5);
      }
    });

    // Save the PDF with a dynamic name based on section and date
    const dateStr = selectedDate ? selectedDate.toISOString().split('T')[0] : 'all';
    doc.save(`${activeSection}_report_${dateStr}.pdf`);
  };

  // Render content based on the active section
  const renderContent = () => {
    if (loading) {
      return <p className="text-blue-800">Loading user details...</p>;
    }

    if (error) {
      return <p className="text-red-500">{error}</p>;
    }

    // If account is not active, display a message and disable editing
    if (formData.status !== "active") {
      return (
        <div>
          <h4 className="text-xl font-semibold mb-3 text-blue-800">Profile Settings</h4>
          <p className="text-red-500 mb-3">This account is not on active mode or has been deleted by the owner.</p>

          {/* Read-only fields */}
          <div className="mt-3 flex flex-col gap-2">
            {[
              { name: "full_name", label: "Full Name", value: formData.full_name },
              { name: "email", label: "Email", value: formData.email },
              { name: "phone_number", label: "Phone Number", value: formData.phone_number },
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
                  readOnly // Make the field read-only
                />
              </div>
            ))}
          </div>
        </div>
      );
    }

    // If account is active, allow editing
    switch (activeSection) {
      case "onlinePurchases":
        return (
          <div>
            <div className="flex justify-between items-center mb-3">
              <h4 className="text-xl font-semibold text-blue-800">Online Purchases</h4>
              <div className="flex items-center gap-2">
                <DatePicker
                  selected={selectedDate}
                  onChange={(date) => setSelectedDate(date)}
                  dateFormat="MMMM d, yyyy"
                  className="p-2 border border-blue-200 rounded-lg bg-blue-50 focus:bg-white focus:border-blue-500 transition duration-200"
                  placeholderText="Select a date"
                />
                <button
                  className="bg-gradient-to-r from-blue-600 to-blue-500 text-white py-2 px-4 rounded-lg hover:from-blue-700 hover:to-blue-600 transition duration-200 flex items-center gap-2"
                  onClick={handleDownloadReport}
                >
                  <FaDownload /> Download Report
                </button>
              </div>
            </div>
            {filterActivities(userData.purchases).map((purchase) => (
              <div key={purchase._id} className="p-4 border border-blue-200 rounded-lg mb-3 bg-blue-50 hover:bg-blue-100 transition duration-200">
                <p className="text-blue-700"><strong>Item:</strong> {purchase.product?.name || 'N/A'}</p>
                <p className="text-blue-700"><strong>Date:</strong> {new Date(purchase.createdAt).toLocaleDateString()}</p>
                <p className="text-blue-700"><strong>Amount:</strong> ${purchase.totalPrice}</p>
              </div>
            ))}
          </div>
        );
      case "communityFeedback":
        return (
          <div>
            <div className="flex justify-between items-center mb-3">
              <h4 className="text-xl font-semibold text-blue-800">Community & Feedback</h4>
              <div className="flex items-center gap-2">
                <DatePicker
                  selected={selectedDate}
                  onChange={(date) => setSelectedDate(date)}
                  dateFormat="MMMM d, yyyy"
                  className="p-2 border border-blue-200 rounded-lg bg-blue-50 focus:bg-white focus:border-blue-500 transition duration-200"
                  placeholderText="Select a date"
                />
                <button
                  className="bg-gradient-to-r from-blue-600 to-blue-500 text-white py-2 px-4 rounded-lg hover:from-blue-700 hover:to-blue-600 transition duration-200 flex items-center gap-2"
                  onClick={handleDownloadReport}
                >
                  <FaDownload /> Download Report
                </button>
              </div>
            </div>
            {filterActivities(userData.communityPosts).map((post) => (
              <div key={post._id} className="p-4 border border-blue-200 rounded-lg mb-3 bg-blue-50 hover:bg-blue-100 transition duration-200">
                <p className="text-blue-700"><strong>Post Title:</strong> {post.title}</p>
                <p className="text-blue-700"><strong>Category:</strong> {post.category}</p>
                <p className="text-blue-700"><strong>Date:</strong> {new Date(post.createdAt).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        );
      case "appointments":
        return (
          <div>
            <div className="flex justify-between items-center mb-3">
              <h4 className="text-xl font-semibold text-blue-800">Appointments</h4>
              <div className="flex items-center gap-2">
                <DatePicker
                  selected={selectedDate}
                  onChange={(date) => setSelectedDate(date)}
                  dateFormat="MMMM d, yyyy"
                  className="p-2 border border-blue-200 rounded-lg bg-blue-50 focus:bg-white focus:border-blue-500 transition duration-200"
                  placeholderText="Select a date"
                />
                <button
                  className="bg-gradient-to-r from-blue-600 to-blue-500 text-white py-2 px-4 rounded-lg hover:from-blue-700 hover:to-blue-600 transition duration-200 flex items-center gap-2"
                  onClick={handleDownloadReport}
                >
                  <FaDownload /> Download Report
                </button>
              </div>
            </div>
            {filterActivities(userData.uploads).map((upload) => (
              <div key={upload._id} className="p-4 border border-blue-200 rounded-lg mb-3 bg-blue-50 hover:bg-blue-100 transition duration-200">
                <p className="text-blue-700"><strong>Upload Title:</strong> {upload.title}</p>
                <p className="text-blue-700"><strong>File Type:</strong> {upload.fileType}</p>
                <p className="text-blue-700"><strong>Date:</strong> {new Date(upload.createdAt).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        );
      case "financial":
        return (
          <div>
            <div className="flex justify-between items-center mb-3">
              <h4 className="text-xl font-semibold text-blue-800">Financial</h4>
              <div className="flex items-center gap-2">
                <DatePicker
                  selected={selectedDate}
                  onChange={(date) => setSelectedDate(date)}
                  dateFormat="MMMM d, yyyy"
                  className="p-2 border border-blue-200 rounded-lg bg-blue-50 focus:bg-white focus:border-blue-500 transition duration-200"
                  placeholderText="Select a date"
                />
                <button
                  className="bg-gradient-to-r from-blue-600 to-blue-500 text-white py-2 px-4 rounded-lg hover:from-blue-700 hover:to-blue-600 transition duration-200 flex items-center gap-2"
                  onClick={handleDownloadReport}
                >
                  <FaDownload /> Download Report
                </button>
              </div>
            </div>
            {filterActivities(userData.feeds).map((feed) => (
              <div key={feed._id} className="p-4 border border-blue-200 rounded-lg mb-3 bg-blue-50 hover:bg-blue-100 transition duration-200">
                <p className="text-blue-700"><strong>Content Type:</strong> {feed.type}</p>
                <p className="text-blue-700"><strong>Likes:</strong> {feed.likes?.length || 0}</p>
                <p className="text-blue-700"><strong>Comments:</strong> {feed.comments?.length || 0}</p>
                <p className="text-blue-700"><strong>Date:</strong> {new Date(feed.createdAt).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        );
      default:
        return (
          <div>
            <h4 className="text-xl font-semibold mb-3 text-blue-800"></h4>
            {error && <p className="text-red-500 mb-3">{error}</p>}

            {/* Profile Image Section */}
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

            {/* Editable fields */}
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

              {/* Account Status Tile */}
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

            {/* Read-only fields */}
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
                    readOnly // Make the field read-only
                  />
                </div>
              ))}
            </div>

            {/* Save Changes and Delete Account Buttons (only shown if account is active) */}
            {formData.status === "active" && (
              <>
                {/* Save Changes and Delete Account Buttons (only shown if account is active) */}
{formData.status === "active" && (
  <div className="flex gap-4 mt-5"> {/* Add flex container with gap */}
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
              </>
            )}
          </div>
        );
    }
  };

  return (
    <div className="container mx-auto p-15 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg shadow-lg mt-5 mb-5">
      {/* Title */}
      <h1 className="text-3xl font-bold text-blue-800 text-center mb-5">Welcome to your User Profile </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Profile Section */}
        <div className="flex flex-col items-center p-5 border-r border-blue-200">
          <img
            className="rounded-full w-36 mt-5 border-4 border-blue-200"
            src={formData.profile_image}
            alt="Profile"
          />
          <span className="font-bold mt-3 text-blue-800">{formData.full_name}</span>
          <span className="text-blue-600">{formData.email}</span>

          {/* Additional Buttons */}
          <div className="mt-4 flex flex-col gap-2 w-full">
            {[
              { label: "Profile Settings", section: "profile", icon: <FaUser /> },
              { label: "Online Purchases", section: "onlinePurchases", icon: <FaShoppingCart /> },
              { label: "Community & Feedback", section: "communityFeedback", icon: <FaComments /> },
              { label: "Appointments", section: "appointments", icon: <FaClock /> },
              { label: "Financial", section: "financial", icon: <FaMoneyBillAlt /> },
            ].map((button) => (
              <button
                key={button.section}
                className={`w-full py-2 px-4 rounded-lg flex items-center gap-2 ${
                  activeSection === button.section
                    ? "bg-gradient-to-r from-blue-700 to-blue-600 text-white"
                    : "bg-blue-100 text-blue-700 hover:bg-blue-200 transition duration-200"
                }`}
                onClick={() => setActiveSection(button.section)}
              >
                {button.icon} {button.label}
              </button>
            ))}
          </div>
        </div>

        {/* Form Section */}
        <div className="p-5 border-r border-blue-200 col-span-2">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}