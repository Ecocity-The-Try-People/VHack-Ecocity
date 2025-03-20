import Weather_box from './weather_box'
import Notification from './notification';
import Map from './map';

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