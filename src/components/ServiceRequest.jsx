import React, { useState } from 'react'; // Import React and useState
import { FaRegCheckCircle, FaEnvelope, FaPhoneAlt, FaCalendarAlt } from 'react-icons/fa'; // Import necessary icons

import '../styles/styles.css'; // Import custom styles

const ServiceRequest = () => {
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    service: '',
    preferred_date: '',
    preferred_time: '',
    notes: '',
    notify_method: '',
    terms_agreed: false,
  });

  const [errors, setErrors] = useState({}); // State for tracking form validation errors
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    let formErrors = {};
    if (!formData.full_name) formErrors.full_name = "Full name is required.";
    if (!formData.email) formErrors.email = "Email is required.";
    if (!formData.phone) formErrors.phone = "Phone number is required.";
    if (!formData.service) formErrors.service = "Please select a service.";
    if (!formData.preferred_date) formErrors.preferred_date = "Preferred date is required.";
    if (!formData.preferred_time) formErrors.preferred_time = "Preferred time is required.";
    if (!formData.terms_agreed) formErrors.terms_agreed = "You must agree to the terms and conditions.";

    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    if (validateForm()) {
      console.log(formData);
      // Handle successful form submission
    } else {
      setIsSubmitting(false);
    }
  };

  return (
    <div 
      className="flex justify-center items-center min-h-screen px-6 py-10"
      style={{ backgroundImage: 'url(/images/bgimage.jpg)', backgroundSize: 'cover', backgroundPosition: 'center center', backgroundRepeat: 'no-repeat' }}
    >
      <div className="bg-white p-8 rounded-3xl shadow-xl max-w-lg w-full border border-blue-300">
        <h1 className="text-3xl font-semibold text-blue-600 text-center mb-8">
          Request Our Services
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Full Name */}
          <div className={`form-group ${errors.full_name ? 'has-error' : ''}`}>
            <label htmlFor="full_name" className="form-label">
              <FaRegCheckCircle className="inline-block mr-2 text-blue-600" />
              Full Name
            </label>
            <input
              type="text"
              id="full_name"
              name="full_name"
              className={`form-input ${errors.full_name ? 'input-error' : ''}`}
              placeholder="Enter your full name"
              value={formData.full_name}
              onChange={handleChange}
              required
            />
            {errors.full_name && <span className="error-text">{errors.full_name}</span>}
          </div>

          {/* Email */}
          <div className={`form-group ${errors.email ? 'has-error' : ''}`}>
            <label htmlFor="email" className="form-label">
              <FaEnvelope className="inline-block mr-2 text-blue-600" />
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className={`form-input ${errors.email ? 'input-error' : ''}`}
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            {errors.email && <span className="error-text">{errors.email}</span>}
          </div>

          {/* Phone */}
          <div className={`form-group ${errors.phone ? 'has-error' : ''}`}>
            <label htmlFor="phone" className="form-label">
              <FaPhoneAlt className="inline-block mr-2 text-blue-600" />
              Phone
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              className={`form-input ${errors.phone ? 'input-error' : ''}`}
              placeholder="Enter your phone number"
              value={formData.phone}
              onChange={handleChange}
              required
            />
            {errors.phone && <span className="error-text">{errors.phone}</span>}
          </div>

          {/* Service Type */}
          <div className={`form-group ${errors.service ? 'has-error' : ''}`}>
            <label htmlFor="service" className="form-label">
              <FaCalendarAlt className="inline-block mr-2 text-blue-600" />
              Select Service
            </label>
            <select
              id="service"
              name="service"
              className={`form-select ${errors.service ? 'input-error' : ''}`}
              value={formData.service}
              onChange={handleChange}
              required
            >
              <option value="">Choose a service</option>
              <option value="Consultation">Consultation</option>
              <option value="Water Testing">Water Testing</option>
              <option value="Installation">Installation</option>
              <option value="Maintenance">Maintenance</option>
            </select>
            {errors.service && <span className="error-text">{errors.service}</span>}
          </div>

          {/* Preferred Date */}
          <div className={`form-group ${errors.preferred_date ? 'has-error' : ''}`}>
            <label htmlFor="preferred_date" className="form-label">
              Preferred Date
            </label>
            <input
              type="date"
              id="preferred_date"
              name="preferred_date"
              className={`form-input ${errors.preferred_date ? 'input-error' : ''}`}
              value={formData.preferred_date}
              onChange={handleChange}
              required
            />
            {errors.preferred_date && <span className="error-text">{errors.preferred_date}</span>}
          </div>

          {/* Preferred Time */}
          <div className={`form-group ${errors.preferred_time ? 'has-error' : ''}`}>
            <label htmlFor="preferred_time" className="form-label">
              Preferred Time
            </label>
            <input
              type="time"
              id="preferred_time"
              name="preferred_time"
              className={`form-input ${errors.preferred_time ? 'input-error' : ''}`}
              value={formData.preferred_time}
              onChange={handleChange}
              required
            />
            {errors.preferred_time && <span className="error-text">{errors.preferred_time}</span>}
          </div>

          {/* Notes */}
          <div>
            <label htmlFor="notes" className="form-label">
              Additional Notes (Optional)
            </label>
            <textarea
              id="notes"
              name="notes"
              className="form-textarea"
              placeholder="Any additional information or requests"
              value={formData.notes}
              onChange={handleChange}
            />
          </div>

          {/* Notify Method */}
          <div>
            <label htmlFor="notify_method" className="form-label">
              Preferred Notification Method
            </label>
            <select
              id="notify_method"
              name="notify_method"
              className="form-select"
              value={formData.notify_method}
              onChange={handleChange}
              required
            >
              <option value="">Select</option>
              <option value="Email">Email</option>
              <option value="SMS">SMS</option>
              <option value="Phone Call">Phone Call</option>
            </select>
          </div>

          {/* Terms and Conditions */}
          <div className={`flex items-center space-x-2 ${errors.terms_agreed ? 'has-error' : ''}`}>
            <input
              type="checkbox"
              id="terms_agreed"
              name="terms_agreed"
              className="checkbox-input"
              checked={formData.terms_agreed}
              onChange={handleChange}
              required
            />
            <label htmlFor="terms_agreed" className="text-sm text-gray-700">
              I agree to the terms and conditions
            </label>
            {errors.terms_agreed && <span className="error-text">{errors.terms_agreed}</span>}
          </div>

          {/* Submit Button */}
          <div className="text-center">
            <button
              type="submit"
              className={`w-full bg-blue-600 text-white py-3 rounded-lg ${isSubmitting ? 'opacity-50' : 'hover:bg-blue-700'} transition duration-300`}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Request'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ServiceRequest;
