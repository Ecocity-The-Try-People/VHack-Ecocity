import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import garbage from "../../assets/png/garbage.png";

const RecenterButton = ({ position }) => {
  const map = useMap();
  
  const handleClick = () => {
    map.flyTo(position, map.getZoom(), {
      duration: 0.25,
      easeLinearity: 0.25
    });
  };

  return (
    <button
      className="recenter-button bg-gray-800 text-white p-2 rounded-full shadow-lg hover:bg-gray-700 transition-colors"
      onClick={handleClick}
      style={{
        position: 'absolute',
        bottom: '20px',
        right: '20px',
        zIndex: 1000
      }}
      aria-label="Recenter to my location"
    >
      <i className="fa-solid fa-location-crosshairs"></i>
    </button>
  );
};

const MapView = () => {
  const [userPosition, setUserPosition] = useState(null);
  const [garbageTruckPosition, setGarbageTruckPosition] = useState([3.139, 101.686]);

  const redIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });

  const truckIcon = new L.Icon({
    iconUrl: garbage,
    iconSize: [40, 40],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
  });

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserPosition([latitude, longitude]);
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
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
    <div style={{ position: 'relative', height: '400px', width: '100%' }}>
      <MapContainer 
        center={userPosition || garbageTruckPosition}
        zoom={13} 
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer 
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        {userPosition && (
          <>
            <Marker position={userPosition} icon={redIcon}>
              <Popup>Your Location</Popup>
            </Marker>
            <RecenterButton position={userPosition} />
          </>
        )}

        <Marker position={garbageTruckPosition} icon={truckIcon}>
          <Popup>Garbage Truck Location</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default MapView;