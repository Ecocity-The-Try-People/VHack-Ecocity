import { useMap } from "react-leaflet";
import { useRef, useEffect } from "react";

export function Routing ({ from, to }) {
    const map = useMap();
    const routingControlRef = useRef(null);

    useEffect(() => {
        if (!map || !from || !to) return;

        if (routingControlRef.current) {
            map.removeControl(routingControlRef.current);
        }

        const instance = L.Routing.control({
            waypoints: [
                L.latLng(from.lat, from.lng),
                L.latLng(to.lat, to.lng),
            ],
            routeWhileDragging: false,
            showAlternatives: true,
            lineOptions: {
                styles: [{ color: '#6c5ce7', opacity: 0.7, weight: 5 }],
            },
            createMarker: function () { return null; }, // Hide routing markers
        }).addTo(map);

        routingControlRef.current = instance;

        // Cleanup function: ensures routing is removed if the component unmounts
        return () => {
            if (routingControlRef.current) {
                map.removeControl(routingControlRef.current);
                routingControlRef.current = null;
            }
        };
    }, [from, to, map]);

    return null;
};
