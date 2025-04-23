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
    const [centerPosition, setCenterPosition] = useState([3.109351, 101.7331131]); // Add this line
    const [userLocation, setUserLocation] = useState({ lat: 3.139, lng: 101.6869 });
    const [destination, setDestination] = useState({});
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const newPos = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    };
                    setUserLocation(newPos);
                    setCenterPosition([newPos.lat, newPos.lng]); // Update center position
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
            setCenterPosition([location.lat, location.lng]); // Update center position
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
            <MapContainer center={centerPosition} zoom={14.25} style={{ height: "50vh", width: "100%" }}>
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

                <Marker position={[userLocation.lat, userLocation.lng]}>
                    <Popup>Your Location</Popup>
                </Marker>
                
                {destination.lat && destination.lng && <Routing from={userLocation} to={destination} />}
            </MapContainer>
        </div>
    );
};

export default TrafficMap;