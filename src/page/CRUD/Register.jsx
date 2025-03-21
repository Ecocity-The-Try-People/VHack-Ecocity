import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaCalendarAlt, FaHome, FaIdCard } from 'react-icons/fa'; // Import icons

function Register() {
  const [formData, setFormData] = useState({
    name: '',
    dob: '',
    address: '',
    icNumber: '',
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
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

  return (
    <div className="relative flex min-h-screen bg-gray-100 dark:bg-gray-900 overflow-hidden">
    {/* Video Background */}
    <video
    autoPlay
    loop
    muted
    className="fixed top-0 left-0 w-full h-full object-cover z-0"
  >
    <source src="src/assets/Smart-City.mp4" type="video/mp4" />
    Your browser does not support the video tag.
  </video>
    <div className="fixed inset-0 z-10 flex items-center justify-center bg-[hsla(180,0%,10%,0.8)]">
      <div className="bg-white bg-opacity-90 p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Register Account</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="form-group">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
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

          <div className="form-group">
            <label htmlFor="dob" className="block text-sm font-medium text-gray-700">
              Date of Birth:
            </label>
            <div className="relative mt-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaCalendarAlt className="text-gray-400" /> {/* Date of Birth icon */}
              </div>
              <input
                type="date"
                id="dob"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
                className="text-[#111] block w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="address" className="block text-sm font-medium text-gray-700">
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

          <div className="form-group">
            <label htmlFor="icNumber" className="block text-sm font-medium text-gray-700">
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

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200"
          >
            Register
          </button>
        </form>
        <button
          className="w-full mt-4 bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition duration-200"
          onClick={handleBackToLogin}
        >
          Click here if you have an account!
        </button>
      </div>
    </div>
    </div>
  );
}

export default Register;