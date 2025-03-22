import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa'; // Import icons

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
  const [error, setError] = useState(''); // State to handle login errors
  const navigate = useNavigate();

  // Define admin credentials (for demonstration purposes)
  const adminCredentials = {
    username: 'admin',
    password: 'admin123',
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    // Check if credentials match admin credentials
    if (username === adminCredentials.username && password === adminCredentials.password) {
      navigate('/admin_page'); // Redirect to admin page
    } else if (username && password) {
      navigate('/homepage'); // Redirect to user's home page
    } else {
      setError('Invalid username or password'); // Show error message
    }
  };

  const handleSignUp = () => {
    navigate('/register'); // Redirect to the register page
  };

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
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

      {/* Content */}
      <div className="fixed inset-0 z-10 flex items-center justify-center bg-[hsla(180,0%,10%,0.8)]">
        <div className="bg-[white] bg-opacity-90 p-8 rounded-lg shadow-lg w-full max-w-md">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Login</h2>
          {error && <p className="text-red-500 text-center mb-4">{error}</p>} {/* Display error message */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username Field */}
            <div className="form-group">
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 text-left">
                Username:
              </label>
              <div className="relative mt-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaUser className="text-gray-400" /> {/* Username icon */}
                </div>
                <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
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
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="text-[#111] block w-full pl-10 pr-12 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                  required
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 bg-transparent border-none cursor-pointer"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />} {/* Toggle eye icon */}
                </button>
              </div>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              className="w-full bg-blue-700 text-white py-2 px-4 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200"
            >
              Login
            </button>
          </form>

          {/* Sign Up Button */}
          <button
            className="w-full mt-4 bg-blue-700 text-white py-2 px-4 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200"
            onClick={handleSignUp}
          >
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;