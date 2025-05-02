import React, { useEffect, useState } from "react";
import {
  FaCheckCircle,
  FaTimesCircle,
  FaBox,
  FaDownload,
  FaPlus,
  FaAngleDown,
  FaAngleUp,
  FaSearch,
  FaFilter,
  FaTrash,
  FaEye,
  FaCheck,
  FaTimes,
  FaPrint
} from "react-icons/fa";
import logo from "../../../assets/bplogo_blackText.png";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import axios from "axios";
import { format } from 'date-fns';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [highlightedOrders, setHighlightedOrders] = useState([]);
  const [orderMessages, setOrderMessages] = useState(() => {
    const savedMessages = localStorage.getItem('orderMessages');
    return savedMessages ? JSON.parse(savedMessages) : {};
  });

  const [cancelModal, setCancelModal] = useState({
    isOpen: false,
    orderId: null,
    message: ""
  });

  // Fetch order data from the backend
  useEffect(() => {
    fetchOrders();
  }, []);

  // Clean up expired messages on load
  useEffect(() => {
    const now = Date.now();
    const twentyFourHours = 24 * 60 * 60 * 1000;
    
    setOrderMessages(prev => {
      const updated = {};
      let hasChanges = false;
      
      Object.keys(prev).forEach(orderId => {
        if (now - prev[orderId].timestamp < twentyFourHours) {
          updated[orderId] = prev[orderId];
        } else {
          hasChanges = true;
        }
      });
      
      if (hasChanges) {
        localStorage.setItem('orderMessages', JSON.stringify(updated));
      }
      
      return updated;
    });
  }, []);

  // Real-time status updates polling
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const response = await axios.get("http://localhost:8070/Finance/status-updates");
        const updates = response.data;
        console.log("Updates received:", updates);
  
        if (updates.length > 0) {
          const newMessages = {};
          const newHighlighted = [];
  
          updates.forEach(update => {
            const order = orders.find(order => order.transactionId === update._id);
            if (order) {
              // Store the message with timestamp
              newMessages[order._id] = {
                text: update.message || `Status update: ${update.status}`,
                timestamp: Date.now()
              };
              
              // Highlight the row
              newHighlighted.push(order._id);
              
              // Show toast notification
              toast.info(
                `Order #${order._id.substring(0, 8)}: ${update.message || 'New update available'}`,
                {
                  position: "bottom-right",
                  autoClose: 5000,
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                }
              );
            }
          });
  
          // Update states
          setOrderMessages(prev => {
            const updated = { ...prev, ...newMessages };
            localStorage.setItem('orderMessages', JSON.stringify(updated));
            return updated;
          });
          
          setHighlightedOrders(prev => [...prev, ...newHighlighted]);
          
          // Clear highlights after 5 seconds
          setTimeout(() => {
            setHighlightedOrders(prev => prev.filter(id => !newHighlighted.includes(id)));
          }, 60*5000);
        }
      } catch (error) {
        console.error("Polling error:", error);
      }
    }, 5000);
  
    return () => clearInterval(interval);
  }, [orders]);

  const fetchOrders = async () => {
    try {
      const response = await axios.get("http://localhost:8070/orders/allOrders");
      setOrders(response.data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus,message) => {
    try {
      setOrders(prevOrders =>
        prevOrders.map(order =>
          order._id === orderId ? { ...order, status: newStatus } : order
        )
      );

      console.log("reason:",message);

      await axios.put(
        `http://localhost:8070/orders/updateStatus/${orderId}`,
        { status: newStatus,message:message },
      );

      // Store message for display
      setOrderMessages(prev => ({
        ...prev,
        [orderId]: {
          text: message || `Status changed to ${newStatus}`,
          timestamp: Date.now()
        }
      }));
  
      await fetchOrders();
    } catch (error) {
      setOrders(prevOrders => [...prevOrders]);
      toast.error("Failed to update status. Please refresh.");
    }
  };

  const deleteOrder = async (orderId) => {
    if (window.confirm("Are you sure you want to delete this order?")) {
      try {
        await axios.delete(`http://localhost:8070/orders/deleteOrder/${orderId}`);
        fetchOrders();
      } catch (error) {
        setError(error.message);
      }
    }
  };

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
      doc.text(`Generated on: ${format(new Date(), 'yyyy-MM-dd HH:mm')}`, 55, 22);
      doc.setFontSize(10);
      doc.text("Address: Minuwangoda Road,Gampaha", 55, 28);
      doc.setFontSize(10);
      doc.text("HotLine: +94 37 695 4879", 55, 34);
      doc.setFontSize(10);
      doc.text("Email: support@bluepulse.com", 55, 40);
      
      autoTable(doc, {
        head: [['Order ID', 'Customer Email', 'Total Amount', 'Status', 'Date','Payment']],
        body: filteredOrders.map(order => [
          order._id.substring(0, 8),
          order.email,
          `$${order.totalAmount.toFixed(2)}`,
          order.status,
          format(new Date(), 'yyyy-MM-dd'),
          orderMessages[order._id].text
        ]),
        startY: 50,
      });
      
      doc.save("order_report.pdf");
    };
    
    reader.readAsDataURL(blob);
  };

  // Filter orders based on search and status
  const filteredOrders = orders
    .filter(order => 
      order.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order._id?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(order => 
      statusFilter === "all" || order.status.toLowerCase() === statusFilter.toLowerCase()
    )
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  if (loading) {
    return (
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Order Management</h1>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-12 bg-gray-100 rounded"></div>
            ))}
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Order Management</h1>
        </div>
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
          <div className="flex">
            <div className="flex-shrink-0">
              <FaTimesCircle className="h-5 w-5 text-red-500" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">Error: {error}</p>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 p-8 overflow-y-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold text-gray-800">Order Management</h1>
        <div className="flex gap-3">
          <button
            onClick={downloadPDF}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition flex items-center gap-2"
          >
            <FaPrint /> Generate Report
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {/* Total Orders */}
        <div className="bg-white p-6 rounded-xl shadow border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Orders</p>
              <p className="text-2xl font-bold text-gray-800">{orders.length}</p>
            </div>
            <FaBox className="text-blue-500 text-2xl" />
          </div>
        </div>

        {/* Completed Orders */}
        <div className="bg-white p-6 rounded-xl shadow border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Completed</p>
              <p className="text-2xl font-bold text-gray-800">
                {orders.filter(o => o.status === 'Completed').length}
              </p>
            </div>
            <FaCheckCircle className="text-green-500 text-2xl" />
          </div>
        </div>

        {/* Pending Orders */}
        <div className="bg-white p-6 rounded-xl shadow border-l-4 border-yellow-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Pending</p>
              <p className="text-2xl font-bold text-gray-800">
                {orders.filter(o => o.status === 'Pending').length}
              </p>
            </div>
            <FaTimesCircle className="text-yellow-500 text-2xl" />
          </div>
        </div>

        {/* Cancelled Orders */}
        <div className="bg-white p-6 rounded-xl shadow border-l-4 border-red-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Cancelled</p>
              <p className="text-2xl font-bold text-gray-800">
                {orders.filter(o => o.status === 'Cancelled').length}
              </p>
            </div>
            <FaTimesCircle className="text-red-500 text-2xl" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-xl shadow mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search by Order ID or Email"
              className="pl-10 w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaFilter className="text-gray-400" />
            </div>
            <select
              className="pl-10 w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
          
          <div className="flex items-center justify-end">
            <span className="text-sm text-gray-500">
              Showing {filteredOrders.length} of {orders.length} orders
            </span>
          </div>
        </div>
      </div>

      {/* Cancel Order Modal */}
      {cancelModal.isOpen && (
        <div className="fixed inset-0 left-290 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
            <h3 className="text-lg font-medium mb-4">Cancel Order</h3>
            <p className="text-sm text-gray-600 mb-4">
              Please provide a reason for cancellation:
            </p>
            <textarea
              className="w-full p-2 border border-gray-300 rounded-lg mb-4"
              placeholder="Enter cancellation reason..."
              value={cancelModal.message}
              onChange={(e) => setCancelModal(prev => ({
                ...prev,
                message: e.target.value
              }))}
              rows={3}
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setCancelModal({ isOpen: false, orderId: null, message: "" })}
                className="px-4 py-2 bg-gray-300 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  updateOrderStatus(
                    cancelModal.orderId, 
                    'Cancelled',
                    cancelModal.message || "Order was cancelled"
                  );
                  setCancelModal({ isOpen: false, orderId: null, message: "" });
                }}
                className="px-4 py-2 bg-red-600 text-white rounded-lg"
              >
                Confirm Cancellation
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Orders Table */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xl text-gray-500 uppercase tracking-wider">Order ID</th>
                <th className="px-6 py-3 text-left text-xl text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-3 text-left text-xl text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xl text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xl text-gray-500 uppercase tracking-wider">Payment Status</th>
                <th className="px-6 py-3 text-left text-xl text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
                  <React.Fragment key={order._id}>
                    <tr className={`hover:bg-gray-50 transition-all ${
                      highlightedOrders.includes(order._id) ? 
                        'bg-green-100 border-l-4 border-green-500' : 
                        ''
                    }`}>
                      <td className="px-6 py-4 whitespace-nowrap text-medium font-medium text-gray-900">
                        #{order._id}
                        {highlightedOrders.includes(order._id) && (
                          <span className="ml-2 text-xs text-blue-600">
                            (Updated!)
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-medium text-gray-500">
                        {order.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-medium text-gray-500">
                        ${order.totalAmount.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col">
                        <span className={`
                          px-3 py-1 inline-flex items-center text-sm font-medium rounded-full 
                          transition-all duration-200 ease-in-out
                          ${order.status === 'Completed' ? 
                            'bg-green-50 text-green-700 ring-1 ring-green-600/20' :
                            order.status === 'Pending' ? 
                            'bg-amber-50 text-amber-700 ring-1 ring-amber-600/20' :
                            'bg-red-50 text-red-700 ring-1 ring-red-600/20'
                          }
                        `}>
                          {/* Status icon based on state */}
                          {order.status === 'Completed' ? (
                            <svg className="w-3 h-3 mr-1.5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          ) : order.status === 'Pending' ? (
                            <svg className="w-3 h-3 mr-1.5 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                            </svg>
                          ) : (
                            <svg className="w-3 h-3 mr-1.5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                          )}
                          {order.status}
                        </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col">
                          {orderMessages[order._id] && (
                            <div className="mt-1 flex items-center gap-1.5">
                              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                              <span className="text-xl font-medium text-gray-600">
                                {orderMessages[order._id].text}
                              </span>
                              <span className="text-xl text-gray-400">
                                {format(new Date(orderMessages[order._id].timestamp), 'h:mm a')}
                              </span>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-medium font-medium flex gap-2">
                        <button
                          onClick={() => setExpandedOrder(expandedOrder === order._id ? null : order._id)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          {expandedOrder === order._id ? <FaAngleUp /> : <FaAngleDown />}
                        </button>
                        {order.status === 'Pending' && (
                          <>
                            <button
                              onClick={() => updateOrderStatus(order._id, 'Completed')}
                              className="text-green-600 hover:text-green-900"
                              title="Complete Order"
                            >
                              <FaCheck />
                            </button>
                            <button
                              onClick={() => setCancelModal({
                              isOpen: true,
                              orderId: order._id,
                              message: ""
                              })}
                              className="text-red-600 hover:text-red-900"
                              title="Cancel Order"
                            >
                              <FaTimes />
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => {
                            // Remove message when deleting order
                            const updatedMessages = { ...orderMessages };
                            delete updatedMessages[order._id];
                            setOrderMessages(updatedMessages);
                            localStorage.setItem('orderMessages', JSON.stringify(updatedMessages));
                            deleteOrder(order._id);
                          }}
                          className="text-red-600 hover:text-red-900"
                          title="Delete Order"
                        >
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                    {expandedOrder === order._id && (
                      <tr>
                        <td colSpan="6" className="px-6 py-4 bg-gray-50">
                          <div className="space-y-4">
                            <h4 className="font-medium text-gray-900">Order Details</h4>
                            <div className="border rounded-lg overflow-hidden">
                              <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-100">
                                  <tr>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {order.products.map((product, idx) => (
                                    <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{product.productName}</td>
                                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">{product.quantity}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                            <div className="flex justify-between items-center">
                              <div>
                                <p className="text-sm text-gray-500">Transaction ID: {order.transactionId}</p>
                                {(orderMessages[order._id] || highlightedOrders.includes(order._id)) && (
                                  <p className="text-xs text-blue-600 mt-1">
                                    {orderMessages[order._id]?.text ? 'Updated: ' + new Date(orderMessages[order._id].timestamp).toLocaleString() : 'Status recently updated'}
                                  </p>
                                )}
                              </div>
                              <div className="text-right">
                                <p className="text-sm font-medium text-gray-900">Total: ${order.totalAmount.toFixed(2)}</p>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
                    No orders found matching your criteria
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
};

export default OrderManagement;