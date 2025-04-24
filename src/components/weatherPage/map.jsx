import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { malaysiaCities } from '../../data';
import { subscribeToSensors, simulateSensors } from '../../../config/sensorService';
import useDarkMode from "../../hooks/DarkMode";

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
  const [activeLayers, setActiveLayers] = useState({
    weather: true,
    flood: true
  });

  const layers = useRef({
    weather: L.layerGroup(),
    flood: L.layerGroup()
  });

  const toggleLayer = (layer) => {
    const newActiveLayers = {
      ...activeLayers,
      [layer]: !activeLayers[layer]
    };
    setActiveLayers(newActiveLayers);
    
    if (newActiveLayers[layer]) {
      layers.current[layer].addTo(map.current);
    } else {
      map.current.removeLayer(layers.current[layer]);
    }
  };

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
    const weatherInterval = setInterval(fetchWeatherData, 3600000);

    return () => clearInterval(weatherInterval);
  }, [weather_api]);

  useEffect(() => {
    if (!mapContainer.current) return;

    map.current = L.map(mapContainer.current).setView([4.2105, 101.9758], 6);
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map.current);

    layers.current.weather = L.layerGroup();
    layers.current.flood = L.layerGroup();

    if (activeLayers.weather) layers.current.weather.addTo(map.current);
    if (activeLayers.flood) layers.current.flood.addTo(map.current);

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

  useEffect(() => {
    const unsubscribe = subscribeToSensors((data) => {
      setSensors(data);
      updateFloodZones(data);
    });
    return () => unsubscribe();
  }, []);

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

  const updateFloodZones = (sensorData) => {
    if (!map.current) return;
    
    layers.current.flood.clearLayers();

    // Group sensors by location to create combined flood areas
    const locationGroups = {};
    sensorData.forEach(sensor => {
      if (!locationGroups[sensor.location]) {
        locationGroups[sensor.location] = [];
      }
      locationGroups[sensor.location].push(sensor);
    });

    // Create flood polygons for each location
    Object.entries(locationGroups).forEach(([location, sensors]) => {
      const floodedSensors = sensors.filter(s => s.status === "flooded");
      const safeSensors = sensors.filter(s => s.status !== "flooded");

      // Create a convex hull polygon for flooded areas
      if (floodedSensors.length > 0) {
        const points = floodedSensors.map(s => [s.lat, s.lon]);
        
        // Create a more visible flood polygon
        const floodPolygon = L.polygon(points, {
          color: '#ff0000',
          fillColor: '#ff0000',
          fillOpacity: 0.4,
          weight: 2,
          dashArray: '5, 5',
          className: 'flood-polygon'
        }).addTo(layers.current.flood);

        // Add pulsing effect to flood areas
        floodPolygon.setStyle({
          fillOpacity: 0.4
        });

        // Add popup with aggregated flood information
        const totalWaterLevel = floodedSensors.reduce((sum, s) => sum + s.waterLevel, 0);
        const avgWaterLevel = Math.round(totalWaterLevel / floodedSensors.length);
        
        floodPolygon.bindPopup(`
          <div class="flood-popup">
            <h3 class="font-bold text-lg text-red-600">FLOOD WARNING</h3>
            <p><strong>Location:</strong> ${location}</p>
            <p><strong>Status:</strong> <span class="text-red-600 font-bold">FLOODED</span></p>
            <p><strong>Affected Sensors:</strong> ${floodedSensors.length}</p>
            <p><strong>Avg. Water Level:</strong> ${avgWaterLevel}cm</p>
            <p class="text-sm mt-2">⚠️ Exercise caution in this area</p>
          </div>
        `);

        // Add tooltip that shows on hover
        floodPolygon.bindTooltip(`Flood Area: ${location}`, {
          permanent: false,
          direction: 'top',
          className: 'flood-tooltip'
        });
      }

      // Mark individual sensors with more visible markers
      sensors.forEach(sensor => {
        const isFlooded = sensor.status === "flooded";
        const markerColor = isFlooded ? '#ff0000' : '#00aa00';
        const markerSize = isFlooded ? 12 : 8; // Larger markers for flooded areas
        
        const sensorMarker = L.circleMarker([sensor.lat, sensor.lon], {
          radius: markerSize,
          fillColor: markerColor,
          color: '#000',
          weight: 1,
          opacity: 1,
          fillOpacity: 0.8
        }).addTo(layers.current.flood);

        sensorMarker.bindPopup(`
          <div class="sensor-popup ${isFlooded ? 'flooded-popup' : ''}">
            <h3 class="font-bold ${isFlooded ? 'text-red-600' : 'text-green-600'}">
              ${sensor.location} Sensor
            </h3>
            <p><strong>Status:</strong> 
              <span class="${isFlooded ? 'text-red-600 font-bold' : 'text-green-600'}">
                ${sensor.status.toUpperCase()}
              </span>
            </p>
            <p><strong>Water Level:</strong> ${sensor.waterLevel}cm</p>
            <p><strong>Last Update:</strong> ${new Date().toLocaleTimeString()}</p>
            ${isFlooded ? '<p class="text-red-600 font-bold">⚠️ Flood warning active</p>' : ''}
          </div>
        `);
      });
    });
  };

  return (
    <div className="relative min-h-screen">
      <style>{`
        .flood-polygon {
          animation: pulse 2s infinite;
        }
        @keyframes pulse {
          0% { fill-opacity: 0.3; }
          50% { fill-opacity: 0.5; }
          100% { fill-opacity: 0.3; }
        }
        .flood-tooltip {
          background: rgba(255, 0, 0, 0.7);
          color: white;
          border: 1px solid white;
          font-weight: bold;
        }
        .flooded-popup {
          border-left: 4px solid #ff0000;
          padding-left: 8px;
        }
      `}</style>
      
      <div 
        ref={mapContainer} 
        style={{ height: '80vh', width: '100%' }}
        className="relative min-h-screen z-1"
      />
      
      {/* Combined Controls Container */}
      <div className={`absolute top-4 right-4 flex flex-col items-end space-y-2 z-5`}>
        {/* Map Layers Control - Now on top */}
        <div className={`${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200 text-black"} p-3 rounded shadow-lg`}>
          <h3 className="font-bold text-lg mb-1">Map Layers</h3>
          
          <label className="flex items-center space-x-2 cursor-pointer">
            <input 
              type="checkbox" 
              checked={activeLayers.weather}
              onChange={() => toggleLayer('weather')}
              className="form-checkbox h-4 w-4"
            />
            <span>Weather Data</span>
          </label>
          
          <label className="flex items-center space-x-2 cursor-pointer">
            <input 
              type="checkbox" 
              checked={activeLayers.flood}
              onChange={() => toggleLayer('flood')}
              className="form-checkbox h-4 w-4"
            />
            <span>Flood Data</span>
          </label>
        </div>
        
        {/* Legend - Now below the layers control */}
        <div className={`${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200 text-black"} p-3 rounded shadow-lg`}>
          <h3 className="font-bold text-lg mb-2">Map Legend</h3>
          
          {activeLayers.weather && (
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
          )}
          
          {activeLayers.flood && (
            <div>
              <h4 className="font-semibold mb-1">Flood Sensors</h4>
              <div className="flex items-center mb-1">
                <div className="w-4 h-4 rounded-full bg-red-500 mr-2 animate-pulse" />
                <span>Flooded area (polygon)</span>
              </div>
              <div className="flex items-center mb-1">
                <div className="w-3 h-3 rounded-full bg-red-500 mr-2" />
                <span>Flooded sensor</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 rounded-full bg-green-500 mr-2" />
                <span>Safe sensor</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {loading && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white px-3 py-1 rounded shadow z-10">
          Loading weather data...
        </div>
      )}
    </div>
  );
};

export default WeatherFloodMap;