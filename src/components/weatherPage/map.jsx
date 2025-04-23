import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { malaysiaCities } from '../../data';
import { subscribeToSensors, simulateSensors } from '../../../config/sensorService';
import useDarkMode from "../../hooks/DarkMode";

// Create custom weather icon class
const WeatherIcon = L.Icon.extend({
  options: {
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40]
  }
});

const WeatherFloodMap = () => {
  const isDarkMode = useDarkMode();
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [weatherData, setWeatherData] = useState([]);
  const [sensors, setSensors] = useState([]);
  const [loading, setLoading] = useState(true);
  const weather_api = import.meta.env.VITE_API_KEY;

  // Layer references
  const layers = useRef({
    weather: L.layerGroup(),
    flood: L.layerGroup()
  });

  // Fetch weather data
  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        setLoading(true);
        const promises = malaysiaCities.map(async (city) => {
          const response = await fetch(
            `https://api.weatherapi.com/v1/current.json?key=${weather_api}&q=${city}`
          );
          return response.json();
        });

        const weatherData = await Promise.all(promises);
        setWeatherData(weatherData.filter(data => !data.error));
      } catch (error) {
        console.error('Error fetching weather data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchWeatherData();
    const weatherInterval = setInterval(fetchWeatherData, 3600000); // Update every hour

    return () => clearInterval(weatherInterval);
  }, [weather_api]);

  // Initialize map and flood sensors
  useEffect(() => {
    if (!mapContainer.current) return;

    // Initialize map
    map.current = L.map(mapContainer.current).setView([4.2105, 101.9758], 6);
    
    // Add base layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map.current);

    // Add layer groups
    layers.current.weather.addTo(map.current);
    layers.current.flood.addTo(map.current);

    // Start sensor simulation
    simulateSensors();
    const sensorInterval = setInterval(simulateSensors, 10000);

    return () => {
      clearInterval(sensorInterval);
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  // Subscribe to sensor updates
  useEffect(() => {
    const unsubscribe = subscribeToSensors((data) => {
      setSensors(data);
      updateFloodZones(data);
    });
    return () => unsubscribe();
  }, []);

  // Update weather markers
  useEffect(() => {
    if (!map.current || !weatherData.length) return;

    layers.current.weather.clearLayers();

    weatherData.forEach((data) => {
      if (!data?.location || !data?.current) return;

      const { location, current } = data;
      const weatherIcon = new WeatherIcon({
        iconUrl: current.condition.icon.replace('64x64', '128x128')
      });

      L.marker([location.lat, location.lon], { icon: weatherIcon })
        .addTo(layers.current.weather)
        .bindPopup(`
          <b>${location.name}, ${location.country}</b><br>
          <b>Temperature:</b> ${current.temp_c}°C (${current.temp_f}°F)<br>
          <b>Condition:</b> ${current.condition.text}<br>
          <img src="${current.condition.icon}" alt="${current.condition.text}">
        `);

      L.circle([location.lat, location.lon], {
        color: '#0078A8',
        fillColor: '#0078A8',
        fillOpacity: 0.2,
        radius: 10000,
      }).addTo(layers.current.weather);
    });
  }, [weatherData]);

  // Update flood zones
  const updateFloodZones = (sensorData) => {
    if (!map.current) return;
    
    layers.current.flood.clearLayers();

    sensorData.forEach((sensor) => {
      const color = sensor.status === "flooded" ? "#ff0000" : "#00aa00";
      
      L.circle([sensor.lat, sensor.lon], {
        color,
        fillColor: color,
        fillOpacity: 0.5,
        radius: 500,
      })
      .addTo(layers.current.flood)
      .bindPopup(`
        <b>${sensor.location}</b><br>
        Status: <strong style="color: ${color}">${sensor.status.toUpperCase()}</strong><br>
        Water Level: ${sensor.waterLevel}cm
      `);
    });
  };

  return (
    <div className="relative min-h-screen">
      <div 
        ref={mapContainer} 
        style={{ height: '80vh', width: '100%' }}
        className="z-1"
      />
      
      {/* Legend */}
      <div className={`absolute top-4 right-4 ${isDarkMode ? "bg-gray-700" : "bg-gray-200 text-black"} p-3 rounded shadow-lg z-5`}>
        <h3 className="font-bold text-lg mb-2">Map Legend</h3>
        
        <div className="mb-3">
          <h4 className="font-semibold mb-1">Weather Stations</h4>
          <div className="flex items-center mb-1">
            <img 
              src="https://cdn.weatherapi.com/weather/64x64/day/113.png" 
              alt="Weather icon" 
              className="w-5 h-5 mr-2" 
            />
            <span>Weather station</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 rounded-full border border-blue-500 mr-2" style={{ 
              backgroundColor: 'rgba(0, 120, 168, 0.2)' 
            }} />
            <span>Weather area</span>
          </div>
        </div>
        
        <div>
          <h4 className="font-semibold mb-1">Flood Sensors</h4>
          <div className="flex items-center mb-1">
            <div className="w-4 h-4 rounded-full bg-red-500 mr-2" />
            <span>Flooded area</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 rounded-full bg-green-500 mr-2" />
            <span>Safe area</span>
          </div>
        </div>
      </div>

      {loading && (
        <div className="absolute top-4 left-4 bg-blue-500 text-white px-3 py-1 rounded shadow z-10">
          Loading weather data...
        </div>
      )}
    </div>
  );
};

export default WeatherFloodMap;