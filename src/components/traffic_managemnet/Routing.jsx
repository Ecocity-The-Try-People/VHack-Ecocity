import { useMap } from "react-leaflet";
import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet-routing-machine";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";

// Custom marker icons
const yellowIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-yellow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  shadowSize: [41, 41]
});

const blueIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  shadowSize: [41, 41]
});

export function Routing({ from, to, isDarkMode }) {
    const map = useMap();
    const routingControlRef = useRef(null);
    const destinationMarkerRef = useRef(null);
    const startMarkerRef = useRef(null);

    useEffect(() => {
        if (!map || !from || !to) return;

        // Cleanup previous instances
        if (routingControlRef.current) {
            map.removeControl(routingControlRef.current);
        }
        if (destinationMarkerRef.current) {
            map.removeLayer(destinationMarkerRef.current);
        }
        if (startMarkerRef.current) {
            map.removeLayer(startMarkerRef.current);
        }

        // Add markers
        startMarkerRef.current = L.marker([from.lat, from.lng], {
            icon: blueIcon
        }).addTo(map).bindPopup("Your Location");

        destinationMarkerRef.current = L.marker([to.lat, to.lng], {
            icon: yellowIcon
        }).addTo(map).bindPopup("Destination");

        // Configure routing
        const instance = L.Routing.control({
            waypoints: [
                L.latLng(from.lat, from.lng),
                L.latLng(to.lat, to.lng)
            ],
            routeWhileDragging: false,
            showAlternatives: true,
            collapsible: true,
            fitSelectedRoutes: true,
            lineOptions: {
                styles: [{ 
                    color: isDarkMode ? '#3b82f6' : '#2563eb', 
                    opacity: 0.8, 
                    weight: 5 
                }],
            },
            createMarker: () => null, // Disable default markers
            formatter: new L.Routing.Formatter({
                language: 'en',
                units: 'metric'
            }),
            show: true
        }).addTo(map);

        routingControlRef.current = instance;

        // Style the routing container
        const styleRoutingContainer = () => {
            const container = document.querySelector('.leaflet-routing-container');
            if (container) {
                // Base styles
                const textColor = isDarkMode ? '#0096c7' : 'black';
                const bgColor = isDarkMode ? '#2d3748' : 'white';
                const hoverBgColor = '#e2e8f0';
                const hoverTextColor = isDarkMode ? '#4a5568' : 'black';

                // Container styling
                container.style.cssText = `
                    color: ${textColor} !important;
                    background-color: ${bgColor} !important;
                    border-radius: 8px !important;
                    padding: 10px !important;
                    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1) !important;
                `;

                // Style interactive elements
                const interactiveElements = container.querySelectorAll('tr, button, a');
                interactiveElements.forEach(el => {
                    el.style.cssText = `
                        transition: all 0.2s ease !important;
                        cursor: pointer !important;
                    `;

                    el.addEventListener('mouseenter', () => {
                        el.style.cssText = `
                            background-color: ${hoverBgColor} !important;
                            color: ${hoverTextColor} !important;
                            transition: all 0.2s ease !important;
                            cursor: pointer !important;
                        `;
                    });

                    el.addEventListener('mouseleave', () => {
                        el.style.cssText = `
                            background-color: transparent !important;
                            color: ${textColor} !important;
                            transition: all 0.2s ease !important;
                        `;
                    });
                });
            } else {
                setTimeout(styleRoutingContainer, 50);
            }
        };

        setTimeout(styleRoutingContainer, 100);

        return () => {
            if (routingControlRef.current) {
                map.removeControl(routingControlRef.current);
            }
            if (destinationMarkerRef.current) {
                map.removeLayer(destinationMarkerRef.current);
            }
            if (startMarkerRef.current) {
                map.removeLayer(startMarkerRef.current);
            }
        };
    }, [from, to, map, isDarkMode]);

    return null;
}