import React, { useState, useRef } from "react";
import { Card, CardContent } from "@/components/Card";

export default function ProfileModule() {
  // State to manage form data
  const [profile, setProfile] = useState({
    name: "",
    dob: "",
    address: "",
    ic: "",
    profilePicture: "", // Base64 string for the profile picture
  });

  // Ref for the hidden file input
  const fileInputRef = useRef(null);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile({
      ...profile,
      [name]: value,
    });
  };

  // Handle profile picture change
  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile({
          ...profile,
          profilePicture: reader.result, // Store base64 string
        });
      };
      reader.readAsDataURL(file); // Convert file to base64
    }
  };

  // Trigger file input when "Change Picture" button is clicked
  const handleChangePictureClick = () => {
    fileInputRef.current.click(); // Open file explorer
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Profile updated successfully!");
  };

  return (
    <div className="relative min-h-screen">
      {/* Background Layer */}
      <div className="fixed inset-0 bg-[hsla(180,0%,10%,0.8)] dark:bg-[hsla(180,0%,5%,0.9)] -z-10 ml-20" /> {/* Dark mode background */}

      {/* Content */}
      <div className="p-4"> {/* Adjust `ml-20` to match the sidebar width */}
        <Card className="bg-white bg-opacity-90 dark:bg-gray-800 dark:bg-opacity-90 p-8 rounded-lg shadow-lg text-gray-800 dark:text-gray-200">
          <CardContent>
            <h2 className="text-3xl font-bold text-center mb-6">User Profile & e-KYC Management</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Profile Picture */}
              <div className="flex flex-col items-center">
                <img
                  src={
                    profile.profilePicture ||
                    "https://via.placeholder.com/150" // Default placeholder image
                  }
                  alt="Profile"
                  className="w-32 h-32 rounded-full object-cover mb-4"
                />
                {/* Hidden file input */}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleProfilePictureChange}
                  ref={fileInputRef}
                  className="hidden" // Hide the file input
                />
                {/* Change Picture Button */}
                <button
                  type="button"
                  onClick={handleChangePictureClick}
                  className="bg-blue-600 dark:bg-green-700 text-white py-2 px-4 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-800 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200"
                >
                  Change Picture
                </button>
              </div>

              {/* Name Field */}
              <div className="form-group">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Name:
                </label>
                <input
                  type="text"
                  name="name"
                  value={profile.name}
                  onChange={handleInputChange}
                  className="text-[#111] dark:text-gray-200 block w-full pl-4 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 bg-white dark:bg-gray-700"
                  required
                />
              </div>

              {/* Date of Birth Field */}
              <div className="form-group">
                <label htmlFor="dob" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Date of Birth:
                </label>
                <input
                  type="date"
                  name="dob"
                  value={profile.dob}
                  onChange={handleInputChange}
                  className="text-[#111] dark:text-gray-200 block w-full pl-4 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 bg-white dark:bg-gray-700"
                  required
                />
              </div>

              {/* Address Field */}
              <div className="form-group">
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Address:
                </label>
                <input
                  type="text"
                  name="address"
                  value={profile.address}
                  onChange={handleInputChange}
                  className="text-[#111] dark:text-gray-200 block w-full pl-4 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 bg-white dark:bg-gray-700"
                  required
                />
              </div>

              {/* IC Number Field */}
              <div className="form-group">
                <label htmlFor="ic" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  IC Number:
                </label>
                <input
                  type="text"
                  name="ic"
                  value={profile.ic}
                  onChange={handleInputChange}
                  className="text-[#111] dark:text-gray-200 block w-full pl-4 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 bg-white dark:bg-gray-700"
                  required
                />
              </div>

              {/* Save Button */}
              <div className="form-group">
                <button
                  type="submit"
                  className="w-full bg-blue-600 dark:bg-green-700 text-white py-2 px-4 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-800 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}