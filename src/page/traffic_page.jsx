import React, { useState, useEffect } from "react";
import useDarkMode from "../hooks/DarkMode.jsx";
import TrafficMap from "../components/TrafficMap.jsx";
import Sidebar from "../components/Sidebar.jsx";
import TransportationVideo from "../assets/videos/transportation.mp4";
import { db } from "../firebase_db/firebase";
import { collection, onSnapshot } from "firebase/firestore";

export default function TrafficPage() {

  const [vehicleData, setVehicleData] = useState([]);
  const [trafficImages, setTrafficImages] = useState([]);
  const [trafficData, setTrafficData] = useState([]);
  const [selectedTraffic, setSelectedTraffic] = useState(null);
  const isDarkMode = useDarkMode();
  const congestionColors = {
    low: "text-green-500",
    moderate: "text-yellow-500",
    high: "text-red-500",
  };

  // Fetch vehicle data
  useEffect(() => {
    const unsubscribeVehicleData = onSnapshot(collection(db, "vehicle_data"), (snapshot) => {
      const vehicles = snapshot.docs.map((doc) => ({
        id: doc.id, // Include document ID
        ...doc.data(),
      }));
      setVehicleData(vehicles);
    });

    return () => unsubscribeVehicleData();
  }, [db]);

  // Fetch traffic images data
  useEffect(() => {
    const unsubscribeTrafficImages = onSnapshot(collection(db, "traffic_image"), (snapshot) => {
      const images = snapshot.docs.map((doc) => doc.data());
      setTrafficImages(images);
    });

    return () => unsubscribeTrafficImages();
  }, [db]);

  // Merge vehicle data and traffic images
  useEffect(() => {
    if (vehicleData.length > 0 && trafficImages.length > 0) {
      const mergedData = vehicleData.map((vehicle) => {
        const matchedImage = trafficImages.find(
          (image) => image.vehicleData_DocId === vehicle.id
        );

        return {
          ...vehicle,
          traffic_img_url: matchedImage ? matchedImage.traffic_img_url : null,
        };
      });
      setTrafficData(mergedData);
    }
  }, [vehicleData, trafficImages]);

  return (
    <div className={`relative flex min-h-screen overflow-hidden ${isDarkMode ? "bg-gray-900" : "bg-gray-50"}`}>
      <div className="fixed inset-0 z-0">
        <video autoPlay loop muted playsInline className={`w-full h-full object-cover ${isDarkMode ? "opacity-10" : "opacity-20"}`}>
          <source src={TransportationVideo} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>

      <Sidebar />

      <main className={`relative z-10 ml-20 flex-grow p-6 xl:p-8 transition-all duration-300`}>
        <header className="mb-8 text-center">
          <h1 className={`text-4xl font-bold mb-2 ${isDarkMode ? "text-white" : "text-gray-800"}`}>Smart Transportation System</h1>
          <p className={`text-lg max-w-2xl mx-auto ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>Real-time traffic monitoring and route optimization across Malaysia</p>
        </header>

        <div className="grid grid-cols-1 gap-6 max-w-5xl mx-auto">
          <section className={`rounded-xl shadow-lg p-0 overflow-hidden transition-all duration-300 hover:shadow-xl border ${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100"}`}>
            <div className="h-full min-h-[500px]">
              <TrafficMap trafficData={trafficData} onSelectTraffic={setSelectedTraffic} />
            </div>
          </section>

          <section className={`rounded-xl shadow-lg p-6 transition-all duration-300 hover:shadow-xl border ${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100"}`}>
            <h2 className={` text-xl font-semibold mb-4 ${isDarkMode ? "text-white" : "text-gray-800"}`}>Traffic Overview</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {selectedTraffic ? (
                <>
                  {/* Current Congestion */}
                  <div className={`p-4 rounded-lg ${isDarkMode ? "bg-blue-900/30" : "bg-blue-50"}`}>
                    <h3 className={`font-medium ${isDarkMode ? "text-blue-200" : "text-blue-800"}`}>Current Congestion</h3>
                    <p className={`text-2xl font-bold ${congestionColors[selectedTraffic.congestionLevel?.toLowerCase()] || "text-gray-400"}`}>
                      {selectedTraffic.congestionLevel
                        ? selectedTraffic.congestionLevel.charAt(0).toUpperCase() + selectedTraffic.congestionLevel.slice(1)
                        : "Loading..."}
                    </p>
                  </div>

                  {/* Vehicles Reported */}
                  <div className={`p-4 rounded-lg ${isDarkMode ? "bg-amber-900/30" : "bg-amber-50"}`}>
                    <h3 className={`font-medium ${isDarkMode ? "text-amber-200" : "text-amber-800"}`}>Vehicles Reported</h3>
                    <p className={`text-2xl font-bold ${isDarkMode ? "text-amber-300" : "text-amber-600"}`}>
                      {selectedTraffic.vehicleNum || "0"}
                    </p>
                  </div>

                  {/* Suggestion */}
                  <div className={`p-4 rounded-lg ${isDarkMode ? "bg-green-900/30" : "bg-green-50"}`}>
                    <h3 className={`font-medium ${isDarkMode ? "text-green-200" : "text-green-800"}`}>Suggestion</h3>
                    <p className={`text-xl font-bold ${isDarkMode ? "text-green-300" : "text-green-600"}`}>
                      {selectedTraffic.suggestion || "Loading..."}
                    </p>
                  </div>
                </>
              ) : (
                <p className={`text-center col-span-3 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>Click on a traffic marker to view details.</p>
              )}
            </div>
          </section>

          <section className={`rounded-xl shadow-lg p-6 transition-all duration-300 hover:shadow-xl border ${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100"}`}>
            <h2 className={`text-xl font-semibold mb-4 ${isDarkMode ? "text-white" : "text-gray-800"}`}>CCTV Camera Feed</h2>
            <div className="space-y-3">
              {selectedTraffic?.traffic_img_url ? (
                <div className="w-full">
                  <img
                    src={selectedTraffic.traffic_img_url}
                    alt="Traffic CCTV"
                    className="w-full h-auto min-h-[350px] rounded-lg object-cover"
                  />
                </div>
              ) : (
                <div className={`flex items-center justify-between p-3 rounded-lg ${isDarkMode ? "bg-gray-700" : "bg-gray-50 text-gray-800"}`}>
                  <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>No images available</p>
                </div>
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};


