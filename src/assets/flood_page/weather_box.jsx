import { useState } from "react";
import { Droplet, Wind, Eye, Thermometer, ChevronDown, ChevronUp, Bell, BellOff } from "lucide-react";

const WeatherBox = () => {
  const [expandedStates, setExpandedStates] = useState({
    "Kuala Lumpur": false,
    "Selangor": false,
    "Cheras": false
  });

  const [notificationPrefs, setNotificationPrefs] = useState({
    "Kuala Lumpur": true,
    "Selangor": true,
    "Cheras": true
  });

  const locations = ["Kuala Lumpur", "Selangor", "Cheras"];

  const weatherData = {
    "Kuala Lumpur": {
      temp: 28,
      condition: "Partly Cloudy",
      icon: "https://cdn.weatherapi.com/weather/64x64/day/116.png",
      wind: 12,
      humidity: 65,
      visibility: 10,
      feelsLike: 30
    },
    "Selangor": {
      temp: 26,
      condition: "Light Rain",
      icon: "https://cdn.weatherapi.com/weather/64x64/day/296.png",
      wind: 8,
      humidity: 80,
      visibility: 8,
      feelsLike: 28
    },
    "Cheras": {
      temp: 27,
      condition: "Sunny",
      icon: "https://cdn.weatherapi.com/weather/64x64/day/113.png",
      wind: 5,
      humidity: 70,
      visibility: 12,
      feelsLike: 29
    }
  };

  const toggleExpand = (location) => {
    setExpandedStates(prev => ({
      ...prev,
      [location]: !prev[location]
    }));
  };

  const toggleNotification = (location, e) => {
    e.stopPropagation();
    setNotificationPrefs(prev => ({
      ...prev,
      [location]: !prev[location]
    }));
  };

  return (
    <div className="w-full flex flex-col md:flex-row gap-4">
      {locations.map((location) => {
        const data = weatherData[location];
        const isExpanded = expandedStates[location];
        const notificationsEnabled = notificationPrefs[location];

        return (
          <div 
            key={location}
            className={`flex-1 rounded-lg border transition-all duration-300 cursor-pointer
              ${isExpanded 
                ? "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800" 
                : "bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 border-gray-200 dark:border-gray-600"
              }`}
            onClick={() => toggleExpand(location)}
          >
            <div className="p-4 flex justify-between items-center">
              <h3 className="font-bold text-lg dark:text-white">{location}</h3>
              <div className="flex items-center gap-2">
                <button 
                  onClick={(e) => toggleNotification(location, e)}
                  className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors cursor-pointer"
                  aria-label={notificationsEnabled ? "Disable notifications" : "Enable notifications"}
                >
                  {notificationsEnabled ? (
                    <Bell className="w-5 h-5 text-yellow-500" />
                  ) : (
                    <BellOff className="w-5 h-5 text-gray-400" />
                  )}
                </button>
                <span className="text-2xl font-bold dark:text-white">
                  {data.temp}°C
                </span>
                {isExpanded ? (
                  <ChevronUp className="w-5 h-5 text-gray-500 dark:text-gray-300" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-500 dark:text-gray-300" />
                )}
              </div>
            </div>

            <div className="px-4 pb-2 flex items-center">
              <img 
                src={data.icon} 
                alt="Weather icon" 
                className="w-10 h-10"
              />
              <span className="ml-2 dark:text-gray-300">{data.condition}</span>
            </div>

            <div className={`overflow-hidden transition-all duration-300 ${
              isExpanded ? "max-h-96" : "max-h-0"
            }`}>
              <div className="p-4 pt-0 space-y-2">
                <DetailItem icon={<Wind />} label="Wind" value={`${data.wind} km/h`} />
                <DetailItem icon={<Droplet />} label="Humidity" value={`${data.humidity}%`} />
                <DetailItem icon={<Eye />} label="Visibility" value={`${data.visibility} km`} />
                <DetailItem icon={<Thermometer />} label="Feels Like" value={`${data.feelsLike}°C`} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

const DetailItem = ({ icon, label, value }) => (
  <div className="flex items-center text-sm">
    <div className="w-4 h-4 mr-2 text-blue-500">
      {icon}
    </div>
    <span className="dark:text-gray-300">
      <span className="font-medium">{label}:</span> {value}
    </span>
  </div>
);

export default WeatherBox;