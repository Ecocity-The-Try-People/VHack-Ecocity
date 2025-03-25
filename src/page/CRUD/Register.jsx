import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaCalendarAlt, FaHome, FaIdCard, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa'; // Import icons
import DatePicker from 'react-datepicker'; // Import DatePicker
import 'react-datepicker/dist/react-datepicker.css'; // Import DatePicker CSS

function Register() {
  const [formData, setFormData] = useState({
    name: '',
    dob: null, // Use null for DatePicker
    address: '',
    icNumber: '',
    password: '',
    confirmPassword: '',
  });

  const [error, setError] = useState(''); // State to handle password mismatch error
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // State to toggle confirm password visibility

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle date change
  const handleDateChange = (date) => {
    setFormData({
      ...formData,
      dob: date,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Check if passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    // Clear error if passwords match
    setError('');

    // Display registration success message
    alert(`
      Registration Successful!\n
      Name: ${formData.name}\n
      Date of Birth: ${formData.dob}\n
      Address: ${formData.address}\n
      IC Number: ${formData.icNumber}
    `);
  };

  const handleBackToLogin = () => {
    navigate('/'); // Redirect back to the login page
  };

  // Toggle password visibility
  const togglePasswordVisibility = (e) => {
    e.preventDefault(); // Prevent default anchor behavior
    setShowPassword(!showPassword);
  };

  // Toggle confirm password visibility
  const toggleConfirmPasswordVisibility = (e) => {
    e.preventDefault(); // Prevent default anchor behavior
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <div className="relative flex min-h-screen bg-gray-100 dark:bg-gray-900 overflow-hidden">
      {/* Video Background */}
      <video
        autoPlay
        loop
        muted
        className="fixed top-0 left-0 w-full h-full object-cover z-0"
      >
        <source src="src/assets/videos/Smart-City.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Content */}
      <div className="fixed inset-0 z-10 flex items-center justify-center bg-[hsla(180,0%,10%,0.8)]">
        <div className="bg-white bg-opacity-90 p-8 rounded-lg shadow-lg w-full max-w-md">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Register Account</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Field */}
            <div className="form-group">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 text-left">
                Name:
              </label>
              <div className="relative mt-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaUser className="text-gray-400" /> {/* Name icon */}
                </div>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="text-[#111] block w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                  required
                />
              </div>
            </div>

            {/* Date of Birth Field */}
            <div className="form-group">
              <label htmlFor="dob" className="block text-sm font-medium text-gray-700 text-left">
                Date of Birth:
              </label>
              <div className="relative mt-1">
                {/* Custom Calendar Icon */}
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaCalendarAlt className="text-gray-400" />
                </div>
                {/* Date Input */}
                <DatePicker
                  selected={formData.dob}
                  onChange={handleDateChange}
                  customInput={
                    <input
                      className="text-[#111] block w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                      placeholder="Select Date"
                      required
                    />
                  }
                />
              </div>
            </div>

            {/* Address Field */}
            <div className="form-group">
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 text-left">
                Address:
              </label>
              <div className="relative mt-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaHome className="text-gray-400" /> {/* Address icon */}
                </div>
                <textarea
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="text-[#111] block w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                  required
                />
              </div>
            </div>

            {/* IC Number Field */}
            <div className="form-group">
              <label htmlFor="icNumber" className="block text-sm font-medium text-gray-700 text-left">
                IC Number:
              </label>
              <div className="relative mt-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaIdCard className="text-gray-400" /> {/* IC Number icon */}
                </div>
                <input
                  type="text"
                  id="icNumber"
                  name="icNumber"
                  value={formData.icNumber}
                  onChange={handleChange}
                  className="text-[#111] block w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="form-group">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 text-left">
                Password:
              </label>
              <div className="relative mt-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="text-gray-400" /> {/* Password icon */}
                </div>
                <input
                  type={showPassword ? "text" : "password"} // Toggle between text and password
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="text-[#111] block w-full pl-10 pr-12 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                  required
                />
                <a
                  href="#"
                  onClick={togglePasswordVisibility}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 bg-transparent border-none cursor-pointer"
                >
                  {showPassword ? (
                    <FaEyeSlash className="text-gray-400 hover:text-gray-600" /> // Eye slash icon
                  ) : (
                    <FaEye className="text-gray-400 hover:text-gray-600" /> // Eye icon
                  )}
                </a>
              </div>
            </div>

            {/* Confirm Password Field */}
            <div className="form-group">
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 text-left">
                Confirm Password:
              </label>
              <div className="relative mt-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="text-gray-400" /> {/* Confirm Password icon */}
                </div>
                <input
                  type={showConfirmPassword ? "text" : "password"} // Toggle between text and password
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="text-[#111] block w-full pl-10 pr-12 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                  required
                />
                <a
                  href="#"
                  onClick={toggleConfirmPasswordVisibility}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 bg-transparent border-none cursor-pointer"
                >
                  {showConfirmPassword ? (
                    <FaEyeSlash className="text-gray-400 hover:text-gray-600" /> // Eye slash icon
                  ) : (
                    <FaEye className="text-gray-400 hover:text-gray-600" /> // Eye icon
                  )}
                </a>
              </div>
            </div>

            {/* Password Mismatch Error */}
            {error && (
              <div className="text-red-500 text-sm text-left">
                {error}
              </div>
            )}

            {/* Register Button */}
            <button
              type="submit"
              className="w-full bg-blue-700 text-white py-2 px-4 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200 cursor-pointer"
            >
              Register
            </button>
          </form>

          {/* Back to Login Button */}
          <button
            className="w-full mt-4 bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transitio cursor-pointer"
            onClick={handleBackToLogin}
          >
            Click here if you have an account!
          </button>
        </div>
      </div>
      <style>
        {`
          .react-datepicker-wrapper {
            width: 100%; /* Ensure the DatePicker takes full width */
          }

          .react-datepicker__input-container {
            width: 100%; /* Ensure the input container takes full width */
          }
        `}
      </style>
    </div>
  );
}

export default Register;