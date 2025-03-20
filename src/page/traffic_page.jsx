import { useState } from "react";
import VehicleMap from "../assets/VehicleMap.jsx";

export default function TrafficPage() {
    const [isMapVisible, setIsMapVisible] = useState(true);

    const toggleMapVisibility = () => {
        setIsMapVisible((prev) => !prev);
    };

    return (
        <div style={{ textAlign: "center", marginTop: "20px" }}>
            <h2>Live Vehicle Tracking with Google Maps</h2>
            <button onClick={toggleMapVisibility}>
                {isMapVisible ? "Hide Map" : "Show Map"}
            </button>
            {isMapVisible && <VehicleMap />}
        </div>
    );
}
