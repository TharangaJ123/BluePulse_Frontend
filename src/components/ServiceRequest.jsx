import React, { useState, useEffect } from 'react';
import { FaRegCheckCircle, FaEnvelope, FaPhoneAlt, FaCalendarAlt, FaClock, FaNotesMedical, FaArrowRight } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import ModernFooter from './Footer';
import NavigationBar from './NavigationBar';

// Custom hook for form handling
const useForm = (initialState, validate) => {
  const [formData, setFormData] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value,
    }));

    // Mark field as touched
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));
    
    // Validate just this field
    const fieldErrors = validate({...formData});
    setErrors(prev => ({
      ...prev,
      [name]: fieldErrors[name]
    }));
  };

  const validateForm = () => {
    const formErrors = validate(formData);
    setErrors(formErrors);
    // Mark all fields as touched when submitting
    const allTouched = Object.keys(formData).reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {});
    setTouched(allTouched);
    return Object.keys(formErrors).length === 0;
  };

  return { formData, errors, touched, handleChange, handleBlur, validateForm, setFormData };
};

// Reusable Input Component
const InputField = ({ name, label, type, value, placeholder, icon, error, onChange, onBlur, touched, options, required = true }) => {
  return (
    <div>
    <div className="form-group mb-4">
      <label htmlFor={name} className="flex items-center text-gray-700 font-medium mb-2">
        {icon && <span className="text-blue-500 mr-2">{icon}</span>}
        <span>{label}</span>
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {type === 'select' ? (
        <div className="relative">
          <select
            id={name}
            name={name}
            className={`w-full p-3 border rounded-lg ${touched && error ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white appearance-none`}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            required={required}
          >
            <option value="">Choose a service</option>
            {options.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
            </svg>
          </div>
        </div>
      ) : type === 'textarea' ? (
        <textarea
          id={name}
          name={name}
          className={`w-full p-3 border rounded-lg ${touched && error ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-24`}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          required={required}
        />
      ) : (
        <input
          type={type}
          id={name}
          name={name}
          className={`w-full p-3 border rounded-lg ${touched && error ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          aria-label={label}
          required={required}
        />
      )}
      {touched && error && (
        <div className="flex items-center mt-1 text-red-500 text-sm">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          {error}
        </div>
      )}
    </div>
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
    if (!data.fullName) errors.fullName = 'Full name is required';
    if (!data.email) errors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(data.email)) errors.email = 'Email is invalid';
    
    if (!data.phone) errors.phone = 'Phone number is required';
    else if (!/^\d{10}$/.test(data.phone.replace(/[^\d]/g, ''))) 
      errors.phone = 'Please enter a valid 10-digit phone number';
    
    if (!data.service) errors.service = 'Please select a service';
    if (!data.preferredDate) errors.preferredDate = 'Preferred date is required';
    else {
      const selectedDate = new Date(data.preferredDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (selectedDate < today) {
        errors.preferredDate = 'Date cannot be in the past';
      }
    }
    
    if (!data.preferredTime) errors.preferredTime = 'Preferred time is required';
    if (!data.termsAccepted) errors.termsAccepted = 'You must agree to the terms and conditions';
    return errors;
  };

  const { formData, errors, touched, handleChange, handleBlur, validateForm, setFormData } = useForm(initialState, validate);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [formProgress, setFormProgress] = useState(0);

  useEffect(() => {
    if (submissionStatus) {
      const timer = setTimeout(() => setSubmissionStatus(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [submissionStatus]);

  useEffect(() => {
    // Calculate form completion percentage
    const totalFields = Object.keys(initialState).length;
    const filledFields = Object.entries(formData).filter(([key, value]) => {
      if (key === 'termsAccepted') return value === true;
      if (key === 'notes') return true; // Notes are optional
      return value !== '';
    }).length;
    
    setFormProgress(Math.round((filledFields / totalFields) * 100));
  }, [formData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!validateForm()) {
      setIsSubmitting(false);
      return;
    }

    try {
      // Simulate API request delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const response = await fetch('http://localhost:8070/api/services/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error(`Error: ${response.statusText}`);

      setSubmissionStatus('success');
      setFormData(initialState);
      window.scrollTo(0, 0);
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmissionStatus(`error: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => {
    // Validate current step fields
    let canProceed = true;
    const currentStepErrors = {};
    
    if (currentStep === 1) {
      ['fullName', 'email', 'phone', 'service'].forEach(field => {
        const error = validate({...formData})[field];
        if (error) {
          currentStepErrors[field] = error;
          canProceed = false;
        }
      });
    }
    
    if (!canProceed) {
      setErrors(prev => ({...prev, ...currentStepErrors}));
      // Mark relevant fields as touched
      const touchedFields = {};
      Object.keys(currentStepErrors).forEach(key => {
        touchedFields[key] = true;
      });
      setTouched(prev => ({...prev, ...touchedFields}));
      return;
    }
    
    setCurrentStep(2);
    window.scrollTo(0, 0);
  };

  const prevStep = () => {
    setCurrentStep(1);
    window.scrollTo(0, 0);
  };

  const serviceOptions = [
    'Water Quality Testing',
    'Water Filter Installation',
    'Water Softener System',
    'Plumbing Consultation',
    'Maintenance & Repair',
    'Emergency Service'
  ];

  // Format the current date as YYYY-MM-DD for min date attribute
  const today = new Date().toISOString().split('T')[0];

  return (
    <div>
      <NavigationBar/>
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          {/* Header with progress indicator */}
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold text-blue-800 mb-3">Schedule Water Service</h2>
            <p className="text-gray-600 mb-6">Complete the form below to request our professional water services</p>
            
            {/* Progress bar */}
            <div className="relative pt-1 mb-6">
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm font-medium text-blue-700">{formProgress}% Completed</div>
              </div>
              <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-100">
                <div style={{ width: `${formProgress}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500 transition-all duration-500 ease-in-out"></div>
              </div>
            </div>
            
            {/* Step indicator */}
            <div className="flex justify-center mb-6">
              <div className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep === 1 ? 'bg-blue-600 text-white' : 'bg-blue-200'}`}>1</div>
                <div className="h-1 w-10 bg-blue-200 mx-2"></div>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep === 2 ? 'bg-blue-600 text-white' : 'bg-blue-200'}`}>2</div>
              </div>
            </div>
          </div>

          {/* Success message */}
          {submissionStatus === 'success' && (
            <div className="bg-green-50 border-l-4 border-green-500 p-6 rounded-lg shadow-md mb-8 animate-fade-in">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-12 w-12 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <h3 className="text-xl font-medium text-green-800">Request Submitted Successfully!</h3>
                  <p className="mt-2 text-green-700">
                    Thank you for your submission. We'll contact you shortly to confirm your appointment.
                  </p>
                  <div className="mt-4">
                    <Link to="/" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                      Return to Home
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Error message */}
          {submissionStatus && submissionStatus !== 'success' && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg shadow-md mb-8">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">
                    {submissionStatus}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Main Form Card */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden transition-all">
            {/* Form Header */}
            <div className="bg-blue-600 px-6 py-4">
              <h3 className="text-xl font-medium text-white">
                {currentStep === 1 ? 'Contact Information' : 'Schedule Service'}
              </h3>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
              {/* Step 1: Contact Information */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <InputField
                    name="fullName"
                    label="Full Name"
                    icon={<FaRegCheckCircle />}
                    type="text"
                    placeholder="Enter your full name"
                    value={formData.fullName}
                    error={errors.fullName}
                    touched={touched.fullName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  <InputField
                    name="email"
                    label="Email Address"
                    icon={<FaEnvelope />}
                    type="email"
                    placeholder="your.email@example.com"
                    value={formData.email}
                    error={errors.email}
                    touched={touched.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  <InputField
                    name="phone"
                    label="Phone Number"
                    icon={<FaPhoneAlt />}
                    type="tel"
                    placeholder="(123) 456-7890"
                    value={formData.phone}
                    error={errors.phone}
                    touched={touched.phone}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  <InputField
                    name="service"
                    label="Select Service"
                    icon={<FaNotesMedical />}
                    type="select"
                    value={formData.service}
                    error={errors.service}
                    touched={touched.service}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    options={serviceOptions}
                  />
                </div>
              )}

              {/* Step 2: Schedule */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <InputField
                    name="preferredDate"
                    label="Preferred Date"
                    icon={<FaCalendarAlt />}
                    type="date"
                    value={formData.preferredDate}
                    error={errors.preferredDate}
                    touched={touched.preferredDate}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    min={today}
                  />
                  <InputField
                    name="preferredTime"
                    label="Preferred Time"
                    icon={<FaClock />}
                    type="time"
                    value={formData.preferredTime}
                    error={errors.preferredTime}
                    touched={touched.preferredTime}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  <InputField
                    name="notes"
                    label="Additional Notes"
                    icon={<FaNotesMedical />}
                    type="textarea"
                    placeholder="Please share any details that might help us prepare for your service"
                    value={formData.notes}
                    error={errors.notes}
                    touched={touched.notes}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required={false}
                  />
                  
                  <div className="mt-6">
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="termsAccepted"
                          name="termsAccepted"
                          type="checkbox"
                          className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                          checked={formData.termsAccepted}
                          onChange={handleChange}
                          onBlur={handleBlur}
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="termsAccepted" className="font-medium text-gray-700">
                          I agree to the terms and conditions
                        </label>
                        <p className="text-gray-500">By selecting this, you agree to our <a href="#" className="text-blue-600 hover:underline">Terms of Service</a> and <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a>.</p>
                        {touched.termsAccepted && errors.termsAccepted && (
                          <p className="mt-1 text-red-500">{errors.termsAccepted}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="mt-8 flex justify-between items-center">
                {currentStep === 1 ? (
                  <>
                    <div></div> {/* Empty div for spacing */}
                    <button
                      type="button"
                      onClick={nextStep}
                      className="flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                    >
                      Next Step <FaArrowRight className="ml-2" />
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={prevStep}
                      className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      className={`px-6 py-3 bg-blue-600 text-white rounded-lg ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'} focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors flex items-center`}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Processing...
                        </>
                      ) : (
                        'Submit Request'
                      )}
                    </button>
                  </>
                )}
              </div>

              {/* Admin Link */}
              <div className="mt-6 text-center">
                <Link to="/ServiceRequest/ServiceReqAdmin" className="text-blue-600 hover:text-blue-800 text-sm">
                  Administrator Access
                </Link>
              </div>
            </form>
          </div>

          {/* Service Details */}
          {formData.service && (
            <div className="mt-8 bg-blue-50 rounded-lg p-6 border border-blue-100">
              <h3 className="text-lg font-medium text-blue-800 mb-3">About {formData.service}</h3>
              <p className="text-gray-700 mb-4">
                {formData.service === 'Water Quality Testing' && 
                  "Our comprehensive water quality testing analyzes your water for contaminants, minerals, and pH levels to ensure it's safe for your household."}
                {formData.service === 'Water Filter Installation' && 
                  "Professional installation of high-quality water filtration systems tailored to your specific water quality needs and home requirements."}
                {formData.service === 'Water Softener System' && 
                  "Complete installation and setup of water softening systems to reduce hardness, prevent scale buildup, and extend the life of your appliances."}
                {formData.service === 'Plumbing Consultation' && 
                  "Expert assessment of your current plumbing system with recommendations for improvements, repairs, or maintenance."}
                {formData.service === 'Maintenance & Repair' && 
                  "Skilled technicians to diagnose and fix issues with your existing water treatment systems and plumbing."}
                {formData.service === 'Emergency Service' && 
                  "Rapid response service for urgent water quality or plumbing issues that require immediate attention."}
              </p>
              <div className="flex items-center text-blue-700">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm">Service takes approximately 1-2 hours</span>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
    <ModernFooter/>
    </div>
  );
};

export default ServiceRequest;