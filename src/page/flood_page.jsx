import Weather_box from '../assets/flood_page/weather_box';
import Notification from '../assets/flood_page/notification';
import Map from '../assets/flood_page/map';
import Sidebar from '../assets/components/Sidebar';
import React from 'react';
import FeaturesVideo from "../assets/videos/weather.mp4";

export default function Flood_page() {
    return (
        <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Sidebar */}
            <Sidebar />

            {/* Main Content */}
            <div className="ml-20 flex-grow p-6 pl-10 pr-10">
                {/* Header Section */}
                <div className="mb-6">
                    {/* Centered h2 */}
                    <div className="flex justify-center">
                        <h2 className="text-2xl font-bold text-white-800 z-10">
                            Weather Forecast
                        </h2>
                    </div>
                </div>

                {/* Notification Button at Top Right */}
                <div className="fixed top-5 right-5 z-10">
                    <Notification />
                </div>

                {/* Weather Box */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8 hover:shadow-lg transition-shadow duration-300">
                    <Weather_box />
                </div>

                {/* Map */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
                    <Map />
                </div>
                {/* Video Background for Features Section */}
        <div className="fixed inset-0 z-0 overflow-hidden">
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
            </div>
        </div>
    );
}