import React, { useEffect, useState } from 'react';
import { FaEnvelope, FaTrash, FaFileCsv } from 'react-icons/fa'; // Import icons
import logo from "../../../assets/bplogo_blackText.png";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const ContactForms = () => {
  const [contacts, setContacts] = useState([]); // State to store contact data
  const [loading, setLoading] = useState(true); // State to handle loading state
  const [error, setError] = useState(null); // State to handle errors
  
  // Fetch contact data from the backend
  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const response = await fetch('http://localhost:8070/Contact/getAllContacts');
      if (!response.ok) {
        throw new Error('Failed to fetch contacts');
      }
      const data = await response.json();
      setContacts(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Function to delete a contact
  const deleteContact = async (contactId) => {
    try {
      const response = await fetch(`http://localhost:8070/Contact/deleteContact/${contactId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete contact');
      }

      setContacts((prevContacts) =>
        prevContacts.filter((contact) => contact._id !== contactId)
      );

      console.log('Contact deleted successfully');
    } catch (error) {
      console.error('Error deleting contact:', error);
      setError(error.message);
    }
  };

  // Function to generate and download CSV file
  const downloadPDF = async () => {
    const doc = new jsPDF();
    
    const response = await fetch(logo);
    const blob = await response.blob();
    const reader = new FileReader();
    
    reader.onloadend = function() {
      const base64data = reader.result;
      doc.addImage(base64data, "PNG", 10, 10, 40, 20);
      
      doc.setFontSize(14);
      doc.text("Order Management Report", 55, 16);
      doc.setFontSize(10);
      doc.text(`Generated on: ${new Date().toLocaleString()}`, 55, 22);
      doc.setFontSize(10);
      doc.text("Address: Minuwangoda Road,Gampaha", 55, 28);
      doc.setFontSize(10);
      doc.text("HotLine: +94 37 695 4879", 55, 34);
      doc.setFontSize(10);
      doc.text("Email: support@bluepulse.com", 55, 40);
      
      autoTable(doc, {
        head: [['FeedBack ID', 'Customer Name', 'Email', 'Feedback', 'Date']],
        body: contacts.map(contact => [
          contact._id,
          contact.name,
          contact.email,
          contact.message,
          new Date(contact.createdAt).toLocaleString(),
        ]),
        startY: 50,
      });
      
      doc.save("feedbacks_report.pdf");
    };
    
    reader.readAsDataURL(blob);
  };

  // Display loading state
  if (loading) {
    return (
      <main className="flex-1 p-8 overflow-y-auto">
        <h1 className="text-2xl font-bold text-blue-800 mb-6">Contact Forms</h1>
        <div className="bg-white p-6 rounded-lg shadow-md animate-pulse">
          <p>Loading contacts...</p>
        </div>
      </main>
    );
  }

  // Display error message
  if (error) {
    return (
      <main className="flex-1 p-8 overflow-y-auto">
        <h1 className="text-2xl font-bold text-blue-800 mb-6">Contact Forms</h1>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <p className="text-red-600">Error: {error}</p>
        </div>
      </main>
    );
  }

  // Display contact data
  return (
    <main className="flex-1 p-8 overflow-y-auto">
      <h1 className="text-2xl font-bold text-blue-800 mb-6">Contact Forms</h1>

      {/* Add New Contact Button */}
      <div className="flex gap-4 mb-6">
        {/* Download CSV Button */}
        <button
          onClick={downloadPDF}
          className="bg-green-500 text-white px-4 py-2 rounded-lg flex items-center hover:bg-green-600 transition duration-300"
        >
          <FaFileCsv className="mr-2" /> Download Report (PDF)
        </button>
      </div>

      {/* Contact Details Table */}
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left p-3 text-gray-700">Name</th>
              <th className="text-left p-3 text-gray-700">Email</th>
              <th className="text-left p-3 text-gray-700">Message</th>
              <th className="text-left p-3 text-gray-700">Created At</th>
              <th className="text-left p-3 text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {contacts.map((contact) => (
              <tr
                key={contact._id}
                className="border-b hover:bg-gray-50 transition duration-200"
              >
                <td className="p-3 text-gray-800">{contact.name}</td>
                <td className="p-3 text-gray-800">{contact.email}</td>
                <td className="p-3 text-gray-800">{contact.message}</td>
                <td className="p-3 text-gray-800">
                  {new Date(contact.createdAt).toLocaleString()}
                </td>
                <td className="p-3 text-gray-800">
                  <button
                    onClick={() => deleteContact(contact._id)}
                    className="text-red-500 hover:text-red-700 transition duration-200"
                    title="Delete contact"
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
};

export default ContactForms;