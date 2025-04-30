import React, { useEffect, useState, useCallback } from 'react';
import { FaDownload, FaTrash, FaEdit, FaSearch, FaFilter, FaTimes, FaFileAlt, FaChartLine, FaCheck } from 'react-icons/fa';

const FinanceAdmin = () => {
  const [submissions, setSubmissions] = useState([]);
  const [filteredSubmissions, setFilteredSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [sortConfig, setSortConfig] = useState({ key: 'createdAt', direction: 'desc' });
  const [stats, setStats] = useState({ total: 0, pending: 0, processed: 0 });
  const [selectedFile, setSelectedFile] = useState(null);
  const [showFilePreview, setShowFilePreview] = useState(false);

  // Document type options
  const documentTypes = [
    'Tax Documents',
    'Bank Statements',
    'Invoices',
    'Receipts',
    'Financial Reports',
    'Other'
  ];

  // Status options
  const statusOptions = [
    { value: 'pending', label: 'Pending', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'processed', label: 'Processed', color: 'bg-green-100 text-green-800' },
    { value: 'rejected', label: 'Rejected', color: 'bg-red-100 text-red-800' }
  ];

  // Fetch financial submissions
  const fetchSubmissions = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:8070/Finance/');
      if (!response.ok) throw new Error('Failed to fetch submissions');
      
      const data = await response.json();
      const submissionsWithDate = data.map(sub => ({
        ...sub,
        createdAt: sub.createdAt || new Date().toISOString(),
        status: sub.status || 'pending'
      }));
      
      setSubmissions(submissionsWithDate);
      setFilteredSubmissions(submissionsWithDate);
      
      setStats({
        total: data.length,
        pending: data.filter(s => (s.status || 'pending') === 'pending').length,
        processed: data.filter(s => s.status === 'processed').length
      });
      
      setError(null);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSubmissions();
  }, [fetchSubmissions]);

  // Filtering and sorting
  useEffect(() => {
    let result = [...submissions];
    
    if (searchTerm) {
      result = result.filter(submission => (
        submission.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        submission.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (submission.contactNumber && submission.contactNumber.includes(searchTerm))
      ))
    }
    
    if (activeFilter !== 'all') {
      result = result.filter(submission => (submission.status || 'pending') === activeFilter);
    }
    
    if (sortConfig.key) {
      result.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1;
        if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    
    setFilteredSubmissions(result);
  }, [searchTerm, submissions, activeFilter, sortConfig]);

  const requestSort = (key) => {
    setSortConfig({
      key,
      direction: sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc'
    });
  };

  // Handle file preview
  const previewFile = (filePath) => {
    if (!filePath) return;
    
    const previewUrl = filePath.startsWith('http') 
      ? filePath 
      : `http://localhost:8070${filePath.startsWith('/') ? '' : '/'}${filePath}`;
    
    setSelectedFile(previewUrl);
    setShowFilePreview(true);
  };

  // Handle file download
  const handleDownload = async (filePath) => {
    try {
      const filename = filePath.split('/').pop();
      const downloadUrl = `http://localhost:8070/Finance/download/${filename}`;
      
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Download error:', error);
      alert('Failed to download file');
    }
  };

  // Delete submission
  const deleteSubmission = async (id) => {
    if (!window.confirm('Are you sure you want to delete this submission?')) return;
    
    try {
      const response = await fetch(`http://localhost:8070/Finance/delete/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete submission');

      const submissionToDelete = submissions.find(s => s._id === id);
      setSubmissions(prev => prev.filter(sub => sub._id !== id));
      setStats(prev => ({
        total: prev.total - 1,
        pending: prev.pending - ((submissionToDelete?.status || 'pending') === 'pending' ? 1 : 0),
        processed: prev.processed - (submissionToDelete?.status === 'processed' ? 1 : 0)
      }));
      
      alert('Submission deleted successfully');
    } catch (error) {
      console.error('Error:', error);
      setError(error.message);
      fetchSubmissions();
    }
  };

  // Update submission
  const updateSubmission = (id) => {
    const submission = submissions.find((sub) => sub._id === id);
    setSelectedSubmission(submission);
    setShowUpdateForm(true);
  };

  const handleUpdate = async (updatedData) => {
    try {
      const response = await fetch(`http://localhost:8070/Finance/update/${updatedData._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData),
      });

      if (!response.ok) throw new Error('Failed to update submission');

      setSubmissions(prev => prev.map(sub => sub._id === updatedData._id ? updatedData : sub));
      
      if (updatedData.status !== (selectedSubmission.status || 'pending')) {
        setStats(prev => {
          const newStats = { ...prev };
          if ((selectedSubmission.status || 'pending') === 'pending') newStats.pending--;
          if (selectedSubmission.status === 'processed') newStats.processed--;
          if (updatedData.status === 'pending') newStats.pending++;
          if (updatedData.status === 'processed') newStats.processed++;
          return newStats;
        });
      }
      
      setShowUpdateForm(false);
      alert('Submission updated successfully');
    } catch (error) {
      console.error('Error:', error);
      setError(error.message);
      fetchSubmissions();
    }
  };

  // CSV export
  const convertToCSV = (data) => {
    const headers = ['Full Name', 'Email', 'Contact Number', 'Document Type', 'Status', 'Message', 'Files', 'Submitted At'];
    const rows = data.map((submission) => [
      `"${submission.fullName}"`,
      submission.email,
      submission.contactNumber || '',
      submission.documentType,
      submission.status || 'pending',
      `"${submission.message || ''}"`,
      submission.UploadDocuments || '',
      new Date(submission.createdAt).toLocaleString()
    ]);

    return [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
  };

  const downloadCSV = () => {
    const date = new Date().toISOString().split('T')[0];
    const csvData = convertToCSV(filteredSubmissions);
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `financial_submissions_${date}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // File Preview Modal
  const FilePreviewModal = ({ fileUrl, onClose }) => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const filename = fileUrl?.split('/').pop();
    const fileType = filename?.split('.').pop().toLowerCase();
    const isImage = ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(fileType);
    const isPDF = fileType === 'pdf';

    return (
      <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
          <div className="flex justify-between items-center p-4 border-b">
            <h3 className="text-lg font-medium">File Preview: {filename}</h3>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <FaTimes className="h-5 w-5" />
            </button>
          </div>
          
          <div className="flex-1 overflow-auto p-4 flex items-center justify-center">
            {loading && (
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading file...</p>
              </div>
            )}
            
            {error && (
              <div className="text-center text-red-600 p-4">
                <p>Failed to load file: {error}</p>
              </div>
            )}
            
            {isImage && (
              <img 
                src={fileUrl} 
                alt="Preview" 
                className="max-w-full max-h-[70vh] object-contain"
                onLoad={() => setLoading(false)}
                onError={() => {
                  setLoading(false);
                  setError('Could not load image');
                }}
              />
            )}
            
            {isPDF && (
              <iframe 
                src={fileUrl} 
                className="w-full h-[70vh] border"
                title="PDF Preview"
                onLoad={() => setLoading(false)}
                onError={() => {
                  setLoading(false);
                  setError('Could not load PDF');
                }}
              />
            )}
            
            {!isImage && !isPDF && !loading && !error && (
              <div className="text-center p-8">
                <FaFileAlt className="mx-auto h-16 w-16 text-gray-400" />
                <p className="mt-4 text-gray-600">Preview not available for this file type</p>
                <button
                  onClick={() => handleDownload(fileUrl)}
                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Download File
                </button>
              </div>
            )}
          </div>
          
          <div className="p-4 border-t text-right">
            <button
              onClick={() => handleDownload(fileUrl)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 inline-flex items-center"
            >
              <FaDownload className="mr-2" />
              Download
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Update Form Component
  const UpdateForm = ({ submission, onClose, onUpdate }) => {
    const [formData, setFormData] = useState({
      ...submission,
      status: submission.status || 'pending'
    });

    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e) => {
      e.preventDefault();
      onUpdate(formData);
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-blue-800">Update Submission</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <FaTimes className="h-5 w-5" />
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">Full Name</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">Contact Number</label>
              <input
                type="tel"
                name="contactNumber"
                value={formData.contactNumber || ''}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">Document Type</label>
              <select
                name="documentType"
                value={formData.documentType || ''}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {documentTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">Status</label>
              <select
                name="status"
                value={formData.status || 'pending'}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {statusOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>
            
            <div className="mb-4 md:col-span-2">
              <label className="block text-gray-700 font-medium mb-2">Message</label>
              <textarea
                name="message"
                value={formData.message || ''}
                onChange={handleChange}
                rows="3"
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-gray-700 font-medium mb-2">Attached Files</label>
              <div className="grid grid-cols-2 gap-2">
                {formData.UploadDocuments ? (
                  <div className="flex items-center p-2 bg-gray-100 rounded-lg">
                    <FaFileAlt className="text-blue-500 mr-2" />
                    <span className="truncate flex-1">{formData.UploadDocuments.split('/').pop()}</span>
                    <button 
                      type="button" 
                      onClick={() => previewFile(formData.UploadDocuments)}
                      className="ml-2 text-blue-500 hover:text-blue-700"
                    >
                      View
                    </button>
                  </div>
                ) : (
                  <div className="p-2 text-gray-500">No files attached</div>
                )}
              </div>
            </div>
            
            <div className="md:col-span-2 flex justify-end space-x-3 mt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200"
              >
                Update Submission
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  // Loading state
  if (loading) {
    return (
      <main className="flex-1 p-6 overflow-y-auto bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-800 mb-8">Financial Submissions Dashboard</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white p-6 rounded-xl shadow-sm h-32 animate-pulse"></div>
            ))}
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="h-10 w-1/3 mb-6 bg-gray-200 rounded animate-pulse"></div>
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="h-16 bg-gray-100 rounded animate-pulse"></div>
              ))}
            </div>
          </div>
        </div>
      </main>
    );
  }

  // Error state
  if (error) {
    return (
      <main className="flex-1 p-6 overflow-y-auto bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-800 mb-8">Financial Submissions Dashboard</h1>
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="text-red-600 p-4 bg-red-50 rounded-lg">
              <p className="font-medium">Error loading submissions:</p>
              <p>{error}</p>
              <button
                onClick={fetchSubmissions}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // Main render
  return (
    <main className="flex-1 p-6 overflow-y-auto bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Financial Submissions Dashboard</h1>
        <p className="text-gray-600 mb-8">Manage and review all financial document submissions</p>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 font-medium">Total Submissions</p>
                <p className="text-3xl font-bold text-gray-800">{stats.total}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full text-blue-500">
                <FaFileAlt className="h-6 w-6" />
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-yellow-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 font-medium">Pending Review</p>
                <p className="text-3xl font-bold text-gray-800">{stats.pending}</p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-full text-yellow-500">
                <FaFileAlt className="h-6 w-6" />
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 font-medium">Processed</p>
                <p className="text-3xl font-bold text-gray-800">{stats.processed}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full text-green-500">
                <FaChartLine className="h-6 w-6" />
              </div>
            </div>
          </div>
        </div>
        
        {/* Action Bar */}
        <div className="bg-white p-4 rounded-xl shadow-sm mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search submissions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="relative">
              <select
                value={activeFilter}
                onChange={(e) => setActiveFilter(e.target.value)}
                className="appearance-none pl-3 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
              >
                <option value="all">All Statuses</option>
                {statusOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                <FaFilter className="text-gray-400" />
              </div>
            </div>
            
            <button
              onClick={downloadCSV}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200 flex items-center"
            >
              <FaDownload className="mr-2" /> Export
            </button>
          </div>
        </div>
        
        {/* Submissions Table */}
        <div className="bg-white p-6 rounded-xl shadow-sm overflow-x-auto">
          {filteredSubmissions.length > 0 ? (
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th 
                    className="p-3 text-left text-gray-700 font-medium cursor-pointer"
                    onClick={() => requestSort('fullName')}
                  >
                    <div className="flex items-center">
                      Name
                      {sortConfig.key === 'fullName' && (
                        <span className="ml-1">{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
                      )}
                    </div>
                  </th>
                  <th 
                    className="p-3 text-left text-gray-700 font-medium cursor-pointer"
                    onClick={() => requestSort('email')}
                  >
                    <div className="flex items-center">
                      Email
                      {sortConfig.key === 'email' && (
                        <span className="ml-1">{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
                      )}
                    </div>
                  </th>
                  <th className="p-3 text-left text-gray-700 font-medium">Contact</th>
                  <th className="p-3 text-left text-gray-700 font-medium">Document Type</th>
                  <th className="p-3 text-left text-gray-700 font-medium">Status</th>
                  <th className="p-3 text-left text-gray-700 font-medium">Files</th>
                  <th className="p-3 text-left text-gray-700 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredSubmissions.map((submission) => (
                  <tr key={submission._id} className="hover:bg-gray-50 transition duration-150">
                    <td className="p-3 text-gray-800 font-medium">{submission.fullName}</td>
                    <td className="p-3 text-gray-800">
                      <a href={`mailto:${submission.email}`} className="text-blue-600 hover:underline">
                        {submission.email}
                      </a>
                    </td>
                    <td className="p-3 text-gray-800">
                      {submission.contactNumber ? (
                        <a href={`tel:${submission.contactNumber}`} className="hover:text-blue-600">
                          {submission.contactNumber}
                        </a>
                      ) : (
                        <span className="text-gray-400">N/A</span>
                      )}
                    </td>
                    <td className="p-3 text-gray-800">{submission.documentType || 'N/A'}</td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          statusOptions.find(o => o.value === (submission.status || 'pending'))?.color || 'bg-gray-100 text-gray-800'
                        }`}>
                          {statusOptions.find(o => o.value === (submission.status || 'pending'))?.label || 'Pending'}
                        </span>
                        <button 
                          className="p-1 text-green-600 hover:bg-green-50 rounded transition duration-200"
                          title="Mark as OK"
                          onClick={() => handleUpdate({ ...submission, status: 'processed' })}
                        >
                          <FaCheck className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                    <td className="p-3">
                      {submission.UploadDocuments ? (
                        <button 
                          onClick={() => previewFile(submission.UploadDocuments)}
                          className="text-blue-600 hover:underline flex items-center"
                        >
                          <FaFileAlt className="mr-1" /> View
                        </button>
                      ) : (
                        <span className="text-gray-400">None</span>
                      )}
                    </td>
                    <td className="p-3">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => updateSubmission(submission._id)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition duration-200"
                          title="Edit"
                        >
                          <FaEdit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => deleteSubmission(submission._id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition duration-200"
                          title="Delete"
                        >
                          <FaTrash className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-center py-12">
              <FaSearch className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-lg font-medium text-gray-900">No submissions found</h3>
              <p className="mt-1 text-gray-500">
                {searchTerm ? 'Try adjusting your search or filter' : 'There are currently no submissions to display'}
              </p>
            </div>
          )}
        </div>
        
        {/* Update Form Modal */}
        {showUpdateForm && (
          <UpdateForm
            submission={selectedSubmission}
            onClose={() => setShowUpdateForm(false)}
            onUpdate={handleUpdate}
          />
        )}
        
        {/* File Preview Modal */}
        {showFilePreview && (
          <FilePreviewModal
            fileUrl={selectedFile}
            onClose={() => setShowFilePreview(false)}
          />
        )}
      </div>
    </main>
  );
};

export default FinanceAdmin;