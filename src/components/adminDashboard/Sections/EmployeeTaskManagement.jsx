import React, { useState } from 'react';

const EmployeeTaskManagement = () => {
  // Sample data for service types, services, and employees
  const serviceTypes = [
    { id: 1, name: 'Filtration' },
    { id: 2, name: 'Chemical Treatment' },
    { id: 3, name: 'Maintenance' },
  ];

  const services = [
    { id: 1, name: 'Filter Replacement', typeId: 1, requiredRole: 'Technician' },
    { id: 2, name: 'Chemical Dosing', typeId: 2, requiredRole: 'Chemist' },
    { id: 3, name: 'System Calibration', typeId: 3, requiredRole: 'Engineer' },
    { id: 4, name: 'Membrane Cleaning', typeId: 1, requiredRole: 'Technician' },
  ];

  const employees = [
    { id: 1, name: 'John Doe', role: 'Technician' },
    { id: 2, name: 'Jane Smith', role: 'Chemist' },
    { id: 3, name: 'Alice Johnson', role: 'Engineer' },
    { id: 4, name: 'Bob Brown', role: 'Technician' },
  ];

  // State to manage the current view
  const [currentView, setCurrentView] = useState('viewTasks'); // 'viewTasks' or 'assignTasks'
  const [selectedServiceType, setSelectedServiceType] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [searchQuery, setSearchQuery] = useState(''); // State for search input

  // Handle task assignment
  const handleAssignTask = (e) => {
    e.preventDefault();
    if (selectedService && selectedEmployee) {
      alert(`Task "${selectedService.name}" has been assigned to ${selectedEmployee.name}.`);
      setSelectedServiceType(null);
      setSelectedService(null);
      setSelectedEmployee(null);
    } else {
      alert('Please select a service and an employee.');
    }
  };

  // Filter tasks based on the search query
  const filteredTasks = services.filter((service) =>
    service.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Get services relevant to the selected service type
  const relevantServices = selectedServiceType
    ? services.filter((service) => service.typeId === selectedServiceType.id)
    : [];

  // Get employees with the required role for the selected service
  const relevantEmployees = selectedService
    ? employees.filter((employee) => employee.role === selectedService.requiredRole)
    : [];

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-4xl">
        <h1 className="text-2xl font-bold mb-6 text-center text-blue-600">Employee Task Management System</h1>

        {/* Tiles for Navigation */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <button
            onClick={() => setCurrentView('viewTasks')}
            className={`p-6 rounded-lg shadow-md text-center ${
              currentView === 'viewTasks' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            <h2 className="text-lg font-semibold">View Employee Tasks</h2>
          </button>
          <button
            onClick={() => setCurrentView('assignTasks')}
            className={`p-6 rounded-lg shadow-md text-center ${
              currentView === 'assignTasks' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            <h2 className="text-lg font-semibold">Assign Tasks to Employees</h2>
          </button>
        </div>

        {/* View Employee Tasks */}
        {currentView === 'viewTasks' && (
          <div>
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Employee Tasks</h2>
            {/* Search Input */}
            <div className="mb-4">
              <input
                type="text"
                placeholder="Search by service name"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            {/* Task List */}
            <div className="space-y-4">
              {filteredTasks.length > 0 ? (
                filteredTasks.map((service) => (
                  <div key={service.id} className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">
                      <strong>Service:</strong> {service.name}
                    </p>
                    <p className="text-sm text-gray-600">
                      <strong>Type:</strong> {serviceTypes.find((type) => type.id === service.typeId)?.name}
                    </p>
                    <p className="text-sm text-gray-600">
                      <strong>Required Role:</strong> {service.requiredRole}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-600">No services found.</p>
              )}
            </div>
          </div>
        )}

        {/* Assign Tasks to Employees */}
        {currentView === 'assignTasks' && (
          <div>
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Assign Tasks</h2>
            <form onSubmit={handleAssignTask} className="space-y-4">
              {/* Step 1: Select Service Type */}
              <div>
                <label htmlFor="serviceType" className="block text-sm font-medium text-gray-700">
                  Select Service Type:
                </label>
                <select
                  id="serviceType"
                  value={selectedServiceType ? selectedServiceType.id : ''}
                  onChange={(e) => {
                    const typeId = parseInt(e.target.value, 10);
                    const type = serviceTypes.find((t) => t.id === typeId);
                    setSelectedServiceType(type);
                    setSelectedService(null); // Reset selected service when type changes
                  }}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">Select a service type</option>
                  {serviceTypes.map((type) => (
                    <option key={type.id} value={type.id}>
                      {type.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Step 2: Select Service */}
              {selectedServiceType && (
                <div>
                  <label htmlFor="service" className="block text-sm font-medium text-gray-700">
                    Select Service:
                  </label>
                  <select
                    id="service"
                    value={selectedService ? selectedService.id : ''}
                    onChange={(e) => {
                      const serviceId = parseInt(e.target.value, 10);
                      const service = services.find((s) => s.id === serviceId);
                      setSelectedService(service);
                      setSelectedEmployee(null); // Reset selected employee when service changes
                    }}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="">Select a service</option>
                    {relevantServices.map((service) => (
                      <option key={service.id} value={service.id}>
                        {service.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Step 3: Select Employee */}
              {selectedService && (
                <div>
                  <label htmlFor="employee" className="block text-sm font-medium text-gray-700">
                    Select Employee ({selectedService.requiredRole}):
                  </label>
                  <select
                    id="employee"
                    value={selectedEmployee ? selectedEmployee.id : ''}
                    onChange={(e) => {
                      const employeeId = parseInt(e.target.value, 10);
                      const employee = employees.find((e) => e.id === employeeId);
                      setSelectedEmployee(employee);
                    }}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="">Select an employee</option>
                    {relevantEmployees.map((employee) => (
                      <option key={employee.id} value={employee.id}>
                        {employee.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Submit Button */}
              {selectedService && selectedEmployee && (
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Assign Task
                </button>
              )}
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeTaskManagement;