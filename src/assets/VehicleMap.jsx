import { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./BusTracker.css";

import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

const DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

L.Marker.prototype.options.icon = DefaultIcon;

// GTFS-Realtime API endpoint
const GTFS_API_URL = "https://api.data.gov.my/gtfs-realtime/vehicle-position/prasarana?category=rapid-bus-kl";

// Mock vehicle positions for fallback
const mockVehiclePositions = [
  {
    id: "1",
    name: "Bus 123",
    position: [3.212, 101.579],
    speed: 30,
  },
  {
    id: "2",
    name: "Bus 456",
    position: [3.220, 101.585],
    speed: 25,
  },
];

// Example static GTFS data (replace with real data or API call)
const staticStops = [
  { id: "1", name: "Sungai Buloh Station", type: "MRT", position: [3.212, 101.579] },
  { id: "2", name: "Bukit Rahman Putra Bus Stop", type: "Bus", position: [3.220, 101.585] },
  { id: "3", name: "Kampung Selamat LRT Station", type: "LRT", position: [3.225, 101.590] },
  { id: "4", name: "Kwasa Damansara MRT Station", type: "MRT", position: [3.230, 101.595] },
];

// Mock data for stations
const stations = [
  { id: 1, name: "Sungai Buloh", position: [3.212, 101.579], scheduledArrival: "08:00" },
  { id: 2, name: "Bukit Rahman Putra", position: [3.220, 101.585], scheduledArrival: "08:15" },
  { id: 3, name: "Kampung Selamat", position: [3.225, 101.590], scheduledArrival: "08:30" },
  { id: 4, name: "Kwasa Damansara", position: [3.230, 101.595], scheduledArrival: "08:45" },
];

// Component to handle recentering the map
const RecenterButton = ({ position }) => {
  const map = useMap();
  const handleRecenter = () => map.setView(position, map.getZoom());
  return (
    <button className="recenter-button" onClick={handleRecenter}>
      <i className="fa-solid fa-location-crosshairs"></i>
    </button>
  );
};

// Bus Tracker Component
const BusTracker = () => {
  const [busPosition, setBusPosition] = useState(stations[0].position);
  const [routePath, setRoutePath] = useState([]);
  const [currentPathIndex, setCurrentPathIndex] = useState(0);
  const [isMovingForward, setIsMovingForward] = useState(true);
  const animationRef = useRef(null);

  useEffect(() => {
    const fetchRoute = async () => {
      const coordinates = stations.map((station) => station.position.reverse().join(",")).join(";");
      const url = `https://router.project-osrm.org/route/v1/driving/${coordinates}?overview=full&geometries=geojson`;

      try {
        const response = await fetch(url);
        const data = await response.json();
        if (data.routes && data.routes[0]) {
          const path = data.routes[0].geometry.coordinates.map((coord) => [coord[1], coord[0]]);
          setRoutePath(path);
        }
      } catch (error) {
        console.error("Failed to fetch route:", error);
      }
    };

    fetchRoute();
  }, []);

  useEffect(() => {
    if (routePath.length === 0) return;

    const moveBus = () => {
      setCurrentPathIndex((prevIndex) => {
        let nextIndex;
        if (isMovingForward) {
          nextIndex = prevIndex + 1;
          if (nextIndex >= routePath.length) {
            setIsMovingForward(false);
            return prevIndex;
          }
        } else {
          nextIndex = prevIndex - 1;
          if (nextIndex < 0) {
            setIsMovingForward(true);
            return prevIndex;
          }
        }

        const isAtStation = stations.some(
          (station) =>
            station.position[0] === routePath[nextIndex][0] &&
            station.position[1] === routePath[nextIndex][1]
        );

        if (isAtStation) {
          clearInterval(animationRef.current);
          setTimeout(() => {
            animationRef.current = setInterval(moveBus, 500);
          }, Math.random() * 3000 + 2000);
        }

        setBusPosition(routePath[nextIndex]);
        return nextIndex;
      });
    };

    animationRef.current = setInterval(moveBus, 500);

    return () => {
      if (animationRef.current) clearInterval(animationRef.current);
    };
  }, [routePath, isMovingForward]);

  const busIcon = new L.Icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/128/3126/3126531.png",
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40],
  });

  return (
    <>
      <Marker position={busPosition} icon={busIcon}>
        <Popup>Bus is here!</Popup>
      </Marker>
      {routePath.length > 0 && (
        <Polyline positions={routePath} color="cyan" weight={4} opacity={0.8} />
      )}
    </>
  );
};

// Vehicle Map Component
const VehicleMap = () => {
  const [vehiclePositions, setVehiclePositions] = useState([]);
  const [destinationCoords, setDestinationCoords] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [destinationQuery, setDestinationQuery] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [routePath, setRoutePath] = useState([]);
  const [routeDetails, setRouteDetails] = useState({ distance: null, duration: null });
  const [eta, setEta] = useState(null);

  // Custom icons
  const userIcon = L.icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/128/684/684908.png",
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });

  const vehicleIcon = L.icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/128/3126/3126531.png",
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40],
  });

  const stopIcon = L.icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/128/484/484167.png",
    iconSize: [25, 25],
    iconAnchor: [12, 25],
    popupAnchor: [0, -25],
  });

  // Fetch GTFS-Realtime data
  const fetchGTFSData = async () => {
    try {
      const response = await fetch(GTFS_API_URL);
      if (!response.ok) throw new Error("Failed to fetch GTFS-Realtime data");
      const data = await response.json();
      console.log("API Response:", data);

      if (!data.entity || data.entity.length === 0) {
        throw new Error("No real-time data available");
      }

      const positions = data.entity
        .filter((entity) => entity.vehicle)
        .map((entity) => ({
          id: entity.id,
          name: entity.vehicle.vehicle.label,
          position: [entity.vehicle.position.latitude, entity.vehicle.position.longitude],
          speed: entity.vehicle.position.speed || 30,
        }));

      if (positions.length === 0) {
        throw new Error("No vehicle positions found");
      }

      setVehiclePositions(positions);
    } catch (error) {
      console.error("Error fetching GTFS-Realtime data:", error);
      setError("Failed to fetch real-time vehicle data. Using mock data.");
      setVehiclePositions(mockVehiclePositions);
    }
  };

  // Poll GTFS-Realtime API every 30 seconds
  useEffect(() => {
    fetchGTFSData();
    const interval = setInterval(fetchGTFSData, 30000);
    return () => clearInterval(interval);
  }, []);

  // Get user's current location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => setUserLocation([position.coords.latitude, position.coords.longitude]),
        (error) => {
          console.error("Error fetching user location:", error);
          setError("Failed to fetch your location. Using default location.");
          setUserLocation([3.212, 101.579]);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
      setError("Geolocation is not supported. Using default location.");
      setUserLocation([3.212, 101.579]);
    }
  }, []);

  // Geocode destination using Nominatim API
  const geocodeDestination = async (query) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`
      );
      if (!response.ok) throw new Error("Failed to geocode destination");
      const data = await response.json();
      if (data.length > 0) {
        const { lat, lon } = data[0];
        setDestinationCoords([parseFloat(lat), parseFloat(lon)]);
      } else {
        throw new Error("No results found");
      }
    } catch (error) {
      console.error("Error geocoding destination:", error);
      setError("Failed to find the destination. Please try again.");
    }
  };

  // Fetch route from user location to destination
  const fetchRoute = async () => {
    if (!userLocation || !destinationCoords) return;
    setIsLoading(true);
    try {
      const coordinates = [userLocation, destinationCoords]
        .map((pos) => [...pos].reverse().join(","))
        .join(";");
      const url = `https://router.project-osrm.org/route/v1/driving/${coordinates}?overview=full&geometries=geojson`;
      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch route");
      const data = await response.json();
      if (data.routes && data.routes[0]) {
        const path = data.routes[0].geometry.coordinates.map((coord) => [coord[1], coord[0]]);
        setRoutePath(path);

        // Store route details
        setRouteDetails({
          distance: (data.routes[0].distance / 1000).toFixed(2), // Distance in km
          duration: data.routes[0].duration, // Duration in seconds
        });

        // Calculate ETA
        const now = new Date();
        const etaTime = new Date(now.getTime() + data.routes[0].duration * 1000);
        setEta(etaTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false }));
      } else {
        throw new Error("No route found");
      }
    } catch (error) {
      console.error("Failed to fetch route:", error);
      setError("Failed to fetch the route. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle destination search
  const handleDestinationSearch = async () => {
    if (!destinationQuery) {
      setError("Please enter a destination.");
      return;
    }
    setIsLoading(true);
    try {
      await geocodeDestination(destinationQuery);
    } catch (error) {
      console.error("Error handling destination search:", error);
      setError("Failed to find the destination. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch route when destination coordinates change
  useEffect(() => {
    if (destinationCoords) {
      fetchRoute();
    }
  }, [destinationCoords]);

  return (
    <div className="map-container">
      <div className="sidebar">
        <h2>Route Planner</h2>
        <div>
          <label>Destination:</label>
          <input
            type="text"
            placeholder="Enter destination"
            value={destinationQuery}
            onChange={(e) => setDestinationQuery(e.target.value)}
          />
          <button onClick={handleDestinationSearch} disabled={isLoading}>
            {isLoading ? "Searching..." : "Search"}
          </button>
        </div>
        {error && <p className="error">{error}</p>}
        {destinationCoords && (
          <div>
            <h3>Route to Destination</h3>
            <p>From Your Location to {destinationQuery}</p>
            {routeDetails.distance && <p>Distance: {routeDetails.distance} km</p>}
            {routeDetails.duration && <p>Estimated Duration: {routeDetails.duration} seconds</p>}
            {eta && <p>ETA: {eta}</p>}
          </div>
        )}
      </div>
      {userLocation && (
        <MapContainer center={userLocation} zoom={14} style={{ height: "600px", width: "100%" }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <Marker position={userLocation} icon={userIcon}>
            <Popup>Your Location</Popup>
          </Marker>
          {vehiclePositions.map((vehicle) => (
            <Marker key={vehicle.id} position={vehicle.position} icon={vehicleIcon}>
              <Popup>{vehicle.name}</Popup>
            </Marker>
          ))}
          {staticStops.map((stop) => (
            <Marker key={stop.id} position={stop.position} icon={stopIcon}>
              <Popup>
                {stop.name} ({stop.type})
              </Popup>
            </Marker>
          ))}
          {stations.map((station) => (
            <Marker key={station.id} position={station.position} icon={stopIcon}>
              <Popup>
                {station.name} <br /> Arrival: {station.scheduledArrival}
              </Popup>
            </Marker>
          ))}
          {destinationCoords && (
            <Marker position={destinationCoords}>
              <Popup>Destination: {destinationQuery}</Popup>
            </Marker>
          )}
          {routePath.length > 0 && (
            <Polyline positions={routePath} color="blue" weight={4} opacity={0.8} />
          )}
          <BusTracker />
          <RecenterButton position={userLocation} />
        </MapContainer>
      )}
    </div>
  );
};

export default VehicleMap; 