import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Register() {
  const [formData, setFormData] = useState({
    name: '',
    dob: '',
    address: '',
    icNumber: '',
    password: '',
    confirmPassword: '', // Add confirm password field
  });

  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
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

    // Check if password and confirm password match
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    alert(`
      Registration Successful!\n
      Name: ${formData.name}\n
      Date of Birth: ${formData.dob}\n
      Address: ${formData.address}\n
      IC Number: ${formData.icNumber}\n
      Password: ${formData.password}
    `);
  };

  const handleBackToLogin = () => {
    navigate('/'); // Redirect back to the login page
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword); // Toggle password visibility
  };

  return (
    <div className="register-container">
      <h2>Register Account</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="dob">Date of Birth:</label>
          <input
            type="date"
            id="dob"
            name="dob"
            value={formData.dob}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="address">Address:</label>
          <textarea
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="icNumber">IC Number:</label>
          <input
            type="text"
            id="icNumber"
            name="icNumber"
            value={formData.icNumber}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type={showPassword ? 'text' : 'password'} 
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm Password:</label>
          <input
            type={showPassword ? 'text' : 'password'}
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
        </div>

        <button type="button" onClick={toggleShowPassword} className="show-password-button">
          {showPassword ? 'Hide Password' : 'Show Password'}
        </button>

        <button type="submit">Register</button>
      </form>
      <button className="back-to-login-button" onClick={handleBackToLogin}>
        Click here if you have an account!
      </button>
    </div>
  );
}

export default Register;