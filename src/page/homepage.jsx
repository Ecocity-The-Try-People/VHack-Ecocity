import React from "react";
import { motion } from "framer-motion";
import SmartCityVideo from "../assets/Smart-City.mp4"; // Import the first video file
import FeaturesVideo from "../assets/weather.mp4"; // Import the second video file
import TransportationVideo from "../assets/transportation.mp4"; // Import the third video file
import EnergyVideo from "../assets/energy.mp4"; // Import the fourth video file
// import EmergencyVideo from "../assets/emergency.mp4"; // Import the fifth video file
import Weather_detail from "../assets/flood_page/weather_detail.jsx";
import Sidebar from "./Sidebar"; // Import the Sidebar component

export default function SmartCityHome() {
  return (
    <div className="h-screen overflow-y-scroll snap-mandatory snap-y scroll-smooth relative">
      {/* Sidebar */}
      <Sidebar />

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
      <section className="snap-start flex items-center justify-center h-screen relative z-10 ml-20"> {/* Add ml-20 to account for sidebar width */}
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
          <button className="mt-8 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300">
            Explore Features
          </button>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="snap-start flex flex-col items-center justify-center h-screen relative z-10 ml-20"> {/* Add ml-20 to account for sidebar width */}
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
      </section>

      {/* Smart Transportation */}
      <section className="snap-start flex flex-col items-center justify-center h-screen relative z-10 ml-20"> {/* Add ml-20 to account for sidebar width */}
        {/* Video Background for Smart Transportation Section */}
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

        {/* Section Content */}
        <motion.h2
          initial={{ opacity: 0, y: -50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-3xl font-semibold text-white relative z-10"
        >
          Smart Transportation
        </motion.h2>
        <p className="text-lg mt-4 text-white relative z-10">
          Advanced public transport systems with AI-driven optimization.
        </p>
        <button className="mt-8 px-6 py-3 bg-white text-yellow-600 rounded-lg hover:bg-gray-100 transition duration-300 relative z-10">
          Learn More
        </button>
      </section>

      {/* Renewable Energy */}
      <section className="snap-start flex flex-col items-center justify-center h-screen relative z-10 ml-20"> {/* Add ml-20 to account for sidebar width */}
        {/* Video Background for Renewable Energy Section */}
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
          Renewable Energy
        </motion.h2>
        <p className="text-lg mt-4 text-white relative z-10">
          Solar, wind, and sustainable energy powering the future.
        </p>
      </section>

      {/* Emergency Alerts */}
      <section className="snap-start flex flex-col items-center justify-center h-screen relative z-10 ml-20"> {/* Add ml-20 to account for sidebar width */}
        {/* Video Background for Emergency Alerts Section */}
        {/* <div className="absolute inset-0 z-0 overflow-hidden">
          <video
            autoPlay
            loop
            muted
            className="w-full h-full object-cover opacity-50" // Adjust opacity here
          >
            <source src={EmergencyVideo} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div> */}

        {/* Section Content */}
        <motion.h2
          initial={{ opacity: 0, y: -50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-3xl font-semibold text-white relative z-10"
        >
          Emergency Alerts
        </motion.h2>
        <p className="text-lg mt-4 text-white relative z-10">
          Real-time alerts for disasters and emergency responses.
        </p>
      </section>

      {/* Floating Climate Change Indicators */}
      <div className="fixed bottom-10 right-10 flex flex-col gap-4 z-20">
        <motion.div
          whileHover={{ scale: 1.1 }}
          className="w-16 h-16 bg-red-500 rounded-full shadow-lg flex items-center justify-center cursor-pointer relative group"
        >
          <span role="img" aria-label="fire" className="text-2xl">
            🔥
          </span>
          <div className="absolute -top-10 bg-black text-white text-sm px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            High Temperature
          </div>
        </motion.div>
        <motion.div
          whileHover={{ scale: 1.1 }}
          className="w-16 h-16 bg-yellow-500 rounded-full shadow-lg flex items-center justify-center cursor-pointer relative group"
        >
          <span role="img" aria-label="sun" className="text-2xl">
            ☀️
          </span>
          <div className="absolute -top-10 bg-black text-white text-sm px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            UV Index
          </div>
        </motion.div>
        <motion.div
          whileHover={{ scale: 1.1 }}
          className="w-16 h-16 bg-green-500 rounded-full shadow-lg flex items-center justify-center cursor-pointer relative group"
        >
          <span role="img" aria-label="leaf" className="text-2xl">
            🌿
          </span>
          <div className="absolute -top-10 bg-black text-white text-sm px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            Air Quality
          </div>
        </motion.div>
      </div>
    </div>
  );
}