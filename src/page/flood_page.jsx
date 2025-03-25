import Weather_box from '../assets/flood_page/weather_box';
import Notification from '../assets/flood_page/notification';
import Map from '../assets/flood_page/map';
import Sidebar from '../assets/components/Sidebar';
import React from 'react';
import FeaturesVideo from "../assets/videos/weather.mp4";
import { useEffect, useState } from "react";


export default function Flood_page() {
      const [isDarkMode, setIsDarkMode] = useState(
        document.documentElement.classList.contains("dark")
      );
    
      useEffect(() => {
        const observer = new MutationObserver((mutations) => {
          mutations.forEach((mutation) => {
            if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
              const darkMode = document.documentElement.classList.contains('dark');
              setIsDarkMode(darkMode);
              console.log("weather " + (darkMode ? "on" : "off"));
            }
          });
        });
    
        observer.observe(document.documentElement, {
          attributes: true,
          attributeFilter: ['class']
        });
    
        return () => observer.disconnect();
      }, []);
    
    return (
        <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Sidebar */}
            <Sidebar />

            {/* Main Content */}
            <div className="ml-20 flex-grow p-6 pl-10 pr-10 z-10">
                {/* Header */}
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-2">
            Weather Forecast
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
          Real-time weather and flood risk updates for Malaysia
          </p>
        </header>

                {/* Notification Button at Top Right */}
                <div className="fixed top-5 right-5 z-10 cursor-pointer">
                    <Notification />
                </div>

                {/* Weather Box */}
                <div className={`${isDarkMode ? "bg-gray-900" : "bg-white"} rounded-lg shadow-md p-6 mb-8 hover:shadow-lg transition-shadow duration-300`}>
                    <Weather_box />
                </div>

                {/* Map */}
                <div className={`${isDarkMode ? "bg-gray-700" : "bg-white"} dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300`}>
                    <Map />
                </div>
                {/* Video Background for Features Section */}
            </div>
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
    );
}