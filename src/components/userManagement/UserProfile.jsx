import { useState, useEffect } from "react";
import React from 'react';
import { FaCalendarAlt, FaDownload, FaTrash, FaUser, FaShoppingCart, FaComments, FaClock, FaMoneyBillAlt, FaEdit, FaBell, FaHome } from "react-icons/fa"; // Icons from react-icons
import DatePicker from "react-datepicker"; // DatePicker component
import "react-datepicker/dist/react-datepicker.css"; // DatePicker CSS
import { useParams, useNavigate } from "react-router-dom"; // Import useParams and useNavigate
import jsPDF from "jspdf"; // Import jsPDF for PDF generation

export default function ProfileSettings() {
  const { id } = useParams();
  const navigate = useNavigate(); // Add navigate hook
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
    profile_image: "https://st3.depositphotos.com/15648834/17930/v/600/depositphotos_179308454-stock-illustration-unknown-person-silhouette-glasses-profile.jpg", // Set default image
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
    feeds: [],
    appointments: [] // Add appointments to userData state
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
        setFormData(prev => ({
          ...prev,
          _id: profileData._id,
          full_name: profileData.full_name,
          email: profileData.email,
          phone_number: profileData.phone_number,
          status: profileData.status,
          created_at: profileData.created_at,
          updated_at: profileData.updated_at,
          __v: profileData.__v,
          profile_image: profileData.profile_image || prev.profile_image,
        }));

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

        // Fetch community posts
        let communityPosts = [];
        try {
          const communityResponse = await fetch('http://localhost:8070/commi/getAll', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });

          if (communityResponse.ok) {
            const allPosts = await communityResponse.json();
            // Filter posts by user's email
            communityPosts = allPosts.filter(post => post.email === profileData.email);
          }
        } catch (error) {
          console.warn("Could not fetch community posts:", error);
        }

        // Fetch all services and filter by email
        let appointmentsData = [];
        try {
          // Try the new findByEmail endpoint first
          const appointmentsResponse = await fetch(`http://localhost:8070/api/services/findByEmail/${profileData.email}`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });

          if (appointmentsResponse.ok) {
            appointmentsData = await appointmentsResponse.json();
          } else {
            // Fallback to fetching all services and filtering on frontend
            const servicesResponse = await fetch('http://localhost:8070/services', {
              headers: {
                'Authorization': `Bearer ${token}`
              }
            });
            
            if (servicesResponse.ok) {
              const allServices = await servicesResponse.json();
              // Filter services by user's email
              appointmentsData = allServices.filter(service => service.email === profileData.email);
            }
          }
        } catch (error) {
          console.warn("Could not fetch services:", error);
        }

        setUserData({
          purchases: userData.purchases || [],
          uploads: userData.uploads || [],
          communityPosts: communityPosts,
          feeds: userData.feeds || [],
          appointments: appointmentsData
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
        dataToDownload = filterActivities(userData.appointments);
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
          doc.text(`Service Type: ${item.service}`, 10, yPosition);
          doc.text(`Full Name: ${item.fullName}`, 10, yPosition + 10);
          doc.text(`Email: ${item.email}`, 10, yPosition + 20);
          doc.text(`Phone: ${item.phone}`, 10, yPosition + 30);
          doc.text(`Preferred Date: ${new Date(item.preferredDate).toLocaleDateString()}`, 10, yPosition + 40);
          doc.text(`Preferred Time: ${item.preferredTime}`, 10, yPosition + 50);
          doc.text(`Status: ${item.termsAccepted ? "Confirmed" : "Pending"}`, 10, yPosition + 60);
          yPosition += 70;
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
                <p className="text-blue-700"><strong>Title:</strong> {post.title}</p>
                <p className="text-blue-700"><strong>Content:</strong> {post.content}</p>
                <p className="text-blue-700"><strong>Category:</strong> {post.category}</p>
                <p className="text-blue-700"><strong>Date:</strong> {new Date(post.createdAt).toLocaleDateString()}</p>
                {post.comments && post.comments.length > 0 && (
                  <div className="mt-2">
                    <p className="text-blue-700"><strong>Comments:</strong> {post.comments.length}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        );
      case "appointments":
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h4 className="text-2xl font-semibold text-gray-800">Service Requests</h4>
              <div className="flex items-center gap-3">
                <DatePicker
                  selected={selectedDate}
                  onChange={(date) => setSelectedDate(date)}
                  dateFormat="MMMM d, yyyy"
                  className="px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholderText="Select a date"
                />
                <button
                  className="bg-gradient-to-r from-blue-600 to-blue-500 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-blue-600 transition-all duration-200 flex items-center gap-2 shadow-md hover:shadow-lg"
                  onClick={handleDownloadReport}
                >
                  <FaDownload /> Download Report
                </button>
              </div>
            </div>

            <div className="grid gap-6">
              {filterActivities(userData.appointments).map((service) => (
                <div 
                  key={service._id} 
                  className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-200 overflow-hidden border border-gray-100"
                >
                  <div className="p-6">
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <FaClock className="text-blue-500" />
                          <p className="text-gray-800">
                            <span className="font-medium">Service Type:</span>{" "}
                            <span className="text-blue-600">{service.service}</span>
                          </p>
                        </div>
                        <p className="text-gray-700">
                          <span className="font-medium">Full Name:</span> {service.fullName}
                        </p>
                        <p className="text-gray-700">
                          <span className="font-medium">Email:</span> {service.email}
                        </p>
                      </div>
                      <div className="space-y-3">
                        <p className="text-gray-700">
                          <span className="font-medium">Phone:</span> {service.phone}
                        </p>
                        <p className="text-gray-700">
                          <span className="font-medium">Preferred Date:</span>{" "}
                          {new Date(service.preferredDate).toLocaleDateString()}
                        </p>
                        <p className="text-gray-700">
                          <span className="font-medium">Preferred Time:</span> {service.preferredTime}
                        </p>
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <div className="flex justify-between items-center">
                        <p className="text-gray-700">
                          <span className="font-medium">Status:</span>{" "}
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                            service.termsAccepted 
                              ? "bg-green-100 text-green-700" 
                              : "bg-yellow-100 text-yellow-700"
                          }`}>
                            {service.termsAccepted ? "Confirmed" : "Pending"}
                          </span>
                        </p>
                        <button 
                          className="text-blue-600 hover:text-blue-800 transition-colors duration-200"
                          onClick={() => {/* Add view details handler */}}
                        >
                          View Details →
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {userData.appointments.length === 0 && (
              <div className="text-center py-12">
                <div className="bg-gray-50 rounded-lg p-8">
                  <FaBell className="mx-auto text-4xl text-gray-400 mb-4" />
                  <p className="text-gray-500 text-lg">No service requests found</p>
                </div>
              </div>
            )}
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
              {formData.profile_image && (
                <img
                  className="rounded-full w-36 h-36 border-4 border-blue-200 mb-3"
                  src={formData.profile_image}
                  alt="Profile"
                  onError={(e) => {
                    e.target.src = "https://st3.depositphotos.com/15648834/17930/v/600/depositphotos_179308454-stock-illustration-unknown-person-silhouette-glasses-profile.jpg";
                  }}
                />
              )}
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
              </>
            )}
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 p-4 md:p-8">
      {/* Main Container */}
      <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Header Section */}
        <div className="relative h-48 bg-gradient-to-r from-blue-600 to-blue-400">
          <div className="absolute inset-0 bg-black opacity-20"></div>
          <div className="relative flex justify-between items-center px-8 pt-8">
            <button
              onClick={() => navigate('/')}
              className="bg-white text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50 transition duration-200 flex items-center gap-2 shadow-lg"
            >
              <FaHome /> Back to Home
            </button>
            <h1 className="text-3xl font-bold text-white">
              Welcome to your User Profile
            </h1>
            <div className="w-32"></div> {/* Spacer to balance the layout */}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
          {/* Left Sidebar - Profile Section */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 -mt-20 relative z-10">
              <div className="flex flex-col items-center">
                {formData.profile_image && (
                  <div className="relative group">
                    <img
                      className="rounded-full w-32 h-32 border-4 border-white shadow-lg transition-transform duration-300 group-hover:scale-105"
                      src={formData.profile_image}
                      alt="Profile"
                      onError={(e) => {
                        e.target.src = "https://st3.depositphotos.com/15648834/17930/v/600/depositphotos_179308454-stock-illustration-unknown-person-silhouette-glasses-profile.jpg";
                      }}
                    />
                    <label
                      htmlFor="profileImageInput"
                      className="absolute bottom-0 right-0 bg-blue-500 p-2 rounded-full text-white cursor-pointer shadow-lg hover:bg-blue-600 transition-colors duration-200"
                    >
                      <FaEdit size={16} />
                    </label>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  id="profileImageInput"
                />
                <h2 className="mt-4 text-xl font-semibold text-gray-800">{formData.full_name}</h2>
                <p className="text-blue-600">{formData.email}</p>
                
                {/* Status Badge */}
                <div className={`mt-3 px-4 py-1 rounded-full text-sm font-medium ${
                  formData.status === "active" 
                    ? "bg-green-100 text-green-800" 
                    : "bg-red-100 text-red-800"
                }`}>
                  {formData.status === "active" ? "Active" : "Inactive"}
                </div>
              </div>

              {/* Navigation Buttons */}
              <div className="mt-8 space-y-3">
                {[
                  { label: "Profile Settings", section: "profile", icon: <FaUser /> },
                  { label: "Online Purchases", section: "onlinePurchases", icon: <FaShoppingCart /> },
                  { label: "Community & Feedback", section: "communityFeedback", icon: <FaComments /> },
                  { label: "Service Requests", section: "appointments", icon: <FaClock /> },
                  { label: "Financial", section: "financial", icon: <FaMoneyBillAlt /> },
                ].map((button) => (
                  <button
                    key={button.section}
                    className={`w-full py-3 px-4 rounded-xl flex items-center gap-3 transition-all duration-200 ${
                      activeSection === button.section
                        ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg transform scale-105"
                        : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                    }`}
                    onClick={() => setActiveSection(button.section)}
                  >
                    <span className="text-lg">{button.icon}</span>
                    <span className="font-medium">{button.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="md:col-span-2 bg-white rounded-2xl shadow-lg p-6">
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
              </div>
            ) : error ? (
              <div className="bg-red-50 text-red-700 p-4 rounded-lg">
                {error}
              </div>
            ) : (
              renderContent()
            )}
          </div>
        </div>
      </div>
    </div>
  );
}