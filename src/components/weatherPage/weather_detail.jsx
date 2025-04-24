import { useState, useEffect } from "react";
import useWeatherAlert from "./alert_function";
import Toggle_button from "../toggle_button";
const weather_api = import.meta.env.VITE_API_KEY;

const Weather_detail = ({ location }) => {
    const [weather, setWeather] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showDetails, setShowDetails] = useState(false);

    const fetchWeather = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(
                `https://api.weatherapi.com/v1/current.json?key=${weather_api}&q=${location}&aqi=no`
            );

            if (!response.ok) {
                throw new Error("Failed to fetch weather data. Please try again.");
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
        setShowDetails((prev) => !prev);
    };

    const alertMessage = useWeatherAlert(weather);

    return (
        <div className="max-w-xs mx-auto p-6 border-2 border-gray-200 rounded-lg bg-white shadow-md hover:shadow-lg transition-shadow duration-300">
            {loading && (
                <p className="text-center text-gray-800 animate-pulse">Loading weather data...</p>
            )}
            {error && (
                <div className="text-center">
                    <p className="text-red-500 mb-4">{error}</p>
                    <button
                        onClick={fetchWeather}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300"
                    >
                        Retry
                    </button>
                </div>
            )}

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

                    {alertMessage && (
                        <div className="mt-4 p-3 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700">
                            <p>{alertMessage}</p>
                        </div>
                    )}
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
                            <div className="flex items-center justify-center">
                                <span className="text-gray-800 text-lg">🌡</span>
                                <p className="text-lg text-gray-800 ml-2">
                                    Feels Like: {weather.current.feelslike_c}°C
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