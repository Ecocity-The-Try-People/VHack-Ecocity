import React from "react";
import VehicleMap from "../assets/VehicleMap.jsx";
import Sidebar from "../assets/components/Sidebar.jsx"; // Import the Sidebar component
import TransportationVideo from "../assets/videos/transportation.mp4";

export default function TrafficPage() {
  return (
    <div className="flex min-h-screen relative">
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

      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-grow relative z-10" style={{ marginLeft: "80px" }}>
        <div className="p-8">
          <h2 className="text-3xl font-bold text-white-800 mb-6 text-center pt-5">Smart Transportation</h2>
          {/* Map is always visible */}
          <div className="rounded-lg shadow-lg p-6">
            <VehicleMap />
          </div>
        </div>
      </div>
    </div>
  );
}