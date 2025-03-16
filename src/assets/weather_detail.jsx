import { useState, useEffect } from "react";
import useWeatherAlert from "./alert_function"; // Import the alert function hook
import Toggle_button from "./toggle_button";

const weather_api = import.meta.env.VITE_API_KEY;

const MiddleDashboard = (place) => {
    const [location, setLocation] = useState("Malaysia"); // Default location
    const [weather, setWeather] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState(""); // Stores user input
    const [showDetails, setShowDetails] = useState(false); // Controls visibility of weather details

    const fetchWeather = async (query) => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(
                `http://api.weatherapi.com/v1/current.json?key=${weather_api}&q=${place.location}&aqi=no`
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

    const addAlert = (message) => {
        setAlerts((prevAlerts) => [...prevAlerts, message]);
    };

    useWeatherAlert(weather, addAlert);

    const handleSearch = (e) => {
        e.preventDefault();
        if (search.trim()) {
            setLocation(search);
            setSearch(""); // Clear input after search
        }
    };

    const toggleDetails = () => {
        setShowDetails((prev) => !prev); // Toggle visibility of weather details
    };

    return (
        <div
            className="max-w-4xl mx-auto p-6 border-4 border-white rounded-lg bg-gray-900 text-white shadow-lg cursor-pointer"
            onClick={toggleDetails} // Clicking the div toggles weather details
        >
            {/* Loading and Error Messages */}
            {loading && <p className="text-center text-lg">Loading...</p>}
            {error && <p className="text-center text-red-500">{error}</p>}

            {/* Basic Weather Info (Always Visible) */}
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

                    {/* Additional Weather Details (Conditionally Rendered) */}
                    {showDetails && (
                        <div className="mt-4 grid grid-cols-2 gap-4">
                            <div className="text-center">
                                <p className="text-lg">🌬 Wind Speed: {weather.current.wind_kph} kph</p>
                                <p className="text-lg">🧭 Wind Direction: {weather.current.wind_dir}</p>
                            </div>
                            <div className="text-center">
                                <p className="text-lg">💧 Humidity: {weather.current.humidity}%</p>
                                <p className="text-lg">📊 Pressure: {weather.current.pressure_mb} mb</p>
                            </div>
                            <div className="text-center">
                                <p className="text-lg">👀 Visibility: {weather.current.vis_km} km</p>
                                <p className="text-lg">☀ UV Index: {weather.current.uv}</p>
                            </div>
                            <div className="text-center">
                                <p className="text-lg">🌡 Feels Like: {weather.current.feelslike_c}°C</p>
                                <p className="text-lg">💨 Gust Speed: {weather.current.gust_kph} kph</p>
                            </div>
                        </div>
                    )}
                    <Toggle_button />
                </div>
            )}
        </div>
    );
};

export default MiddleDashboard;