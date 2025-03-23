import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Home, FileText, Map, Users, LogOut, CloudRain } from "lucide-react";
import NavButton from "@/components/NavButton";

export default function Sidebar() {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("home");

  // Handle logout with window.confirm
  const handleLogout = () => {
    const confirmLogout = window.confirm("Are you sure you want to log out?");
    if (confirmLogout) {
      localStorage.removeItem("isAuthenticated"); // Clear authentication state
      navigate("/"); // Redirect to the login page
    }
  };

  return (
    <nav className="w-20 bg-white dark:bg-gray-800 shadow-md flex flex-col items-center py-4 fixed min-h-screen z-20">
      {/* Home Icon */}
      <NavButton
        icon={<Home className={`w-6 h-6 ${activeSection === "home" ? "text-blue-600 dark:text-blue-400" : "text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-black"}`} />}
        onClick={() => {
          navigate("/homepage");
          setActiveSection("home");
        }}
        isActive={activeSection === "home"}
        aria-label="Home"
        className="hover:bg-gray-100 dark:hover:bg-gray-700"
      />

      {/* FileText Icon */}
      <NavButton
        icon={<FileText className={`w-6 h-6 ${activeSection === "features" ? "text-blue-600 dark:text-blue-400" : "text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-black"}`} />}
        onClick={() => {
          navigate("/homepage#policy");
          setActiveSection("features");
        }}
        isActive={activeSection === "features"}
        aria-label="Features"
        className="hover:bg-gray-100 dark:hover:bg-gray-700"
      />

      {/* Map Icon */}
      <NavButton
        icon={<Map className={`w-6 h-6 ${activeSection === "transportation" ? "text-blue-600 dark:text-blue-400" : "text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-black"}`} />}
        onClick={() => {
          navigate("/homepage#feedback");
          setActiveSection("transportation");
        }}
        isActive={activeSection === "transportation"}
        aria-label="Transportation"
        className="hover:bg-gray-100 dark:hover:bg-gray-700"
      />

      {/* Users Icon */}
      <NavButton
        icon={<Users className={`w-6 h-6 ${activeSection === "profile" ? "text-blue-600 dark:text-blue-400" : "text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-black"}`} />}
        onClick={() => {
          navigate("/homepage#profile");
          setActiveSection("profile");
        }}
        isActive={activeSection === "profile"}
        aria-label="Profile"
        className="hover:bg-gray-100 dark:hover:bg-gray-700"
      />
      <NavButton
        icon={<CloudRain className={`w-6 h-6 ${activeSection === "flood_page" ? "text-blue-600 dark:text-blue-400" : "text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-black"}`} />}
        onClick={() => {
          navigate("/flood_page");
          setActiveSection("flood_page");
        }}
        isActive={activeSection === "flood_page"}
        aria-label="flood_page"
        className="hover:bg-gray-100 dark:hover:bg-gray-700"
      />
      <NavButton
        icon={<CloudRain className={`w-6 h-6 ${activeSection === "traffic" ? "text-blue-600 dark:text-blue-400" : "text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-black"}`} />}
        onClick={() => {
          navigate("/traffic");
          setActiveSection("Transportation");
        }}
        isActive={activeSection === "traffic"}
        aria-label="traffic"
        className="hover:bg-gray-100 dark:hover:bg-gray-700"
      />
      <NavButton
        icon={<CloudRain className={`w-6 h-6 ${activeSection === "smart_waste_management_page" ? "text-blue-600 dark:text-blue-400" : "text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-black"}`} />}
        onClick={() => {
          navigate("/smart_waste_management_page");
          setActiveSection("smart_waste_management_page");
        }}
        isActive={activeSection === "smart_waste_management_page"}
        aria-label="smart_waste_management_page"
        className="hover:bg-gray-100 dark:hover:bg-gray-700"
      />

      {/* Logout Icon */}
      <div className="mt-auto">
        <NavButton
          icon={<LogOut className="w-6 h-6 text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-600" />}
          onClick={handleLogout}
          aria-label="Logout"
          className="hover:bg-gray-100 dark:hover:bg-gray-700"
        />
      </div>
    </nav>
  );
}