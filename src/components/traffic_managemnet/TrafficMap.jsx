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

const TrafficMap = ({ trafficData, onSelectTraffic, isDarkMode }) => {
    // Initialize centerPosition as null to detect first load
    const [centerPosition, setCenterPosition] = useState(null);
    const [userLocation, setUserLocation] = useState(null); // Start as null
    const [destination, setDestination] = useState({});
    const [errorMessage, setErrorMessage] = useState('');
    const mapRef = useRef();

    // Default fallback position (KL coordinates)
    const defaultPosition = [3.109351, 101.7331131];

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const newPos = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    };
                    setUserLocation(newPos);
                    // Only set center position if it's not already set
                    if (centerPosition === null) {
                        setCenterPosition([newPos.lat, newPos.lng]);
                    }
                },
                (error) => {
                    console.error(error);
                    setErrorMessage('Unable to retrieve your location. Using default position.');
                    // Fallback to default position if geolocation fails
                    if (centerPosition === null) {
                        setCenterPosition(defaultPosition);
                    }
                },
                { timeout: 10000 } // 10 second timeout
            );
        } else {
            // Browser doesn't support geolocation
            setErrorMessage('Geolocation not supported. Using default position.');
            setCenterPosition(defaultPosition);
        }
    }, []);

    // This effect handles auto-recentering when userLocation changes
    useEffect(() => {
        if (userLocation && mapRef.current) {
            mapRef.current.setView([userLocation.lat, userLocation.lng]);
        }
    }, [userLocation]);

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
            setCenterPosition([location.lat, location.lng]);
            setErrorMessage('');
        } else {
            setErrorMessage('Destination not found. Please check the address.');
        }
    };

    // Don't render MapContainer until we have a centerPosition
    if (centerPosition === null) {
        return <div>Loading map...</div>;
    }

    return (
        <div className="space-y-6">
            <DestinationInput
                setDestination={setDestination}
                handleSubmitDestination={handleSubmitDestination}
                errorMessage={errorMessage}
                isDarkMode={isDarkMode}
            />
            
            <MapContainer 
                center={centerPosition} 
                zoom={14.25} 
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

                <RecenterButton position={centerPosition} />

                {userLocation && (
                    <Marker position={[userLocation.lat, userLocation.lng]}>
                        <Popup>Your Location</Popup>
                    </Marker>
                )}
                
                {destination.lat && destination.lng && <Routing from={userLocation || { lat: defaultPosition[0], lng: defaultPosition[1] }} to={destination} />}
            </MapContainer>
        </div>
    );
};

export default TrafficMap;