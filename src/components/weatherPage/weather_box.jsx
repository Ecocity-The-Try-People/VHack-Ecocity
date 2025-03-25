import { useEffect, useState } from "react";
import { Droplet, Wind, Eye, Thermometer, ChevronDown, ChevronUp, Bell, BellOff } from "lucide-react";

const WeatherBox = () => {
  const [isDarkMode, setIsDarkMode] = useState(
    document.documentElement.classList.contains("dark")
  );

  useEffect(() => {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
          const darkMode = document.documentElement.classList.contains('dark');
          setIsDarkMode(darkMode);
          console.log("weather " + (darkMode ? "on" : "off"));
        }
      });
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });

    return () => observer.disconnect();
  }, []);


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

  useEffect(()=>{

  });

  return (
    <div className="w-full flex flex-col md:flex-row gap-4">
      {locations.map((location) => {
        const data = weatherData[location];
        const isExpanded = expandedStates[location];
        const notificationsEnabled = notificationPrefs[location];

        return (
            <div 
              key={location}
              className={`flex-1 rounded-lg border transition-all duration-300 cursor-pointer shadow-sm
                ${isExpanded 
                  ? `${isDarkMode ? "bg-gray-800 border-blue-700" : "bg-blue-50 border-blue-200"} shadow-md` 
                  : `${isDarkMode ? "bg-gray-800 hover:bg-gray-700/80 border-gray-700" : "bg-gray hover:bg-gray-50 border-gray-200"}`
                }`}
              onClick={() => toggleExpand(location)}
            >
            <div className="p-4 flex justify-between items-center">
              <h3 className={`font-bold text-lg ${isDarkMode ? "dark:text-gray-100" : "text-gray-800"}`}>{location}</h3>
              <div className="flex items-center gap-2">
                <button 
                  onClick={(e) => toggleNotification(location, e)}
                  className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  aria-label={notificationsEnabled ? "Disable notifications" : "Enable notifications"}
                >
                  {notificationsEnabled ? (
                    <Bell className="w-5 h-5 text-yellow-500 dark:text-yellow-400" />
                  ) : (
                    <BellOff className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                  )}
                </button>
                <span className={`text-2xl font-bold ${isDarkMode ? "dark:text-gray-100" : "text-gray-800"}`}>
                  {data.temp}°C
                </span>
                {isExpanded ? (
                  <ChevronUp className={`w-5 h-5 ${isDarkMode ? "dark:text-gray-400" : "text-gray-500"}`} />
                ) : (
                  <ChevronDown className={`w-5 h-5 ${isDarkMode ? "dark:text-gray-400" : "text-gray-500"}`} />
                )}
              </div>
            </div>

            <div className="px-4 pb-2 flex items-center">
              <img 
                src={data.icon} 
                alt="Weather icon" 
                className="w-10 h-10"
              />
              <span className={`ml-2 ${isDarkMode ? "dark:text-gray-300" : "text-gray-700"}`}>{data.condition}</span>
            </div>

            <div className={`overflow-hidden transition-all duration-300 ${
              isExpanded ? "max-h-96" : "max-h-0"
            }`}>
              <div className="p-4 pt-0 space-y-3">
                <DetailItem 
                  icon={<Wind className="w-4 h-4" />} 
                  label="Wind" 
                  value={`${data.wind} km/h`} 
                  isDarkMode={isDarkMode}
                />
                <DetailItem 
                  icon={<Droplet className="w-4 h-4" />} 
                  label="Humidity" 
                  value={`${data.humidity}%`} 
                  isDarkMode={isDarkMode}
                />
                <DetailItem 
                  icon={<Eye className="w-4 h-4" />} 
                  label="Visibility" 
                  value={`${data.visibility} km`} 
                  isDarkMode={isDarkMode}
                />
                <DetailItem 
                  icon={<Thermometer className="w-4 h-4" />} 
                  label="Feels Like" 
                  value={`${data.feelsLike}°C`} 
                  isDarkMode={isDarkMode}
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

const DetailItem = ({ icon, label, value, isDarkMode }) => (
  <div className="flex items-center text-sm">
    <div className="w-5 h-5 mr-2 text-blue-500 dark:text-blue-400 flex items-center justify-center">
      {icon}
    </div>
    <span className={`${isDarkMode ? "dark:text-gray-300" : "text-gray-700"}`}>
      <span className="font-medium">{label}:</span> {value}
    </span>
  </div>
);

export default WeatherBox;