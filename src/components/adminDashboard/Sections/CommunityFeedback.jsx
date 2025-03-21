import React, { useEffect, useState } from "react";
import { FaDownload } from "react-icons/fa"; // Import icons

const AdminCommi = () => {
  const [commis, setCommis] = useState([]); // State to store Commi data
  const [loading, setLoading] = useState(true); // State to handle loading state
  const [error, setError] = useState(null); // State to handle errors

  // Fetch Commi data from the backend
  useEffect(() => {
    fetchCommis();
  }, []);

  const fetchCommis = async () => {
    try {
      const response = await fetch("http://localhost:8070/commi/getAll");
      if (!response.ok) {
        throw new Error("Failed to fetch commis");
      }
      const data = await response.json();
      setCommis(data); // Set the fetched data to the state
    } catch (error) {
      setError(error.message); // Set error message if something goes wrong
    } finally {
      setLoading(false); // Set loading to false after fetching
    }
  };

  // Function to convert Commi data to CSV
  const convertToCSV = (data) => {
    const headers = ["Commi ID", "PID", "Email", "Description", "Photo"];
    const rows = data.map((commi) => [
      commi._id || "",
      commi.pid || "",
      commi.email || "",
      commi.description || "",
      commi.photo || "",
    ]);

    const csvContent = [headers.join(","), ...rows.map((row) => row.join(","))].join("\n");

    return csvContent;
  };

  // Function to trigger CSV download
  const downloadCSV = () => {
    const csvData = convertToCSV(commis);
    const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "commi_details.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Display loading state
  if (loading) {
    return (
      <main className="flex-1 p-8 overflow-y-auto">
        <h1 className="text-2xl font-bold text-blue-800 mb-6">Commiunity Management</h1>
        <div className="bg-white p-6 rounded-lg shadow-md animate-pulse">
          <p>Loading commis...</p>
        </div>
      </main>
    );
  }

  // Display error message
  if (error) {
    return (
      <main className="flex-1 p-8 overflow-y-auto">
        <h1 className="text-2xl font-bold text-blue-800 mb-6">Commiunity Management</h1>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <p className="text-red-600">Error: {error}</p>
        </div>
      </main>
    );
  }

  // Display Commi data
  return (
    <main className="flex-1 p-8 overflow-y-auto">
      <h1 className="text-2xl font-bold text-blue-800 mb-6">Commiunity Management</h1>

      {/* Download Button */}
      <div className="mb-6">
        <button
          onClick={downloadCSV}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-300 flex items-center"
        >
          <FaDownload className="mr-2" /> Download Commiunity Details
        </button>
      </div>

      {/* Commi Details Table */}
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left p-3 text-gray-700">Commiunity ID</th>
              <th className="text-left p-3 text-gray-700">PID</th>
              <th className="text-left p-3 text-gray-700">Email</th>
              <th className="text-left p-3 text-gray-700">Description</th>
              <th className="text-left p-3 text-gray-700">Photo</th>
            </tr>
          </thead>
          <tbody>
            {commis.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center p-3 text-gray-800">
                  No commis found.
                </td>
              </tr>
            ) : (
              commis.map((commi) => (
                <tr key={commi._id} className="border-b hover:bg-gray-50 transition duration-200">
                  <td className="p-3 text-gray-800">{commi._id}</td>
                  <td className="p-3 text-gray-800">{commi.pid}</td>
                  <td className="p-3 text-gray-800">{commi.email}</td>
                  <td className="p-3 text-gray-800">{commi.description}</td>
                  <td className="p-3 text-gray-800">
                    {commi.photo && (
                      <img
                        src={`http://localhost:8070${commi.photo}`}
                        alt="Commi"
                        className="w-16 h-16 object-cover"
                      />
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
};

export default AdminCommi;