import React, { useState } from "react";
import useDarkMode from "../hooks/DarkMode.jsx";
import Sidebar from "../components/Sidebar.jsx";
import EnergyVideo from "../assets/videos/energy.mp4";
import BinSensors from '../components/smart_waste_management/BinSensors';
import RouteOptimizer from '../components/smart_waste_management/RouteOptimizer';
import EquipmentHealth from '../components/smart_waste_management/EquipmentHealth';
import CitizenRewards from '../components/smart_waste_management/CitizenRewards';
import RequestPickup from '../components/smart_waste_management/RequestPickup';
import MapView from '../components/smart_waste_management/MapView';

export default function SmartWasteManagementPage() {
    const isDarkMode = useDarkMode();
    const [bins, setBins] = useState([]);
    const [requests, setRequests] = useState([
        { id: 1, status: 'pending', location: 'Main Square', type: 'Plastic' },
        { id: 2, status: 'completed', location: 'Central Park', type: 'Organic' }
    ]);

    return (
        <div className={`flex min-h-screen transition-colors duration-300 ${isDarkMode ? "bg-gray-900" : "bg-gray-50"}`}>
            <Sidebar />

            <div className="ml-20 flex-grow p-6 pl-10 pr-10 relative">
                {/* Background Video */}
                <div className="fixed inset-0 z-0 overflow-hidden">
                    <video
                        autoPlay
                        loop
                        muted
                        playsInline
                        className={`w-full h-full object-cover transition-opacity duration-500 ${isDarkMode ? "opacity-10" : "opacity-20"}`}
                    >
                        <source src={EnergyVideo} type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>
                </div>

                <div className="relative z-10 space-y-6">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <h1 className={`text-4xl font-bold mb-2 ${isDarkMode ? "text-white" : "text-gray-800"}`}>
                            Smart Waste Management
                        </h1>
                        <p className={`${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                            IoT-powered waste monitoring and optimized collection system
                        </p>
                    </div>

                    {/* IoT Sensor Grid */}
                    <div className={`rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 border ${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}>
                        <h2 className={`text-xl font-semibold mb-4 ${isDarkMode ? "text-gray-200" : "text-gray-700"}`}>
                            Live Bin Monitoring
                        </h2>
                        <BinSensors onUpdate={setBins} />
                    </div>

                    {/* Map and Route Optimization */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className={`rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 border ${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}>
                            <h2 className={`text-xl font-semibold mb-4 ${isDarkMode ? "text-gray-200" : "text-gray-700"}`}>
                                Collection Map & Truck Tracker
                            </h2>
                            <div className="h-96 w-full">
                                <MapView bins={bins} />
                            </div>
                        </div>

                        <div className={`rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 border ${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}>
                            <h2 className={`text-xl font-semibold mb-4 ${isDarkMode ? "text-gray-200" : "text-gray-700"}`}>
                                Route Optimization
                            </h2>
                            <RouteOptimizer bins={bins} />
                        </div>
                    </div>

                    {/* Request and Equipment */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className={`rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 border ${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}>
                            <h2 className={`text-xl font-semibold mb-4 ${isDarkMode ? "text-gray-200" : "text-gray-700"}`}>
                                Request Pickup
                            </h2>
                            <RequestPickup />
                        </div>

                        <div className={`rounded-xl shadow-lg p-6 border transition-all duration-300 ${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}>
                            <h2 className={`text-xl font-semibold mb-4 ${isDarkMode ? "text-gray-200" : "text-gray-700"}`}>
                                Equipment Health
                            </h2>
                            <EquipmentHealth />
                        </div>
                    </div>

                    {/* Community and Stats */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className={`rounded-xl shadow-lg p-6 border transition-all duration-300 ${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}>
                            <h2 className={`text-xl font-semibold mb-4 ${isDarkMode ? "text-gray-200" : "text-gray-700"}`}>
                                Community Rewards
                            </h2>
                            <CitizenRewards />
                        </div>

                        <div className={`rounded-xl shadow-lg p-6 border transition-all duration-300 ${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}>
                            <h2 className={`text-xl font-semibold mb-4 ${isDarkMode ? "text-gray-200" : "text-gray-700"}`}>
                                Collection Statistics
                            </h2>
                            <div className="space-y-4">
                                <div className={`flex items-center justify-between p-3 rounded-lg ${isDarkMode ? "bg-blue-900/20" : "bg-blue-50"}`}>
                                    <span className={`${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>Pending Requests</span>
                                    <span className={`font-bold ${isDarkMode ? "text-blue-400" : "text-blue-600"}`}>
                                        {requests.filter(r => r.status === 'pending').length}
                                    </span>
                                </div>
                                <div className={`flex items-center justify-between p-3 rounded-lg ${isDarkMode ? "bg-green-900/20" : "bg-green-50"}`}>
                                    <span className={`${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>Completed Today</span>
                                    <span className={`font-bold ${isDarkMode ? "text-green-400" : "text-green-600"}`}>
                                        {requests.filter(r => r.status === 'completed').length}
                                    </span>
                                </div>
                                <div className={`flex items-center justify-between p-3 rounded-lg ${isDarkMode ? "bg-amber-900/20" : "bg-amber-50"}`}>
                                    <span className={`${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>Recycling Rate</span>
                                    <span className={`font-bold ${isDarkMode ? "text-amber-400" : "text-amber-600"}`}>67%</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}