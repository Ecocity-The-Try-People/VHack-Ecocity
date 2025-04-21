import { useMap } from "react-leaflet";
import { LocateFixed } from "lucide-react";
import useDarkMode from "../../hooks/DarkMode"; // Import your dark mode hook

const RecenterButton = ({ position }) => {
  const map = useMap();
  const isDarkMode = useDarkMode(); // Use the dark mode hook

  const centerOnTruck = () => {
    if (position) {
      map.flyTo(position, 17, {
        duration: 1,
        easeLinearity: 0.25
      });
    }
  };

  return (
    <button
      onClick={centerOnTruck}
      className={`cursor-pointer absolute z-[1000] bottom-4 right-4 p-2 rounded-full shadow-lg border transition-colors ${
        isDarkMode ? "bg-gray-800 border-gray-600 hover:bg-gray-700" : "bg-white border-gray-300 hover:bg-gray-100"}`}
      title="Center on truck"
      aria-label="Center map on truck location"
    >
      <LocateFixed className={isDarkMode ? "text-gray-300" : "text-gray-700"} size={20} />
    </button>
  );
};

export default RecenterButton;