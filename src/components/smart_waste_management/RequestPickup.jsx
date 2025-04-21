import { useState, useEffect } from "react";
import { MapPin, Navigation, Trash2, Clock, X, Check, Trash } from "lucide-react";
import Swal from "sweetalert2";
import useDarkMode from "../../hooks/DarkMode";

const RequestPickup = () => {
    const isDarkMode = useDarkMode();
    const [location, setLocation] = useState("");
    const [coords, setCoords] = useState(null);
    const [type, setType] = useState("Plastic");
    const [requests, setRequests] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isUsingCurrentLocation, setIsUsingCurrentLocation] = useState(false);

    useEffect(() => {
        loadRequests();
    }, []);

    const loadRequests = () => {
        const storedRequests = JSON.parse(localStorage.getItem("waste_requests")) || [];
        setRequests(storedRequests);
    };

    const handleLocation = async () => {
        if (!navigator.geolocation) {
            showAlert("Error", "Geolocation is not supported by your browser", "error");
            return;
        }

        try {
            setIsUsingCurrentLocation(true);
            setIsLoading(true);
            
            const position = await new Promise((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(resolve, reject, {
                    enableHighAccuracy: true,
                    timeout: 15000
                });
            });

            const { latitude, longitude, accuracy } = position.coords;
            setCoords([latitude, longitude]);

            if (accuracy > 100) {
                showAlert(
                    "Low Accuracy", 
                    `Location accuracy is low (${Math.round(accuracy)} meters). For better results, move to an open area.`, 
                    "warning"
                );
            }

            const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
            );
            const data = await response.json();
            
            const address = [
                data.address?.house_number,
                data.address?.road,
                data.address?.suburb,
                data.address?.city || data.address?.town,
                data.address?.state,
                data.address?.country
            ].filter(Boolean).join(", ");

            setLocation(address || `Lat: ${latitude.toFixed(4)}, Lon: ${longitude.toFixed(4)}`);
        } catch (error) {
            showAlert("Error", "Failed to get location: " + error.message, "error");
        } finally {
            setIsLoading(false);
            setIsUsingCurrentLocation(false);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!location.trim() || !coords) {
            showAlert("Error", "Please enter a valid location", "error");
            return;
        }

        const newRequest = {
            id: Date.now(),
            location,
            coords,
            type,
            status: "pending",
            timestamp: new Date().toISOString()
        };

        const updatedRequests = [...requests, newRequest];
        localStorage.setItem("waste_requests", JSON.stringify(updatedRequests));
        setRequests(updatedRequests);
        setLocation("");
        setCoords(null);
        setType("Plastic");
        showAlert("Success", "Pickup request submitted successfully!", "success");
    };

    const handleDeleteRequest = async (id) => {
        const requestToDelete = requests.find(req => req.id === id);
        
        const result = await showConfirm(
            "Delete this request?",
            `<div class="text-left">
                <p><strong>Location:</strong> ${requestToDelete.location}</p>
                <p><strong>Type:</strong> ${requestToDelete.type}</p>
                <p><strong>Date:</strong> ${new Date(requestToDelete.timestamp).toLocaleString()}</p>
            </div>`,
            "warning"
        );

        if (result.isConfirmed) {
            const updatedRequests = requests.filter(req => req.id !== id);
            localStorage.setItem("waste_requests", JSON.stringify(updatedRequests));
            setRequests(updatedRequests);
            showAlert("Deleted!", "Your waste request has been deleted.", "success");
        }
    };

    const handleClearAll = async () => {
        if (requests.length === 0) {
            showAlert("Info", "There are no requests to clear", "info");
            return;
        }

        const result = await showConfirm(
            "Clear All Requests?",
            `Are you sure you want to delete all ${requests.length} requests? This action cannot be undone.`,
            "warning"
        );

        if (result.isConfirmed) {
            localStorage.removeItem("waste_requests");
            setRequests([]);
            showAlert("Cleared!", "All requests have been deleted.", "success");
        }
    };

    const showAlert = (title, text, icon) => {
        return Swal.fire({
            title,
            text,
            icon,
            background: isDarkMode ? '#1f2937' : '#ffffff',
            color: isDarkMode ? '#ffffff' : '#1f2937',
            confirmButtonColor: '#3b82f6',
        });
    };

    const showConfirm = (title, html, icon) => {
        return Swal.fire({
            title,
            html,
            icon,
            background: isDarkMode ? '#1f2937' : '#ffffff',
            color: isDarkMode ? '#ffffff' : '#1f2937',
            showCancelButton: true,
            confirmButtonColor: '#3b82f6',
            cancelButtonColor: isDarkMode ? '#6b7280' : '#9ca3af',
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'Cancel'
        });
    };

    return (
        <div className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                    <label className={`block text-sm font-medium ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                        Collection Location
                    </label>
                    <div className="flex space-x-2">
                        <input
                            type="text"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            placeholder="Enter address or coordinates"
                            className={`flex-1 border ${
                                isDarkMode ? "border-gray-600 bg-gray-700 text-white" : "border-gray-300 bg-white text-black"
                            } transition-all duration-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                            disabled={isUsingCurrentLocation}
                        />
                        <button
                            type="button"
                            onClick={handleLocation}
                            disabled={isLoading}
                            className={`cursor-pointer flex items-center justify-center px-4 py-2 rounded-lg transition-colors ${
                                isLoading 
                                    ? "bg-blue-400 cursor-not-allowed" 
                                    : "bg-blue-600 hover:bg-blue-700 text-white"
                            }`}
                        >
                            {isLoading ? (
                                <span className="animate-pulse">...</span>
                            ) : (
                                <>
                                    <Navigation className="w-4 h-4 mr-2" />
                                    Current
                                </>
                            )}
                        </button>
                    </div>
                </div>

                <div className="space-y-2">
                    <label className={`block text-sm font-medium ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                        Waste Type
                    </label>
                    <select
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                        className={`cursor-pointer w-full border ${
                            isDarkMode ? "bg-gray-700 text-gray-100 border-gray-600" : "bg-white text-gray-800 border-gray-300"
                        } transition-all duration-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                    >
                        <option value="Plastic">Plastic</option>
                        <option value="Paper">Paper</option>
                        <option value="Metal">Metal</option>
                        <option value="Glass">Glass</option>
                        <option value="Organic">Organic</option>
                        <option value="Electronic">Electronic</option>
                        <option value="Hazardous">Hazardous</option>
                    </select>
                </div>

                <button
                    type="submit"
                    disabled={!location || !coords}
                    className={`cursor-pointer w-full py-3 px-4 font-medium rounded-lg transition-colors flex items-center justify-center ${
                        !location || !coords
                            ? `${isDarkMode ? "bg-gray-600" : "bg-gray-400"} cursor-not-allowed`
                            : "bg-green-600 hover:bg-green-700 text-white"
                    } `}
                >
                    <Check className="w-5 h-5 mr-2" />
                    Submit Pickup Request
                </button>
            </form>

            {requests.length > 0 && (
                <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                    <div className="flex justify-between items-center mb-3">
                        <h3 className={`flex items-center text-lg font-semibold ${isDarkMode ? "text-gray-200" : "text-gray-700"}`}>
                            <Clock className="w-5 h-5 mr-2 text-amber-500" />
                            Recent Requests ({requests.length})
                        </h3>
                        <button
                            onClick={handleClearAll}
                            className="cursor-pointer flex items-center text-sm transition-colors text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
                        >
                            <Trash className="w-4 h-4 mr-1" />
                            Clear All
                        </button>
                    </div>
                    <div className="space-y-3">
                        {requests.slice(0, 3).map((request) => (
                            <div 
                                key={request.id} 
                                className={`flex items-center justify-between p-3 rounded-lg transition-colors ${
                                    isDarkMode ? "bg-gray-700 hover:bg-gray-600" : "bg-gray-50 hover:bg-gray-100"
                                }`}
                            >
                                <div>
                                    <p className={`font-medium ${isDarkMode ? "text-gray-100" : "text-gray-800"} flex items-center`}>
                                        <MapPin className="w-4 h-4 mr-2 text-blue-500" />
                                        {request.location}
                                    </p>
                                    <p className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-600"} flex items-center mt-1`}>
                                        <Trash2 className="w-4 h-4 mr-2 text-amber-500" />
                                        {request.type} • {new Date(request.timestamp).toLocaleString()}
                                    </p>
                                </div>
                                <button
                                    onClick={() => handleDeleteRequest(request.id)}
                                    className={`cursor-pointer p-2 rounded-full transition-colors ${
                                        isDarkMode 
                                            ? "hover:bg-gray-600 text-gray-300 hover:text-red-400" 
                                            : "hover:bg-gray-200 text-gray-500 hover:text-red-500"
                                    }`}
                                    aria-label="Delete request"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default RequestPickup;