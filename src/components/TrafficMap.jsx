import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { useNotificationContext } from "../context/NotificationContext";

const congestionColors = {
    Low: "green",
    Medium: "orange",
    High: "red",
};

const TrafficMap = ({ trafficData, onSelectTraffic }) => {
    const { showNotification } = useNotificationContext() || {};
    const [trafficArr, setTrafficArr] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const result = [];

            for (const location of trafficData) {
                const coords = await geocodeLocation(location.location);
                if (coords) {
                    result.push({
                        ...location,
                        coords: [coords.lat, coords.lng],
                    });
                } else {
                    showNotification("Fail to retrieve the location", "error");
                }
            }

            setTrafficArr(result);
        };

        fetchData();
    }, [trafficData]);

    const geocodeLocation = async (location) => {
        const response = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location + ', Kuala Lumpur, Malaysia')}`
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

    return (
        // 3.1067023,101.7243126 
        // 3.1189949, 101.715
        <MapContainer center={[3.1016735, 101.7269919]} zoom={15} style={{ height: "100vh", width: "100%" }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            {trafficArr.map((d, i) => (
                <Marker
                    key={i}
                    position={d.coords}
                    icon={L.icon({
                        iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-${congestionColors[d.congestionLevel]}.png`,
                        iconSize: [25, 41],
                        iconAnchor: [12, 41],
                        popupAnchor: [1, -34],
                    })}
                    eventHandlers={{
                        click: () => {
                            console.log("Marker clicked:", d);
                            onSelectTraffic?.(d);
                        },
                    }}
                >
                    <Popup>
                        <img src={d.traffic_img_url} alt="Selected location" className="rounded-2xl mb-4 " />
                        {d.location}
                    </Popup>
                </Marker>
            ))}
        </MapContainer>
    );
};

export default TrafficMap;

