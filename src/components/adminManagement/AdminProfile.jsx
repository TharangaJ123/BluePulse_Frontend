import React, { useState } from 'react';
import Modal from '../common/Modal';

const AdminProfile = () => {
  const [showModal, setShowModal] = useState({
    isOpen: false,
    type: 'info',
    title: '',
    message: ''
  });

  const showModalMessage = (type, title, message) => {
    setShowModal({
      isOpen: true,
      type,
      title,
      message
    });
  };

  const handleImageUpload = async () => {
    if (!selectedImage) {
      showModalMessage('error', 'Error', 'Please select an image to upload.');
      return;
    }

    try {
      const response = await fetch(`http://localhost:8070/User/users/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ profile_image: selectedImage }),
      });

      if (!response.ok) {
        throw new Error("Failed to update profile image.");
      }

      const updatedUser = await response.json();
      setFormData(prev => ({ ...prev, profile_image: selectedImage }));
      showModalMessage('success', 'Success', 'Profile image updated successfully!');
    } catch (error) {
      console.error("Error updating profile image:", error);
      showModalMessage('error', 'Error', 'Failed to update profile image. Please try again.');
    }
  };

  const handleSubmit = async () => {
    if (!formData.full_name || !formData.email) {
      showModalMessage('error', 'Error', 'Full Name and Email are required.');
      return;
    }

    try {
      const response = await fetch(`http://localhost:8070/User/users/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to update user data.");
      }

      const updatedUser = await response.json();
      setError("");
      showModalMessage('success', 'Success', 'Profile updated successfully!');
    } catch (error) {
      console.error("Error updating user data:", error);
      showModalMessage('error', 'Error', 'Failed to update user data. Please try again.');
    }
  };

  const handleDeleteAccount = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete your account? This action cannot be undone.");
    if (confirmDelete) {
      try {
        const response = await fetch(`http://localhost:8070/User/users/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: "inactive" }),
        });

        if (!response.ok) {
          throw new Error("Failed to update account status.");
        }

        const updatedUser = await response.json();
        showModalMessage('success', 'Success', 'Account status updated to inactive.');
        setFormData(prev => ({ ...prev, status: "inactive" }));
      } catch (error) {
        console.error("Error updating account status:", error);
        showModalMessage('error', 'Error', 'Failed to update account status. Please try again.');
      }
    }
  };

  return (
    <>
      {/* Your existing JSX */}
      
      <Modal
        isOpen={showModal.isOpen}
        onClose={() => setShowModal({ ...showModal, isOpen: false })}
        title={showModal.title}
        message={showModal.message}
        type={showModal.type}
      />
    </>
  );
};

export default AdminProfile; 