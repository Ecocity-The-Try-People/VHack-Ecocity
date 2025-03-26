import React from "react";
import useDarkMode from "../hooks/DarkMode.jsx";
import VehicleMap from "../components/VehicleMap.jsx";
import Sidebar from "../components/Sidebar.jsx";
import TransportationVideo from "../assets/videos/transportation.mp4";

export default function TrafficPage() {
  const isDarkMode = useDarkMode();

  return (
    <div className={`relative flex min-h-screen overflow-hidden ${isDarkMode ? "bg-gray-900" : "bg-gray-50"}`}>
      <div className="fixed inset-0 z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className={`w-full h-full object-cover ${isDarkMode ? "opacity-10" : "opacity-20"}`}
        >
          <source src={TransportationVideo} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>

      <Sidebar />

      <main className={`relative z-10 ml-20 flex-grow p-6 xl:p-8 transition-all duration-300`}>
        <header className="mb-8 text-center">
          <h1 className={`text-4xl font-bold mb-2 ${isDarkMode ? "text-white" : "text-gray-800"}`}>
            Smart Transportation System
          </h1>
          <p className={`text-lg max-w-2xl mx-auto ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
            Real-time traffic monitoring and route optimization across Malaysia
          </p>
        </header>

        <div className="grid grid-cols-1 gap-6 max-w-7xl mx-auto">
          <section className={`rounded-xl shadow-lg p-0 overflow-hidden transition-all duration-300 hover:shadow-xl border ${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100"}`}>
            <div className="h-full min-h-[500px]">
              <VehicleMap />
            </div>
          </section>

          <section className={`rounded-xl shadow-lg p-6 transition-all duration-300 hover:shadow-xl border ${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100"}`}>
            <h2 className={`text-xl font-semibold mb-4 ${isDarkMode ? "text-white" : "text-gray-800"}`}>
              Traffic Overview
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className={`p-4 rounded-lg ${isDarkMode ? "bg-blue-900/30" : "bg-blue-50"}`}>
                <h3 className={`font-medium ${isDarkMode ? "text-blue-200" : "text-blue-800"}`}>Current Congestion</h3>
                <p className={`text-2xl font-bold ${isDarkMode ? "text-blue-300" : "text-blue-600"}`}>Moderate</p>
              </div>
              <div className={`p-4 rounded-lg ${isDarkMode ? "bg-amber-900/30" : "bg-amber-50"}`}>
                <h3 className={`font-medium ${isDarkMode ? "text-amber-200" : "text-amber-800"}`}>Incidents Reported</h3>
                <p className={`text-2xl font-bold ${isDarkMode ? "text-amber-300" : "text-amber-600"}`}>2</p>
              </div>
              <div className={`p-4 rounded-lg ${isDarkMode ? "bg-green-900/30" : "bg-green-50"}`}>
                <h3 className={`font-medium ${isDarkMode ? "text-green-200" : "text-green-800"}`}>Public Transport</h3>
                <p className={`text-2xl font-bold ${isDarkMode ? "text-green-300" : "text-green-600"}`}>On Schedule</p>
              </div>
            </div>
          </section>

          <section className={`rounded-xl shadow-lg p-6 transition-all duration-300 hover:shadow-xl border ${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100"}`}>
            <h2 className={`text-xl font-semibold mb-4 ${isDarkMode ? "text-white" : "text-gray-800"}`}>
              Recommended Routes
            </h2>
            <div className="space-y-3">
              <div className={`flex items-center justify-between p-3 rounded-lg ${isDarkMode ? "bg-gray-700" : "bg-gray-50 text-gray-800"}`}>
                <div>
                  <h3 className="font-medium">KLCC to Petaling Jaya</h3>
                  <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>Via Federal Highway</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm ${isDarkMode ? "bg-green-900 text-green-200" : "bg-green-100 text-green-800"}`}>
                  22 min
                </span>
              </div>
              <div className={`flex items-center justify-between p-3 rounded-lg ${isDarkMode ? "bg-gray-700" : "bg-gray-50 text-gray-800"}`}>
                <div>
                  <h3 className="font-medium">Bangsar to Mont Kiara</h3>
                  <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>Via Sprint Highway</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm ${isDarkMode ? "bg-amber-900 text-amber-200" : "bg-amber-100 text-amber-800"}`}>
                  35 min
                </span>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}