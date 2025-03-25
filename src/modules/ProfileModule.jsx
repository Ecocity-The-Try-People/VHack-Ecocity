import React, { useState, useRef } from "react";
import { Card, CardContent } from "@/components/Card";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import SmartCityVideo from "@/assets/videos/Smart-City.mp4";
import { currentLoginUser } from "../data";
import { useNotificationContext } from "../context/NotificationContext";

export default function ProfileModule({ userRole }) {
  const currentUser = currentLoginUser.find((user) => user.role.toLowerCase() === userRole.toLowerCase()) || {};
  const { showNotification } = useNotificationContext() || {};

  const [profile, setProfile] = useState({
    name: currentUser.name,
    dob: currentUser.dob,
    address: currentUser.address,
    ic: currentUser.icNum,
    profilePicture: currentUser.avatarUrl,
  });

  const fileInputRef = useRef(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile({
      ...profile,
      [name]: value,
    });
  };

  const handleDateChange = (date) => {
    setProfile({
      ...profile,
      dob: date,
    });
  };

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile({
          ...profile,
          profilePicture: reader.result,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleChangePictureClick = () => {
    fileInputRef.current.click();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    showNotification("Profile updated successfully!", "success");
  };

  return (
    <div className="relative min-h-screen">
      <div className="fixed inset-0 z-0 overflow-hidden ml-20">
        <video
          autoPlay
          loop
          muted
          className="w-full h-full object-cover opacity-50"
        >
          <source src={SmartCityVideo} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>

      <div className="fixed inset-0 z-0 bg-[hsla(180,0%,10%,0.6)] ml-20" />

      <div className="relative z-10 p-4 ml-20">
        <div className="max-w-2xl mx-auto">
          <Card className="bg-white bg-opacity-90 dark:bg-gray-800 dark:bg-opacity-90 p-8 rounded-lg shadow-lg text-gray-800 dark:text-gray-200">
            <CardContent>
              <h2 className="text-3xl font-bold text-center mb-6">User Profile</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Profile Picture */}
                <div className="flex flex-col items-center">
                  <div className="w-32 h-32 rounded-full border-3 border-gray-500 overflow-hidden">
                    <img
                      src={profile.profilePicture}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleProfilePictureChange}
                    ref={fileInputRef}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={handleChangePictureClick}
                    className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200 mt-4"
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
                  <div className="w-full">
                    <DatePicker
                      selected={profile.dob}
                      onChange={handleDateChange}
                      className="custom-datepicker"
                      placeholderText="Select Date"
                      required
                    />
                  </div>
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
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}