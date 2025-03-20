import Weather_box from '../assets/flood_page/weather_box'
import Notification from '../assets/flood_page/notification';
import Map from '../assets/flood_page/map';

export default function Flood_page(){
    return (
        <div className="max-w-5x1 mx-auto px-4">        {/* Notification Button at Top Left */}
        <div className="fixed top-5 right-5 z-50">
          <Notification />
        </div>
    
        {/* Weather Box */}
        <div className="mt-20"> {/* Add margin to avoid overlap */}
          <Weather_box />
        </div>
        <Map />
        </div>
    )
}