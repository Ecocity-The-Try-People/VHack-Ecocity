import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useLocation } from "react-router-dom";
import SmartCityVideo from "../assets/videos/Smart-City.mp4"; // Import the first video file
import FeaturesVideo from "../assets/videos/weather.mp4"; // Import the second video file
import TransportationVideo from "../assets/videos/transportation.mp4"; // Import the third video file
import EnergyVideo from "../assets/videos/energy.mp4"; // Import the fourth video file
import Weather_detail from "../assets/flood_page/weather_detail.jsx";
import { useNavigate } from "react-router-dom";
import TrafficIntro from "./homepage_section/TrafficIntro.jsx"; 
import Sidebar from "../assets/components/Sidebar.jsx";
import PublicAdminModule from '@/modules/ProfileModule.jsx';
import FeedbackModule from "../modules/FeedbackModule.jsx";
import PolicyManagement from "../modules/PolicyManagement.jsx";

export default function SmartCityHome() {
  const navigate = useNavigate();
  const location = useLocation();
  const [visibleSection, setVisibleSection] = useState("home");
  const UserRole = "User";

  useEffect(() => {
    const hash = location.hash.replace('#', "");
    if (hash) {
      setVisibleSection(hash);
    } else {
      setVisibleSection("home");
    }
  }, [location.hash]);

  const traffic_page = () => {
    navigate("/traffic"); // Redirect to the TrafficPage
  };
  const weather_page = () => {
    navigate("/flood_page"); // Redirect to the FloodPage
  };
  const smart_waste_page = () => {
    navigate("/smart_waste_management_page"); // Redirect to the SmartWastePage
  };

  // Function to scroll to a specific section
  const scrollToSection = (id) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className={`h-screen overflow-y-scroll snap-mandatory snap-y scroll-smooth relative`}>
      {/* Sidebar */}
      <Sidebar />
      <div className={`h-6 ${visibleSection === "profile" ? "block" : "hidden"}`}>
        <PublicAdminModule />
      </div>
      <div className="flex-1 ml-20 z-20 relative">
        <div className={`relative min-h-screen ${visibleSection === "policy" ? "block" : "hidden"}`}>
          <PolicyManagement userRole={UserRole} />
        </div>
      </div>
      <div className="flex-1 ml-20 z-20 relative">
        <div className={`relative min-h-screen ${visibleSection === "feedback" ? "block" : "hidden"}`}>
          <FeedbackModule userRole={UserRole} />
        </div>
      </div>
      <div className={`${visibleSection === "home" ? "block" : "hidden"}`}>
        {/* Video Background for Hero Section */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <video
            autoPlay
            loop
            muted
            className="w-full h-full object-cover opacity-50" // Adjust opacity here
          >
            <source src={SmartCityVideo} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>

        {/* Hero Section */}
        <section id="home" className={`snap-start flex items-center justify-center h-screen relative z-10 ml-20`}>
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-center"
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-4 text-white">
              Welcome to the Smart City
            </h1>
            <p className="text-lg md:text-xl mt-4 text-gray-200">
              A sustainable and efficient urban future powered by technology.
            </p>
          </motion.div>
        </section>

        {/* Features Section */}
        <section id="features" className="snap-start flex flex-col items-center justify-center h-screen relative z-10 ml-20">
          {/* Video Background for Features Section */}
          <div className="absolute inset-0 z-0 overflow-hidden">
            <video
              autoPlay
              loop
              muted
              className="w-full h-full object-cover opacity-50" // Adjust opacity here
            >
              <source src={FeaturesVideo} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>

          {/* Section Heading */}
          <motion.h2
            initial={{ opacity: 0, y: -50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-4xl md:text-5xl font-bold text-white mb-8 text-center relative z-10"
          >
            Smart City Features
          </motion.h2>

          {/* Cards Grid */}
          <div className="w-full max-w-6xl mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 px-4 relative z-10">
            {/* Weather Card - Kuala Lumpur */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="p-8 bg-white/20 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-white/10"
            >
              <div className="text-center text-white">
                <h3 className="text-2xl font-semibold text-white mb-4">Kuala Lumpur</h3>
                <Weather_detail location="Kuala Lumpur" />
              </div>
            </motion.div>

            {/* Weather Card - Cheras */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="p-8 bg-white/20 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-white/10"
            >
              <div className="text-center">
                <h3 className="text-2xl font-semibold text-white mb-4">Cheras</h3>
                <Weather_detail location="Cheras" />
              </div>
            </motion.div>

            {/* Weather Card - SS2 */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="p-8 bg-white/20 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-white/10"
            >
              <div className="text-center">
                <h3 className="text-2xl font-semibold text-white mb-4">SS2</h3>
                <Weather_detail location="SS2" />
              </div>
            </motion.div>
          </div>

          {/* Explore Features Button */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="mt-12 relative z-10"
          >
            <button
              onClick={weather_page}
              className="px-8 py-3 bg-transparent border-2 border-white text-white rounded-lg hover:bg-white hover:text-gray-900 transition duration-300 cursor-pointer"
            >
              Explore Features
            </button>
          </motion.div>
        </section>

        {/* Smart Transportation */}
        <section id="transportation" className="snap-start flex flex-col items-center justify-center h-screen relative z-10">
          {/* Content Container */}
          <div className="w-full max-w-6xl mx-auto p-5 z-10">
            <h1 className="text-4xl font-bold text-center mb-5">Welcome to Our Transportation Hub</h1>
            <TrafficIntro />

            {/* Explore Features Button */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.5 }}
              className="mt-12 text-center"
            >
              <button
                onClick={traffic_page}
                className="px-8 py-3 bg-transparent border-2 border-white text-white rounded-lg hover:bg-white hover:text-gray-900 transition duration-300 cursor-pointer"
              >
                Explore Live Map
              </button>
            </motion.div>
          </div>

          {/* Video Background */}
          <div className="absolute inset-0 z-0 overflow-hidden">
            <video
              autoPlay
              loop
              muted
              className="w-full h-full object-cover opacity-50" // Adjust opacity here
            >
              <source src={TransportationVideo} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        </section>

        {/* Renewable Energy */}
        <section id="waste-collection" className="snap-start flex flex-col items-center justify-center h-screen relative z-10 ml-20">
          {/* Video Background for Waste Collection Section */}
          <div className="absolute inset-0 z-0 overflow-hidden">
            <video
              autoPlay
              loop
              muted
              className="w-full h-full object-cover opacity-50" // Adjust opacity here
            >
              <source src={EnergyVideo} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>

          {/* Section Content */}
          <motion.h2
            initial={{ opacity: 0, y: -50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-3xl font-semibold text-white relative z-10"
          >
            Automated Waste Collection Vehicles
          </motion.h2>
          <p className="text-lg mt-4 text-white relative z-10">
            Deploy autonomous or semi-autonomous garbage trucks equipped with robotic arms for efficient collection.
          </p>

          {/* Widgets Grid */}
          <div className="w-full max-w-6xl mt-8 grid grid-cols-1 md:grid-cols-3 gap-8 px-4 relative z-10">
            {/* Widget 1: Real-Time Tracking */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="p-6 bg-white/20 backdrop-blur-sm rounded-lg shadow-lg border border-white/10"
            >
              <h3 className="text-xl font-bold text-white mb-4">Real-Time Tracking</h3>
              <p className="text-gray-200 mb-6">
                Track the location of waste collection vehicles in real-time using our interactive map. Know exactly when your recyclables will be picked up.
              </p>
              <button
                onClick={smart_waste_page}
                className="px-6 py-2 bg-transparent border-2 border-white text-white rounded-lg hover:bg-white hover:text-gray-900 transition duration-300 cursor-pointer"
              >
                Track Now
              </button>
            </motion.div>

            {/* Widget 2: Request Pickup */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.4 }}
              className="p-6 bg-white/20 backdrop-blur-sm rounded-lg shadow-lg border border-white/10"
            >
              <h3 className="text-xl font-bold text-white mb-4">Request Pickup</h3>
              <p className="text-gray-200 mb-6">
                Request for recyclable garbage to be picked up at your location. Our vehicles are equipped to handle plastic, paper, and metal.
              </p>
              <button
                onClick={smart_waste_page}
                className="px-6 py-2 bg-transparent border-2 border-white text-white rounded-lg hover:bg-white hover:text-gray-900 transition duration-300 cursor-pointer"
              >
                Request Now
              </button>
            </motion.div>

            {/* Widget 3: Advanced Recycling */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.6 }}
              className="p-6 bg-white/20 backdrop-blur-sm rounded-lg shadow-lg border border-white/10"
            >
              <h3 className="text-xl font-bold text-white mb-4">Advanced Recycling</h3>
              <p className="text-gray-200 mb-6">
                Our vehicles are equipped with high-tech cameras that can differentiate between types of recyclable garbage, ensuring efficient sorting and processing.
              </p>
              <button
                onClick={smart_waste_page}
                className="px-6 py-2 bg-transparent border-2 border-white text-white rounded-lg hover:bg-white hover:text-gray-900 transition duration-300 cursor-pointer"
              >
                Learn More
              </button>
            </motion.div>
          </div>

          {/* Explore Features Button */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="mt-12 text-center relative z-10"
          >
            <button
              onClick={smart_waste_page}
              className="px-8 py-3 bg-transparent border-2 border-white text-white rounded-lg hover:bg-white hover:text-gray-900 transition duration-300 cursor-pointer"
            >
              Explore Features
            </button>
          </motion.div>
        </section>

        {/* Emergency Alerts */}
        {/* <section id="emergency" className="snap-start flex flex-col items-center justify-center h-screen relative z-10 ml-20"> */}
          {/* Section Content */}
          {/* <motion.h2
            initial={{ opacity: 0, y: -50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-3xl font-semibold text-white relative z-10"
          >
            Emergency Alerts
          </motion.h2>
          <p className="text-lg mt-4 text-white relative z-10">
            Real-time alerts for disasters and emergency responses.
          </p> */}
        {/* </section> */}

        {/* Floating Climate Change Indicators */}
        <div className="fixed bottom-10 right-10 flex flex-col gap-4 z-20">
  {/* Home Button */}
  <motion.div
    whileHover={{ scale: 1.1 }}
    className="w-16 h-16 rounded-full shadow-lg flex items-center justify-center cursor-pointer relative group"
    style={{ backgroundColor: "#205781" }} // Updated background color
    onClick={() => scrollToSection("home")}
  >
    <span role="img" aria-label="home" className="text-2xl">
      🏠
    </span>
    <div className="absolute -top-10 bg-black text-white text-sm px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300">
      Home
    </div>
  </motion.div>

  {/* Weather Button */}
  <motion.div
    whileHover={{ scale: 1.1 }}
    className="w-16 h-16 rounded-full shadow-lg flex items-center justify-center cursor-pointer relative group"
    style={{ backgroundColor: "#4F959D" }} // Updated background color
    onClick={() => scrollToSection("features")}
  >
    <span role="img" aria-label="weather" className="text-2xl">
      🌧️
    </span>
    <div className="absolute -top-10 bg-black text-white text-sm px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300">
      Weather
    </div>
  </motion.div>

  {/* Transport Button */}
  <motion.div
    whileHover={{ scale: 1.1 }}
    className="w-16 h-16 rounded-full shadow-lg flex items-center justify-center cursor-pointer relative group"
    style={{ backgroundColor: "#98D2C0" }} // Updated background color
    onClick={() => scrollToSection("transportation")}
  >
    <span role="img" aria-label="transport" className="text-2xl">
      🚗
    </span>
    <div className="absolute -top-10 bg-black text-white text-sm px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300">
      Transport
    </div>
  </motion.div>

  {/* Waste Collection Button */}
  <motion.div
    whileHover={{ scale: 1.1 }}
    className="w-16 h-16 rounded-full shadow-lg flex items-center justify-center cursor-pointer relative group"
    style={{ backgroundColor: "#F6F8D5" }} // Updated background color
    onClick={() => scrollToSection("waste-collection")}
  >
    <span role="img" aria-label="waste collection" className="text-2xl">
      🗑️
    </span>
    <div className="absolute -top-10 bg-black text-white text-sm px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300">
      Waste Collection
    </div>
  </motion.div>
</div>
 </div>
    </div>
  );
}