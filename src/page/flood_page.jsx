import Weather_box from '../assets/flood_page/weather_box'
import Notification from '../assets/flood_page/notification';
import Map from '../assets/flood_page/map';
import Sidebar from '../assets/components/Sidebar';

export default function Flood_page(){
    return (
      <div className=''>
          <Sidebar />
        <div className="max-w-5x1 mx-auto px-4">        {/* Notification Button at Top Left */}
            {/* <div className="fixed top-5 right-5 z-0">
              <Notification />
            </div> */}
            {/* Weather Box */}
            <div className=""> {/* Add margin to avoid overlap */}
              <Weather_box />
            </div>
            <div className="mt-20 z-1"> {/* Add margin to avoid overlap */}
            <Map />
            </div>
        </div>
      </div>
    )
}