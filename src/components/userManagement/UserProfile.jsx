import { useState, useEffect } from "react";
import React from 'react';
import { FaCalendarAlt, FaDownload, FaTrash } from "react-icons/fa"; // Calendar, Download, and Trash icons from react-icons
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
  });

  const [activeSection, setActiveSection] = useState("profile"); // Track active section
  const [selectedDate, setSelectedDate] = useState(null); // Track selected date for filtering
  const [error, setError] = useState(""); // Track errors
  const [loading, setLoading] = useState(true); // Track loading state

  // Sample data for sidebar sections
  const sampleData = {
    onlinePurchases: [
      { id: 1, item: "Laptop", date: "2023-10-01", amount: "$1200" },
      { id: 2, item: "Headphones", date: "2023-09-25", amount: "$150" },
    ],
    communityFeedback: [
      { id: 1, feedback: "Great community support!", date: "2023-10-05" },
      { id: 2, feedback: "Need more events.", date: "2023-09-30" },
    ],
    appointments: [
      { id: 1, type: "Doctor", date: "2023-10-10", time: "10:00 AM" },
      { id: 2, type: "Dentist", date: "2023-10-15", time: "2:00 PM" },
    ],
    financial: [
      { id: 1, transaction: "Salary", date: "2023-10-01", amount: "$5000" },
      { id: 2, transaction: "Rent", date: "2023-10-05", amount: "$1200" },
    ],
  };

  // Fetch user details when the component mounts or userId changes
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await fetch(`http://localhost:8070/User/users/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch user details");
        }
        const data = await response.json();
        // Update formData with fetched data
        setFormData({
          _id: data._id,
          full_name: data.full_name,
          email: data.email,
          phone_number: data.phone_number,
          status: data.status,
          created_at: data.created_at,
          updated_at: data.updated_at,
          __v: data.__v,
        });
      } catch (error) {
        console.error("Error fetching user details:", error);
        setError("Failed to load user details. Please try again.");
      } finally {
        setLoading(false); // Set loading to false after the request completes
      }
    };

    fetchUserDetails();
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    if (!formData.full_name || !formData.email) {
      setError("Full Name and Email are required.");
      return;
    }
    console.log("Saved Data:", formData);
    setError(""); // Clear error on successful submission
  };

  // Filter activities based on the selected date
  const filterActivities = (activities) => {
    if (!selectedDate) return activities; // Return all activities if no date is selected
    const selectedDateString = selectedDate.toISOString().split('T')[0];
    return activities.filter((activity) => activity.date === selectedDateString);
  };

  // Handle report download as PDF
  const handleDownloadReport = () => {
    const filteredData = filterActivities(sampleData[activeSection]);
    if (filteredData.length === 0) {
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
    let yPosition = 20; // Starting Y position for the content
    filteredData.forEach((item, index) => {
      Object.entries(item).forEach(([key, value]) => {
        doc.text(`${key}: ${value}`, 10, yPosition);
        yPosition += 10; // Move down for the next line
      });
      yPosition += 10; // Add extra space between items
    });

    // Save the PDF and trigger download
    doc.save(`${activeSection}_report_${selectedDate.toISOString().split('T')[0]}.pdf`);
  };

  // Handle account deletion
  const handleDeleteAccount = () => {
    const confirmDelete = window.confirm("Are you sure you want to delete your account? This action cannot be undone.");
    if (confirmDelete) {
      // Perform account deletion logic here
      console.log("Account deletion confirmed.");
      alert("Account deleted successfully.");
      // You can add an API call to delete the account from the backend
    } else {
      console.log("Account deletion canceled.");
    }
  };

  // Render content based on the active section
  const renderContent = () => {
    if (loading) {
      return <p className="text-blue-800">Loading user details...</p>;
    }

    if (error) {
      return <p className="text-red-500">{error}</p>;
    }

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
            {filterActivities(sampleData.onlinePurchases).map((purchase) => (
              <div key={purchase.id} className="p-4 border border-blue-200 rounded-lg mb-3 bg-blue-50 hover:bg-blue-100 transition duration-200">
                <p className="text-blue-700"><strong>Item:</strong> {purchase.item}</p>
                <p className="text-blue-700"><strong>Date:</strong> {purchase.date}</p>
                <p className="text-blue-700"><strong>Amount:</strong> {purchase.amount}</p>
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
            {filterActivities(sampleData.communityFeedback).map((feedback) => (
              <div key={feedback.id} className="p-4 border border-blue-200 rounded-lg mb-3 bg-blue-50 hover:bg-blue-100 transition duration-200">
                <p className="text-blue-700"><strong>Feedback:</strong> {feedback.feedback}</p>
                <p className="text-blue-700"><strong>Date:</strong> {feedback.date}</p>
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
            {filterActivities(sampleData.appointments).map((appointment) => (
              <div key={appointment.id} className="p-4 border border-blue-200 rounded-lg mb-3 bg-blue-50 hover:bg-blue-100 transition duration-200">
                <p className="text-blue-700"><strong>Type:</strong> {appointment.type}</p>
                <p className="text-blue-700"><strong>Date:</strong> {appointment.date}</p>
                <p className="text-blue-700"><strong>Time:</strong> {appointment.time}</p>
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
            {filterActivities(sampleData.financial).map((transaction) => (
              <div key={transaction.id} className="p-4 border border-blue-200 rounded-lg mb-3 bg-blue-50 hover:bg-blue-100 transition duration-200">
                <p className="text-blue-700"><strong>Transaction:</strong> {transaction.transaction}</p>
                <p className="text-blue-700"><strong>Date:</strong> {transaction.date}</p>
                <p className="text-blue-700"><strong>Amount:</strong> {transaction.amount}</p>
              </div>
            ))}
          </div>
        );
      default:
        return (
          <div>
            <h4 className="text-xl font-semibold mb-3 text-blue-800">Profile Settings</h4>
            {error && <p className="text-red-500 mb-3">{error}</p>}

            {/* Read-only fields */}
            <div className="mt-3 flex flex-col gap-2">
              {[
                { name: "_id", label: "User ID", value: formData._id },
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
                { name: "status", label: "Status" },
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
            </div>
            <button
              className="mt-5 bg-gradient-to-r from-blue-600 to-blue-500 text-white py-2 px-4 rounded-lg hover:from-blue-700 hover:to-blue-600 transition duration-200"
              onClick={handleSubmit}
            >
              Save Profile
            </button>
            <button
              className="mt-3 bg-gradient-to-r from-red-600 to-red-500 text-white py-2 px-4 rounded-lg hover:from-red-700 hover:to-red-600 transition duration-200 flex items-center gap-2"
              onClick={handleDeleteAccount}
            >
              <FaTrash /> Delete Account
            </button>
          </div>
        );
    }
  };

  return (
    <div className="container mx-auto p-15 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg shadow-lg mt-5 mb-5">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Profile Section */}
        <div className="flex flex-col items-center p-5 border-r border-blue-200">
          <img
            className="rounded-full w-36 mt-5 border-4 border-blue-200"
            src="https://st3.depositphotos.com/15648834/17930/v/600/depositphotos_179308454-stock-illustration-unknown-person-silhouette-glasses-profile.jpg"
            alt="Profile"
          />
          <span className="font-bold mt-3 text-blue-800">{formData.full_name}</span>
          <span className="text-blue-600">{formData.email}</span>

          {/* Additional Buttons */}
          <div className="mt-4 flex flex-col gap-2 w-full">
            {[
              { label: "Profile Settings", section: "profile" },
              { label: "Online Purchases", section: "onlinePurchases" },
              { label: "Community & Feedback", section: "communityFeedback" },
              { label: "Appointments", section: "appointments" },
              { label: "Financial", section: "financial" },
            ].map((button) => (
              <button
                key={button.section}
                className={`w-full py-2 px-4 rounded-lg ${
                  activeSection === button.section
                    ? "bg-gradient-to-r from-blue-700 to-blue-600 text-white"
                    : "bg-blue-100 text-blue-700 hover:bg-blue-200 transition duration-200"
                }`}
                onClick={() => setActiveSection(button.section)}
              >
                {button.label}
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