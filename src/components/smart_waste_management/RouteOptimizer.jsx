import React, { useState } from 'react';
import { Route, RefreshCw, Truck, Zap, Leaf } from 'lucide-react';
import useDarkMode from '../../hooks/DarkMode';

const RouteOptimizer = ({ bins }) => {
  const isDarkMode = useDarkMode();
  const [optimizedRoute, setOptimizedRoute] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const calculateRoute = () => {
    setIsLoading(true);
    
    // Simulate AI route calculation
    setTimeout(() => {
      const priorityBins = [...bins]
        .filter(b => b.fillLevel > 50)
        .sort((a, b) => b.fillLevel - a.fillLevel);
      
      setOptimizedRoute({
        distance: (5 + Math.random() * 10).toFixed(1) + ' km',
        fuelSaved: (15 + Math.random() * 20).toFixed(0) + '%',
        emissionReduction: (3 + Math.random() * 5).toFixed(1) + ' kg CO₂',
        stops: priorityBins.slice(0, 3)
      });
      setIsLoading(false);
    }, 1500);
  };
  // Add this right after the calculateRoute function
  if (bins.length > 0 && bins.every(bin => bin.fillLevel < 50)) {
    return (
      <div className={`p-4 rounded-lg ${
        isDarkMode ? 'bg-gray-700 text-gray-200' : 'bg-gray-100 text-gray-700'
      }`}>
        <p className="flex items-center">
          <Leaf className="mr-2" size={18} />
          All bins have sufficient space (below 50% full). Collection route not urgently needed.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <button
        onClick={calculateRoute}
        disabled={isLoading || bins.length === 0}
        className={`w-full py-2 px-4 rounded-lg flex items-center justify-center transition-colors duration-200 ${
          isLoading 
            ? 'bg-gray-400 cursor-not-allowed' 
            : `${
                isDarkMode 
                  ? 'bg-blue-600 hover:bg-blue-500' 
                  : 'bg-blue-600 hover:bg-blue-700'
              } cursor-pointer`
        } text-white`}
      >
        {isLoading ? (
          <>
            <RefreshCw className="mr-2 animate-spin" size={18} />
            Optimizing Route...
          </>
        ) : (
          <>
            <Route className="mr-2" size={18} />
            Generate Optimal Route
          </>
        )}
      </button>

      {optimizedRoute && (
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-2">
            <div className={`p-3 rounded-lg text-center transition-colors duration-200 ${
              isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
            }`}>
              <Truck className={`mx-auto ${
                isDarkMode ? 'text-blue-400' : 'text-blue-500'
              }`} size={20} />
              <p className={`text-sm ${
                isDarkMode ? 'text-gray-300' : 'text-gray-500'
              }`}>Distance</p>
              <p className={`font-bold ${
                isDarkMode ? 'text-gray-100' : 'text-gray-800'
              }`}>{optimizedRoute.distance}</p>
            </div>
            <div className={`p-3 rounded-lg text-center transition-colors duration-200 ${
              isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
            }`}>
              <Zap className={`mx-auto ${
                isDarkMode ? 'text-amber-400' : 'text-amber-500'
              }`} size={20} />
              <p className={`text-sm ${
                isDarkMode ? 'text-gray-300' : 'text-gray-500'
              }`}>Fuel Saved</p>
              <p className={`font-bold ${
                isDarkMode ? 'text-green-400' : 'text-green-600'
              }`}>{optimizedRoute.fuelSaved}</p>
            </div>
            <div className={`p-3 rounded-lg text-center transition-colors duration-200 ${
              isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
            }`}>
              <Leaf className={`mx-auto ${
                isDarkMode ? 'text-green-400' : 'text-green-500'
              }`} size={20} />
              <p className={`text-sm ${
                isDarkMode ? 'text-gray-300' : 'text-gray-500'
              }`}>CO₂ Reduction</p>
              <p className={`font-bold ${
                isDarkMode ? 'text-teal-400' : 'text-teal-600'
              }`}>{optimizedRoute.emissionReduction}</p>
            </div>
          </div>

          <div className={`p-4 rounded-lg transition-colors duration-200 ${
            isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
          }`}>
            <h4 className={`font-semibold mb-2 ${
              isDarkMode ? 'text-gray-100' : 'text-gray-800'
            }`}>Recommended Collection Route:</h4>
            <ol className="list-decimal pl-5 space-y-1">
              {optimizedRoute.stops.map((bin, index) => (
                <li key={index} className={isDarkMode ? 'text-gray-200' : 'text-gray-700'}>
                  {bin.location} ({bin.fillLevel}% full)
                </li>
              ))}
            </ol>
          </div>
        </div>
      )}
    </div>
  );
};

export default RouteOptimizer;