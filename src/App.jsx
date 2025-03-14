import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Flood_homepage from './flood_homepage'
import Weather_box from './weather_box'
import Test from './test'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Weather_box />
      {/* <Flood_homepage /> */}
    </>
  )
}

export default App
