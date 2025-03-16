import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Flood_homepage from './assets/weather_detail'
import Weather_box from './weather_box'
import Notification from './notification';

function App() {
  const [count, setCount] = useState(0)

  return (
<>
      {/* Notification Button at Top Left */}
      <div className="fixed top-5 right-5 z-50">
        <Notification />
      </div>

      {/* Weather Box */}
      <div className="mt-20"> {/* Add margin to avoid overlap */}
        <Weather_box />
      </div>
    </>
  )
}

export default App
