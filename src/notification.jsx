import { useState, useEffect } from "react";
import { Bell } from "lucide-react";
import { motion } from "framer-motion";

const Notification = ({ weather }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [alerts, setAlerts] = useState([]);

  const addAlert = (message) => {
    setAlerts((prevAlerts) => [...prevAlerts, message]);
  };

  // Use the weather alert hook
  useWeatherAlert(weather, addAlert);

  return (
    <div className="relative">
      {/* Notification Icon */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 transition relative"
      >
        <Bell className="w-6 h-6 text-gray-700" />
        {alerts.length > 0 && (
          <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full"></span>
        )}
      </button>

      {/* Notification Panel */}
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
                <li key={index} className="border-b py-1 last:border-none">{alert}</li>
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

// Weather Alert Hook
const useWeatherAlert = (weather, addAlert) => {
  useEffect(() => {
    if (!weather?.api?.current || !weather?.api?.location || typeof addAlert !== 'function') return;

    const { wind_mph, precip_in, temp_c, pressure_mb, humidity } = weather.api.current;
    const { name, region, country } = weather.api.location;
    const location = `${name}, ${region}, ${country}`;

    if (wind_mph >= 15) {
      addAlert(`Strong winds detected in ${location}! Stay cautious.`);
    }

    if (precip_in >= 2) {
      addAlert(`Heavy rain detected in ${location}! Take necessary precautions.`);
    }

    if (temp_c >= 40) {
      addAlert(`Extreme heat alert in ${location}! Stay hydrated and avoid prolonged exposure.`);
    }

    if (temp_c <= 5) {
      addAlert(`Cold weather alert in ${location}! Dress warmly.`);
    }

    if (pressure_mb < 980) {
      addAlert(`Low atmospheric pressure detected in ${location}! Possible storm approaching.`);
    }

    if (humidity >= 90) {
      addAlert(`High humidity alert in ${location}! Stay cool and hydrated.`);
    }
  }, [weather, addAlert]);
};

export default Notification;