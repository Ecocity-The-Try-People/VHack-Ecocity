import React, { useState } from 'react';
import { redirect, useNavigate } from 'react-router-dom';
import { FaUser, FaCalendarAlt, FaHome, FaIdCard, FaLock, FaEye, FaEyeSlash, FaCheckCircle } from 'react-icons/fa';
import DatePicker from 'react-datepicker'; 
import 'react-datepicker/dist/react-datepicker.css'; 
import videoSrc from '../../assets/videos/Smart-City.mp4';
import { auth, db } from '../../../config/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { motion } from 'framer-motion';

function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    dob: null,
    address: '',
    icNumber: '',
    password: '',
    confirmPassword: '',
    redirect:"/homepage"
  });

  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'icNumber') {
      const numericValue = value.replace(/\D/g, '').slice(0, 12);
      setFormData({
        ...formData,
        [name]: numericValue,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleDateChange = (date) => {
    setFormData({
      ...formData,
      dob: date,
    });
  };

  const validateICNumber = (icNumber) => {
    return /^\d{12}$/.test(icNumber);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (!validateICNumber(formData.icNumber)) {
      setError('IC Number must be exactly 12 digits');
      setIsLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      await setDoc(doc(db, "users", userCredential.user.uid), {
        name: formData.name,
        dob: formData.dob,
        address: formData.address,
        ic_number: formData.icNumber,
        email: formData.email,
        createdAt: new Date(),
        role: "user",
        avatar_url: "https://png.pngtree.com/element_our/20200610/ourmid/pngtree-character-default-avatar-image_2237203.jpg"
      });

      setRegistrationSuccess(true);
      setTimeout(() => {
        navigate('/'); 
      }, 3000);

    } catch (error) {
      console.error("Registration error:", error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToLogin = () => {
    navigate('/');
  };

  const togglePasswordVisibility = (e) => {
    e.preventDefault(); 
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = (e) => {
    e.preventDefault();
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <div className="relative min-h-screen bg-gray-100 dark:bg-gray-900 overflow-auto">
      {/* Video Background */}
      <div className="fixed inset-0 overflow-hidden z-0">
        <video
          autoPlay
          loop
          muted
          className="absolute top-0 left-0 w-full h-full object-cover"
        >
          <source src={videoSrc} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>

      {/* Overlay */}
      <div className="fixed inset-0 bg-[hsla(180,0%,10%,0.8)] z-10"></div>

      {/* Main Content */}
      <div className="relative z-20 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-4xl mx-auto">
          <div className="bg-white bg-opacity-90 rounded-lg shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-2">
            {/* Left Column - Visual */}
            <div className="hidden lg:flex items-center justify-center bg-gradient-to-br from-blue-500 to-blue-700 p-8">
              <div className="text-white text-center">
                <h3 className="text-2xl font-bold mb-4">The Try People</h3>
                <p className="mb-6">Create your account to access exclusive features and services.</p>
                <div className="flex justify-center">
                  <img 
                    src="ecoIcon.jpg" 
                    alt="Eco Icon" 
                    className="w-64 h-64 rounded-full object-cover border-4 border-white" 
                  />
                </div>
              </div>
            </div>

            {/* Right Column - Form */}
            <div className="p-8">
              {registrationSuccess ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="text-center"
                >
                  <div className="flex justify-center mb-4">
                    <FaCheckCircle className="text-green-500 text-6xl" />
                  </div>
                  <h2 className="text-3xl font-bold text-gray-800 mb-4">Registration Successful!</h2>
                  <p className="text-gray-600 mb-6">
                    Your account has been created successfully. You'll be redirected to the login page shortly.
                  </p>
                  <div className="w-full bg-blue-100 text-blue-800 py-3 px-4 rounded-lg">
                    <p>Please login with your new credentials</p>
                  </div>
                </motion.div>
              ) : (
                <>
                  <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Register Account</h2>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Name */}
                      <div className="form-group">
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 text-left mb-1">
                          Name:
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FaUser className="text-gray-400" />
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

                      {/* Email */}
                      <div className="form-group">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 text-left mb-1">
                          Email:
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FaUser className="text-gray-400" />
                          </div>
                          <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="text-[#111] block w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                            required
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Date of Birth */}
                      <div className="form-group">
                        <label htmlFor="dob" className="block text-sm font-medium text-gray-700 text-left mb-1">
                          Date of Birth:
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FaCalendarAlt className="text-gray-400" />
                          </div>
                          <DatePicker
                            selected={formData.dob}
                            onChange={handleDateChange}
                            className="text-[#111] block w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                            placeholderText="Select Date"
                            required
                          />
                        </div>
                      </div>

                      {/* IC Number */}
                      <div className="form-group">
                        <label htmlFor="icNumber" className="block text-sm font-medium text-gray-700 text-left mb-1">
                          IC Number:
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FaIdCard className="text-gray-400" />
                          </div>
                          <input
                            type="text"
                            id="icNumber"
                            name="icNumber"
                            value={formData.icNumber}
                            onChange={handleChange}
                            className="text-[#111] block w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                            required
                            maxLength={12}
                            pattern="\d{12}"
                            title="Please enter exactly 12 digits"
                          />
                        </div>
                        {formData.icNumber && formData.icNumber.length !== 12 && (
                          <p className="text-red-500 text-xs mt-1">Invalid IC Number</p>
                        )}
                      </div>
                    </div>

                    {/* Address */}
                    <div className="form-group">
                      <label htmlFor="address" className="block text-sm font-medium text-gray-700 text-left mb-1">
                        Address:
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 pt-3 flex items-start pointer-events-none">
                          <FaHome className="text-gray-400" />
                        </div>
                        <textarea
                          id="address"
                          name="address"
                          value={formData.address}
                          onChange={handleChange}
                          rows={3}
                          className="text-[#111] block w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Password */}
                      <div className="form-group">
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 text-left mb-1">
                          Password:
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FaLock className="text-gray-400" />
                          </div>
                          <input
                            type={showPassword ? "text" : "password"}
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="text-[#111] block w-full pl-10 pr-12 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                            required
                          />
                          <button
                            type="button"
                            onClick={togglePasswordVisibility}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 bg-transparent border-none cursor-pointer"
                          >
                            {showPassword ? (
                              <FaEyeSlash className="text-gray-400 hover:text-gray-600" />
                            ) : (
                              <FaEye className="text-gray-400 hover:text-gray-600" />
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Confirm Password */}
                      <div className="form-group">
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 text-left mb-1">
                          Confirm Password:
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FaLock className="text-gray-400" />
                          </div>
                          <input
                            type={showConfirmPassword ? "text" : "password"}
                            id="confirmPassword"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            className="text-[#111] block w-full pl-10 pr-12 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                            required
                          />
                          <button
                            type="button"
                            onClick={toggleConfirmPasswordVisibility}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 bg-transparent border-none cursor-pointer"
                          >
                            {showConfirmPassword ? (
                              <FaEyeSlash className="text-gray-400 hover:text-gray-600" />
                            ) : (
                              <FaEye className="text-gray-400 hover:text-gray-600" />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>

                    {error && (
                      <div className="text-red-500 text-sm text-left">
                        {error}
                      </div>
                    )}

                    <div className="pt-2">
                      <button
                        type="submit"
                        disabled={isLoading}
                        className={`w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200 cursor-pointer ${isLoading ? 'opacity-70' : ''}`}
                      >
                        {isLoading ? 'Registering...' : 'Register'}
                      </button>
                    </div>
                  </form>

                  <div className="mt-4">
                    <button
                      className="w-full bg-gray-200 text-gray-800 py-3 px-4 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition duration-200 cursor-pointer"
                      onClick={handleBackToLogin}
                    >
                      Already have an account? Login here!
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;