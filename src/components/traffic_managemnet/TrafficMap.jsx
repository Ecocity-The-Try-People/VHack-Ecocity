import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet-routing-machine';
import { DestinationInput } from "./DestinationInput";
import { Routing } from "./Routing";
import RecenterButton from "../smart_waste_management/RecenterButton"

const congestionColors = {
    Low: "green",
    Medium: "orange",
    High: "red",
};

// Cheras coordinates (example: near Cheras Leisure Mall)
const CHERAS_POSITION = [3.0902, 101.7617];

const TrafficMap = ({ trafficData, onSelectTraffic, isDarkMode }) => {
    const [userLocation, setUserLocation] = useState(null);
    const [destination, setDestination] = useState({});
    const [errorMessage, setErrorMessage] = useState('');
    const mapRef = useRef();

    useEffect(() => {
        // Get user location but don't auto-center
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
                },
                { timeout: 10000 }
            );
        }
    }, []);

    const geocodeLocation = async (destinationName) => {
        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(destinationName + ', Kuala Lumpur, Malaysia')}`
            );
            if (!response.ok) throw new Error('Geocoding failed');
            const data = await response.json();
            if (data.length > 0) {
                return {
                    lat: parseFloat(data[0].lat),
                    lng: parseFloat(data[0].lon),
                };
            }
            return null;
        } catch (error) {
            console.error('Geocoding error:', error);
            setErrorMessage('Geocoding service unavailable. Please try again later.');
            return null;
        }
    };

    const handleSubmitDestination = async (destinationName) => {
        setDestination({});
        const location = await geocodeLocation(destinationName);
        if (location) {
            setDestination(location);
            // Center on destination when selected
            if (mapRef.current) {
                mapRef.current.setView([location.lat, location.lng]);
            }
            setErrorMessage('');
        } else {
            setErrorMessage('Destination not found. Please check the address.');
        }
    };

    // Function to handle recentering
    const handleRecenter = () => {
        if (mapRef.current) {
            // Center on user location if available, otherwise Cheras
            const center = userLocation ? [userLocation.lat, userLocation.lng] : CHERAS_POSITION;
            mapRef.current.setView(center);
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
            
            <MapContainer 
                center={CHERAS_POSITION}
                zoom={12} 
                style={{ height: "50vh", width: "100%" }}
                whenCreated={(map) => { mapRef.current = map; }}
            >
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

                {/* Updated RecenterButton with onClick handler */}
                <RecenterButton 
                    position={userLocation ? [userLocation.lat, userLocation.lng] : CHERAS_POSITION}
                    onClick={handleRecenter}
                />

                {userLocation && (
                    <Marker position={[userLocation.lat, userLocation.lng]}>
                        <Popup>Your Location</Popup>
                    </Marker>
                )}
                
                {destination.lat && destination.lng && (
                    <Routing 
                        from={userLocation || { lat: CHERAS_POSITION[0], lng: CHERAS_POSITION[1] }} 
                        to={destination}
                        isDarkMode={isDarkMode}
                    />
                )}
            </MapContainer>
        </div>
    );
};

export default TrafficMap;