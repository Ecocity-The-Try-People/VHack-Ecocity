import { useState } from "react";

export function DestinationInput({ setDestination, handleSubmitDestination, errorMessage, isDarkMode }) {
    const [destinationName, setDestinationName] = useState('');

    const handleDestinationChange = (e) => {
        setDestinationName(e.target.value);
    };

    const handleSubmit = () => {
        setDestination({ name: destinationName });
        handleSubmitDestination(destinationName);
    };

    // Style variables for consistency
    const containerStyle = `p-6 rounded-lg shadow-md transition-all duration-300 ${
        isDarkMode ? "bg-gray-800/90 backdrop-blur-sm border-gray-700" : "bg-white/90 backdrop-blur-sm border-gray-200"
    } border`;

    const inputStyle = `w-full p-3 rounded-lg focus:outline-none transition-all duration-300 ${
        isDarkMode 
            ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500" 
            : "bg-white border-gray-300 text-gray-800 placeholder-gray-500 focus:ring-blue-500 focus:border-blue-500"
    } border`;

    const buttonStyle = `w-full p-3 rounded-lg transition-all duration-300 ${
        isDarkMode 
            ? "bg-blue-600 hover:bg-blue-700 text-white" 
            : "bg-blue-500 hover:bg-blue-600 text-white"
    } font-medium cursor-pointer`;

    return (
        <div className={containerStyle}>
            <h3 className={`text-lg font-semibold mb-4 ${
                isDarkMode ? "text-gray-200" : "text-gray-800"
            }`}>
                Set Your Destination
            </h3>
            <div className="space-y-4">
                <input
                    type="text"
                    name="destination"
                    value={destinationName}
                    onChange={handleDestinationChange}
                    placeholder="Enter a place or address"
                    className={inputStyle}
                />
                <button
                    onClick={handleSubmit}
                    className={buttonStyle}
                >
                    Find Route
                </button>
                {errorMessage && (
                    <p className={`text-sm ${
                        isDarkMode ? "text-red-400" : "text-red-500"
                    }`}>
                        {errorMessage}
                    </p>
                )}
            </div>
        </div>
    );
}