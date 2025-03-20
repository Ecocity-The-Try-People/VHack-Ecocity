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

    </>
  );
}

export default App;