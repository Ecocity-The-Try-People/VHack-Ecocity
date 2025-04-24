import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import RecenterButton from "../smart_waste_management/RecenterButton"; // Import the new component
import garbageIcon from '../../assets/png/garbage.png';

// Truck icon
const truckIcon = new L.Icon({
  iconUrl: garbageIcon,
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -40]
});

// Bin icon
const binIcon = new L.Icon({
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const MapView = ({ bins }) => {
  const [truckPosition, setTruckPosition] = useState([3.1390, 101.6869]);
  const [truckStatus, setTruckStatus] = useState("En route to Main Square");
  
  // Simulate truck movement
  useEffect(() => {
    const interval = setInterval(() => {
      setTruckPosition(prev => {
        // Move truck randomly around the center
        const newLat = prev[0] + (Math.random() - 0.5) * 0.005;
        const newLng = prev[1] + (Math.random() - 0.5) * 0.005;
        return [newLat, newLng];
      });
      
      // Update status randomly
      const statuses = [
        "En route to Main Square",
        "Collecting waste",
        "En route to disposal site",
        "Idle at depot"
      ];
      setTruckStatus(statuses[Math.floor(Math.random() * statuses.length)]);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ height: "100%", width: "100%", position: "relative" }}>
      <MapContainer 
        center={[3.1390, 101.6869]}
        zoom={15} 
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        {/* Waste bins */}
        {bins.map(bin => (
          <Marker 
          key={`bin-${bin.id}`} 
          position={
            bin.coordinates && typeof bin.coordinates.latitude === 'number' 
              ? [bin.coordinates.latitude, bin.coordinates.longitude]  // GeoPoint → [lat, lng]
              : [3.1390, 101.6869]  // Fallback to default (Kuala Lumpur)
          }
          icon={binIcon}
          >
            <Popup>
              <div className="font-medium">{bin.location}</div>
              <div className="flex items-center">
                <span className="w-24">Fill Level:</span>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className={`h-2.5 rounded-full ${
                      bin.fillLevel > 85 ? 'bg-red-500' : 
                      bin.fillLevel > 60 ? 'bg-amber-500' : 'bg-green-500'
                    }`}
                    style={{ width: `${bin.fillLevel}%` }}
                  ></div>
                </div>
                <span className="ml-2 font-bold">{bin.fillLevel}%</span>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Garbage truck */}
        <Marker 
          position={truckPosition}
          icon={truckIcon}
        >
          <Popup>
            <div className="font-bold">Waste Collection Truck</div>
            <div className="text-sm">Status: {truckStatus}</div>
            <div className="text-xs text-gray-500 mt-1">
              Last updated: {new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false })}
            </div>
          </Popup>
        </Marker>

        {/* Add the RecenterButton inside MapContainer */}
        <RecenterButton position={truckPosition} />
      </MapContainer>
    </div>
  );
};

export default MapView;