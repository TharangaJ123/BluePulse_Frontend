import React, { useState, useEffect } from 'react';
import { FaRegCheckCircle, FaEnvelope, FaPhoneAlt, FaCalendarAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import NavigationBar from './NavigationBar';
import Footer from './Footer';

// Custom hook for form handling
const useForm = (initialState, validate) => {
  const [formData, setFormData] = useState(initialState);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const validateForm = () => {
    const formErrors = validate(formData);
    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  return { formData, errors, handleChange, validateForm, setFormData };
};

// Reusable Input Component
const InputField = ({ name, label, type, value, placeholder, icon, error, onChange, options }) => {
  return (
    <div className="form-group">
      <label htmlFor={name} className="flex items-center mb-1">
        {icon} <span className="ml-2">{label}</span>
      </label>
      {type === 'select' ? (
        <select
          id={name}
          name={name}
          className={`w-full p-2 border rounded-md ${error ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
          value={value}
          onChange={onChange}
          required
        >
          <option value="">Choose a service</option>
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      ) : (
        <input
          type={type}
          id={name}
          name={name}
          className={`w-full p-2 border rounded-md ${error ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          aria-label={label}
          required
        />
      )}
      {error && <span className="text-red-500 text-sm">{error}</span>}
    </div>
  );
};

// Main Component
const ServiceRequest = () => {
  const initialState = {
    fullName: '',
    email: '',
    phone: '',
    service: '',
    preferredDate: '',
    preferredTime: '',
    notes: '',
    termsAccepted: false,
  };

  const validate = (data) => {
    const errors = {};
    if (!data.fullName) errors.fullName = 'Full name is required.';
    if (!data.email) errors.email = 'Email is required.';
    if (!data.phone) errors.phone = 'Phone number is required.';
    if (!data.service) errors.service = 'Please select a service.';
    if (!data.preferredDate) errors.preferredDate = 'Preferred date is required.';
    if (!data.preferredTime) errors.preferredTime = 'Preferred time is required.';
    if (!data.termsAccepted) errors.termsAccepted = 'You must agree to the terms and conditions.';
    return errors;
  };

  const { formData, errors, handleChange, validateForm, setFormData } = useForm(initialState, validate);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState(null);

  useEffect(() => {
    if (submissionStatus) {
      const timer = setTimeout(() => setSubmissionStatus(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [submissionStatus]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!validateForm()) {
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:5003/api/services/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error(`Error: ${response.statusText}`);

      setSubmissionStatus('success');
      setFormData(initialState);
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmissionStatus(`error: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const serviceOptions = ['Consultation', 'Water Testing', 'Installation', 'Maintenance'];

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
  
      <NavigationBar/>
      {/* Main Content */}
      <main className="flex-grow container mx-auto px-6 py-8">
        <div className="bg-white p-8 max-w-4xl mx-auto">
          <h2 className="text-3xl font-semibold text-blue-600 text-center mb-6">Request Our Services</h2>

          {submissionStatus && (
            <div className={`mb-6 p-4 rounded-lg ${submissionStatus === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {submissionStatus === 'success' ? 'Form submitted successfully!' : submissionStatus}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { name: 'fullName', label: 'Full Name', icon: <FaRegCheckCircle />, type: 'text', placeholder: 'Enter your full name' },
                { name: 'email', label: 'Email', icon: <FaEnvelope />, type: 'email', placeholder: 'Enter your email' },
                { name: 'phone', label: 'Phone', icon: <FaPhoneAlt />, type: 'tel', placeholder: 'Enter your phone number' },
                { name: 'service', label: 'Select Service', icon: <FaCalendarAlt />, type: 'select' },
              ].map((field) => (
                <InputField
                  key={field.name}
                  {...field}
                  value={formData[field.name]}
                  error={errors[field.name]}
                  onChange={handleChange}
                  options={field.type === 'select' ? serviceOptions : undefined}
                />
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField
                name="preferredDate"
                label="Preferred Date"
                type="date"
                value={formData.preferredDate}
                error={errors.preferredDate}
                onChange={handleChange}
              />
              <InputField
                name="preferredTime"
                label="Preferred Time"
                type="time"
                value={formData.preferredTime}
                error={errors.preferredTime}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="notes" className="form-label">Additional Notes (Optional)</label>
              <textarea
                id="notes"
                name="notes"
                className="w-full p-2 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Any additional information or requests"
                value={formData.notes}
                onChange={handleChange}
              />
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="termsAccepted"
                name="termsAccepted"
                className="checkbox-input"
                checked={formData.termsAccepted}
                onChange={handleChange}
                required
              />
              <label htmlFor="termsAccepted" className="text-sm text-gray-700">
                I agree to the terms and conditions
              </label>
            </div>

            <button
              type="submit"
              className={`w-full bg-blue-600 text-white py-3 rounded-lg ${isSubmitting ? 'opacity-50' : 'hover:bg-blue-700'} transition duration-300`}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Request'}
            </button>
          </form>
        </div>
      </main>
      <Footer/>
    
    </div>
  );
};

export default ServiceRequest;