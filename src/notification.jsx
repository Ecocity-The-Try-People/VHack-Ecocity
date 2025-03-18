import { useState, useEffect, useRef, useCallback } from "react";
import { Bell } from "lucide-react";
import { motion } from "framer-motion";

const weather_api = import.meta.env.VITE_API_KEY;

const Notification = ({ weatherData }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [alerts, setAlerts] = useState([]);
  const addedAlerts = useRef(new Set());

  useEffect(() => {
    if (!weatherData.length) return;
    
    weatherData.forEach((weather) => {
      if (!weather?.current || !weather?.location) return;
      
      const { wind_mph, precip_in, temp_c, pressure_mb, humidity } = weather.current;
      const { name, region, country } = weather.location;
      const location = `<strong>${name}, ${region}, ${country}</strong>`;

      const alertMessages = [
        { condition: wind_mph >= 15, message: `Strong winds detected in ${location}! Stay cautious.` },
        { condition: precip_in >= 2, message: `Heavy rain detected in ${location}! Take necessary precautions.` },
        { condition: temp_c >= 40, message: `Extreme heat alert in ${location}! Stay hydrated and avoid prolonged exposure.` },
        { condition: temp_c <= 5, message: `Cold weather alert in ${location}! Dress warmly.` },
        { condition: pressure_mb < 980, message: `Low atmospheric pressure detected in ${location}! Possible storm approaching.` },
        { condition: humidity >= 90, message: `High humidity alert in ${location}! Stay cool and hydrated.` },
      ];

      alertMessages.forEach(({ condition, message }) => {
        if (condition && !addedAlerts.current.has(message)) {
          setAlerts((prevAlerts) => [...prevAlerts, message]);
          addedAlerts.current.add(message);
        }
      });
    });
  }, [weatherData]);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 transition relative"
      >
        <Bell className="w-6 h-6 text-gray-700" />
        {alerts.length > 0 && (
          <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full"></span>
        )}
      </button>
      {isOpen && (
        <motion.div
          initial={{ x: 300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 300, opacity: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          className="absolute right-0 top-20 w-64 bg-white shadow-lg rounded-lg p-4"
        >
          <h3 className="font-semibold text-lg">Notifications</h3>
          {alerts.length > 0 ? (
            <ul className="mt-2 text-sm text-gray-600">
              {alerts.map((alert, index) => (
                <li key={index} className="border-b py-1 last:border-none" dangerouslySetInnerHTML={{ __html: alert }}></li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-600 mt-2">No new notifications.</p>
          )}
        </motion.div>
      )}
    </div>
  );
};

const useWeatherData = (cities) => {
  const [weatherData, setWeatherData] = useState([]);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const weatherResponses = await Promise.all(
          cities.map(async (city) => {
            const response = await fetch(
              `https://api.weatherapi.com/v1/current.json?key=${weather_api}&q=${city}`
            );
            return response.json();
          })
        );
        setWeatherData(weatherResponses);
      } catch (error) {
        console.error("Error fetching weather data:", error);
      }
    };

    fetchWeather();
  }, [cities]);

  return weatherData;
};

const App = () => {
  const cities = ["Kuala Lumpur", "Selangor", "Cheras"]; // Add multiple cities
  const weatherData = useWeatherData(cities);

  return (
    <div>
      <Notification weatherData={weatherData} />
    </div>
  );
};

export default App;
