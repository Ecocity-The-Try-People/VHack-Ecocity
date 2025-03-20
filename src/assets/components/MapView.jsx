import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const MapView = () => {
  // 
  const [userPosition, setUserPosition] = useState(null);
  // 
  const [garbageTruckPosition, setGarbageTruckPosition] = useState([3.139, 101.686]);

  // 
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserPosition([latitude, longitude]);
        },
        (error) => {
          console.error("error catching location:", error);
        }
      );
    } else {
      console.error("Error");
    }
  }, []);

  
  useEffect(() => {
    const interval = setInterval(() => {
      setGarbageTruckPosition((prev) => [
        prev[0] + (Math.random() - 0.5) * 0.01,
        prev[1] + (Math.random() - 0.5) * 0.01,
      ]);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <MapContainer 
      center={userPosition || garbageTruckPosition}
      zoom={13} 
      style={{ height: "400px", width: "100%" }}
    >
   
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

   
      {userPosition && (
        <Marker position={userPosition}>
          <Popup> Your Location</Popup>
        </Marker>
      )}

     
      <Marker position={garbageTruckPosition}>
        <Popup> Garbage car location</Popup>
      </Marker>
    </MapContainer>
  );
};

export default MapView;
