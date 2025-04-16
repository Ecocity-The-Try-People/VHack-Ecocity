import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet-routing-machine';
import { DestinationInput } from "./DestinationInput";
import { Routing } from "./Routing";

const congestionColors = {
    Low: "green",
    Medium: "orange",
    High: "red",
};

const TrafficMap = ({ trafficData, onSelectTraffic, isDarkMode }) => {

    const [userLocation, setUserLocation] = useState({ lat: 3.139, lng: 101.6869 }); // Default to Kuala Lumpur
    const [destination, setDestination] = useState({});
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        // Get user's current location if possible
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setUserLocation({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    });
                },
                (error) => {
                    console.error(error);
                    setErrorMessage('Unable to retrieve your location.');
                }
            );
        }
    }, []);

    const geocodeLocation = async (destinationName) => {
        const response = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(destinationName + ', Kuala Lumpur, Malaysia')}`
        );
        const data = await response.json();
        if (data.length > 0) {
            return {
                lat: parseFloat(data[0].lat),
                lng: parseFloat(data[0].lon),
            };
        }
        return null;
    };

    const handleSubmitDestination = async (destinationName) => {
        setDestination({});
        const location = await geocodeLocation(destinationName);
        if (location) {
            setDestination(location);
            setErrorMessage('');
        } else {
            setErrorMessage('Destination not found. Please check the address.');
        }
    };

    return (
        <div className="space-y-6">
            <DestinationInput
                setDestination={setDestination}
                handleSubmitDestination={handleSubmitDestination}
                errorMessage={errorMessage}
                isDarkMode={isDarkMode}
            />
            {/* // 3.1067023,101.7243126
            // 3.1189949, 101.715
            // 3.1094367,101.7241867,14z */}
            <MapContainer center={[3.109351, 101.7331131]} zoom={14.25} style={{ height: "100vh", width: "100%" }}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                {trafficData.map((d, i) => (
                    <Marker
                        key={i}
                        position={[d.lat, d.lon]}
                        icon={L.icon({
                            iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-${congestionColors[d.congestionLevel]}.png`,
                            iconSize: [25, 41],
                            iconAnchor: [12, 41],
                            popupAnchor: [1, -34],
                        })}
                        eventHandlers={{
                            click: () => {
                                onSelectTraffic?.(d);
                            },
                        }}
                    >
                        <Popup>
                            <div className="w-[250px] text-center">
                                <img
                                    src={d.traffic_img_url}
                                    alt="Selected location"
                                    className="w-full max-h-48 object-cover rounded-2xl mb-4"
                                />
                                <p className="text-sm font-medium text-gray-800">{d.locationName}</p>
                            </div>
                        </Popup>

                    </Marker>
                ))}

                {/* User's location marker */}
                <Marker position={[userLocation.lat, userLocation.lng]}>
                    <Popup>Your Location</Popup>
                </Marker>
                {/* Routing */}
                {destination.lat && destination.lng && <Routing from={userLocation} to={destination} />}
            </MapContainer>
        </div>
    );
};

export default TrafficMap;

