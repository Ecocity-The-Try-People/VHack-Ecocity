import { useState, useEffect } from "react";

const MiddleDashboard = (place) => {
    const [location, setLocation] = useState("Malaysia"); // Default location
    const [weather, setWeather] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState(""); // Stores user input

    const fetchWeather = async (query) => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(
                `http://api.weatherapi.com/v1/current.json?key=e71c4ddfa0414d08a67150224251003&q=${place.location}&aqi=no`
            );

            if (!response.ok) {
                throw new Error("Failed to fetch weather data");
            }

            const data = await response.json();
            setWeather(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchWeather(location);
    }, [location]);

    const handleSearch = (e) => {
        e.preventDefault();
        if (search.trim()) {
            setLocation(search);
            setSearch(""); // Clear input after search
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6 border-4 border-white rounded-lg bg-gray-900 text-white shadow-lg">

            {/* Search Input */}
            {/* <form onSubmit={handleSearch} className="mb-6 flex items-center">
                <input
                    type="text"
                    placeholder="Enter location..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="p-3 border border-gray-300 rounded-l-md w-full text-black focus:ring focus:ring-blue-300"
                />
                <button
                    type="submit"
                    className="bg-blue-500 text-white px-5 py-3 rounded-r-md hover:bg-blue-600 transition-all"
                >
                    Search
                </button>
            </form> */}

            {/* Loading and Error Messages */}
            {loading && <p className="text-center text-lg">Loading...</p>}
            {error && <p className="text-center text-red-500">{error}</p>}

            {/* Weather Display */}
            {weather && (
                <div className="bg-white shadow-lg p-6 rounded-md text-gray-900">
                    <h2 className="text-2xl font-semibold text-center">
                        {weather.location.name}, {weather.location.country}
                    </h2>
                    <p className="text-lg text-center">🌡 Temperature: {weather.current.temp_c}°C</p>
                    <p className="text-lg text-center">☁ Condition: {weather.current.condition.text}</p>
                    <div className="flex justify-center">
                        <img src={weather.current.condition.icon} alt="Weather Icon" />
                    </div>
                </div>
            )}
        </div>
    );
};

export default MiddleDashboard;
