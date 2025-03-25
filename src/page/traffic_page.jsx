import React from "react";
import VehicleMap from "../assets/VehicleMap.jsx";
import Sidebar from "../assets/components/Sidebar.jsx";
import TransportationVideo from "../assets/videos/transportation.mp4";
import Notification from "../assets/flood_page/notification";

export default function TrafficPage() {
  return (
    <div className="relative flex min-h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden">
      <div className="fixed inset-0 z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover opacity-20 dark:opacity-10"
        >
          <source src={TransportationVideo} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>

      <Sidebar />

      <main className="relative z-10 ml-20 flex-grow p-6 xl:p-8 transition-all duration-300">
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-2">
            Smart Transportation System
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Real-time traffic monitoring and route optimization across Malaysia
          </p>
        </header>

        <div className="grid grid-cols-1 gap-6 max-w-7xl mx-auto">
          <section className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-0 overflow-hidden transition-all duration-300 hover:shadow-xl border border-gray-100 dark:border-gray-700">
            <div className="h-full min-h-[500px]">
              <VehicleMap />
            </div>
          </section>

          <section className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 transition-all duration-300 hover:shadow-xl border border-gray-100 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
              Traffic Overview
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg">
                <h3 className="font-medium text-blue-800 dark:text-blue-200">Current Congestion</h3>
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-300">Moderate</p>
              </div>
              <div className="bg-amber-50 dark:bg-amber-900/30 p-4 rounded-lg">
                <h3 className="font-medium text-amber-800 dark:text-amber-200">Incidents Reported</h3>
                <p className="text-2xl font-bold text-amber-600 dark:text-amber-300">2</p>
              </div>
              <div className="bg-green-50 dark:bg-green-900/30 p-4 rounded-lg">
                <h3 className="font-medium text-green-800 dark:text-green-200">Public Transport</h3>
                <p className="text-2xl font-bold text-green-600 dark:text-green-300">On Schedule</p>
              </div>
            </div>
          </section>

          <section className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 transition-all duration-300 hover:shadow-xl border border-gray-100 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
              Recommended Routes
            </h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div>
                  <h3 className="font-medium">KLCC to Petaling Jaya</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Via Federal Highway</p>
                </div>
                <span className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-3 py-1 rounded-full text-sm">
                  22 min
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div>
                  <h3 className="font-medium">Bangsar to Mont Kiara</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Via Sprint Highway</p>
                </div>
                <span className="bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-200 px-3 py-1 rounded-full text-sm">
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