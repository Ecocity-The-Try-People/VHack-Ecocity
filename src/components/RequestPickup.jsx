import { useState, useEffect } from "react";

const RequestPickup = () => {
  const [location, setLocation] = useState("");
  const [coords, setCoords] = useState(null);
  const [type, setType] = useState("Plastic");
  const [requests, setRequests] = useState([]);
  const [typingTimeout, setTypingTimeout] = useState(null);
  const [isUsingCurrentLocation, setIsUsingCurrentLocation] = useState(false);

  useEffect(() => {
    loadRequests();
  }, []);

 
  const loadRequests = () => {
    const storedRequests = JSON.parse(localStorage.getItem("requests")) || [];
    setRequests(storedRequests);
  };


  const handleLocation = () => {
    if (window.confirm("Do you wish to use your current location? Please ensure you are in an open area for better accuracy.")) {
      setIsUsingCurrentLocation(true);
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude, accuracy } = position.coords;
          console.log(`Coordinates: ${latitude}, ${longitude} (Accuracy: ${accuracy} meters)`);
          setCoords([latitude, longitude]);

          if (accuracy > 100) {
            alert(`Warning: Location accuracy is low (${accuracy} meters). Try moving to an open area.`);
          }

          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
            );
            const data = await response.json();
            console.log("Reverse Geocoding Data:", data);

            if (!data || !data.address) {
              alert("Failed to retrieve an accurate address. Please try again.");
              setLocation(`Lat: ${latitude}, Lon: ${longitude}`);
              return;
            }

            const { house_number, road, suburb, city, town, village, state, country } = data.address;
            let formattedLocation = [
              house_number ? `${house_number} ${road}` : road,
              suburb,
              city || town || village,
              state,
              country
            ].filter(Boolean).join(", ");

            setLocation(formattedLocation || `Lat: ${latitude}, Lon: ${longitude}`);
          } catch (error) {
            alert("Failed to fetch address: " + error.message);
            setLocation(`Lat: ${latitude}, Lon: ${longitude}`);
          } finally {
            setIsUsingCurrentLocation(false);
          }
        },
        (error) => {
          alert("Failed to get location: " + error.message);
          setIsUsingCurrentLocation(false);
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 } 
      );
    }
  };

  const handleLocationInput = (e) => {
    if (isUsingCurrentLocation) return;

    const input = e.target.value;
    setLocation(input);
    if (typingTimeout) clearTimeout(typingTimeout);

    const newTimeout = setTimeout(async () => {
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(input)}`
        );
        const data = await response.json();
        if (data.length > 0) {
          setLocation(data[0].display_name);
          setCoords([parseFloat(data[0].lat), parseFloat(data[0].lon)]);
        }
      } catch (error) {
        console.error("Failed to fetch coordinates:", error);
      }
    }, 2000);

    setTypingTimeout(newTimeout);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!location.trim() || !coords) {
      alert("Please enter a valid location.");
      return;
    }
    if (!window.confirm("Are you sure you want to submit this request?")) return;

    const newRequest = { location, coords, type, timestamp: new Date().toISOString() };
    const updatedRequests = [...requests, newRequest];
    localStorage.setItem("requests", JSON.stringify(updatedRequests));
    setRequests(updatedRequests);
    setLocation("");
    setCoords(null);
    setType("Plastic");
    setIsUsingCurrentLocation(false);
  };

  const handleDeleteRequest = (index) => {
    if (!window.confirm("Are you sure you want to delete this request?")) return;
    const updatedRequests = requests.filter((_, i) => i !== index);
    localStorage.setItem("requests", JSON.stringify(updatedRequests));
    setRequests(updatedRequests);
  };

  const handleClearHistory = () => {
    if (window.confirm("Are you sure you want to clear the history?")) {
      localStorage.removeItem("requests");
      setRequests([]);
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto bg-white rounded-xl shadow-md space-y-4">
      <h2 className="text-xl font-bold text-center text-gray-800">Garbage Pickup Request</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col gap-2">
          <input
            type="text"
            placeholder="Enter your location (e.g., Kuala Lumpur OR 3.14, 101.68)"
            value={location}
            onChange={handleLocationInput}
            className="border p-3 rounded-md w-full focus:ring-2 focus:ring-blue-400"
          />
          <button
            type="button"
            onClick={handleLocation}
            className="bg-gray-200 p-3 rounded-md hover:bg-gray-300"
          >
            📍 Use Current Location
          </button>
        </div>
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="border p-3 rounded-md w-full focus:ring-2 focus:ring-blue-400"
        >
          <option value="Plastic">Plastic</option>
          <option value="Paper">Paper</option>
          <option value="Metal">Metal</option>
        </select>
        <button
          type="submit"
          className="bg-blue-500 text-white p-3 rounded-md w-full hover:bg-blue-600"
        >
          Post Request
        </button>
      </form>
      <div className="border-t pt-4">
        <h3 className="text-lg font-semibold text-gray-700">History</h3>
        {requests.length > 0 ? (
          <ul className="divide-y divide-gray-200">
            {requests.map((req, index) => (
              <li key={index} className="py-3 flex justify-between items-center">
                <span>
                  📍 {req.location} - 🗑 {req.type} ({new Date(req.timestamp).toLocaleString()})
                </span>
                <button
                  onClick={() => handleDeleteRequest(index)}
                  className="bg-red-500 text-white p-2 rounded-md hover:bg-red-600"
                >
                  ❌
                </button>
              </li>
            ))}
          </ul>
        ) : ( 
          <p className="text-gray-500 text-center">No requests yet.</p>
        )}
        {requests.length > 0 && (
          <button
            onClick={handleClearHistory}
            className="bg-red-500 text-white p-3 rounded-md w-full mt-4 hover:bg-red-600"
          >
            Clear History
          </button>
        )}
      </div>
    </div>
  );
};

export default RequestPickup;