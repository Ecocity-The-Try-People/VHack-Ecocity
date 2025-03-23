import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import malaysiaCities from '../cities'; // Import the city list

const SS2Map = () => {
    const mapContainer = useRef(null);
    const map = useRef(null);
    const [mapLoaded, setMapLoaded] = useState(false);
    const [weatherData, setWeatherData] = useState([]);

    // Define your WeatherAPI key
    const weather_api = import.meta.env.VITE_API_KEY // Replace with your actual API key

    // Fetch weather data for all cities
    useEffect(() => {
        const fetchWeatherData = async () => {
            try {
                const promises = malaysiaCities.map(async (city) => {
                    const response = await fetch(
                        `https://api.weatherapi.com/v1/current.json?key=${weather_api}&q=${city}`
                    );
                    const data = await response.json();
                    return data;
                });

                const weatherData = await Promise.all(promises);
                setWeatherData(weatherData);
            } catch (error) {
                console.error('Error fetching weather data:', error);
            }
        };

        fetchWeatherData();
    }, []);

    useEffect(() => {
        if (mapLoaded || !mapContainer.current) return; // Prevent re-initialization or if container is null

        // Initialize the map (centered on Malaysia)
        map.current = L.map(mapContainer.current).setView([4.2105, 101.9758], 6); // Set zoom level to 6

        // Add a tile layer
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map.current);

        // Add markers and areas for each city with weather information
        weatherData.forEach((data) => {
            if (data && data.location && data.current) {
                const { location, current } = data;

                // Create a custom icon using the weather condition icon
                const weatherIcon = L.icon({
                    iconUrl: current.condition.icon,
                    iconSize: [40, 40], // Size of the icon
                    iconAnchor: [20, 40], // Point of the icon that corresponds to the marker's location
                });

                // Add a marker with the custom icon
                const marker = L.marker([location.lat, location.lon], { icon: weatherIcon }).addTo(map.current);

                // Add a popup with weather information
                const weatherText = `
                    <b>${location.name}, ${location.country}</b><br>
                    <b>Temperature:</b> ${current.temp_c}°C (${current.temp_f}°F)<br>
                    <b>Condition:</b> ${current.condition.text}<br>
                    <img src="${current.condition.icon}" alt="${current.condition.text}">
                `;
                marker.bindPopup(weatherText);

                // Add a circular area around the location
                L.circle([location.lat, location.lon], {
                    color: '#0078A8', // Border color
                    fillColor: '#0078A8', // Fill color
                    fillOpacity: 0.2, // Semi-transparent
                    radius: 10000, // Radius in meters (10 km)
                }).addTo(map.current);
            }
        });

        // Cleanup on unmount
        return () => {
            if (map.current) {
                map.current.remove();
                map.current = null;
                setMapLoaded(false);
            }
        };
    }, [mapLoaded, weatherData]);

    return <div className='z-1' ref={mapContainer} style={{ height: '80vh', width: '100%' }} />;
};

export default SS2Map;