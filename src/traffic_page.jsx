import VehicleMap from "./VehicleMap.jsx";

export default function traffic_page(){
    return(
        <div style={{ textAlign: "center", marginTop: "20px" }}>
            <h2>Live Vehicle Tracking with Google Maps</h2>
            <button onClick={toggleMapVisibility}>
            {isMapVisible ? "Hide Map" : "Show Map"}
            </button>
            {isMapVisible && <VehicleMap />}
        </div>
    )
}