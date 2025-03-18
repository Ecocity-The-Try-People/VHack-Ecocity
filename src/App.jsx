import { useState } from 'react';
import './App.css';
import VehicleMap from "./VehicleMap.jsx";

function App() {
  const [isMapVisible, setIsMapVisible] = useState(true);

  const toggleMapVisibility = () => {
    setIsMapVisible(!isMapVisible);
  };

  return (
    <>
      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <h2>Live Vehicle Tracking with Google Maps</h2>
        <button onClick={toggleMapVisibility}>
          {isMapVisible ? "Hide Map" : "Show Map"}
        </button>
        {isMapVisible && <VehicleMap />}
      </div>
    </>
  );
}

export default App;

// src/App.js
// import React, { useState } from "react";
// import MapComponent from "./MapComponent";
// import SearchComponent from "./SearchComponent";

// const App = () => {
//   const [start, setStart] = useState([37.7749, -122.4194]);
//   const [end, setEnd] = useState([34.0522, -118.2437]);

//   const handleSearch = (startLocation, endLocation) => {
//     // Convert location names to coordinates (you'll need a geocoding API for this)
//     setStart([37.7749, -122.4194]); // Example: San Francisco
//     setEnd([34.0522, -118.2437]); // Example: Los Angeles
//   };

//   return (
//     <div>
//       <SearchComponent onSearch={handleSearch} />
//       <MapComponent start={start} end={end} />
//     </div>
//   );
// };

// export default App;