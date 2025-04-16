import { useState } from "react";

export function DestinationInput ({ setDestination, handleSubmitDestination, errorMessage, isDarkMode }) {
    const [destinationName, setDestinationName] = useState('');

    const handleDestinationChange = (e) => {
        setDestinationName(e.target.value);
    };

    const handleSubmit = () => {
        setDestination({ name: destinationName });
        handleSubmitDestination(destinationName);
    };

    return (
        <div className={`p-6 rounded-lg shadow-md ${isDarkMode ? "bg-gray-800" : "bg-white"}`}>
            <h3 className="text-lg font-semibold mb-4">Set Your Destination</h3>
            <div className="space-y-4">
                <input
                    type="text"
                    name="destination"
                    value={destinationName}
                    onChange={handleDestinationChange}
                    placeholder="Enter a place or address"
                    className="w-full p-3 border rounded-lg focus:outline-none"
                />
                <button
                    onClick={handleSubmit}
                    className="w-full p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                >
                    Find Route
                </button>
                {errorMessage && <p className="text-red-500 text-sm">{errorMessage}</p>}
            </div>
        </div>
    );
};