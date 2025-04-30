import React, { useEffect, useState } from 'react';
import { FaEnvelope, FaTrash, FaFileCsv } from 'react-icons/fa'; // Import icons

const ContactForms = () => {
  const [contacts, setContacts] = useState([]); // State to store contact data
  const [loading, setLoading] = useState(true); // State to handle loading state
  const [error, setError] = useState(null); // State to handle errors
  const [showAddForm, setShowAddForm] = useState(false); // State to toggle add form visibility
  const [newContact, setNewContact] = useState({
    name: '',
    email: '',
    message: '',
  }); // State for new contact data

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
      setContacts(data); // Set the fetched data to the state
    } catch (error) {
      setError(error.message); // Set error message if something goes wrong
    } finally {
      setLoading(false); // Set loading to false after fetching
    }
  };

  // Handle input change for new contact form
  const handleNewContactChange = (e) => {
    const { name, value } = e.target;
    setNewContact({ ...newContact, [name]: value });
  };

  // Handle form submission to add a new contact
  const addNewContact = async () => {
    try {
      const response = await fetch('http://localhost:8070/Contact/addContact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newContact),
      });

      if (!response.ok) {
        throw new Error('Failed to add new contact');
      }

      const addedContact = await response.json();

      // Add the new contact to the state
      setContacts((prevContacts) => [addedContact, ...prevContacts]);

      // Reset the form
      setNewContact({
        name: '',
        email: '',
        message: '',
      });

      // Hide the form
      setShowAddForm(false);

      console.log('Contact added successfully:', addedContact);
    } catch (error) {
      console.error('Error adding contact:', error);
      setError(error.message);
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

      // Remove the contact from the state
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
  const downloadCSV = () => {
    // Define CSV headers
    const headers = ['Name', 'Email', 'Message', 'Created At'];

    // Map contact data to CSV rows
    const rows = contacts.map((contact) => [
      contact.name,
      contact.email,
      contact.message,
      new Date(contact.createdAt).toLocaleString(),
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
    link.download = 'contact_forms_report.csv';
    link.click();

    // Clean up
    URL.revokeObjectURL(link.href);
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
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center hover:bg-blue-600 transition duration-300"
        >
          <FaEnvelope className="mr-2" /> Add New Contact
        </button>

        {/* Download CSV Button */}
        <button
          onClick={downloadCSV}
          className="bg-green-500 text-white px-4 py-2 rounded-lg flex items-center hover:bg-green-600 transition duration-300"
        >
          <FaFileCsv className="mr-2" /> Download Report (CSV)
        </button>
      </div>

      {/* Add New Contact Form */}
      {showAddForm && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-bold text-blue-800 mb-4">Add New Contact</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-gray-700">Name</label>
              <input
                type="text"
                name="name"
                value={newContact.name}
                onChange={handleNewContactChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-gray-700">Email</label>
              <input
                type="email"
                name="email"
                value={newContact.email}
                onChange={handleNewContactChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-gray-700">Message</label>
              <textarea
                name="message"
                value={newContact.message}
                onChange={handleNewContactChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              onClick={addNewContact}
              className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition duration-300"
            >
              Save Contact
            </button>
          </div>
        </div>
      )}

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