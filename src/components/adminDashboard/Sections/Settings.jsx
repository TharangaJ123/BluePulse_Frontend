import React, { useState, useEffect } from 'react';
import { FaMoon, FaSun, FaBell, FaFont, FaClock, FaSave, FaUndo } from 'react-icons/fa';

const Settings = () => {
  const [settings, setSettings] = useState({
    theme: 'light',
    notifications: {
      email: true,
      system: true,
      updates: true
    },
    fontStyle: 'inter',
    fontSize: 'medium',
    timeFormat: '12h'
  });

  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState({ type: '', text: '' });

  // Load saved settings from localStorage on component mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('adminDashboardSettings');
    if (savedSettings) {
      const parsedSettings = JSON.parse(savedSettings);
      setSettings(parsedSettings);
      // Apply theme immediately
      applyTheme(parsedSettings.theme);
      // Apply font settings
      applyFontSettings(parsedSettings.fontStyle, parsedSettings.fontSize);
    }
  }, []);

  const applyTheme = (theme) => {
    const adminDashboard = document.querySelector('.admin-dashboard');
    if (!adminDashboard) return;

    if (theme === 'dark') {
      adminDashboard.classList.add('dark-theme');
      adminDashboard.style.setProperty('--admin-bg-primary', '#1a1a1a');
      adminDashboard.style.setProperty('--admin-text-primary', '#ffffff');
      adminDashboard.style.setProperty('--admin-bg-secondary', '#2d2d2d');
    } else {
      adminDashboard.classList.remove('dark-theme');
      adminDashboard.style.setProperty('--admin-bg-primary', '#ffffff');
      adminDashboard.style.setProperty('--admin-text-primary', '#1a1a1a');
      adminDashboard.style.setProperty('--admin-bg-secondary', '#f3f4f6');
    }
  };

  const applyFontSettings = (style, size) => {
    const adminDashboard = document.querySelector('.admin-dashboard');
    if (!adminDashboard) return;

    // Apply font family
    adminDashboard.style.setProperty('--admin-font-family', getFontFamily(style));
    // Apply font size
    adminDashboard.style.setProperty('--admin-font-size-base', getFontSize(size));
  };

  const getFontFamily = (style) => {
    switch (style) {
      case 'inter':
        return 'Inter, sans-serif';
      case 'roboto':
        return 'Roboto, sans-serif';
      case 'poppins':
        return 'Poppins, sans-serif';
      default:
        return 'Inter, sans-serif';
    }
  };

  const getFontSize = (size) => {
    switch (size) {
      case 'small':
        return '14px';
      case 'medium':
        return '16px';
      case 'large':
        return '18px';
      default:
        return '16px';
    }
  };

  const handleThemeChange = (theme) => {
    setSettings(prev => ({
      ...prev,
      theme
    }));
    applyTheme(theme);
  };

  const handleNotificationChange = (type) => {
    setSettings(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [type]: !prev.notifications[type]
      }
    }));
  };

  const handleFontStyleChange = (style) => {
    setSettings(prev => ({
      ...prev,
      fontStyle: style
    }));
    applyFontSettings(style, settings.fontSize);
  };

  const handleFontSizeChange = (size) => {
    setSettings(prev => ({
      ...prev,
      fontSize: size
    }));
    applyFontSettings(settings.fontStyle, size);
  };

  const handleTimeFormatChange = (format) => {
    setSettings(prev => ({
      ...prev,
      timeFormat: format
    }));
  };

  const handleSave = () => {
    setIsSaving(true);
    setSaveMessage({ type: '', text: '' });

    // Simulate API call
    setTimeout(() => {
      localStorage.setItem('adminDashboardSettings', JSON.stringify(settings));
      setIsSaving(false);
      setSaveMessage({ type: 'success', text: 'Settings saved successfully!' });
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSaveMessage({ type: '', text: '' });
      }, 3000);
    }, 1000);
  };

  const handleReset = () => {
    const defaultSettings = {
      theme: 'light',
      notifications: {
        email: true,
        system: true,
        updates: true
      },
      fontStyle: 'inter',
      fontSize: 'medium',
      timeFormat: '12h'
    };
    setSettings(defaultSettings);
    applyTheme(defaultSettings.theme);
    applyFontSettings(defaultSettings.fontStyle, defaultSettings.fontSize);
    setSaveMessage({ type: 'info', text: 'Settings reset to default values' });
  };

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Admin Dashboard Settings</h1>

        {/* Save Message */}
        {saveMessage.text && (
          <div className={`mb-6 p-4 rounded-lg ${
            saveMessage.type === 'success' ? 'bg-green-50 text-green-600' :
            saveMessage.type === 'error' ? 'bg-red-50 text-red-600' :
            'bg-blue-50 text-blue-600'
          }`}>
            {saveMessage.text}
          </div>
        )}

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Theme Settings */}
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <FaSun className="mr-2" /> Dashboard Theme
            </h2>
            <div className="flex space-x-4">
              <button
                onClick={() => handleThemeChange('light')}
                className={`px-4 py-2 rounded-lg flex items-center ${
                  settings.theme === 'light'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <FaSun className="mr-2" /> Light
              </button>
              <button
                onClick={() => handleThemeChange('dark')}
                className={`px-4 py-2 rounded-lg flex items-center ${
                  settings.theme === 'dark'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <FaMoon className="mr-2" /> Dark
              </button>
            </div>
          </div>

          {/* Font Settings */}
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <FaFont className="mr-2" /> Dashboard Font Settings
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Font Style
                </label>
                <select
                  value={settings.fontStyle}
                  onChange={(e) => handleFontStyleChange(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="inter">Inter</option>
                  <option value="roboto">Roboto</option>
                  <option value="poppins">Poppins</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Font Size
                </label>
                <select
                  value={settings.fontSize}
                  onChange={(e) => handleFontSizeChange(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="small">Small</option>
                  <option value="medium">Medium</option>
                  <option value="large">Large</option>
                </select>
              </div>
            </div>
          </div>

          {/* Time Format Settings */}
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <FaClock className="mr-2" /> Dashboard Time Format
            </h2>
            <div className="flex space-x-4">
              <button
                onClick={() => handleTimeFormatChange('12h')}
                className={`px-4 py-2 rounded-lg flex items-center ${
                  settings.timeFormat === '12h'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                12-Hour
              </button>
              <button
                onClick={() => handleTimeFormatChange('24h')}
                className={`px-4 py-2 rounded-lg flex items-center ${
                  settings.timeFormat === '24h'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                24-Hour
              </button>
            </div>
          </div>

          {/* Notification Settings */}
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <FaBell className="mr-2" /> Dashboard Notifications
            </h2>
            <div className="space-y-4">
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={settings.notifications.email}
                  onChange={() => handleNotificationChange('email')}
                  className="form-checkbox h-5 w-5 text-blue-500 rounded"
                />
                <span className="text-gray-700">Email Notifications</span>
              </label>
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={settings.notifications.system}
                  onChange={() => handleNotificationChange('system')}
                  className="form-checkbox h-5 w-5 text-blue-500 rounded"
                />
                <span className="text-gray-700">System Notifications</span>
              </label>
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={settings.notifications.updates}
                  onChange={() => handleNotificationChange('updates')}
                  className="form-checkbox h-5 w-5 text-blue-500 rounded"
                />
                <span className="text-gray-700">Update Notifications</span>
              </label>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex justify-end space-x-4">
          <button
            onClick={handleReset}
            className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200 flex items-center"
            disabled={isSaving}
          >
            <FaUndo className="mr-2" /> Reset to Default
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200 flex items-center"
            disabled={isSaving}
          >
            <FaSave className="mr-2" /> {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;