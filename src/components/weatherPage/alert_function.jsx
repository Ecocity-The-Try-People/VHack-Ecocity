import { useEffect } from "react";

export default function useWeatherAlert(weather, addAlert) {
    useEffect(() => {
        
        if (!weather?.api?.current || !weather?.api?.location || typeof addAlert !== 'function') return;
        
        const { wind_mph, precip_in, temp_c, pressure_mb, humidity } = weather.api.current;
        const { name, region, country } = weather.api.location;
        const location = `${name}, ${region}, ${country}`
        
        
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
}
