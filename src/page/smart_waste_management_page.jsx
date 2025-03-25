import React from "react";
import MapView from "../assets/components/MapView";
import RequestPickup from "../assets/components/RequestPickup";
import Sidebar from "../assets/components/Sidebar";
import EnergyVideo from "../assets/videos/energy.mp4";

export default function SmartWasteManagementPage() {
    return (
        <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
            <Sidebar />

            <div className="ml-20 flex-grow p-6 pl-10 pr-10 relative">
                <div className="fixed inset-0 z-0 overflow-hidden">
                    <video
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="w-full h-full object-cover opacity-20 dark:opacity-10 transition-opacity duration-500"
                    >
                        <source src={EnergyVideo} type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>
                </div>

                <div className="relative z-10 space-y-6">
                    <div className="text-center mb-8">
                        <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-2">
                            Smart Waste Management
                        </h1>
                        <p className="text-gray-600 dark:text-gray-300">
                            Monitor and request waste collection services in real-time
                        </p>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700">
                        <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-4">
                            Waste Collection Map
                        </h2>
                        <MapView />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700">
                            <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-4">
                                Request Collection
                            </h2>
                            <RequestPickup />
                        </div>

                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
                            <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-4">
                                Waste Collection Stats
                            </h2>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                                    <span className="text-gray-600 dark:text-gray-300">Pending Requests</span>
                                    <span className="font-bold text-blue-600 dark:text-blue-400">12</span>
                                </div>
                                <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                                    <span className="text-gray-600 dark:text-gray-300">Completed Today</span>
                                    <span className="font-bold text-green-600 dark:text-green-400">8</span>
                                </div>
                                <div className="flex items-center justify-between p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                                    <span className="text-gray-600 dark:text-gray-300">Recycling Rate</span>
                                    <span className="font-bold text-amber-600 dark:text-amber-400">67%</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}