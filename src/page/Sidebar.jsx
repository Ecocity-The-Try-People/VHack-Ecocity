// Sidebar.jsx
import React from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate for programmatic navigation
import { Home, FileText, Map, Users, LogOut } from "lucide-react"; // Import the same icons as in PublicAdmin.jsx

export default function Sidebar() {
  const navigate = useNavigate(); // Initialize useNavigate

  // Handle logout
  const handleLogout = () => {
    // Show confirmation popup
    const confirmLogout = window.confirm("Are you sure you want to log out?");
    if (confirmLogout) {
      localStorage.removeItem("isAuthenticated"); // Clear authentication state
      navigate("/"); // Redirect to the login page
    }
  };

  return (
    <aside className="w-20 bg-white dark:bg-gray-800 shadow-md flex flex-col items-center py-4 fixed min-h-screen z-20">
      {/* Home Icon */}
      <a
        href="#home" // Link to the first section
        className="p-3 rounded-lg transition duration-200 hover:bg-gray-100 dark:hover:bg-gray-700"
      >
        <Home className="w-6 h-6 text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-black" />
      </a>

      {/* FileText Icon */}
      <a
        href="#features" // Link to the features section
        className="mt-4 p-3 rounded-lg transition duration-200 hover:bg-gray-100 dark:hover:bg-gray-700"
      >
        <FileText className="w-6 h-6 text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-black" />
      </a>

      {/* Map Icon */}
      <a
        href="#transportation" // Link to the transportation section
        className="mt-4 p-3 rounded-lg transition duration-200 hover:bg-gray-100 dark:hover:bg-gray-700"
      >
        <Map className="w-6 h-6 text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-black" />
      </a>

      {/* Users Icon */}
      <a
        href="#profile" // Link to the profile section
        className="mt-4 p-3 rounded-lg transition duration-200 hover:bg-gray-100 dark:hover:bg-gray-700"
      >
        <Users className="w-6 h-6 text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-black" />
      </a>

      {/* Logout Icon */}
      <button
        onClick={handleLogout} // Call handleLogout on click
        className="mt-auto p-3 rounded-lg transition duration-200 hover:bg-gray-100 dark:hover:bg-gray-700"
      >
        <LogOut className="w-6 h-6 text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-600" />
      </button>
    </aside>
  );
}