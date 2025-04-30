import React, { useEffect, useState } from "react";

const EmployeeProfile = () => {
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Extract employee ID from the URL
  const employeeId = window.location.pathname.split("/").pop();

  useEffect(() => {
    // Fetch employee data
    const fetchEmployee = async () => {
      try {
        const response = await fetch(
          `http://localhost:8070/Employee/employees/${employeeId}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch employee data");
        }
        const data = await response.json();
        setEmployee(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployee();
  }, [employeeId]);

  // Handle delete employee
  const handleDelete = async () => {
    // Show confirmation alert
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this employee?"
    );
    if (!isConfirmed) return; // Exit if not confirmed

    try {
      const response = await fetch(
        `http://localhost:8070/Employee/employees/${employeeId}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) {
        throw new Error("Failed to delete employee");
      }
      alert("Employee deleted successfully");
      window.location.href = "/AdminLogin"; // Redirect to AdminLogin page
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return <div className="text-center mt-8">Loading...</div>;
  }

  if (error) {
    return <div className="text-center mt-8 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-blue-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-8 transform transition-transform hover:scale-105">
        <h1 className="text-3xl font-bold text-center text-blue-900 mb-8">
          Employee Profile
        </h1>
        {employee ? (
          <div className="space-y-6">
            <DetailItem label="Full Name" value={employee.full_name} />
            <DetailItem label="Email" value={employee.email} />
            <DetailItem
              label="Phone Number"
              value={employee.phone_number || "N/A"}
            />
            <DetailItem label="Status" value={employee.status} />
            <DetailItem
              label="Position"
              value={employee.employee_position || "N/A"}
            />
            <DetailItem label="Role" value={employee.user_role} />
            <DetailItem
              label="Created At"
              value={new Date(employee.created_at).toLocaleString()}
            />
            <DetailItem
              label="Last Updated"
              value={new Date(employee.updated_at).toLocaleString()}
            />
            <div className="flex justify-between mt-8">
              <button
                onClick={handleDelete}
                className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete Profile
              </button>
            </div>
          </div>
        ) : (
          <p className="text-center text-gray-500">No employee data found.</p>
        )}
      </div>
    </div>
  );
};

// Reusable component for displaying detail items
const DetailItem = ({ label, value }) => (
  <div className="flex justify-between border-b border-blue-200 pb-3">
    <span className="font-medium text-blue-800">{label}:</span>
    <span className="text-blue-600">{value}</span>
  </div>
);

export default EmployeeProfile;