import React, { useState, useEffect } from "react";
import useDarkMode from "../hooks/DarkMode.jsx";
import Sidebar from "../components/Sidebar.jsx";
import EnergyVideo from "../assets/videos/energy.mp4";
import CitizenRewards from '../components/smart_waste_management/CitizenRewards';
import RequestPickup from '../components/smart_waste_management/RequestPickup';
import MapView from '../components/smart_waste_management/MapView';
import { db } from '../../config/firebase';
import { collection, onSnapshot } from 'firebase/firestore';

export default function SmartWasteManagementPage() {
    const isDarkMode = useDarkMode();
    const [bins, setBins] = useState([]);
    const [requests, setRequests] = useState([
        { id: 1, status: 'pending', location: 'Main Square', type: 'Plastic' },
        { id: 2, status: 'completed', location: 'Central Park', type: 'Organic' }
    ]);

    // Fetch bin data from Firebase
    useEffect(() => {
        const unsubscribe = onSnapshot(
            collection(db, 'bins'),
            (snapshot) => {
                const binsData = snapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setBins(binsData);
            },
            (err) => {
                console.error("Failed to fetch bin data:", err);
            }
        );

        return () => unsubscribe();
    }, []);

    return (
        <div className={`flex w-screen min-h-screen transition-colors duration-300 ${isDarkMode ? "bg-gray-900" : "bg-gray-50"}`}>
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

                    {/* Map Section (now the primary component) */}
                    <div className={`rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 border ${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}>
                        <h2 className={`text-xl font-semibold mb-4 ${isDarkMode ? "text-gray-200" : "text-gray-700"}`}>
                            Waste Collection Overview
                        </h2>
                        <div className="h-96 w-full">
                            <MapView bins={bins} />
                        </div>
                    </div>

                    {/* Request and Community Sections */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className={`rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 border ${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}>
                            <h2 className={`text-xl font-semibold mb-4 ${isDarkMode ? "text-gray-200" : "text-gray-700"}`}>
                                Request Pickup
                            </h2>
                            <RequestPickup />
                        </div>

                        <div className={`rounded-xl shadow-lg p-6 border transition-all duration-300 ${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}>
                            <h2 className={`text-xl font-semibold mb-4 ${isDarkMode ? "text-gray-200" : "text-gray-700"}`}>
                                Community Rewards
                            </h2>
                            <CitizenRewards />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}