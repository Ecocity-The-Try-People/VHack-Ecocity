import { useState, useEffect } from "react";
import useWeatherAlert from "../alert_function"; // Import the alert function hook
import Toggle_button from "../toggle_button";

const weather_api = import.meta.env.VITE_API_KEY;

const Weather_detail = ({ location }) => {
    const [weather, setWeather] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showDetails, setShowDetails] = useState(false); // Controls visibility of additional details

    const fetchWeather = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(
                `http://api.weatherapi.com/v1/current.json?key=${weather_api}&q=${location}&aqi=no`
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
        fetchWeather();
    }, [location]);

    const toggleDetails = () => {
        setShowDetails((prev) => !prev); // Toggle visibility of additional details
    };

    return (
        <div className="max-w-xs mx-auto p-6 border-2 border-gray-200 rounded-lg bg-white shadow-md">
            {/* Loading and Error Messages */}
            {loading && <p className="text-center text-gray-800">Loading...</p>}
            {error && <p className="text-center text-red-500">{error}</p>}

            {/* Basic Weather Info (Always Visible) */}
            {weather && (
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-800">
                        {weather.location.name}, {weather.location.country}
                    </h2>
                    <div className="flex justify-center items-center mt-4">
                        <img
                            src={weather.current.condition.icon}
                            alt="Weather Icon"
                            className="w-16 h-16"
                        />
                        <p className="text-4xl font-bold text-gray-800 ml-4">
                            {weather.current.temp_c}°C
                        </p>
                    </div>
                    <p className="text-xl text-gray-800 mt-4">
                        {weather.current.condition.text}
                    </p>

                    {/* Show More Button */}
                    <button
                        onClick={toggleDetails}
                        className="mt-6 px-4 py-2 text-blue-600 hover:text-blue-800 underline transition duration-300 cursor-pointer">
                        {showDetails ? "Show Less" : "Show More"}
                    </button>

                    {/* Additional Weather Details (Conditionally Rendered) */}
                    {showDetails && (
                        <div className="mt-6 space-y-3">
                            <div className="flex items-center justify-center">
                                <span className="text-gray-800 text-lg">🌬</span>
                                <p className="text-lg text-gray-800 ml-2">
                                    Wind: {weather.current.wind_kph} kph
                                </p>
                            </div>
                            <div className="flex items-center justify-center">
                                <span className="text-gray-800 text-lg">💧</span>
                                <p className="text-lg text-gray-800 ml-2">
                                    Humidity: {weather.current.humidity}%
                                </p>
                            </div>
                            <div className="flex items-center justify-center">
                                <span className="text-gray-800 text-lg">👀</span>
                                <p className="text-lg text-gray-800 ml-2">
                                    Visibility: {weather.current.vis_km} km
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Weather_detail;