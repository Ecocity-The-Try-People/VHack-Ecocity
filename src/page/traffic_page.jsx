import React, { useState, useEffect } from "react";
import useDarkMode from "../hooks/DarkMode.jsx";
import TrafficMap from "../components/traffic_managemnet/TrafficMap.jsx";
import Sidebar from "../components/Sidebar.jsx";
import TransportationVideo from "../assets/videos/transportation.mp4";
import { db } from "../../config/firebase";
import { collection, getDocs, getDoc, doc } from "firebase/firestore";

export default function TrafficPage() {
  const [trafficData, setTrafficData] = useState([]);
  const [selectedTraffic, setSelectedTraffic] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const isDarkMode = useDarkMode();

  const congestionColors = {
    low: "text-green-500",
    moderate: "text-yellow-500",
    high: "text-red-500",
  };

  useEffect(() => {
    const fetchTrafficData = async () => {
      try {
        setIsLoading(true);
        const snapshot = await getDocs(collection(db, "locations"));
        const locationDocs = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        const trafficInfo = await Promise.all(locationDocs.map(async loc => {
          const [vehicleSnap, imageSnap] = await Promise.all([
            getDoc(doc(db, "vehicle_data", loc.latest_vehicleData_DocId)),
            getDoc(doc(db, "traffic_image", loc.latest_trafficImage_DocId))
          ]);

          return {
            locationName: loc.name,
            lat: loc.lat,
            lon: loc.lon,
            lastUpdated: loc.lastUpdated,
            vehicleNum: vehicleSnap.data()?.vehicleNum ?? 0,
            suggestion: vehicleSnap.data()?.suggestion ?? "No suggestion",
            congestionLevel: vehicleSnap.data()?.congestionLevel ?? "Unknown",
            traffic_img_url: imageSnap.data()?.traffic_img_url ?? null,
          };
        }));

        setTrafficData(trafficInfo);
      } catch (error) {
        console.error("Error fetching traffic data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTrafficData();
  }, []);

  return (
<div className={`flex w-screen h-screen transition-colors duration-300 ${isDarkMode ? "bg-gray-900" : "bg-gray-50"}`}>
      <Sidebar />

      <div className="ml-20 flex-grow p-6 pl-10 pr-10 relative">
        <div className="fixed inset-0 z-0 overflow-hidden">
          <video
            autoPlay
            loop
            muted
            playsInline
            className={`w-full h-full object-cover transition-opacity duration-500 ${isDarkMode ? "opacity-10" : "opacity-20"}`}
          >
            <source src={TransportationVideo} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>

        <div className="relative z-10 space-y-6">
          <div className="text-center mb-8">
            <h1 className={`text-4xl font-bold mb-2 ${isDarkMode ? "text-white" : "text-gray-800"}`}>
              Smart Transportation System
            </h1>
            <p className={`${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
              Real-time traffic monitoring and route optimization across Malaysia
            </p>
          </div>

          {/* Main Map Section */}
          <div className={`rounded-xl shadow-lg p-0 overflow-hidden hover:shadow-xl transition-all duration-300 border ${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}>
            <div className="h-full min-h-[500px]">
              {isLoading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="animate-pulse text-gray-400">Loading map data...</div>
                </div>
              ) : (
                <TrafficMap 
                trafficData={trafficData} 
                onSelectTraffic={setSelectedTraffic} 
                isDarkMode={isDarkMode} 
                />
              )}
            </div>
          </div>

              {/* Suggestion Card (Full Width) */}
              {selectedTraffic && (
                <div className={`rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 border ${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}>
                  <h2 className={`text-xl font-semibold mb-4 ${isDarkMode ? "text-gray-200" : "text-gray-700"}`}>
                    Route Suggestion
                  </h2>
                  <div className={`p-4 rounded-lg ${isDarkMode ? "bg-purple-900/20" : "bg-purple-50"}`}>
                    <p className={`${isDarkMode ? "text-purple-200" : "text-purple-800"}`}>
                      {selectedTraffic.suggestion || "No suggestion available"}
                    </p>
                  </div>
                </div>
              )}

          {/* Stats Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Traffic Overview Card */}
            <div className={`rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 border ${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}>
              <h2 className={`text-xl font-semibold mb-4 ${isDarkMode ? "text-gray-200" : "text-gray-700"}`}>
                Traffic Overview
              </h2>
              
              <div className="space-y-4">
                {selectedTraffic ? (
                  <>
                    <div className={`flex items-center justify-between p-3 rounded-lg ${isDarkMode ? "bg-blue-900/20" : "bg-blue-50"}`}>
                      <span className={`${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>Current Location</span>
                      <span className={`font-bold ${isDarkMode ? "text-blue-400" : "text-blue-600"}`}>
                        {selectedTraffic.locationName}
                      </span>
                    </div>
                    
                    <div className={`flex items-center justify-between p-3 rounded-lg ${isDarkMode ? "bg-amber-900/20" : "bg-amber-50"}`}>
                      <span className={`${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>Congestion Level</span>
                      <span className={`font-bold ${congestionColors[selectedTraffic.congestionLevel?.toLowerCase()] || "text-gray-400"}`}>
                        {selectedTraffic.congestionLevel?.charAt(0).toUpperCase() + selectedTraffic.congestionLevel?.slice(1) || "Unknown"}
                      </span>
                    </div>
                    
                    <div className={`flex items-center justify-between p-3 rounded-lg ${isDarkMode ? "bg-green-900/20" : "bg-green-50"}`}>
                      <span className={`${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>Vehicles Detected</span>
                      <span className={`font-bold ${isDarkMode ? "text-green-400" : "text-green-600"}`}>
                        {selectedTraffic.vehicleNum}
                      </span>
                    </div>
                  </>
                ) : (
                  <div className={`text-center py-8 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                    Select a location on the map to view details
                  </div>
                )}
              </div>
            </div>

            {/* CCTV Feed Card */}
            <div className={`rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 border ${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}>
              <h2 className={`text-xl font-semibold mb-4 ${isDarkMode ? "text-gray-200" : "text-gray-700"}`}>
                CCTV Camera Feed
              </h2>
              
              <div className={`flex items-center justify-center ${isDarkMode ? "dark:bg-gray-700" : "bg-gray-100"} rounded-lg overflow-hidden min-h-[200px]`}>
                {selectedTraffic?.traffic_img_url ? (
                  <img
                    src={selectedTraffic.traffic_img_url}
                    alt="Traffic CCTV"
                    className="w-full h-auto max-h-[300px] object-contain"
                  />
                ) : (
                  <div className={`py-8 text-center ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                    {selectedTraffic ? "No image available" : "Select a location to view feed"}
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}