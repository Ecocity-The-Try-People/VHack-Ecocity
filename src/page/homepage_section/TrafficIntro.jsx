import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix for default marker icons in Leaflet
const DefaultIcon = L.icon({
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});
L.Marker.prototype.options.icon = DefaultIcon;

// Example static data for the transportation hub
const hubLocations = [
  { id: 1, name: "Central Station", position: [3.1390, 101.6869] },
  { id: 2, name: "Bus Terminal A", position: [3.1400, 101.6879] },
  { id: 3, name: "LRT Station", position: [3.1380, 101.6859] },
  { id: 4, name: "Taxi Stand", position: [3.1375, 101.6865] },
];

export default function TrafficIntro() {
  const navigate = useNavigate();

  const handleExploreClick = () => {
    navigate("/traffic"); // Redirect to the TrafficPage
  };

  return (
    <div className="flex w-full max-w-6xl mx-auto text-white p-8 rounded-lg shadow-lg">
      {/* Map on the Left */}
      <div className="w-1/2 p-4 bg-[#1F1D21]">
        <div className="h-96 rounded-lg overflow-hidden shadow-lg">
          <MapContainer
            center={[3.1390, 101.6869]} // Center of the transportation hub
            zoom={15}
            scrollWheelZoom={false}
            className="h-full w-full"
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            {hubLocations.map((location) => (
              <Marker key={location.id} position={location.position}>
                <Popup>{location.name}</Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </div>

      {/* Empty Middle (Background Visible) */}
      <div className="w-1/6"></div>

      {/* Content on the Right */}
      <div className="w-1/3 p-6 flex flex-col justify-between bg-[#1F1D21]">
        <div>
          <h2 className="text-2xl font-bold mb-4">Live Vehicle Tracking</h2>
          <p className="text-gray-300 mb-6 text-xl font-roboto">
            Track real-time vehicle locations and plan your journey with ease. Our interactive map provides live updates on bus positions, routes, and estimated arrival times.
          </p>
        </div>
      </div>
    </div>
  );
}