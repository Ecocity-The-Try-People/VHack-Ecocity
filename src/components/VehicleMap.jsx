import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import useDarkMode from "../hooks/DarkMode.jsx";
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const GTFS_API_URL = "https://api.data.gov.my/gtfs-realtime/vehicle-position/prasarana?category=rapid-bus-kl";
const OSRM_ROUTE_API = "https://router.project-osrm.org/route/v1/driving";
const NOMINATIM_API = "https://nominatim.openstreetmap.org/search";

//KL coordinates
const DEFAULT_POSITION = [3.0556, 101.7110];

const ICONS = {
  default: L.icon({
    iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
    iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  }),
  user: L.icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/128/684/684908.png",
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  }),
  vehicle: L.icon({
    iconUrl: "src/assets/png/front-of-bus.png",
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40],
  }),
  stop: L.divIcon({
    className: "custom-marker",
    html: `
      <div style="position: relative;">
        <svg width="28" height="28" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path fill="#FF6D00" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
        </svg>
      </div>
    `,
    iconSize: [28, 28],
    iconAnchor: [14, 28],
  }),
  selectedStop: L.divIcon({
    className: "custom-marker selected",
    html: `
      <div style="position: relative;">
        <svg width="32" height="32" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path fill="#FF9E00" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 10c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z"/>
        </svg>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
  }),
};

L.Marker.prototype.options.icon = ICONS.default;

const staticStops = [
  { id: "bj1", name: "Bukit Jalil LRT Station", type: "LRT", position: [3.0638, 101.6981] },
  { id: "bj2", name: "National Sports Complex", type: "Bus", position: [3.0564, 101.6932] },
  { id: "bj3", name: "Sri Petaling Station", type: "LRT", position: [3.0719, 101.6936] },
  { id: "bj4", name: "Arena Mall Bus Stop", type: "Bus", position: [3.0592, 101.7038] },
  { id: "ch1", name: "Cheras LRT Station", type: "LRT", position: [3.0481, 101.7275] },
  { id: "ch2", name: "Taman Connaught Bus Stop", type: "Bus", position: [3.0679, 101.7324] },
  { id: "ch3", name: "Taman Midah Station", type: "MRT", position: [3.0922, 101.7361] },
  { id: "ch4", name: "Leisure Mall Bus Stop", type: "Bus", position: [3.0853, 101.7478] },
];

const stations = [
  { id: "bj1", name: "Bukit Jalil LRT", position: [3.0638, 101.6981], scheduledArrival: "08:00" },
  { id: "bj2", name: "Sri Petaling LRT", position: [3.0719, 101.6936], scheduledArrival: "08:15" },
  { id: "ch1", name: "Cheras LRT", position: [3.0481, 101.7275], scheduledArrival: "08:30" },
  { id: "ch2", name: "Taman Midah MRT", position: [3.0922, 101.7361], scheduledArrival: "08:45" },
];

const formatDuration = (seconds) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  return `${hours > 0 ? `${hours} h ` : ''}${minutes} min`;
};

const RecenterButton = ({ position, isDarkMode }) => {
  const map = useMap();
  const handleRecenter = useCallback(() => map.setView(position, map.getZoom()), [map, position]);
  
  return (
    <button
      className={`recenter-button ${isDarkMode ? "bg-gray-800 text-white border-gray-600 hover:bg-gray-700" : "bg-white text-gray-800 border-gray-300 hover:bg-gray-100"} p-2 rounded-full shadow-lg transition-colors border`}
      onClick={handleRecenter}
      aria-label="Recenter Map"
    >
      <i className="fa-solid fa-location-crosshairs"></i>
    </button>
  );
};

const BusTracker = ({ isDarkMode }) => {
  const [busPosition, setBusPosition] = useState(stations[0].position);
  const [routePath, setRoutePath] = useState([]);
  const [currentPathIndex, setCurrentPathIndex] = useState(0);
  const [isMovingForward, setIsMovingForward] = useState(true);
  const animationRef = useRef(null);

  const fetchRoute = useCallback(async () => {
    const coordinates = stations.map(s => s.position.reverse().join(",")).join(";");
    try {
      const response = await fetch(`${OSRM_ROUTE_API}/${coordinates}?overview=full&geometries=geojson`);
      const data = await response.json();
      if (data.routes?.[0]) {
        setRoutePath(data.routes[0].geometry.coordinates.map(coord => [coord[1], coord[0]]));
      }
    } catch (error) {
      console.error("Route fetch error:", error);
    }
  }, []);

  useEffect(() => {
    fetchRoute();
    return () => {
      if (animationRef.current) clearInterval(animationRef.current);
    };
  }, [fetchRoute]);

  useEffect(() => {
    if (routePath.length === 0) return;

    const moveBus = () => {
      setCurrentPathIndex(prev => {
        let next = isMovingForward ? prev + 1 : prev - 1;
        
        if (next >= routePath.length || next < 0) {
          setIsMovingForward(!isMovingForward);
          return prev;
        }

        const isAtStation = stations.some(s => 
          s.position[0] === routePath[next][0] && 
          s.position[1] === routePath[next][1]
        );

        if (isAtStation) {
          clearInterval(animationRef.current);
          setTimeout(() => {
            animationRef.current = setInterval(moveBus, 500);
          }, 2000 + Math.random() * 3000);
        }

        setBusPosition(routePath[next]);
        return next;
      });
    };

    animationRef.current = setInterval(moveBus, 500);
    return () => clearInterval(animationRef.current);
  }, [routePath, isMovingForward]);

  return (
    <>
      <Marker position={busPosition} icon={ICONS.vehicle}>
        <Popup className={`custom-popup ${isDarkMode ? "bg-gray-800 text-white" : ""}`}>Bus is here!</Popup>
      </Marker>
      {routePath.length > 0 && (
        <Polyline 
          positions={routePath} 
          color="#3b82f6" 
          weight={4} 
          opacity={0.8} 
        />
      )}
    </>
  );
};

const VehicleMap = () => {
  const [vehiclePositions, setVehiclePositions] = useState([]);
  const [destinationCoords, setDestinationCoords] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [destinationQuery, setDestinationQuery] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [routePath, setRoutePath] = useState([]);
  const [routeDetails, setRouteDetails] = useState({ distance: null, duration: null });
  const [selectedStop, setSelectedStop] = useState(null);
  const mapRef = useRef();
  const isDarkMode = useDarkMode();

  const fetchGTFSData = useCallback(async () => {
    try {
      const response = await fetch(GTFS_API_URL);
      if (!response.ok) throw new Error("API request failed");
      
      const data = await response.json();
      const positions = data.entity
        ?.filter(e => e.vehicle)
        .map(e => ({
          id: e.id,
          name: e.vehicle.vehicle.label,
          position: [e.vehicle.position.latitude, e.vehicle.position.longitude],
          speed: e.vehicle.position.speed || 30,
        })) || [];

      setVehiclePositions(positions.length ? positions : [
        { id: "1", name: "Bus 123", position: [3.212, 101.579], speed: 30 },
        { id: "2", name: "Bus 456", position: [3.220, 101.585], speed: 25 },
      ]);
    } catch (error) {
      console.error("GTFS fetch error:", error);
      setError("Real-time data unavailable. Showing demo data.");
    }
  }, []);

  const geocodeDestination = useCallback(async (query) => {
    try {
      const response = await fetch(`${NOMINATIM_API}?format=json&q=${encodeURIComponent(query)}`);
      const data = await response.json();
      if (data.length) {
        return [parseFloat(data[0].lat), parseFloat(data[0].lon)];
      }
      throw new Error("No results found");
    } catch (error) {
      console.error("Geocoding error:", error);
      setError("Destination not found. Please try another location.");
      return null;
    }
  }, []);

  const fetchRoute = useCallback(async (start, end) => {
    try {
      const coords = [start, end].map(pos => [...pos].reverse().join(",")).join(";");
      const response = await fetch(`${OSRM_ROUTE_API}/${coords}?overview=full&geometries=geojson`);
      const data = await response.json();
      
      if (data.routes?.[0]) {
        setRoutePath(data.routes[0].geometry.coordinates.map(coord => [coord[1], coord[0]]));
        setRouteDetails({
          distance: (data.routes[0].distance / 1000).toFixed(2),
          duration: data.routes[0].duration,
        });
        setError(null);
      } else {
        throw new Error("No route found");
      }
    } catch (error) {
      console.error("Routing error:", error);
      setError("Could not calculate route. Please try again.");
    }
  }, []);

  const handleDestinationSearch = useCallback(async () => {
    if (!destinationQuery.trim()) {
      setError("Please enter a destination");
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      const coords = await geocodeDestination(destinationQuery);
      if (coords) {
        setDestinationCoords(coords);
        await fetchRoute(userLocation || DEFAULT_POSITION, coords);
      } else {
        setError("Destination not found. Please try another location.");
      }
    } catch (error) {
      console.error("Search error:", error);
      setError("Failed to find destination. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [destinationQuery, userLocation, geocodeDestination, fetchRoute]);

  const handleStopClick = useCallback((stop) => {
    setSelectedStop(stop);
    if (mapRef.current) {
      mapRef.current.flyTo(stop.position, 16, {
        duration: 0.75,
        easeLinearity: 0.25
      });

      setTimeout(() => {
        const markerLayer = mapRef.current._layers[stop.id];
        if (markerLayer && markerLayer.openPopup) {
          markerLayer.openPopup();
        }
      }, 750);
    }
  }, []);

  useEffect(() => {
    fetchGTFSData();
    const interval = setInterval(fetchGTFSData, 30000);
    return () => clearInterval(interval);
  }, [fetchGTFSData]);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        pos => setUserLocation([pos.coords.latitude, pos.coords.longitude]),
        () => {
          setError("Location access denied. Using default location.");
          setUserLocation(DEFAULT_POSITION);
        }
      );
    } else {
      setError("Geolocation not supported. Using default location.");
      setUserLocation(DEFAULT_POSITION);
    }
  }, []);

  const eta = useMemo(() => {
    if (!routeDetails.duration) return null;
    const now = new Date();
    return new Date(now.getTime() + routeDetails.duration * 1000)
      .toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false });
  }, [routeDetails.duration]);

  return (
    <div className="flex justify-center items-center p-4">
      <div className={`flex rounded-lg shadow-lg overflow-hidden w-full max-w-6xl h-[650px] border ${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}>
        {/* Sidebar */}
        <div className={`w-96 p-6 overflow-y-auto border-r ${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}>
          <h2 className={`text-2xl font-bold mb-6 ${isDarkMode ? "text-white" : "text-gray-800"}`}>Route Planner</h2>
          
          <div className="mb-6">
            <label className={`block text-sm font-medium mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>Destination:</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={destinationQuery}
                onChange={(e) => {
                  setDestinationQuery(e.target.value);
                  setError(null);
                }}
                onKeyDown={(e) => e.key === "Enter" && handleDestinationSearch()}
                placeholder="Enter destination"
                className={`flex-grow px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDarkMode ? "bg-gray-700 text-white border-gray-600" : "bg-white text-gray-900 border-gray-300"}`}
              />
              <button
                onClick={handleDestinationSearch}
                disabled={isLoading}
                className={`px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors ${isLoading ? (isDarkMode ? "bg-blue-500" : "bg-blue-400") : ""}`}
              >
                {isLoading ? "..." : "Go"}
              </button>
            </div>
          </div>

          {error && (
            <div className={`mb-4 p-2 border rounded ${isDarkMode ? "bg-red-900 border-red-700 text-red-200" : "bg-red-100 border-red-400 text-red-700"}`}>
              {error}
            </div>
          )}

          {destinationCoords && (
            <div className={`p-4 rounded-lg mb-6 border ${isDarkMode ? "bg-gray-700 border-gray-600" : "bg-gray-100 border-gray-200"}`}>
              <h3 className={`text-lg font-semibold mb-2 ${isDarkMode ? "text-white" : "text-gray-800"}`}>Route Details</h3>
              <div className={`space-y-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                <p>From: Your Location</p>
                <p>To: {destinationQuery}</p>
                {routeDetails.distance && <p>Distance: {routeDetails.distance} km</p>}
                {routeDetails.duration && <p>Duration: {formatDuration(routeDetails.duration)}</p>}
                {eta && <p>ETA: {eta}</p>}
              </div>
            </div>
          )}

          <div className={`p-4 rounded-lg border ${isDarkMode ? "bg-gray-700 border-gray-600" : "bg-gray-100 border-gray-200"}`}>
            <h3 className={`text-lg font-semibold mb-2 ${isDarkMode ? "text-white" : "text-gray-800"}`}>Nearby Stops</h3>
            <ul className="space-y-2">
              {staticStops.map(stop => (
                <li 
                  key={stop.id} 
                  className={`p-2 rounded cursor-pointer transition-colors ${
                    selectedStop?.id === stop.id 
                      ? isDarkMode 
                        ? 'bg-blue-900 text-blue-200' 
                        : 'bg-blue-100 text-blue-800'
                      : isDarkMode 
                        ? 'text-gray-300 hover:bg-gray-600' 
                        : 'text-gray-700 hover:bg-gray-200'
                  }`}
                  onClick={() => handleStopClick(stop)}
                >
                  {stop.name} ({stop.type})
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Map */}
        <div className="flex-grow relative">
          {userLocation && (
            <MapContainer 
              center={userLocation} 
              zoom={14} 
              className="h-full w-full"
              whenCreated={(map) => { 
                mapRef.current = map;
                mapRef.current._layers = {};
                map.on('layeradd', (e) => {
                  if (e.layer instanceof L.Marker && e.layer.options.stopId) {
                    mapRef.current._layers[e.layer.options.stopId] = e.layer;
                  }
                });
              }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              
              <Marker position={userLocation} icon={ICONS.user}>
                <Popup className={`custom-popup ${isDarkMode ? "bg-gray-800 text-white" : ""}`}>Your Location</Popup>
              </Marker>

              {vehiclePositions.map(vehicle => (
                <Marker key={vehicle.id} position={vehicle.position} icon={ICONS.vehicle}>
                  <Popup className={`custom-popup ${isDarkMode ? "bg-gray-800 text-white" : ""}`}>{vehicle.name}</Popup>
                </Marker>
              ))}

              {[...staticStops, ...stations].map(stop => (
                <Marker 
                  key={stop.id}
                  position={stop.position}
                  icon={selectedStop?.id === stop.id ? ICONS.selectedStop : ICONS.stop}
                  stopId={stop.id}
                  eventHandlers={{
                    click: () => handleStopClick(stop),
                    mouseover: (e) => e.target.openPopup(),
                    mouseout: (e) => e.target.closePopup()
                  }}
                >
                  <Popup className={`custom-popup ${isDarkMode ? "bg-gray-800" : ""}`}>
                    <div className={`font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}>{stop.name}</div>
                    <div className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>{stop.type}</div>
                    {stop.scheduledArrival && (
                      <div className={`mt-1 text-xs ${isDarkMode ? "text-orange-400" : "text-orange-600"}`}>
                        <i className="fas fa-clock mr-1"></i>
                        Next arrival: {stop.scheduledArrival}
                      </div>
                    )}
                  </Popup>
                </Marker>
              ))}

              {destinationCoords && (
                <Marker position={destinationCoords}>
                  <Popup className={`custom-popup ${isDarkMode ? "bg-gray-800 text-white" : ""}`}>Destination: {destinationQuery}</Popup>
                </Marker>
              )}

              {routePath.length > 0 && (
                <Polyline 
                  positions={routePath} 
                  color="#3b82f6" 
                  weight={4} 
                  opacity={0.8} 
                />
              )}

              <BusTracker isDarkMode={isDarkMode} />
              <RecenterButton position={userLocation} isDarkMode={isDarkMode} />
            </MapContainer>
          )}
        </div>
      </div>
    </div>
  );
};

export default VehicleMap;