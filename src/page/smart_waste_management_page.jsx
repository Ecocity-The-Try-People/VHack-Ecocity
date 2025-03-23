import React from "react";
import MapView from "../assets/components/MapView";
import RequestPickup from "../assets/components/RequestPickup";
import Sidebar from "../assets/components/Sidebar";
import EnergyVideo from "../assets/videos/energy.mp4"; // Import the fourth video file

export default function SmartWasteManagementPage() {
    return (
        <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Sidebar */}
            <Sidebar />

            {/* Main Content */}
            <div className="ml-20 flex-grow p-6 pl-10 pr-10 relative">
                {/* Video Background */}
                <div className="fixed inset-0 z-0 overflow-hidden">
                    <video
                        autoPlay
                        loop
                        muted
                        className="w-full h-full object-cover opacity-20 dark:opacity-10"
                    >
                        <source src={EnergyVideo} type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>
                </div>

                {/* Page Title */}
                <h1 className="text-2xl font-bold text-center text-[var(--primary-color)] dark:text-gray-100 mb-6 relative z-10">
                    Smart Waste Management
                </h1>

                {/* MapView Card */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6 hover:shadow-lg transition-shadow duration-300 relative z-10">
                    <MapView />
                </div>

                {/* RequestPickup Card */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
                        <RequestPickup />
                    </div>
                </div>
            </div>
        </div>
    );
}