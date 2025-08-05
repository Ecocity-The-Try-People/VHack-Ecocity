import Weather_box from '../components/weatherPage/weather_box';
import Notification from '../components/weatherPage/notification';
import WeatherFloodMap from '../components/weatherPage/map';
import Sidebar from '../components/Sidebar';
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
        <div className={`flex w-screen min-h-screen ${isDarkMode ? "bg-gray-900" : "bg-gray-50"}`}>
            {/* Sidebar */}
            <Sidebar />

            {/* Main Content */}
            <div className="ml-20 flex-grow p-6 pl-10 pr-10 z-10">
                {/* Header */}
        <header className="mb-8 text-center">
          <h1 className={`text-4xl font-bold ${isDarkMode ? "text-white" : "text-gray-800"} mb-2`}>
            Weather Forecast
          </h1>
          <p className={`text-lg ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
          Real-time weather and flood risk updates for Malaysia
          </p>
        </header>

                <div className="fixed top-5 right-5 z-10 cursor-pointer">
                    <Notification />
                </div>

                <div className={`${isDarkMode ? "bg-gray-900" : "bg-white"} rounded-lg shadow-md p-6 mb-8 hover:shadow-lg transition-shadow duration-300`}>
                    <Weather_box />
                </div>

                {/* Map */}
                <div className={`${isDarkMode ? "bg-gray-900" : "bg-white"} rounded-lg shadow-md p-6`}>
                    <WeatherFloodMap />
                </div>
            </div>
            <div className="fixed inset-0 z-0 overflow-hidden">
                <video
                    autoPlay
                    loop
                    muted
                    className="w-full h-full object-cover opacity-50"
                >
                    <source src={FeaturesVideo} type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
            </div>
        </div>
    );
}